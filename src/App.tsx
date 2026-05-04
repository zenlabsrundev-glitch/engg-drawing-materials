import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './components/auth/login/login';
import { StudentCartPage } from './components/student/StudentCartPage';
import { StudentOrdersPage } from './components/student/StudentOrdersPage';
import { StudentProfilePage } from './components/student/StudentProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageOrdersPage } from './components/admin/ManageOrdersPage';
import { ManageUsersPage } from './components/admin/ManageUsersPage';
import { ManageKitsPage } from './components/admin/ManageKitsPage';
import { ReportsPage as AdminReportsPage } from './components/admin/ReportsPage';
import { AdminSettingsPage } from './components/admin/AdminSettingsPage';
import { StudentKitsPage } from './components/student/StudentKitsPage';


const App: React.FC = () => {
  const initData = useDataStore(state => state.initData);
  const { role, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && role) {
      initData(role, user);
    }
  }, [initData, role, user, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth-only Routes (login card layout) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Public + Student Routes under DashboardLayout */}
        <Route 
          path="/student" 
          element={
            isAuthenticated && (role === 'student' || role === 'admin')
              ? <DashboardLayout />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="kits" replace />} />
          <Route path="kits" element={<StudentKitsPage />} />
          <Route path="cart" element={<StudentCartPage />} />
          <Route path="orders" element={<StudentOrdersPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && role === 'admin' 
              ? <DashboardLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<ManageOrdersPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="kits" element={<ManageKitsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Root Route: Smart redirect based on auth status */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={role === 'admin' ? '/admin' : '/student/kits'} replace /> 
              : <Navigate to="/login" replace />
          } 
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
