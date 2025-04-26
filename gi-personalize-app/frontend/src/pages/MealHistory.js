// MealHistory.js - Component for displaying meal history
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, Calendar, Search } from 'lucide-react';
import './MealHistory.css';

const MealHistory = ({ user }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchMealHistory();
  }, []);
  
  const fetchMealHistory = async () => {
    try {
      const response = await axios.get(`/api/meals/${user.user_id}`);
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error fetching meal history:', error);
      setError('Failed to load meal history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Filter and search meals
  const filteredMeals = meals.filter(meal => {
    // Filter by impact level
    if (filter !== 'all') {
      const hasMatchingImpact = meal.food_items && meal.food_items.some(
        food => food.personalized_gi && food.personalized_gi.impact_level === filter
      );
      if (!hasMatchingImpact) return false;
    }
    
    // Search by food name
    if (searchTerm) {
      const hasMatchingFood = meal.food_items && meal.food_items.some(
        food => food.food_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return hasMatchingFood;
    }
    
    return true;
  });
  
  return (
    <div className="meal-history-container">
      <h1>Meal History</h1>
      
      <div className="history-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <label htmlFor="impact-filter">Filter by impact:</label>
          <select
            id="impact-filter"
            value={filter}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All meals</option>
            <option value="low">Low impact</option>
            <option value="medium">Medium impact</option>
            <option value="high">High impact</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-message">Loading your meal history...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredMeals.length === 0 ? (
        <div className="empty-history">
          {searchTerm || filter !== 'all' ? (
            <p>No meals match your search or filter criteria.</p>
          ) : (
            <>
              <p>You haven't analyzed any meals yet.</p>
              <Link to="/analyze" className="btn btn-primary">
                Analyze Your First Meal
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="meals-history-list">
          {filteredMeals.map((meal, index) => (
            <div key={index} className="history-meal-card">
              <div className="meal-image">
                <img src={meal.image_path || "/placeholder-meal.jpg"} alt="Meal" />
              </div>
              
              <div className="meal-content">
                <div className="meal-header">
                  <div className="meal-datetime">
                    <div className="meal-date">
                      <Calendar size={16} />
                      <span>{formatDate(meal.timestamp)}</span>
                    </div>
                    <div className="meal-time">
                      <Clock size={16} />
                      <span>{formatTime(meal.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="meal-foods">
                  {meal.food_items && meal.food_items.map((food, i) => (
                    <div key={i} className="food-item">
                      <div className="food-name">{food.food_name}</div>
                      <div className={`impact-indicator ${food.personalized_gi.impact_level}-impact`}>
                        {food.personalized_gi.impact_level}
                      </div>
                      <div className="gi-values">
                        <span className="gi-label">GI:</span>
                        <span className="gi-value">{Math.round(food.personalized_gi.personalized_gi_score)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {meal.user_response && (
                  <div className="user-response">
                    <div className="response-label">Your response:</div>
                    <div className="response-value">
                      {meal.user_response.response === 'less_than_expected' && 'Less impact than expected'}
                      {meal.user_response.response === 'as_expected' && 'As expected'}
                      {meal.user_response.response === 'more_than_expected' && 'More impact than expected'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealHistory;
