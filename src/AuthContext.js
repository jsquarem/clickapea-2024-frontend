import React, { createContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async response => {
      console.log('Login Success:', response);
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`
        }
      }).then(res => res.json());

      setIsAuthenticated(true);
      setUser(userInfo);
    },
    onError: error => {
      console.log('Login Error:', error);
      setIsAuthenticated(false);
      setUser(null);
    },
    scope: 'openid email profile',
  });

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
