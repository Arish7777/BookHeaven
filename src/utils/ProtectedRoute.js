import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    // Redirect to login if no user is logged in
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;