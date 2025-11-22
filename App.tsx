import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { Subjects } from './pages/Subjects';
import { MarkAttendance } from './pages/MarkAttendance';
import { Calendar } from './pages/Calendar';
import { Notifications } from './pages/Notifications';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { TeacherClasses } from './pages/TeacherClasses';

const AppRoutes = () => {
  const { isLoggedIn, user } = useApp();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Conditional Dashboard Routing */}
        <Route path="/" element={user?.role === 'teacher' ? <TeacherDashboard /> : <Dashboard />} />
        
        {/* Shared Routes */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Student Specific Routes (In a real app, protect these with role checks) */}
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/mark" element={<MarkAttendance />} />
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Teacher Specific Routes */}
        <Route path="/classes" element={<TeacherClasses />} />
        <Route path="/requests" element={<Notifications />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;