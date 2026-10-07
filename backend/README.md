# SmartSum AI Backend

A FastAPI backend that processes mathematical expressions from images using Google's Gemini AI model.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Google Gemini API Key

### Setup
1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd smartsum-be
   pip install -r requirements.txt
   ```

2. **Create `.env` file**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ENV=dev
   SERVER_URL=localhost
   PORT=8900
   ```

3. **Run the server**
   ```bash
   python main.py
   ```

   Server runs at: `http://localhost:8900`

## 📡 API Endpoints

### Health Check
```http
GET /
GET /health
```

### Process Image
```http
POST /calculate
Content-Type: application/json

{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "dict_of_vars": {"x": 5, "y": 10}
}
```

**Response:**
```json
{
  "message": "Image Processed",
  "type": "success",
  "data": [
    {
      "expr": "2 + 3 * 4",
      "result": "14",
      "assign": false
    }
  ]
}
```

## 🧮 What It Solves

1. **Basic Math**: `2 + 3 * 4`, `5 / 6` (follows PEMDAS)
2. **Equations**: `x^2 + 2x + 1 = 0`, `3y + 4x = 0`
3. **Variable Assignment**: `x = 4`, `y = 5`
4. **Word Problems**: Visual math problems in drawings
5. **Abstract Concepts**: Identifies concepts from drawings

## 🌐 Deployment

### Local Development
- Supports CORS for `localhost:3000`, `localhost:5173`, etc.
- Auto-reload enabled in dev mode

### Production (Render)
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables:
   - `GEMINI_API_KEY`: Your API key
   - `ENV`: `prod`
   - `ALLOWED_ORIGINS`: Your frontend domain

Build Command: `pip install -r requirements.txt`  
Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 📁 Project Structure

```
smartsum-be/
├── apps/calculator/
│   ├── route.py          # API endpoints
│   └── utils.py          # Gemini AI integration
├── constants.py          # Configuration
├── main.py              # FastAPI app
├── schema.py            # Data models
├── requirements.txt     # Dependencies
└── render.yaml          # Deployment config
```

## 🔧 Configuration

### CORS
- **Dev**: Allows common local dev servers
- **Prod**: Configured via `ALLOWED_ORIGINS` env var

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `ENV` | Environment (`dev`/`prod`) | `dev` |
| `PORT` | Server port | `8900` |
| `ALLOWED_ORIGINS` | CORS origins (prod only) | - |

## 🛠️ Development

### API Documentation
Visit `http://localhost:8900/docs` for interactive Swagger UI

### Testing
```bash
# Health check
curl http://localhost:8900/health

# Test calculation (replace with actual base64 image)
curl -X POST http://localhost:8900/calculate \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,...", "dict_of_vars": {}}'
```

## 🔗 Links

- **Frontend**: [https://smart-calc-ai.vercel.app](https://smart-calc-ai.vercel.app)
- **API Docs**: Visit `/docs` endpoint for interactive documentation

---

**Made with ❤️ AK-RAJAK**