# ai_quiz_generator

# Deep Klarity

Deep Klarity is a web application for generating quizzes from URLs using AI, with user authentication and quiz history tracking.

## Project Structure

- `frontend/` — React app (Vite, Tailwind, component-based)
- `backend/` — FastAPI server, database models, authentication, quiz generation
- `sample_data/` — Example data for testing

## Getting Started

### Prerequisites


- Python 3.8+
- (Optional) Git

### Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```
   cd backend
   ```
2. Create and activate a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Access the App

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)

## Features

- User authentication
- Quiz generation from URLs
- Quiz history tracking
- Responsive UI

## Folder Overview

- `frontend/src/components/` — React components
- `frontend/src/services/` — API service
- `backend/models.py` — Database models
- `backend/main.py` — FastAPI entry point

## Troubleshooting

- Ensure both frontend and backend servers are running.
- If you see connection errors, check that the backend is running on port 8000.
- For Python dependency issues, recreate the virtual environment.

## License

This project is for educational and demonstration purposes.
