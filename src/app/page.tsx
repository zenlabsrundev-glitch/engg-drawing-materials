import React from 'react';
import { Navigate } from 'react-router-dom';

const RootPage: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default RootPage;
