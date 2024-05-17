import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  localStorage.setItem(
    'protectedRouteDebug',
    JSON.stringify({ isAuthenticated, user })
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
