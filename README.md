# AI Document Vault

A modern document management system with AI-powered summarization and markdown generation using Anthropic's Claude.

## Features

- 📤 Drag-and-drop file upload
- 📁 Folder organization
- 🤖 AI-powered document summarization
- 📝 Automatic markdown conversion
- 📄 Multi-mode document viewer

## Tech Stack

**Frontend:** React, TypeScript, Vite, Zustand  
**Backend:** Node.js, Express, Anthropic Claude API  
**Storage:** Local filesystem + JSON database

---

## Setup

### Prerequisites

- Node.js 20+ (for frontend)
- Node.js 18+ (for backend only)
- Anthropic API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd case-study
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=3000
ANTHROPIC_API_KEY=your_api_key_here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

Start backend:

```bash
npm start
```

Backend runs on **http://localhost:3000**

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

### 4. Access Application

Open **http://localhost:5173** in your browser

---

## Demo Video

🎥 [Watch Demo Video](./ai-vault-demo.mov)

---

## Project Structure

```
case-study/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   └── services/
│   └── README.md
│
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   └── README.md
│
└── README.md
```

---

## API Endpoints

**Documents**

- `POST /api/documents/upload` - Upload files
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document

**Folders**

- `POST /api/folders` - Create folder
- `GET /api/folders` - List folders
- `DELETE /api/folders/:id` - Delete folder

---
