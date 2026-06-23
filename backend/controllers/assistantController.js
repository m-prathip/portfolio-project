const Profile = require('../models/Profile');
const Skills = require('../models/Skills');
const Projects = require('../models/Projects');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Achievements = require('../models/Achievements');

// Builds a compact knowledge base about the portfolio owner from their data.
async function buildContext(userId) {
  const [profile, skills, projects, experience, education, achievements] = await Promise.all([
    Profile.findOne({ user: userId }).lean(),
    Skills.find({ user: userId }).lean(),
    Projects.find({ user: userId }).lean(),
    Experience.find({ user: userId }).lean(),
    Education.find({ user: userId }).lean(),
    Achievements.find({ user: userId }).lean()
  ]);
  return { profile, skills, projects, experience, education, achievements };
}

function contextToText(ctx) {
  const p = ctx.profile || {};
  const lines = [];
  if (p.name) lines.push(`Name: ${p.name}`);
  if (p.title) lines.push(`Title: ${p.title}`);
  if (p.location) lines.push(`Location: ${p.location}`);
  if (p.about) lines.push(`About: ${p.about}`);
  if (p.email) lines.push(`Contact email: ${p.email}`);
  if (ctx.skills?.length) lines.push(`Skills: ${ctx.skills.map((s) => `${s.name} (${s.level}%)`).join(', ')}`);
  if (ctx.experience?.length) lines.push('Experience:\n' + ctx.experience.map((e) => `- ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join('\n'));
  if (ctx.education?.length) lines.push('Education:\n' + ctx.education.map((e) => `- ${e.degree}, ${e.department} at ${e.college} (${e.graduationYear})${e.cgpa ? `, CGPA ${e.cgpa}` : ''}`).join('\n'));
  if (ctx.projects?.length) lines.push('Projects:\n' + ctx.projects.map((pr) => `- ${pr.title} [${(pr.techStack || []).join(', ')}]: ${pr.description}`).join('\n'));
  if (ctx.achievements?.length) lines.push('Achievements:\n' + ctx.achievements.map((a) => `- ${a.title} (${a.date}): ${a.description}`).join('\n'));
  return lines.join('\n');
}

// Rule-based reply used when no OpenAI key is configured (offline mode).
function offlineReply(message, ctx) {
  const q = (message || '').toLowerCase();
  const p = ctx.profile || {};
  const has = (...words) => words.some((w) => q.includes(w));

  if (has('hello', 'hey', 'who are you') || q.match(/\bhi\b/))
    return `Hi! I'm ${p.name || 'the developer'}'s portfolio assistant. Ask me about their skills, projects, experience, or how to get in touch.`;
  if (has('contact', 'email', 'reach', 'hire'))
    return p.email ? `You can reach ${p.name || 'them'} at ${p.email}.${p.phone ? ` Phone: ${p.phone}.` : ''}` : `Use the contact form on this page to get in touch.`;
  if (has('resume', 'cv'))
    return p.resumeUrl ? `You can download the resume using the "Resume" button in the hero section.` : `A downloadable resume isn't published yet.`;
  if (has('skill', 'tech', 'stack', 'react', 'backend', 'frontend'))
    return ctx.skills?.length ? `Key skills: ${ctx.skills.slice(0, 12).map((s) => s.name).join(', ')}.` : `No skills listed yet.`;
  if (has('project', 'built', 'work'))
    return ctx.projects?.length ? `Featured projects: ${ctx.projects.slice(0, 5).map((pr) => pr.title).join(', ')}. Visit the Projects page for details.` : `No projects listed yet.`;
  if (has('experience', 'job', 'company', 'worked'))
    return ctx.experience?.length ? ctx.experience.slice(0, 3).map((e) => `${e.role} at ${e.company} (${e.duration})`).join('; ') + '.' : `No experience listed yet.`;
  if (has('education', 'study', 'college', 'degree'))
    return ctx.education?.length ? ctx.education.map((e) => `${e.degree} at ${e.college} (${e.graduationYear})`).join('; ') + '.' : `No education listed yet.`;
  if (has('about', 'tell me'))
    return p.about || `${p.name || 'This developer'} is a ${p.title || 'software developer'}.`;
  return `I can tell you about ${p.name || 'the developer'}'s skills, projects, experience, education, achievements, or contact details. What would you like to know?`;
}

async function callGemini(message, history, ctxText, name) {
  const key = process.env.GEMINI_API_KEY;
  const systemInstruction = `You are a friendly, concise portfolio assistant for ${name || 'a software developer'}. ` +
    `Answer recruiter questions using ONLY the facts below. If something isn't covered, say you don't have that info and suggest contacting them. ` +
    `Keep answers under 90 words.\n\n--- PORTFOLIO FACTS ---\n${ctxText}`;

  const contents = [];
  (history || []).slice(-6).forEach((m) => {
    if (m.role && m.content) {
      const role = m.role === 'user' ? 'user' : 'model';
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += '\n' + String(m.content).slice(0, 1000);
      } else {
        contents.push({
          role,
          parts: [{ text: String(m.content).slice(0, 1000) }]
        });
      }
    }
  });
  
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += '\n' + String(message).slice(0, 1000);
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: String(message).slice(0, 1000) }]
    });
  }

  // Gemini API requires the conversation to start with a 'user' role
  while (contents.length > 0 && contents[0].role === 'model') {
    contents.shift();
  }

  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 220 }
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini ${resp.status}: ${err}`);
  }
  
  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

// @route POST /api/portfolio/:username/assistant
const ask = async (req, res) => {
  try {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const ctx = await buildContext(req.portfolioUser._id);
    const name = ctx.profile?.name;
    let reply, mode = 'offline';

    if (process.env.GEMINI_API_KEY) {
      try {
        reply = await callGemini(message, req.body.history, contextToText(ctx), name);
        mode = 'ai';
      } catch (e) {
        console.error('Gemini error:', e.message);
        reply = offlineReply(message, ctx); // graceful fallback
      }
    } else {
      reply = offlineReply(message, ctx);
    }

    res.json({ reply: reply || offlineReply(message, ctx), mode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { ask };
