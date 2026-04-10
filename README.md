# 🚀 CareerSync - AI-Powered Job Aggregator & Recommender

CareerSync is a modern platform that aggregates job postings from LinkedIn, Indeed, and Wellfound, and uses a **Deep Learning recommendation engine** (ConvDeepFM) to match candidates with the best opportunities based on their resumes.

---

## 🏗️ Project Architecture

CareerSync consists of three primary components:
1.  **Frontend**: React (Vite) + Tailwind CSS + ShadcnUI.
2.  **Node.js Backend**: Express + MongoDB (Auth & User Data Management).
3.  **ML Backend**: FastAPI + PyTorch + JobSpy (Resume analysis & Real-time scraping).

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or an Atlas URI)
- [Git](https://git-scm.com/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sohamhanse/CareerSync.git
cd CareerSync
```

### 2. ML Backend & Recommendation Engine (Python)
The ML backend handles resume parsing, web scraping, and the recommendation logic.
```bash
cd Backend
# Create a virtual environment
python -m venv venv
# Activate it (Windows)
.\venv\Scripts\activate
# Activate it (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Node.js Backend
Handles user authentication and profile storage.
```bash
cd Backend
# Note: You are already in the Backend folder
npm install
```

### 4. Frontend
The user interface.
```bash
cd ../Frontend
npm install
```

---

## 🔑 Environment Variables

You need to set up `.env` files for both the Backend and Frontend.

### **Backend (`/Backend/.env`)**
Create this file and add:
```env
# Server Config
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/careersync

# Security
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# AI/ML Config
GROQ_API_KEY=your_groq_api_key_here
```

### **Frontend (`/Frontend/.env`)**
Create this file and add:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running the Project

You will need **three** terminal windows to run the full stack simultaneously.

### **Terminal 1: ML Backend (Python)**
```bash
cd Backend
.\venv\Scripts\activate
python main.py
```
*Runs on [http://localhost:8000](http://localhost:8000)*

### **Terminal 2: Core Backend (Node.js)**
```bash
cd Backend
npm run dev
```
*Runs on [http://localhost:5000](http://localhost:5000)*

### **Terminal 3: Frontend (React)**
```bash
cd Frontend
npm run dev
```
*Runs on [http://localhost:8080](http://localhost:8080)*

---

## 🛠️ Tech Stack Details

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Zod (Validation).
- **ML/AI**: FastAPI, PyTorch, Groq Llama 3 (Parsing), JobSpy (Scraping), Scikit-learn.

---

## 🤝 Contributing
Feel free to fork this project and submit PRs. For major changes, please open an issue first to discuss what you would like to change.

Made with ❤️ by [Soham Hanse](https://github.com/sohamhanse)
