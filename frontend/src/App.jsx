import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard'; // Created in next step
import Dashboard from './pages/Dashboard';
import MyLearning from './pages/MyLearning';
import Courses from './pages/Courses';
import LandingPage from './pages/LandingPage';
import ChatInterface from './pages/ChatInterface';
import LabView from './pages/LabView';
import Achievements from './pages/Achievements';
import CertificateView from './pages/CertificateView';
import ProfileSettings from './pages/ProfileSettings';
import ResumeAnalysis from './pages/ResumeAnalysis';
import Login from './pages/Login';
import Register from './pages/Register';
import WebDevLab from './components/3d/WebDevLab';
import PhysicsLab from './components/3d/PhysicsLab';
import ChemistryLab from './components/3d/ChemistryLab';
import NetworkSecLab from './components/3d/NetworkSecLab';
import CircuitLab from './components/3d/CircuitLab';
import NeuralNetViz from './components/3d/NeuralNetViz';
import SortingViz from './components/3d/SortingViz';
import LearningPathDetail from './pages/LearningPathDetail';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/my-learning" element={<Layout><MyLearning /></Layout>} />
        <Route path="/courses" element={<Layout><Courses /></Layout>} />
        <Route path="/course/:id" element={<Layout><CourseDetail /></Layout>} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/chat" element={<Layout><ChatInterface /></Layout>} />
        <Route path="/lab/:labId" element={<LabView />} />
        <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
        <Route path="/lab/web-dev" element={<WebDevLab />} />
        <Route path="/lab/physics" element={<PhysicsLab />} />
        <Route path="/lab/chemistry" element={<ChemistryLab />} />
        <Route path="/lab/network-defense" element={<NetworkSecLab />} />
        <Route path="/lab/circuit-logic" element={<CircuitLab />} />
        <Route path="/lab/neural-network" element={<NeuralNetViz />} />
        <Route path="/lab/sorting-algo" element={<SortingViz />} />
        <Route path="/learning-path/:id" element={<Layout><LearningPathDetail /></Layout>} />
        <Route path="/certificate/:id" element={<CertificateView />} />
        <Route path="/resume" element={<Layout><ResumeAnalysis /></Layout>} />
        <Route path="/profile" element={<Layout><ProfileSettings /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
