// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Update this import
import './index.css';
import App from './App';
import UserProvider from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
