import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import LandingNavbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import PortfolioPreviewSection from '../components/landing/PortfolioPreviewSection';
import ResumeBuilderSection from '../components/landing/ResumeBuilderSection';
import QRGeneratorSection from '../components/landing/QRGeneratorSection';
import AIPortfolioSection from '../components/landing/AIPortfolioSection';
import AnalyticsDashboardSection from '../components/landing/AnalyticsDashboardSection';
import TemplatesSection from '../components/landing/TemplatesSection';
import RecruiterViewSection from '../components/landing/RecruiterViewSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import FooterSection from '../components/landing/FooterSection';

const Landing = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('openai');
    // Force dark mode for the landing page
    document.documentElement.classList.add('dark');
    return () => {};
  }, [setTheme]);

  return (
    <div className="landing-root min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <LandingNavbar />
      <main>
        <HeroSection />
        <PortfolioPreviewSection />
        <ResumeBuilderSection />
        <QRGeneratorSection />
        <AIPortfolioSection />
        <AnalyticsDashboardSection />
        <TemplatesSection />
        <RecruiterViewSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Landing;