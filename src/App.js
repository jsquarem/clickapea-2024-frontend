import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthContext, { AuthProvider } from './AuthContext';
import RecipePage from './pages/RecipePage/RecipePage';
import AddRecipePage from './pages/AddRecipePage/AddRecipePage';
import Protected from './Protected';
import Header from './components/Header/Header';
import './App.css';

const App = () => {
    const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async response => {
            console.log('Login Success:', response);
            const userInfo = await fetchUserInfo(response.access_token);
            setIsAuthenticated(true);
            setUser(userInfo);
        },
        onError: error => {
            console.log('Login Error:', error);
            setIsAuthenticated(false);
        },
        scope: 'openid email profile',
    });

    const fetchUserInfo = async (accessToken) => {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return await res.json();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <Router>
            <div className="App">
                <Header 
                    isAuthenticated={isAuthenticated} 
                    user={user} 
                    onLogin={login} 
                    onLogout={handleLogout} 
                    showMenu={showMenu} 
                    setShowMenu={setShowMenu}
                />
                <Routes>
                    <Route path="/" element={<RecipePage />} />
                    <Route path="/recipe/:id" element={<RecipePage />} />
                    <Route path="/add-recipe" element={<AddRecipePage />} />
                    <Route path="/protected" element={
                        isAuthenticated ? <Protected /> : <Navigate to="/" />
                    } />
                </Routes>
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
