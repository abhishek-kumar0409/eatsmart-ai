// Profile.js - User profile management component
import React, { useState } from 'react';
import axios from 'axios';
import { User, Save } from 'lucide-react';
import './Profile.css';

const Profile = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    ...user.profile,
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      await axios.put(`/api/users/${user.user_id}`, formData);
      
      onProfileUpdate(formData);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-icon">
          <User size={28} />
        </div>
        <h1>Your Profile</h1>
      </div>
      
      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  min="18"
                  max="120"
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sex">Sex</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex || ''}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Body Measurements</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity_level">Activity Level</label>
              <select
                id="activity_level"
                name="activity_level"
                value={formData.activity_level || 'moderately_active'}
                onChange={handleChange}
                className="form-control"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="lightly_active">Lightly active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very active (hard exercise 6-7 days/week)</option>
                <option value="extremely_active">Extremely active (very hard exercise, physical job)</option>
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Health Information</h2>
            
            <div className="form-group">
              <label htmlFor="diabetes_status">Diabetes Status</label>
              <select
                id="diabetes_status"
                name="diabetes_status"
                value={formData.diabetes_status || 'none'}
                onChange={handleChange}
                className="form-control"
              >
                <option value="none">No diabetes</option>
                <option value="pre_diabetic">Pre-diabetic</option>
                <option value="type2_diabetes">Type 2 Diabetes</option>
                <option value="type1_diabetes">Type 1 Diabetes</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="weight_goal">Weight Management Goal</label>
              <select
                id="weight_goal"
                name="weight_goal"
                value={formData.weight_goal || 'maintain'}
                onChange={handleChange}
                className="form-control"
              >
                <option value="lose">Weight loss</option>
                <option value="maintain">Weight maintenance</option>
                <option value="gain">Weight gain</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hba1c">HbA1c (%) - If known</label>
                <input
                  type="number"
                  id="hba1c"
                  name="hba1c"
                  value={formData.hba1c || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="3"
                  max="15"
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fasting_glucose">Fasting Glucose (mg/dL) - If known</label>
                <input
                  type="number"
                  id="fasting_glucose"
                  name="fasting_glucose"
                  value={formData.fasting_glucose || ''}
                  onChange={handleChange}
                  min="50"
                  max="400"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Profile updated successfully!</p>}
          
          <button 
            type="submit" 
            className="btn btn-primary save-button"
            disabled={loading}
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
