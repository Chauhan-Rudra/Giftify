import React from 'react';
import { useLocation, Redirect } from 'wouter';

const ProtectedRoute = ({ component: Component, allowedRole, ...rest }) => {
  const [location] = useLocation();
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return <Redirect to="/login" />;
  }

  const user = JSON.parse(storedUser);

  // If allowedRole is specified, enforce it
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their correct dashboard to be helpful
    const correctPath = user.role === 'creator' ? '/dashboard/creator' : '/dashboard/fan';
    return <Redirect to={correctPath} />;
  }

  // If no role restriction or role matches, render component
  return <Component {...rest} />;
};

export default ProtectedRoute;
