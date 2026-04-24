import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StudentKitsPage as KitsContent } from '../../components/student/kits/StudentKitsPage';

const StudentKitsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <KitsContent />
    </DashboardLayout>
  );
};

export default StudentKitsPage;
