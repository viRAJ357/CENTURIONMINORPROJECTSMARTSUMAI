
<div align="center">

# 🧮 SmartSum AI
### *Draw Math. Get Answers. Instantly.*

![SmartSum AI Banner](https://img.shields.io/badge/SmartSum-AI%20Powered%20Calculator-blueviolet?style=for-the-badge&logo=google&logoColor=white)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A full-stack AI-powered calculator that lets you draw mathematical expressions on a canvas and solves them using Google Gemini Vision AI.**

[🚀 Live Demo](https://smart-sum-ai.vercel.app) • [📦 Backend API](https://smartsum-ai-backend.onrender.com) • [📖 API Docs](https://smartsum-ai-backend.onrender.com/docs)

</div>

---

## 📋 Table of Contents

- [🎯 Problem Statement](#-problem-statement)
- [💡 Solution](#-solution)
- [✨ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Workflow Diagram](#-workflow-diagram)
- [📡 API Flow](#-api-flow)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🌐 Environment Variables](#-environment-variables)
- [📊 Features Deep Dive](#-features-deep-dive)
- [🤝 Contributing](#-contributing)

---

## 🎯 Problem Statement

```
╔══════════════════════════════════════════════════════════════════╗
║                    ❌ THE PROBLEM                                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  📌 Traditional calculators require users to TYPE expressions   ║
║     using keyboard — slow, error-prone, unnatural               ║
║                                                                  ║
║  📌 Complex equations (integrals, graphs, geometry) cannot be   ║
║     easily typed — impossible on mobile keyboards               ║
║                                                                  ║
║  📌 Students solving homework on paper must switch between      ║
║     paper and calculator constantly — breaks flow               ║
║                                                                  ║
║  📌 No tool can understand hand-drawn mathematical diagrams,    ║
║     word problems shown visually, or abstract concepts          ║
║                                                                  ║
║  📌 Existing AI math tools require text prompts — not visual    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 💡 Solution

```
╔══════════════════════════════════════════════════════════════════╗
║                    ✅ SMARTSUM AI SOLUTION                       ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  🖊️  Draw your math problem on a digital canvas                 ║
║       ↓                                                          ║
║  📸  Canvas captured as image automatically                      ║
║       ↓                                                          ║
║  🤖  Google Gemini Vision AI analyzes the drawing               ║
║       ↓                                                          ║
║  ✨  Answer rendered with LaTeX on the canvas instantly          ║
║                                                                  ║
║  SmartSum AI bridges the gap between natural handwriting         ║
║  and computational power using multimodal AI technology.         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🖊️ **Draw & Solve** | Draw mathematical expressions on canvas | ✅ Live |
| 🤖 **AI Vision** | Gemini 2.5 Flash multimodal image analysis | ✅ Live |
| 📐 **LaTeX Rendering** | Beautiful math rendering with MathJax | ✅ Live |
| 🎨 **Color Picker** | Choose pen colors for drawing | ✅ Live |
| 🧹 **Smart Eraser** | Erase drawings easily | ✅ Live |
| 📊 **Variable Tracking** | Tracks assigned variables (x=4, y=5) | ✅ Live |
| 🌐 **CORS Enabled** | Dev + Prod origin support | ✅ Live |
| 📱 **Responsive UI** | Works on desktop & tablet | ✅ Live |
| 🔄 **Auto-Reload** | Hot reload in development | ✅ Live |
| 📡 **REST API** | FastAPI with interactive Swagger docs | ✅ Live |

### 🧠 What SmartSum AI Can Solve:

```
┌─────────────────────────────────────────────────────────────┐
│  TYPE 1: Simple Expressions                                 │
│  ➤ 2 + 3 × 4  →  14                                        │
│  ➤ √(144) + 5²  →  37                                      │
├─────────────────────────────────────────────────────────────┤
│  TYPE 2: Equations with Variables                           │
│  ➤ 3x + 6 = 15  →  x = 3                                   │
│  ➤ x² + 2x + 1 = 0  →  x = -1                             │
├─────────────────────────────────────────────────────────────┤
│  TYPE 3: Variable Assignment                                │
│  ➤ x = 10, y = 20  →  assigns and tracks variables         │
├─────────────────────────────────────────────────────────────┤
│  TYPE 4: Graphical Math Problems                            │
│  ➤ Pythagorean triangle drawings                            │
│  ➤ Physics/collision diagrams                               │
├─────────────────────────────────────────────────────────────┤
│  TYPE 5: Abstract Concept Detection                         │
│  ➤ Drawings representing emotions, history, concepts        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SMARTSUM AI ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────┐      ┌──────────────────────────────┐
  │         FRONTEND (React)          │      │       BACKEND (FastAPI)       │
  │         localhost:5173            │      │       localhost:8900           │
  │                                  │      │                               │
  │  ┌────────────────────────────┐  │      │  ┌───────────────────────┐   │
  │  │      Canvas (HTML5)        │  │      │  │   /calculate  POST     │   │
  │  │   Draw Math Expressions    │  │      │  │   Route Handler        │   │
  │  └──────────┬─────────────────┘  │      │  └──────────┬────────────┘   │
  │             │ base64 image        │      │             │                 │
  │  ┌──────────▼─────────────────┐  │      │  ┌──────────▼────────────┐   │
  │  │      Axios HTTP Client     │──┼──────┼─▶│   Image Processing     │   │
  │  │   POST /calculate          │  │      │  │   (PIL / Pillow)       │   │
  │  └──────────┬─────────────────┘  │      │  └──────────┬────────────┘   │
  │             │ JSON response       │      │             │                 │
  │  ┌──────────▼─────────────────┐  │      │  ┌──────────▼────────────┐   │
  │  │    MathJax LaTeX Renderer  │  │      │  │  Google Gemini 2.5    │   │
  │  │  Display Answer on Canvas  │◀─┼──────┼──│  Flash Vision API     │   │
  │  └────────────────────────────┘  │      │  └──────────┬────────────┘   │
  │                                  │      │             │                 │
  │  Tech: React + TypeScript + Vite │      │  ┌──────────▼────────────┐   │
  │  UI: Tailwind + Mantine + Shadcn │      │  │  Response Parser       │   │
  └──────────────────────────────────┘      │  │  ast.literal_eval      │   │
                                            │  └───────────────────────┘   │
                                            │  Tech: Python + FastAPI +     │
                                            │  Uvicorn + python-dotenv      │
                                            └──────────────────────────────┘
                                                           │
                                            ┌──────────────▼──────────────┐
                                            │     GOOGLE GEMINI AI         │
                                            │   (External Cloud API)       │
                                            │   Model: gemini-2.5-flash    │
                                            └─────────────────────────────┘
```

---

## 🔄 Workflow Diagram

```
 USER                FRONTEND                   BACKEND              GEMINI AI
  │                     │                          │                     │
  │  Opens App          │                          │                     │
  │────────────────────▶│                          │                     │
  │                     │ Loads Canvas + Tools     │                     │
  │                     │                          │                     │
  │  Draws Math on      │                          │                     │
  │  Canvas (pen/mouse) │                          │                     │
  │────────────────────▶│                          │                     │
  │                     │                          │                     │
  │  Clicks "Calculate" │                          │                     │
  │────────────────────▶│                          │                     │
  │                     │                          │                     │
  │                     │ canvas.toDataURL()       │                     │
  │                     │ Convert to base64 image  │                     │
  │                     │                          │                     │
  │                     │ POST /calculate           │                     │
  │                     │ {image, dict_of_vars}    │                     │
  │                     │─────────────────────────▶│                     │
  │                     │                          │                     │
  │                     │                          │ Decode base64       │
  │                     │                          │ PIL Image object    │
  │                     │                          │                     │
  │                     │                          │ Send Image + Prompt │
  │                     │                          │────────────────────▶│
  │                     │                          │                     │
  │                     │                          │                     │ Analyze with
  │                     │                          │                     │ Vision Model
  │                     │                          │                     │
  │                     │                          │◀────────────────────│
  │                     │                          │ [{"expr":"2+2",     │
  │                     │                          │  "result": 4,       │
  │                     │                          │  "assign": false}]  │
  │                     │                          │                     │
  │                     │                          │ Parse & Validate    │
  │                     │                          │ JSON Response       │
  │                     │                          │                     │
  │                     │◀─────────────────────────│                     │
  │                     │ {message, type, data}    │                     │
  │                     │                          │                     │
  │                     │ MathJax renders LaTeX    │                     │
  │                     │ on canvas overlay        │                     │
  │                     │                          │                     │
  │◀────────────────────│                          │                     │
  │  Sees Answer on     │                          │                     │
  │  Canvas! ✅         │                          │                     │
```

---

## 📡 API Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GET  /                                                     │
│  ├── Response: Health check + environment info              │
│  └── Status: 200 OK                                         │
│                                                             │
│  GET  /health                                               │
│  ├── Response: {"status": "healthy"}                        │
│  └── Status: 200 OK                                         │
│                                                             │
│  POST /calculate                                            │
│  ├── Body: {                                                │
│  │     "image": "data:image/png;base64,...",               │
│  │     "dict_of_vars": {"x": 4, "y": 5}                   │
│  │   }                                                      │
│  ├── Process:                                               │
│  │     1. Decode base64 image                               │
│  │     2. Open with PIL                                     │
│  │     3. Send to Gemini Vision API                         │
│  │     4. Parse structured response                         │
│  │     5. Return results                                    │
│  └── Response: {                                            │
│        "message": "Image Processed",                        │
│        "type": "success",                                   │
│        "data": [                                            │
│          {"expr": "2+2", "result": 4, "assign": false}     │
│        ]                                                    │
│      }                                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
CENTURIONMINORPROJECT/
│
├── 📁 backend/                          # FastAPI Python Backend
│   ├── 📁 apps/
│   │   └── 📁 calculator/
│   │       ├── 🐍 route.py             # POST /calculate endpoint
│   │       └── 🐍 utils.py             # Gemini AI image analysis
│   ├── 🐍 main.py                      # FastAPI app + CORS config
│   ├── 🐍 constants.py                 # Env variables + CORS origins
│   ├── 🐍 schema.py                    # Pydantic request schemas
│   ├── 📄 requirements.txt             # Python dependencies
│   ├── 📄 .env.example                 # Environment template
│   ├── 📄 runtime.txt                  # Python version (3.13)
│   └── 📄 render.yaml                  # Render deployment config
│
├── 📁 frontend/                         # React TypeScript Frontend
│   ├── 📁 src/
│   │   ├── 📁 screens/
│   │   │   ├── 📁 home/                # Main canvas screen
│   │   │   └── 📁 ui/                  # UI components (button)
│   │   ├── 📁 components/              # Shared components
│   │   ├── 📁 lib/                     # Utilities
│   │   ├── ⚛️  App.tsx                 # Root component + routing
│   │   └── ⚛️  main.tsx               # React entry point
│   ├── 📄 package.json                 # Node dependencies
│   ├── 📄 vite.config.ts               # Vite configuration
│   ├── 📄 tailwind.config.ts           # Tailwind CSS config
│   ├── 📄 tsconfig.json                # TypeScript config
│   └── 📄 .env.example                 # Environment template
│
└── 📄 README.md                         # This file
```

---

## ⚙️ Tech Stack

### 🎨 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI Framework |
| **TypeScript** | 5.7 | Type Safety |
| **Vite** | 6.3 | Build Tool & Dev Server |
| **Tailwind CSS** | 3.4 | Styling |
| **Mantine UI** | 7.17 | Component Library |
| **Axios** | 1.8 | HTTP Client |
| **MathJax** | 3.2 | LaTeX Math Rendering |
| **React Router** | 7.4 | Client-side Routing |
| **Lucide React** | 0.48 | Icons |
| **React Draggable** | 4.5 | Draggable Result Labels |

### 🐍 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.13 | Runtime |
| **FastAPI** | 0.115 | Web Framework |
| **Uvicorn** | 0.34 | ASGI Server |
| **Google Generative AI** | 0.8.4 | Gemini SDK |
| **Pillow** | 11.1 | Image Processing |
| **Pydantic** | 2.10 | Data Validation |
| **python-dotenv** | 1.0 | Environment Variables |
| **python-multipart** | 0.0.6 | Form Data Handling |

### ☁️ AI Model
| Model | Provider | Capability |
|-------|----------|------------|
| **Gemini 2.5 Flash** | Google DeepMind | Multimodal Vision + Text Generation |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.13+ 
- Node.js 18+
- Google Gemini API Key → [Get here](https://aistudio.google.com/app/apikey)

---

### 🐍 Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Create virtual environment with Python 3.13
py -3.13 -m venv venv

# 3. Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 6. Start the backend server
python main.py
```

✅ Backend runs at: **http://localhost:8900**  
📖 API Docs at: **http://localhost:8900/docs**

---

### ⚛️ Frontend Setup

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local:
# VITE_API_URL=http://localhost:8900

# 4. Start the dev server
npm run dev
```

✅ Frontend runs at: **http://localhost:5173**

---

### 🌐 Environment Variables

#### Backend `.env`
```env
GEMINI_API_KEY=your_gemini_api_key_here
ENV=dev
SERVER_URL=localhost
PORT=8900
```

#### Frontend `.env.local`
```env
# For local development:
VITE_API_URL=http://localhost:8900

# For production:
# VITE_API_URL=https://smartsum-ai-backend.onrender.com
```

---

## 📊 Features Deep Dive

### 🖊️ Drawing Canvas
```
┌─────────────────────────────────────┐
│        Canvas Controls               │
├─────────────────────────────────────┤
│  🎨 Color Picker  → Choose pen color │
│  🖊️  Pen Tool     → Draw mode        │
│  🧹 Eraser        → Erase mode       │
│  🔄 Reset         → Clear canvas     │
│  🚀 Calculate     → Send to AI       │
└─────────────────────────────────────┘
```

### 🤖 AI Processing Pipeline
```
  Image Captured
       │
       ▼
  ┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
  │ base64 PNG  │───▶│  Gemini Prompt   │───▶│  AI Vision  │
  │  (canvas)   │    │  PEMDAS rules    │    │  Analysis   │
  └─────────────┘    │  5 problem types │    └──────┬──────┘
                     │  Variable dict   │           │
                     └──────────────────┘           ▼
                                            ┌───────────────┐
                                            │ JSON Response │
                                            │ expr + result │
                                            │ assign flag   │
                                            └───────┬───────┘
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │ ast.literal   │
                                            │ _eval Parse   │
                                            │ + Validation  │
                                            └───────┬───────┘
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │ LaTeX Render  │
                                            │ on Canvas     │
                                            └───────────────┘
```

### 🔒 CORS Security
```
Development Mode (ENV=dev):
  ✅ http://localhost:3000    (React CRA)
  ✅ http://localhost:5173    (Vite)
  ✅ http://127.0.0.1:5173   (Vite alt)
  ✅ http://localhost:8080    (Vue)
  ✅ https://smart-sum-ai.vercel.app

Production Mode (ENV=prod):
  ✅ https://smart-sum-ai.vercel.app
  ✅ https://smart-sum-ai-*.vercel.app
  ✅ Custom ALLOWED_ORIGINS env var
```

---

## 🚀 Deployment

### Backend → Render.com
```yaml
# render.yaml (already configured)
services:
  - type: web
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend → Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 👥 Team

> **Centurion University Minor Project**  
> Department of Computer Science & Engineering

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ using Google Gemini AI**

⭐ Star this repo if you found it helpful!

</div>
