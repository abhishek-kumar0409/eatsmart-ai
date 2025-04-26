"""
Input validation utilities for the GI Personalize app.
"""
import logging

logger = logging.getLogger(__name__)

def validate_user_data(data, required_fields=True):
    """
    Validate user profile data.
    
    Args:
        data (dict): User profile data
        required_fields (bool): Whether to validate required fields
        
    Returns:
        str: Error message or None if valid
    """
    # Check required fields
    if required_fields:
        for field in ['age', 'sex', 'height', 'weight']:
            if field not in data:
                return f"Missing required field: {field}"
    
    # Validate age
    if 'age' in data:
        try:
            age = int(data['age'])
            if age < 18 or age > 120:
                return "Age must be between 18 and 120"
        except ValueError:
            return "Age must be a number"
    
    # Validate sex
    if 'sex' in data and data['sex'] not in ['male', 'female']:
        return "Sex must be either 'male' or 'female'"
    
    # Validate height
    if 'height' in data:
        try:
            height = float(data['height'])
            if height < 100 or height > 250:
                return "Height must be between 100 and 250 cm"
        except ValueError:
            return "Height must be a number"
    
    # Validate weight
    if 'weight' in data:
        try:
            weight = float(data['weight'])
            if weight < 30 or weight > 300:
                return "Weight must be between 30 and 300 kg"
        except ValueError:
            return "Weight must be a number"
    
    # Validate activity_level
    valid_activity_levels = [
        'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'
    ]
    if 'activity_level' in data and data['activity_level'] not in valid_activity_levels:
        return f"Activity level must be one of: {', '.join(valid_activity_levels)}"
    
    # Validate diabetes_status
    valid_diabetes_statuses = ['none', 'pre_diabetic', 'type1_diabetes', 'type2_diabetes']
    if 'diabetes_status' in data and data['diabetes_status'] not in valid_diabetes_statuses:
        return f"Diabetes status must be one of: {', '.join(valid_diabetes_statuses)}"
    
    # Validate weight_goal
    valid_weight_goals = ['lose', 'maintain', 'gain']
    if 'weight_goal' in data and data['weight_goal'] not in valid_weight_goals:
        return f"Weight goal must be one of: {', '.join(valid_weight_goals)}"
    
    # Validate optional fields
    if 'hba1c' in data and data['hba1c']:
        try:
            hba1c = float(data['hba1c'])
            if hba1c < 3 or hba1c > 15:
                return "HbA1c must be between 3 and 15 %"
        except ValueError:
            return "HbA1c must be a number"
    
    if 'fasting_glucose' in data and data['fasting_glucose']:
        try:
            fasting_glucose = float(data['fasting_glucose'])
            if fasting_glucose < 50 or fasting_glucose > 400:
                return "Fasting glucose must be between 50 and 400 mg/dL"
        except ValueError:
            return "Fasting glucose must be a number"
    
    return None

def validate_glucose_readings(readings):
    """
    Validate glucose readings.
    
    Args:
        readings (list): Glucose readings
        
    Returns:
        str: Error message or None if valid
    """
    if not isinstance(readings, list):
        return "Glucose readings must be a list"
    
    if len(readings) != 5:
        return "Must provide 5 glucose readings (fasting, 30min, 60min, 90min, 120min)"
    
    # Validate each reading
    for i, reading in enumerate(readings):
        try:
            reading = float(reading)
            # Validate range (50-400 mg/dL or 2.8-22.2 mmol/L)
            if reading < 2.8 and reading > 22.2 and reading < 50 and reading > 400:
                return f"Reading {i+1} is out of valid range (50-400 mg/dL or 2.8-22.2 mmol/L)"
        except ValueError:
            return f"Reading {i+1} must be a number"
    
    return None

def validate_meal_response(response):
    """
    Validate meal response data.
    
    Args:
        response (dict): Meal response data
        
    Returns:
        str: Error message or None if valid
    """
    if not isinstance(response, dict):
        return "Response must be an object"
    
    if 'response' not in response:
        return "Missing required field: response"
    
    valid_responses = ['less_than_expected', 'as_expected', 'more_than_expected']
    if response['response'] not in valid_responses:
        return f"Response must be one of: {', '.join(valid_responses)}"
    
    return None
