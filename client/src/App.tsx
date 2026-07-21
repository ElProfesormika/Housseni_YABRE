import { Routes, Route } from 'react-router-dom';
import PortfolioLayout from './layouts/PortfolioLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import SkillsPage from './pages/public/SkillsPage';
import ParcoursPage from './pages/public/ParcoursPage';
import ExperienceDetailPage from './pages/public/ExperienceDetailPage';
import EducationDetailPage from './pages/public/EducationDetailPage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import CertificationsPage from './pages/public/CertificationsPage';
import CertificationDetailPage from './pages/public/CertificationDetailPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminCrud from './pages/admin/AdminCrud';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMessages from './pages/admin/AdminMessages';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PortfolioLayout />}>
          <Route index element={<HomePage />} />
          <Route path="a-propos" element={<AboutPage />} />
          <Route path="competences" element={<SkillsPage />} />
          <Route path="parcours" element={<ParcoursPage />} />
          <Route path="parcours/experience/:id" element={<ExperienceDetailPage />} />
          <Route path="parcours/formation/:id" element={<EducationDetailPage />} />
          <Route path="projets" element={<ProjectsPage />} />
          <Route path="projets/:id" element={<ProjectDetailPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="certifications/:id" element={<CertificationDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminCrud resource="projects" title="Projets" />} />
          <Route path="experiences" element={<AdminCrud resource="experiences" title="Expériences" />} />
          <Route path="skills" element={<AdminCrud resource="skills" title="Compétences" />} />
          <Route path="certifications" element={<AdminCrud resource="certifications" title="Certifications" />} />
          <Route path="education" element={<AdminCrud resource="education" title="Formation" />} />
          <Route path="social" element={<AdminCrud resource="social-links" title="Réseaux sociaux" />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}
