import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Platform pages
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import PortfolioLayout from './pages/PortfolioLayout';

// Public portfolio pages (rendered inside PortfolioLayout, under /u/:username)
import Home from './pages/Home';
import Education from './pages/Education';
import Projects from './pages/Projects';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminSignup from './pages/admin/Signup';
import AdminLayout from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminShare from './pages/admin/Share';
import {
  AdminEducation, AdminExperience, AdminSkills,
  AdminProjects, AdminAchievements, AdminActivities
} from './pages/admin/Sections';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px' } }} />
        <Routes>
          {/* Platform landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* Admin dashboard — manage your own portfolio content */}
          <Route path="/admin" element={
            <ProtectedRoute><AdminLayout /></ProtectedRoute>
          }>
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
          </Route>

          {/* Every user's public portfolio lives at /u/:username */}
          <Route path="/u/:username" element={<PortfolioLayout />}>
            <Route index element={<Home />} />
            <Route path="education" element={<Education />} />
            <Route path="projects" element={<Projects />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
