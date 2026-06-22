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

const EmptyState = ({ title, text }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-gray-900">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-6">{text}</p>
    <Link to="/" className="btn-primary px-5 py-2.5"><FiArrowLeft size={16} /> Back home</Link>
  </div>
);

const PortfolioLayout = () => {
  const { username } = useParams();
  const { theme, setTheme } = useTheme();
  const { setBg } = useBackground();
  const [status, setStatus] = useState('loading'); // loading | not-found | not-setup | ready
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
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
        setStatus(err.response?.status === 404 ? 'not-found' : 'not-setup');
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
