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
export const AdminSkills = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => skillsAPI.getMine().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  if (loading) return <PageLoader />;
  return <AdminCRUD title="Skills" itemLabel="Skill" items={items} api={skillsAPI} onRefresh={load} fields={[
    { name: 'name', label: 'Skill Name', required: true, placeholder: 'React.js' },
    { name: 'level', label: 'Proficiency Level (0-100)', required: true, type: 'range', defaultValue: 80 },
    { name: 'category', label: 'Category', placeholder: 'Frontend, Backend, DevOps…' },
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
