import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AppWrapper />
    </GoogleOAuthProvider>
  </React.StrictMode>
);