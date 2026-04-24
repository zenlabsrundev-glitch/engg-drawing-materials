import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { AdminDashboard } from '../../components/admin/dashboard/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
