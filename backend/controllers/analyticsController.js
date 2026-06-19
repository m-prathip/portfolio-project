const Visit = require('../models/Visit');
const ContactMessage = require('../models/ContactMessage');
const ResumeDownload = require('../models/ResumeDownload');
const ThemeEvent = require('../models/ThemeEvent');
const LoginActivity = require('../models/LoginActivity');
const Profile = require('../models/Profile');
const mongoose = require('mongoose');
const { parseUserAgent, getClientIp } = require('../utils/device');
const { sendMail, emails } = require('../utils/email');

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ── PUBLIC: record a portfolio page view ───────────────
const recordVisit = async (req, res) => {
  try {
    const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
    await Visit.create({
      user: req.portfolioUser._id,
      path: req.body.path || '/',
      referrer: req.body.referrer || req.headers.referer || '',
      ip: getClientIp(req), device, browser, os
    });
    res.json({ ok: true });
  } catch (err) { res.status(200).json({ ok: false }); } // never block the page
};

// ── PUBLIC: record a theme selection ───────────────────
const recordTheme = async (req, res) => {
  try {
    if (req.body.theme) await ThemeEvent.create({ user: req.portfolioUser._id, theme: String(req.body.theme).slice(0, 40) });
    res.json({ ok: true });
  } catch { res.status(200).json({ ok: false }); }
};

// ── PUBLIC: record a resume download ───────────────────
const recordResumeDownload = async (req, res) => {
  try {
    const { device } = parseUserAgent(req.headers['user-agent']);
    await ResumeDownload.create({ user: req.portfolioUser._id, ip: getClientIp(req), device });
    res.json({ ok: true });
  } catch { res.status(200).json({ ok: false }); }
};

// ── PUBLIC: contact form submission ────────────────────
const submitContact = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const message = String(req.body.message || '').trim();
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message are required' });
    if (message.length > 5000) return res.status(400).json({ message: 'Message too long' });

    const msg = await ContactMessage.create({
      user: req.portfolioUser._id, name, email, message, ip: getClientIp(req)
    });

    // Notify the portfolio owner by email (best effort).
    const profile = await Profile.findOne({ user: req.portfolioUser._id }).select('email name');
    const to = profile?.email;
    if (to) sendMail({ to, ...emails.contactNotification(profile?.name, { name, email, message }) }).catch(() => {});

    res.status(201).json({ ok: true, id: msg._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── OWNER: aggregated analytics dashboard ──────────────
const getAnalytics = async (req, res) => {
  try {
    const uid = req.user.id;
    const oid = new mongoose.Types.ObjectId(uid);
    const since7 = daysAgo(7);
    const since14 = daysAgo(14);

    const [
      totalVisits, visits7, visits14,
      totalDownloads, downloads7,
      totalMessages, unreadMessages,
      themeAgg, deviceAgg, referrerAgg, recentActivity
    ] = await Promise.all([
      Visit.countDocuments({ user: uid }),
      Visit.countDocuments({ user: uid, createdAt: { $gte: since7 } }),
      Visit.find({ user: uid, createdAt: { $gte: since14 } }).select('createdAt').lean(),
      ResumeDownload.countDocuments({ user: uid }),
      ResumeDownload.countDocuments({ user: uid, createdAt: { $gte: since7 } }),
      ContactMessage.countDocuments({ user: uid }),
      ContactMessage.countDocuments({ user: uid, read: false }),
      ThemeEvent.aggregate([{ $match: { user: oid } }, { $group: { _id: '$theme', count: { $sum: 1 } } }]).catch(() => []),
      Visit.aggregate([{ $match: { user: oid } }, { $group: { _id: '$device', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]).catch(() => []),
      Visit.aggregate([{ $match: { user: oid } }, { $group: { _id: '$referrer', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]).catch(() => []),
      LoginActivity.find({ user: uid }).sort('-createdAt').limit(15).lean()
    ]);

    // Build a 14-day visit timeline.
    const byDay = {};
    for (let i = 13; i >= 0; i--) {
      const d = daysAgo(i).toISOString().slice(0, 10);
      byDay[d] = 0;
    }
    visits14.forEach((v) => {
      const d = new Date(v.createdAt).toISOString().slice(0, 10);
      if (d in byDay) byDay[d] += 1;
    });
    const timeline = Object.entries(byDay).map(([date, count]) => ({ date, count }));

    res.json({
      visits: { total: totalVisits, last7: visits7, timeline },
      resumeDownloads: { total: totalDownloads, last7: downloads7 },
      messages: { total: totalMessages, unread: unreadMessages },
      themes: themeAgg.map((t) => ({ theme: t._id, count: t.count })),
      devices: deviceAgg.map((d) => ({ device: d._id || 'Unknown', count: d.count })),
      referrers: referrerAgg.map((r) => ({ referrer: r._id || 'Direct', count: r.count })),
      activity: recentActivity
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── OWNER: list contact messages ───────────────────────
const getMessages = async (req, res) => {
  try {
    const items = await ContactMessage.find({ user: req.user.id }).sort('-createdAt').limit(100).lean();
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const markMessageRead = async (req, res) => {
  try {
    const m = await ContactMessage.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, { read: true }, { new: true }
    );
    if (!m) return res.status(404).json({ message: 'Not found' });
    res.json(m);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  recordVisit, recordTheme, recordResumeDownload, submitContact,
  getAnalytics, getMessages, markMessageRead
};
