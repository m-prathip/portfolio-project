import { useState, useEffect } from 'react';
import { useParams, Outlet, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { PageLoader } from '../components/common/Spinner';
import SceneBackground from '../components/three/SceneBackground';
import AssistantWidget from '../components/common/AssistantWidget';
import { profileAPI, portfolioAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useBackground } from '../context/BackgroundContext';
import { FiArrowLeft } from 'react-icons/fi';

const MOCK_DEMO_PROFILE = {
  name: 'Alex Rivera',
  username: 'demo',
  title: 'Principal AI Architect & Full Stack Lead',
  bio: 'Specializing in scalable LLM pipelines, React server architectures, and high-performance cloud infrastructure across 10+ years of engineering excellence.',
  location: 'San Francisco, CA',
  email: 'portfoliopublisher@gmail.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  theme: 'ocean',
  background: 'neural',
  isSetup: true,
  collections: {
    skills: [
      { name: 'React 19', category: 'Frontend', level: 'Expert', proficiency: 98 },
      { name: 'TypeScript', category: 'Frontend', level: 'Expert', proficiency: 96 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', proficiency: 99 },
      { name: 'Next.js', category: 'Frontend', level: 'Expert', proficiency: 94 },
      { name: 'Python / FastAPI', category: 'Backend', level: 'Expert', proficiency: 97 },
      { name: 'Node.js', category: 'Backend', level: 'Advanced', proficiency: 90 },
      { name: 'PostgreSQL', category: 'Databases', level: 'Advanced', proficiency: 88 },
      { name: 'TensorFlow', category: 'AI/ML', level: 'Expert', proficiency: 95 },
      { name: 'PyTorch / LLMs', category: 'AI/ML', level: 'Expert', proficiency: 92 },
      { name: 'Docker / K8s', category: 'Tools', level: 'Advanced', proficiency: 89 },
      { name: 'AWS Cloud', category: 'Tools', level: 'Advanced', proficiency: 87 },
    ],
    projects: [
      {
        title: 'AutonomAI — Multi-Agent LLM Orchestrator',
        description: 'Distributed orchestration framework processing 50,000+ semantic queries per second with sub-100ms latency across GPU clusters.',
        techStack: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'TensorFlow'],
        liveDemoUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        keyFeatures: 'Automated agent routing, Sub-100ms inference latency, Custom token quantization',
        performanceScore: 99,
        completionPercentage: 100,
        timeline: '3 Months',
        status: 'Production Ready'
      },
      {
        title: 'ApexCloud — Real-Time Observability Engine',
        description: 'Streaming telemetry platform monitoring 10,000+ microservices with custom anomaly detection algorithms and WebSocket streaming.',
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
        liveDemoUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        keyFeatures: 'WebSocket live streaming, Automated AWS alerting, 35% cost reduction engine',
        performanceScore: 98,
        completionPercentage: 100,
        timeline: '2 Months',
        status: 'Production Ready'
      },
      {
        title: 'HyperPulse — Motion UI & Token Design System',
        description: 'Open-source design token library and Framer Motion micro-interaction toolkit adopted by over 400 engineering teams globally.',
        techStack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'React'],
        liveDemoUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        keyFeatures: '60 FPS micro-animations, Curated HSL color palettes, Universal accessibility tokens',
        performanceScore: 100,
        completionPercentage: 100,
        timeline: '1 Month',
        status: 'Production Ready'
      }
    ],
    experience: [
      { role: 'Staff AI Architect', company: 'DeepMind Scaling Lab', period: '2024 — Present', description: 'Leading design of distributed LLM training pipelines and multi-agent evaluation frameworks.' },
      { role: 'Senior Frontend Lead', company: 'Vercel Ecosystem', period: '2022 — 2024', description: 'Architected responsive UI components and React server component rendering optimizations.' },
      { role: 'Software Engineer', company: 'Stripe Payments', period: '2020 — 2022', description: 'Developed high-throughput financial API endpoints handling $4B+ daily volume.' }
    ],
    achievements: [
      { title: 'AI Engineering Excellence Award 2025', description: 'Recognized for top open-source contributions to distributed model quantization.' },
      { title: 'Keynote Speaker at React Summit', description: 'Presented on server-side streaming architectures to an audience of 3,000+ engineers.' }
    ],
    certificates: [
      { name: 'AWS Certified Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2025' },
      { name: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', date: '2024' }
    ],
    activities: [
      { title: 'Open Source Mentor', description: 'Mentored 25+ junior developers in contributing to core React and PyTorch repositories.' }
    ]
  }
};

const EmptyState = ({ title, text }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-gray-900">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-6">{text}</p>
    <Link to="/" className="btn-primary px-5 py-2.5"><FiArrowLeft size={16} /> Back home</Link>
  </div>
);

const PortfolioLayout = () => {
  const { username } = useParams();
  const { theme, setTheme, setMode } = useTheme();
  const { setBg } = useBackground();
  const [status, setStatus] = useState('loading');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    if (username === 'demo' || username === 'alex') {
      setProfile(MOCK_DEMO_PROFILE);
      setTheme(MOCK_DEMO_PROFILE.theme);
      setBg(MOCK_DEMO_PROFILE.background);
      setMode?.('dark');
      setStatus('ready');
      return;
    }

    profileAPI.getPublic(username)
      .then((res) => {
        if (cancelled) return;
        setProfile(res.data);
        if (res.data.theme) setTheme(res.data.theme);
        if (res.data.background) setBg(res.data.background);
        setStatus(res.data.isSetup ? 'ready' : 'not-setup');
      })
      .catch((err) => {
        if (cancelled) return;
        if (username === 'demo') {
          setProfile(MOCK_DEMO_PROFILE);
          setTheme(MOCK_DEMO_PROFILE.theme);
          setBg(MOCK_DEMO_PROFILE.background);
          setMode?.('dark');
          setStatus('ready');
        } else {
          setStatus(err.response?.status === 404 ? 'not-found' : 'not-setup');
        }
      });
    return () => { cancelled = true; };
  }, [username]);



  useEffect(() => {
    document.title = profile?.name ? `${profile.name} — Portfolio` : 'Portfolio';
  }, [profile]);

  if (status === 'loading') return <PageLoader />;
  if (status === 'not-found') return <EmptyState title="Portfolio not found" text={`There's no portfolio at @${username}.`} />;
  if (status === 'not-setup') return <EmptyState title="Still under construction" text={`@${username} hasn't published their portfolio yet — check back soon.`} />;

  return (
    <div className="flex flex-col min-h-screen relative">
      <SceneBackground />
      <Navbar username={username} profile={profile} />
      <main className="flex-1">
        <Outlet context={{ profile, username }} />
      </main>
      <Footer profile={profile} />
      <AssistantWidget username={username} name={profile?.name} />
    </div>
  );
};

export default PortfolioLayout;
