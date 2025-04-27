// FoodAnalysis.js - Component for analyzing food images
import React, { useState } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import './FoodAnalysis.css';

const FoodAnalysis = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  
  // Update the handleSubmit function in FoodAnalysis.js
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedFile) {
      setError('Please select an image to analyze');
      return;
    }
  
    setAnalyzing(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('food_image', selectedFile);
      formData.append('user_id', user.user_id);
    
      // Adjusted to match backend endpoint
      const response = await axios.post('/api/food/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
      setResults(response.data);
    } catch (error) {
      console.error('Error analyzing food:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to analyze food image. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };
  
  
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };
  
  const handleLogResponse = async (mealId, response) => {
    try {
      await axios.post(`/api/meals/${user.user_id}/${mealId}/response`, response);
      alert('Thank you for your feedback! Your personalized model will be updated.');
    } catch (error) {
      console.error('Error logging response:', error);
      alert('Failed to save your response. Please try again.');
    }
  };
  
  return (
    <div className="food-analysis-container">
      <h1>Analyze Food</h1>
      
      {!results ? (
        <div className="analysis-form">
          <div className="camera-container">
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <div className="camera-placeholder">
                <Camera size={48} />
                <p>Take a photo of your food</p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="file-input-container">
              <input
                type="file"
                id="food-image"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="food-image" className="file-input-label btn btn-secondary">
                {preview ? 'Change Photo' : 'Take Photo'}
              </label>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <button
              type="submit"
              className="btn btn-primary analyze-button"
              disabled={analyzing || !selectedFile}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Food'}
            </button>
          </form>
        </div>
      ) : (
        <div className="analysis-results">
          <div className="result-image">
            <img src={preview} alt="Analyzed food" />
          </div>
          
          <div className="food-items">
            <h2>Identified Foods</h2>
            
            {results.results.map((item, index) => (
              <div 
                key={index} 
                className={`food-item ${item.personalized_gi.impact_level}-impact`}
              >
                <h3>{item.food_name}</h3>
                <div className="gi-info">
                  <div className="gi-values">
                    <div className="gi-value">
                      <span className="label">Standard GI:</span>
                      <span className="value">{Math.round(item.base_gi)}</span>
                    </div>
                    <div className="gi-value personalized">
                      <span className="label">Personalized GI:</span>
                      <span className="value">
                        {Math.round(item.personalized_gi.personalized_gi_score)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="impact-badge">
                    {item.personalized_gi.impact_level.toUpperCase()} IMPACT
                  </div>
                </div>
                
                <div className="recommendations">
                  <h4>Recommendations:</h4>
                  <ul>
                    {item.personalized_gi.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="feedback-section">
            <h3>How did this food affect you?</h3>
            <div className="feedback-buttons">
              <button 
                onClick={() => handleLogResponse(results.meal_id, { response: 'less_than_expected' })}
                className="btn btn-secondary feedback-button"
              >
                Less impact than expected
              </button>
              <button 
                onClick={() => handleLogResponse(results.meal_id, { response: 'as_expected' })}
                className="btn btn-secondary feedback-button"
              >
                As expected
              </button>
              <button 
                onClick={() => handleLogResponse(results.meal_id, { response: 'more_than_expected' })}
                className="btn btn-secondary feedback-button"
              >
                More impact than expected
              </button>
            </div>
          </div>
          
          <button onClick={handleReset} className="btn btn-primary analyze-another-button">
            Analyze Another Food
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodAnalysis;
