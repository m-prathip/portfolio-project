import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { BackgroundProvider } from './context/BackgroundContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { PageLoader } from './components/common/Spinner';

// Code-splitting: every route is lazy-loaded so the initial bundle stays
// small and the heavy 3D/animation libs only load on the portfolio pages
// that use them (Phase 13 — performance).
const Landing = lazy(() => import('./pages/Landing'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PortfolioLayout = lazy(() => import('./pages/PortfolioLayout'));
const Home = lazy(() => import('./pages/Home'));
const Education = lazy(() => import('./pages/Education'));
const Projects = lazy(() => import('./pages/Projects'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Experience = lazy(() => import('./pages/Experience'));
const Activities = lazy(() => import('./pages/Activities'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminSignup = lazy(() => import('./pages/admin/Signup'));
const VerifyEmail = lazy(() => import('./pages/admin/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword'));
const AdminLayout = lazy(() => import('./pages/admin/Dashboard'));
const AdminProfile = lazy(() => import('./pages/admin/Profile'));
const AdminShare = lazy(() => import('./pages/admin/Share'));

// Sections.jsx exports several named admin components — lazy-load each.
const pick = (name) => lazy(() => import('./pages/admin/Sections').then((m) => ({ default: m[name] })));
const AdminEducation = pick('AdminEducation');
const AdminExperience = pick('AdminExperience');
const AdminSkills = pick('AdminSkills');
const AdminProjects = pick('AdminProjects');
const AdminAchievements = pick('AdminAchievements');
const AdminActivities = pick('AdminActivities');
const AdminCertificates = pick('AdminCertificates');
const AdminWhyHire = pick('AdminWhyHire');

const App = () => (
  <ThemeProvider>
    <BackgroundProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px' } }} />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Auth */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/verify-email" element={<VerifyEmail />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />

              {/* Admin dashboard */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/profile" replace />} />
                <Route path="dashboard" element={<Navigate to="/admin/profile" replace />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="share" element={<AdminShare />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="achievements" element={<AdminAchievements />} />
                <Route path="activities" element={<AdminActivities />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="whyhire" element={<AdminWhyHire />} />
              </Route>

              {/* Public portfolios */}
              <Route path="/u/:username" element={<PortfolioLayout />}>
                <Route index element={<Home />} />
                <Route path="education" element={<Education />} />
                <Route path="projects" element={<Projects />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="experience" element={<Experience />} />
                <Route path="activities" element={<Activities />} />
                <Route path="*" element={<Navigate to="." replace />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </BackgroundProvider>
  </ThemeProvider>
);

export default App;
