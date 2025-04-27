// Onboarding.js - Component for new user registration
import React, { useState } from 'react';
import axios from 'axios';
import './Onboarding.css';

const Onboarding = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activity_level: 'moderately_active',
    diabetes_status: 'none',
    weight_goal: 'maintain'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.age || !formData.gender) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.age < 18 || formData.age > 120) {
        setError('Please enter a valid age between 18 and 120');
        return false;
      }
    } else if (step === 2) {
      if (!formData.height || !formData.weight) {
        setError('Please fill in all required fields');
        return false;
      }
    }
    
    setError(null);
    return true;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };

  // In your Onboarding.js file, update the handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateStep()) return;
  
    setLoading(true);
  
    try {
      // Log what we're sending for debugging
      console.log("Sending data:", formData);
    
      // Convert string values to numbers and ensure all required fields are present
      const processedData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender, 
        height: Number(formData.height),
        weight: Number(formData.weight),
        activity_level: formData.activity_level,
        diabetes_status: formData.diabetes_status,
        weight_goal: formData.weight_goal,
        // Only include optional fields if they have values
        ...(formData.hba1c ? { hba1c: Number(formData.hba1c) } : {}),
        ...(formData.fasting_glucose ? { fasting_glucose: Number(formData.fasting_glucose) } : {})
      };
      console.log("Sending data to:", '/api/users');
      console.log("Payload:", processedData); 
      
      const response = await axios.post('/api/users', processedData);

      console.log("Response:", response);
    
      onLogin(response.data);

    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error response:', error.response?.data); // Log the full error response
      console.error('Response status:', error.response?.status);
      // Show more detailed error message if available
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>Welcome to GI Personalize</h1>
          <p className="subtitle">Let's set up your personalized profile</p>
          <div className="step-indicator">
            <div className={`step ${step === 1 ? 'active' : ''}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>2</div>
            <div className="step-line"></div>
            <div className={`step ${step === 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>
        
        <form onSubmit={step === 3 ? handleSubmit : undefined}>
          {step === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="120"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="form-step">
              <h2>Body Measurements</h2>
              
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="activity_level">Activity Level</label>
                <select
                  id="activity_level"
                  name="activity_level"
                  value={formData.activity_level}
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
          )}
          
          {step === 3 && (
            <div className="form-step">
              <h2>Health Information</h2>
              
              <div className="form-group">
                <label htmlFor="diabetes_status">Diabetes Status</label>
                <select
                  id="diabetes_status"
                  name="diabetes_status"
                  value={formData.diabetes_status}
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
                  value={formData.weight_goal}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="lose">Weight loss</option>
                  <option value="maintain">Weight maintenance</option>
                  <option value="gain">Weight gain</option>
                </select>
              </div>
              
              <div className="optional-info">
                <p>Optional: If you know these values</p>
                
                <div className="form-group">
                  <label htmlFor="hba1c">HbA1c (%)</label>
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
                  <label htmlFor="fasting_glucose">Fasting Glucose (mg/dL)</label>
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
          )}
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-buttons">
            {step > 1 && (
              <button 
                type="button" 
                className="btn btn-secondary back-button" 
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button 
                type="button" 
                className="btn btn-primary next-button" 
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary submit-button"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
