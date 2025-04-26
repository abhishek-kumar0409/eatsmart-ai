// App.js - Main React component for the GI Personalization App
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import FoodAnalysis from './pages/FoodAnalysis';
import Calibration from './pages/Calibration';
import MealHistory from './pages/MealHistory';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing user session
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserProfile(userId);
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('userId');
      setLoading(false);
    }
  };
  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userId', userData.user_id);
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Onboarding onLogin={handleLogin} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
            <Route path="/analyze" element={user ? <FoodAnalysis user={user} /> : <Navigate to="/" />} />
            <Route path="/calibration" element={user ? <Calibration user={user} /> : <Navigate to="/" />} />
            <Route path="/history" element={user ? <MealHistory user={user} /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile user={user} onProfileUpdate={(updatedUser) => setUser({...user, profile: updatedUser})} /> : <Navigate to="/" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
