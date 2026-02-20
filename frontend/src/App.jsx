import Navbar from './components/Navbar.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/About.jsx';
import ExplorePage from './pages/Explore.jsx';
import ProfilePage from './pages/Profile.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import AuthPage from './pages/Auth.jsx';
import AddProjectPage from './pages/AddProject.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-project"
          element={
            <ProtectedRoute>
              <AddProjectPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;