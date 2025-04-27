// Dashboard.js - Main dashboard component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Camera, LineChart, Clipboard, Settings, Award } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [recentMeals, setRecentMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Add this console log to inspect the user object structure
    console.log("User object in Dashboard:", user);
    fetchMealHistory();
  }, []);
  
  const fetchMealHistory = async () => {
    try {
      const response = await axios.get(`/api/meals/${user.user_id}`);
      // Get most recent 3 meals
      setRecentMeals(response.data.meals ? response.data.meals.slice(0, 3) : []);
    } catch (error) {
      console.error('Error fetching meal history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate personalization level based on user data
  const calculatePersonalizationLevel = () => {
    let level = 'Basic';
    let percentage = 25;
    
    // Check if user has calibration data
    if (user.calibration && user.calibration.calibration_factor) {
      level = 'Calibrated';
      percentage = 50;
    }
    
    // Check if user has logged responses to meals
    if (recentMeals && recentMeals.some(meal => meal.user_response)) {
      level = 'Personalized';
      percentage = 75;
    }
    
    // Check if user has logged at least 5 meal responses
    if (recentMeals && recentMeals.filter(meal => meal.user_response).length >= 5) {
      level = 'Advanced';
      percentage = 100;
    }
    
    return { level, percentage };
  };
  
  const personalization = calculatePersonalizationLevel();
  
  return (
    <div className="dashboard-container">
      <div className="greeting-section">
        <h1>
          Hello, {user?.profile?.name || 'there'}!
        </h1>
        <p className="subtitle">Here's your personal GI dashboard</p>
      </div>
      
      <div className="personalization-card">
        <div className="personalization-header">
          <h2>Personalization Level</h2>
          <span className="level-badge">{personalization.level}</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${personalization.percentage}%` }}
          ></div>
        </div>
        
        <p className="personalization-tip">
          {personalization.level === 'Basic' && 
            'Complete the calibration test to improve your personalized recommendations.'}
          {personalization.level === 'Calibrated' && 
            'Log your responses to meals to further improve personalization.'}
          {personalization.level === 'Personalized' && 
            'Keep logging meal responses to reach advanced personalization.'}
          {personalization.level === 'Advanced' && 
            'You have reached advanced personalization! Your recommendations are highly tailored.'}
        </p>
        
        {personalization.level === 'Basic' && (
          <Link to="/calibration" className="btn btn-primary">
            Take Calibration Test
          </Link>
        )}
      </div>
      
      <div className="action-buttons">
        <Link to="/analyze" className="main-action">
          <Camera size={24} />
          <span>Analyze Food</span>
        </Link>
        
        <div className="secondary-actions">
          <Link to="/calibration" className="action-button">
            <LineChart size={20} />
            <span>Calibration</span>
          </Link>
          
          <Link to="/history" className="action-button">
            <Clipboard size={20} />
            <span>History</span>
          </Link>
          
          <Link to="/profile" className="action-button">
            <Settings size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
      
      <div className="recent-meals">
        <h2>Recent Meals</h2>
        
        {loading ? (
          <p>Loading your recent meals...</p>
        ) : recentMeals.length > 0 ? (
          <div className="meals-list">
            {recentMeals.map((meal, index) => (
              <div key={index} className="meal-card">
                <div className="meal-image">
                  <img src={meal.image_path || "/placeholder-meal.jpg"} alt="Meal" />
                </div>
                
                <div className="meal-details">
                  <div className="food-names">
                    {meal.food_items && meal.food_items.map((food, i) => (
                      <span key={i} className={`food-tag ${food.personalized_gi.impact_level}-impact`}>
                        {food.food_name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="meal-time">
                    {new Date(meal.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-meals">
            <p>No meals analyzed yet.</p>
            <Link to="/analyze" className="btn btn-primary">
              Analyze Your First Meal
            </Link>
          </div>
        )}
      </div>
      
      <div className="tips-section">
        <h2>Personalized Tips</h2>
        
        <div className="tip-card">
          <div className="tip-icon">
            <Award size={24} />
          </div>
          <div className="tip-content">
            <h3>Improve Your Metabolic Health</h3>
            <p>
              {user?.profile?.diabetes_status === 'none' 
                ? 'For optimal blood sugar control, consider pairing carbs with protein or healthy fats.'
                : 'To help manage your blood sugar, focus on low GI foods and proper meal timing.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
