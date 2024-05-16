import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthContext, { AuthProvider } from './AuthContext';
import HomePage from './pages/HomePage/HomePage';
import RecipePage from './pages/RecipePage/RecipePage';
import AddRecipePage from './pages/AddRecipePage/AddRecipePage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import Protected from './Protected';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

const App = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      console.log('Login Success:', response);
      const userInfo = await fetchUserInfo(response.access_token);
      setIsAuthenticated(true);
      setUser(userInfo);
    },
    onError: (error) => {
      console.log('Login Error:', error);
      setIsAuthenticated(false);
    },
    scope: 'openid email profile',
  });

  const fetchUserInfo = async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await res.json();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={login}
          onLogout={handleLogout}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/add-recipe" element={<AddRecipePage />} />
            <Route
              path="/categories"
              element={
                isAuthenticated && user ? <CategoryPage /> : <Navigate to="/" />
              }
            />
            <Route
              path="/protected"
              element={
                isAuthenticated && user ? <Protected /> : <Navigate to="/" />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
