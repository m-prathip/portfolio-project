// Admin pages for Education, Experience, Skills, Projects, Achievements, Activities
// Each uses the AdminCRUD component with different field configs

import { useState, useEffect } from 'react';
import AdminCRUD from '../../components/admin/AdminCRUD';
import { PageLoader } from '../../components/common/Spinner';

// ------ EDUCATION ------
import { educationAPI } from '../../services/api';
export const AdminEducation = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => educationAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Education" itemLabel="Education" items={items} api={educationAPI} onRefresh={load} fields={[
    { name: 'college', label: 'College / University', required: true, placeholder: 'MIT' },
    { name: 'degree', label: 'Degree', required: true, placeholder: 'B.Tech / B.Sc / M.Tech' },
    { name: 'department', label: 'Department', required: true, placeholder: 'Computer Science' },
    { name: 'graduationYear', label: 'Graduation Year', required: true, placeholder: '2024' },
    { name: 'cgpa', label: 'CGPA / Grade', placeholder: '9.2 / 10' },
  ]} />;
};

// ------ EXPERIENCE ------
import { experienceAPI } from '../../services/api';
export const AdminExperience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => experienceAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Experience" itemLabel="Experience" items={items} api={experienceAPI} onRefresh={load} fields={[
    { name: 'company', label: 'Company Name', required: true, placeholder: 'Google' },
    { name: 'role', label: 'Role / Title', required: true, placeholder: 'Software Engineer' },
    { name: 'duration', label: 'Duration', required: true, placeholder: 'Jun 2023 – Present' },
    { name: 'description', label: 'Description', required: true, type: 'textarea', placeholder: 'What you did...' },
  ]} />;
};

// ------ SKILLS ------
import { skillsAPI } from '../../services/api';
const SKILL_CATEGORIES = {
  'Frontend': ['react', 'react.js', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'next.js', 'tailwind'],
  'Backend': ['node.js', 'node', 'express', 'python', 'django', 'java', 'spring', 'c#', '.net', 'php', 'ruby', 'go'],
  'Database': ['mongodb', 'sql', 'mysql', 'postgresql', 'redis', 'firebase', 'oracle'],
  'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'ci/cd', 'jenkins', 'terraform'],
  'Tools': ['git', 'github', 'gitlab', 'figma', 'postman', 'jira']
};

export const AdminSkills = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => skillsAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  
  return <AdminCRUD title="Skills" itemLabel="Skill" items={items} api={skillsAPI} onRefresh={load} fields={[
    { 
      name: 'name', 
      label: 'Skill Name', 
      required: true, 
      placeholder: 'React.js',
      onChangeEffect: (val, form) => {
        if (form.category) return form; // Don't overwrite if user already typed something
        const search = val.toLowerCase().trim();
        for (const [cat, skills] of Object.entries(SKILL_CATEGORIES)) {
          if (skills.includes(search)) {
            return { ...form, category: cat.charAt(0).toUpperCase() + cat.slice(1) };
          }
        }
        return form;
      }
    },
    { name: 'level', label: 'Proficiency Level (0-100)', required: true, type: 'range', defaultValue: 80 },
    { 
      name: 'category', 
      label: 'Category', 
      placeholder: 'Frontend, Backend, DevOps…',
      datalist: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Design', 'Mobile', 'Other']
    },
    {
      name: 'proficiencyLevel',
      label: 'Proficiency Level Label Override',
      placeholder: 'Leave blank to auto-calculate (Expert, Advanced, etc.)',
      datalist: ['Expert', 'Advanced', 'Intermediate', 'Learning']
    },
    {
      name: 'yearsOfExperience',
      label: 'Years of Experience',
      placeholder: 'e.g. 3 Yrs, 4+ Yrs'
    },
    {
      name: 'projectsCount',
      label: 'Project Details / Usage',
      placeholder: 'e.g. Active production use, 5+ projects'
    },
    {
      name: 'keyAreas',
      label: 'Key Areas / Highlights',
      placeholder: 'e.g. Caching, UI Components, Optimization'
    }
  ]} />;
};

// ------ PROJECTS ------
import { projectsAPI } from '../../services/api';
export const AdminProjects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => projectsAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Projects" itemLabel="Project" items={items} api={projectsAPI} onRefresh={load} fields={[
    { name: 'title', label: 'Project Title', required: true, placeholder: 'Portfolio Website' },
    { name: 'description', label: 'Description', required: true, type: 'textarea', placeholder: 'What the project does…' },
    { name: 'techStack', label: 'Tech Stack', type: 'array', placeholder: 'React, Node.js, MongoDB', help: 'Comma-separated list' },
    { name: 'githubLink', label: 'GitHub URL', placeholder: 'https://github.com/…' },
    { name: 'liveLink', label: 'Live Demo URL', placeholder: 'https://…' },
    { name: 'image', label: 'Project Screenshot', type: 'file', accept: 'image/*' },
    { name: 'problemSolved', label: 'Problem Solved (Case Study)', type: 'textarea', placeholder: 'Describe the problem this project solved…' },
    { name: 'businessImpact', label: 'Business Impact (Case Study)', type: 'textarea', placeholder: 'Describe the business impact / key achievements…' },
    { name: 'keyFeatures', label: 'Key Deliverables / Features (Case Study)', placeholder: 'e.g. Real-time Caching, Stripe Checkout', help: 'Comma-separated list' },
    { name: 'performanceScore', label: 'Performance Score (Lighthouse 0-100)', type: 'number', placeholder: 'e.g. 99' },
    { name: 'timeline', label: 'Development Timeline', placeholder: 'e.g. 3 Months, 2 Weeks' },
    { name: 'completionPercentage', label: 'Completion Percentage (0-100)', type: 'number', placeholder: 'e.g. 100' },
    { name: 'status', label: 'Project Status', placeholder: 'e.g. Production Ready, In Active Dev', datalist: ['Production Ready', 'Beta', 'In Active Dev', 'Prototype'] },
  ]} />;
};

// ------ ACHIEVEMENTS ------
import { achievementsAPI } from '../../services/api';
export const AdminAchievements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => achievementsAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Achievements" itemLabel="Achievement" items={items} api={achievementsAPI} onRefresh={load} fields={[
    { name: 'title', label: 'Achievement Title', required: true, placeholder: 'First Place Hackathon' },
    { name: 'description', label: 'Description', required: true, type: 'textarea', placeholder: 'Brief description…' },
    { name: 'date', label: 'Date', required: true, placeholder: 'March 2024' },
  ]} />;
};

// ------ ACTIVITIES ------
import { activitiesAPI } from '../../services/api';
export const AdminActivities = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => activitiesAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Extra-Curricular Activities" itemLabel="Activity" items={items} api={activitiesAPI} onRefresh={load} fields={[
    { name: 'name', label: 'Activity Name', required: true, placeholder: 'Chess Club' },
    { name: 'description', label: 'Description', required: true, type: 'textarea', placeholder: 'What you did…' },
  ]} />;
};

// ------ CERTIFICATES ------
import { certificatesAPI } from '../../services/api';
export const AdminCertificates = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => certificatesAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Certificates" itemLabel="Certificate" items={items} api={certificatesAPI} onRefresh={load} fields={[
    { name: 'name', label: 'Certificate Name', required: true, placeholder: 'AWS Certified Solutions Architect' },
    { name: 'issuer', label: 'Issuing Organization', required: true, placeholder: 'Amazon Web Services' },
    { name: 'issueDate', label: 'Issue Date', required: true, placeholder: 'May 2024' },
    { name: 'credentialUrl', label: 'Credential URL', placeholder: 'https://...' },
  ]} />;
};

// ------ WHY HIRE ME ------
import { whyHireAPI } from '../../services/api';
export const AdminWhyHire = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => whyHireAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Why Hire Me Points" itemLabel="Point" items={items} api={whyHireAPI} onRefresh={load} fields={[
    { name: 'title', label: 'Why Hire Me Point', required: true, type: 'textarea', placeholder: 'e.g. Shipped 5+ production-ready web applications using React and Node.js.' },
  ]} />;
};

