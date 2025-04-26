# GI Personalize

A mobile-friendly web application that analyzes food images and provides personalized glycemic index information based on individual health profiles and metabolic responses.

## Features

- **Food Recognition**: Identify food items through camera images
- **Personalized GI Analysis**: Adjust glycemic impact based on individual health profiles
- **Calibration System**: Calibrate the app to your unique metabolic response
- **Response Tracking**: Learn from your feedback to improve predictions over time
- **Meal History**: Keep track of analyzed meals and responses

## Technologies Used

### Frontend
- React.js
- React Router
- Axios for API requests
- Lucide React for icons
- Mobile-first responsive design

### Backend
- Python/Flask RESTful API
- Machine Learning (scikit-learn for personalized predictions)
- SQLite for user tracking
- File-based storage for user data

### Deployment
- Docker & Docker Compose
- Nginx as reverse proxy

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.9+
- Docker and Docker Compose (for production deployment)

### Development Setup

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create required directories:
   ```bash
   mkdir -p uploads user_data data logs
   ```

5. Run the Flask development server:
   ```bash
   flask run --debug
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the app at `http://localhost:3000`

## Project Structure

```
gi-personalize-app/
├── backend/
│   ├── app.py                # Main Flask application
│   ├── models.py             # ML and personalization algorithms
│   ├── config.py             # Configuration settings
│   ├── utils/                # Utility functions
│   ├── data/                 # Data files including GI database
│   ├── uploads/              # Food images storage
│   ├── user_data/            # User profiles and responses
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── public/               # Static files
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── index.js          # Entry point
│   └── package.json          # Node.js dependencies
│
├── nginx/                    # Nginx configuration
└── docker-compose.yml        # Multi-container setup
```

## Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Glycemic Index Foundation for reference values
- PREDICT studies for personalized nutrition research
