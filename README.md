# SkillTree AI - Project Setup & Run Guide

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

## 1. Backend Setup (FastAPI)
The backend handles the database, API endpoints, and AI logic.

```bash
# Navigate to backend
cd backend

# Create virtual environment (if not exists)
# python -m venv ..\venv

# Activate virtual environment
# Windows (PowerShell):
..\venv\Scripts\Activate.ps1
# Windows (CMD):
# ..\venv\Scripts\activate
# Mac/Linux:
# source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
*Server will start at `http://localhost:8000`*

## 2. Frontend Setup (React + Vite)
The frontend provides the interactive UI, VR labs, and Dashboard.

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*App will start at `http://localhost:5173`*

## 3. Usage
1. Open [http://localhost:5173](http://localhost:5173).
2. **Dashboard**: View your progress and stats.
3. **Courses**: Browse courses and filter by Branch/Year.
4. **My Learning**: Resume your enrolled courses.
5. **Labs**: Experience VR simulations (Physics, Chemistry, etc.).
6. **AI Instructor**: Click the floating bot or go to Chat to ask questions.
7. **Resume**: Upload your resume for analysis and job recommendations.
