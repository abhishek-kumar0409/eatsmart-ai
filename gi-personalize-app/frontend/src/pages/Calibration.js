// Calibration.js - Component for conducting calibration tests
import React, { useState } from 'react';
import axios from 'axios';
import './Calibration.css';

const Calibration = ({ user }) => {
  const [step, setStep] = useState('intro');
  const [glucoseReadings, setGlucoseReadings] = useState({
    fasting: '',
    thirtyMin: '',
    sixtyMin: '',
    ninetyMin: '',
    twoHour: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleGlucoseChange = (field, value) => {
    setGlucoseReadings({
      ...glucoseReadings,
      [field]: value
    });
  };
  
  const handleStartCalibration = () => {
    setStep('instructions');
  };
  
  const handleSubmitReadings = async () => {
    // Validate readings
    for (const key in glucoseReadings) {
      if (!glucoseReadings[key]) {
        setError('Please fill in all glucose readings');
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const readings = [
        parseFloat(glucoseReadings.fasting),
        parseFloat(glucoseReadings.thirtyMin),
        parseFloat(glucoseReadings.sixtyMin),
        parseFloat(glucoseReadings.ninetyMin),
        parseFloat(glucoseReadings.twoHour)
      ];
      
      const response = await axios.post(`/api/calibration/${user.user_id}`, {
        glucose_readings: readings
      });
      
      setResult(response.data);
      setStep('result');
    } catch (error) {
      console.error('Error submitting calibration:', error);
      setError('Failed to process calibration. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="calibration-container">
      <h1>Personalized Calibration</h1>
      
      {step === 'intro' && (
        <div className="calibration-intro">
          <p>
            To provide the most accurate personalized recommendations, we need to
            understand how your body responds to carbohydrates.
          </p>
          <p>
            This calibration process involves consuming a standard food and
            measuring your glucose response over 2 hours.
          </p>
          <p>
            You'll need:
          </p>
          <ul>
            <li>A glucose meter or CGM device</li>
            <li>A standard slice of white bread (or 15g of glucose)</li>
            <li>2 hours of time where you won't eat or exercise</li>
          </ul>
          
          <button 
            onClick={handleStartCalibration} 
            className="btn btn-primary start-calibration-button"
          >
            Start Calibration
          </button>
        </div>
      )}
      
      {step === 'instructions' && (
        <div className="calibration-instructions">
          <h2>Calibration Instructions</h2>
          
          <ol className="instruction-steps">
            <li>Fast for at least 2 hours before starting</li>
            <li>Measure your fasting glucose level</li>
            <li>Consume one slice of white bread (or 15g glucose solution)</li>
            <li>Measure your glucose at 30, 60, 90, and 120 minutes</li>
            <li>Enter all readings below</li>
          </ol>
          
          <div className="glucose-readings-form">
            <h3>Enter Your Glucose Readings</h3>
            
            <div className="reading-input">
              <label>Fasting (0 min):</label>
              <input
                type="number"
                step="0.1"
                value={glucoseReadings.fasting}
                onChange={(e) => handleGlucoseChange('fasting', e.target.value)}
                placeholder="mg/dL or mmol/L"
                className="form-control"
              />
            </div>
            
            <div className="reading-input">
              <label>30 minutes:</label>
              <input
                type="number"
                step="0.1"
                value={glucoseReadings.thirtyMin}
                onChange={(e) => handleGlucoseChange('thirtyMin', e.target.value)}
                placeholder="mg/dL or mmol/L"
                className="form-control"
              />
            </div>
            
            <div className="reading-input">
              <label>60 minutes:</label>
              <input
                type="number"
                step="0.1"
                value={glucoseReadings.sixtyMin}
                onChange={(e) => handleGlucoseChange('sixtyMin', e.target.value)}
                placeholder="mg/dL or mmol/L"
                className="form-control"
              />
            </div>
            
            <div className="reading-input">
              <label>90 minutes:</label>
              <input
                type="number"
                step="0.1"
                value={glucoseReadings.ninetyMin}
                onChange={(e) => handleGlucoseChange('ninetyMin', e.target.value)}
                placeholder="mg/dL or mmol/L"
                className="form-control"
              />
            </div>
            
            <div className="reading-input">
              <label>120 minutes:</label>
              <input
                type="number"
                step="0.1"
                value={glucoseReadings.twoHour}
                onChange={(e) => handleGlucoseChange('twoHour', e.target.value)}
                placeholder="mg/dL or mmol/L"
                className="form-control"
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <button
              onClick={handleSubmitReadings}
              className="btn btn-primary submit-readings-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Readings'}
            </button>
          </div>
        </div>
      )}
      
      {step === 'result' && result && (
        <div className="calibration-result">
          <h2>Calibration Complete!</h2>
          
          <div className="result-card">
            <p>
              Based on your glucose response, we've calculated your personal
              sensitivity factor:
            </p>
            
            <div className="calibration-factor">
              <span className="factor-value">
                {result.calibration_factor.toFixed(2)}
              </span>
              <span className="factor-label">
                {result.calibration_factor < 1 
                  ? 'Lower sensitivity than average' 
                  : 'Higher sensitivity than average'}
              </span>
            </div>
            
            <p className="result-explanation">
              {result.calibration_factor < 0.8 && (
                'Your body appears to process carbohydrates efficiently. You may tolerate higher GI foods better than average.'
              )}
              {result.calibration_factor >= 0.8 && result.calibration_factor <= 1.2 && (
                'Your response to carbohydrates is close to the population average.'
              )}
              {result.calibration_factor > 1.2 && (
                'Your glucose response to carbohydrates is stronger than average. You may benefit from limiting high GI foods.'
              )}
            </p>
          </div>
          
          <p className="next-steps">
            Your personalized GI recommendations will now be adjusted based on your
            unique metabolism. Continue using the app to analyze foods and receive
            tailored guidance.
          </p>
        </div>
      )}
    </div>
  );
};

export default Calibration;
