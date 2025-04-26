"""
Main Flask application entry point for GI Personalize app.
"""
from flask import Flask, request, jsonify
import os
import uuid
import json
import logging
from datetime import datetime
from werkzeug.utils import secure_filename
import numpy as np

# Import modules
from utils.database import get_user_data, save_user_data, initialize_database
from utils.food_recognition import identify_food_in_image
from utils.validators import validate_user_data, validate_glucose_readings
import models
from config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join('logs', 'app.log')),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Ensure required directories exist
for directory in [app.config['UPLOAD_FOLDER'], 
                 app.config['USER_DATA_FOLDER'], 
                 'logs']:
    os.makedirs(directory, exist_ok=True)

# Initialize database on startup
initialize_database()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"})

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user profile."""
    try:
        data = request.json
        
        # Validate user data
        validation_error = validate_user_data(data)
        if validation_error:
            return jsonify({"error": validation_error}), 400
        
        # Generate unique user ID
        user_id = str(uuid.uuid4())
        
        # Calculate BMI
        data['bmi'] = data['weight'] / ((data['height']/100) ** 2)
        
        # Create user profile
        user_profile = {
            "user_id": user_id,
            "profile": data,
            "meals": [],
            "calibration": {},
            "created_at": datetime.now().isoformat()
        }
        
        # Save user profile
        save_user_data(user_id, user_profile)
        
        return jsonify({"user_id": user_id}), 201
    
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to create user"}), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile."""
    try:
        user_data = get_user_data(user_id)
        
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Remove sensitive info for response
        response_data = {
            "user_id": user_data["user_id"],
            "profile": user_data["profile"],
            "calibration": user_data.get("calibration", {}),
            "created_at": user_data["created_at"]
        }
        
        return jsonify(response_data), 200
    
    except Exception as e:
        logger.error(f"Error getting user {user_id}: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to get user profile"}), 500

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user profile."""
    try:
        user_data = get_user_data(user_id)
        
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Update profile with new data
        data = request.json
        
        # Validate user data
        validation_error = validate_user_data(data, required_fields=False)
        if validation_error:
            return jsonify({"error": validation_error}), 400
        
        user_data['profile'].update(data)
        
        # Recalculate BMI if weight or height was updated
        if 'weight' in data or 'height' in data:
            weight = user_data['profile']['weight']
            height = user_data['profile']['height']
            user_data['profile']['bmi'] = weight / ((height/100) ** 2)
        
        # Save updated profile
        save_user_data(user_id, user_data)
        
        return jsonify({"message": "User profile updated"}), 200
    
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to update user profile"}), 500

@app.route('/api/analyze/food', methods=['POST'])
def analyze_food():
    """Analyze food image and provide personalized GI info."""
    try:
        # Check if the post request has the file part
        if 'food_image' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['food_image']
        user_id = request.form.get('user_id')
        
        # If user doesn't submit a file
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        # Check if user exists
        user_data = get_user_data(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        if file and allowed_file(file.filename):
            # Save the file
            filename = secure_filename(f"{user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Identify food in the image
            food_items = identify_food_in_image(filepath)
            
            # Get personalized GI values
            results = []
            for food in food_items:
                # Look up base GI value
                base_gi = models.lookup_gi(food['name'])
                
                # Personalize GI impact
                personalized = models.personalize_gi_impact(base_gi, user_data['profile'])
                
                # Apply calibration factor if available
                if 'calibration' in user_data and 'calibration_factor' in user_data['calibration']:
                    personalized['personalized_gi_score'] *= user_data['calibration']['calibration_factor']
                
                # Add to results
                food_result = {
                    "food_name": food['name'],
                    "confidence": food['confidence'],
                    "base_gi": base_gi,
                    "personalized_gi": personalized
                }
                results.append(food_result)
            
            # Save this analysis to user history
            meal_id = str(uuid.uuid4())
            meal_data = {
                "meal_id": meal_id,
                "timestamp": datetime.now().isoformat(),
                "food_items": results,
                "image_path": filepath
            }
            user_data['meals'].append(meal_data)
            
            # Save updated user data
            save_user_data(user_id, user_data)
            
            return jsonify({
                "meal_id": meal_id,
                "results": results
            }), 200
        
        return jsonify({"error": "Invalid file format"}), 400
    
    except Exception as e:
        logger.error(f"Error analyzing food: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to analyze food"}), 500

def allowed_file(filename):
    """Check if file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/api/calibration/<user_id>', methods=['POST'])
def submit_calibration(user_id):
    """Submit calibration meal data."""
    try:
        # Check if user exists
        user_data = get_user_data(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Get glucose readings from request
        data = request.json
        if 'glucose_readings' not in data:
            return jsonify({"error": "Missing glucose readings"}), 400
        
        glucose_readings = data['glucose_readings']
        
        # Validate glucose readings
        validation_error = validate_glucose_readings(glucose_readings)
        if validation_error:
            return jsonify({"error": validation_error}), 400
        
        # Process calibration meal
        response_factor = models.process_calibration_meal(glucose_readings)
        
        # Update user profile with calibration data
        user_data['calibration'] = {
            "calibration_factor": response_factor,
            "timestamp": datetime.now().isoformat(),
            "readings": glucose_readings
        }
        
        # Save updated profile
        save_user_data(user_id, user_data)
        
        return jsonify({
            "calibration_factor": response_factor,
            "message": "Calibration completed successfully"
        }), 200
    
    except Exception as e:
        logger.error(f"Error processing calibration for user {user_id}: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to process calibration"}), 500

@app.route('/api/meals/<user_id>/<meal_id>/response', methods=['POST'])
def log_meal_response(user_id, meal_id):
    """Log user's response to a meal."""
    try:
        # Check if user exists
        user_data = get_user_data(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Find the meal
        meal_found = False
        for meal in user_data['meals']:
            if meal['meal_id'] == meal_id:
                # Add user response
                meal['user_response'] = request.json
                meal['response_time'] = datetime.now().isoformat()
                meal_found = True
                break
        
        if not meal_found:
            return jsonify({"error": "Meal not found"}), 404
        
        # Update user's personal model if enough data points
        model_updated = False
        meals_with_responses = [m for m in user_data['meals'] if 'user_response' in m]
        
        if len(meals_with_responses) >= 5:
            # Prepare training data
            feature_data, response_data = models.prepare_training_data(meals_with_responses)
            
            # Train model if we have enough data
            if len(feature_data) > 0 and len(response_data) > 0:
                # Update user's personalized model
                model_updated = models.update_user_model(user_id, feature_data, response_data)
                
                # Record model update
                if model_updated:
                    user_data['model_updated_at'] = datetime.now().isoformat()
                    user_data['model_version'] = user_data.get('model_version', 0) + 1
        
        # Save updated user data
        save_user_data(user_id, user_data)
        
        response = {"message": "Response recorded"}
        if model_updated:
            response["model_updated"] = True
            response["message"] = "Your personal profile has been updated based on your response"
        
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Error logging meal response for user {user_id}, meal {meal_id}: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to log meal response"}), 500

@app.route('/api/meals/<user_id>', methods=['GET'])
def get_user_meals(user_id):
    """Get user's meal history."""
    try:
        # Check if user exists
        user_data = get_user_data(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        # Return meals
        return jsonify({"meals": user_data.get('meals', [])}), 200
    
    except Exception as e:
        logger.error(f"Error getting meals for user {user_id}: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to get meal history"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
