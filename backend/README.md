# AI Document Vault - Backend API

A Node.js + Express backend API with Anthropic Claude integration for AI-powered document processing, summarization, and markdown generation.

## 🚀 Features

- **📤 File Upload**: Multi-file upload with validation (PDF, DOC, DOCX, TXT, MD)
- **🤖 AI Processing**: Automatic document summarization and markdown generation using Claude
- **📁 Folder Management**: Create and organize documents in folders
- **💾 File Storage**: Local filesystem storage with metadata in JSON database
- **🔄 Background Processing**: Async AI processing with status tracking
- **🛡️ Error Handling**: Comprehensive error handling and validation
- **📡 RESTful API**: Clean API design with proper HTTP methods

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Anthropic SDK** - Claude AI integration
- **UUID** - Unique ID generation
- **dotenv** - Environment configuration
- **CORS** - Cross-origin support

## 📋 Prerequisites

- Node.js 18+ installed
- Anthropic API key (already configured)
- npm or yarn

## 🔧 Installation

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Dependencies are already installed**, but if needed:

   ```bash
   npm install
   ```

3. **Environment variables are configured** in `.env` file with your Anthropic API key

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on **`http://localhost:3000`**

You should see:

```
✅ Database initialized
🚀  AI Document Vault Backend Server Running
📍  Port: 3000
🤖  AI: Anthropic Claude (Configured)
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response**:

```json
{
  "success": true,
  "message": "AI Document Vault API is running",
  "timestamp": "2025-10-19T..."
}
```

### Documents

#### Upload Documents

```http
POST /api/documents/upload
Content-Type: multipart/form-data
```

**Body**:

- `files[]`: File(s) to upload (max 10 files)
- `folderId`: (Optional) Folder ID to organize document

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "document.pdf",
      "size": 12345,
      "type": "application/pdf",
      "processingStatus": "processing",
      ...
    }
  ],
  "message": "1 file(s) uploaded successfully. AI processing started."
}
```

#### Get All Documents

```http
GET /api/documents
```

**Response**:

```json
{
  "success": true,
  "data": [...]
}
```

#### Get Document by ID

```http
GET /api/documents/:id
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "document.pdf",
    "summary": "AI-generated summary...",
    "markdown": "# AI-generated markdown...",
    "processingStatus": "completed",
    ...
  }
}
```

#### Get Document Content (Download Original File)

```http
GET /api/documents/:id/content
```

**Response**: Original file download

#### Delete Document

```http
DELETE /api/documents/:id
```

**Response**:

```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

#### Get Documents by Folder

```http
GET /api/documents/folder/:folderId
```

### Folders

#### Create Folder

```http
POST /api/folders
Content-Type: application/json
```

**Body**:

```json
{
  "name": "My Folder",
  "parentId": "uuid" // optional
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Folder",
    "parentId": null,
    "createdAt": "2025-10-19T..."
  }
}
```

#### Get All Folders

```http
GET /api/folders
```

#### Get Folder Tree

```http
GET /api/folders/tree
```

Returns hierarchical folder structure.

#### Delete Folder

```http
DELETE /api/folders/:id
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── documentController.js   # Document business logic
│   │   └── folderController.js     # Folder business logic
│   ├── routes/
│   │   ├── documentRoutes.js       # Document endpoints
│   │   └── folderRoutes.js         # Folder endpoints
│   ├── middleware/
│   │   └── upload.js               # Multer file upload config
│   ├── utils/
│   │   ├── database.js             # JSON database operations
│   │   └── aiProcessor.js          # Anthropic Claude integration
│   └── server.js                   # Main server file
├── uploads/                        # Uploaded files storage
├── data/
│   └── db.json                     # JSON database (auto-created)
├── .env                            # Environment variables (configured)
├── .env.example                    # Environment template
├── package.json
└── README.md
```

## 🤖 AI Processing

### How It Works

1. **Upload**: File is uploaded and stored
2. **Extract**: Text content is extracted from the file
3. **Process**: Two parallel Claude API calls:
   - Generate concise summary
   - Convert to clean markdown format
4. **Update**: Document record updated with AI results
5. **Status**: Processing status tracked (`processing` → `completed`/`failed`)

### AI Models Used

- **Claude 3.5 Sonnet** (claude-3-5-sonnet-20241022)
- Optimized for document understanding and formatting

### Processing Status

- `processing`: AI is working on the document
- `completed`: Summary and markdown ready
- `failed`: AI processing encountered an error

## 🔧 Configuration

### Environment Variables

Edit `.env` file:

```env
PORT=3000                    # Server port
NODE_ENV=development         # Environment
ANTHROPIC_API_KEY=sk-ant-... # Your API key (already set)
UPLOAD_DIR=./uploads         # File storage location
MAX_FILE_SIZE=10485760       # Max file size (10MB)
CORS_ORIGIN=http://localhost:5173  # Frontend URL
```

### Supported File Types

- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)
- Plain Text (`.txt`)
- Markdown (`.md`)

### File Size Limits

- Default: 10MB per file
- Configurable via `MAX_FILE_SIZE` in `.env`

## 🔒 Security Considerations

For production deployment, consider:

- Add authentication/authorization
- Implement rate limiting
- Use cloud storage (S3, GCS)
- Use proper database (PostgreSQL, MongoDB)
- Add input sanitization
- Implement file scanning
- Add API key rotation
- Enable HTTPS

## 🗄️ Database

Currently uses a simple JSON file (`data/db.json`) for prototype purposes.

**Structure**:

```json
{
  "documents": [...],
  "folders": [...]
}
```

For production, migrate to:

- PostgreSQL
- MongoDB
- MySQL
- etc.

## 🧪 Testing

### Test with cURL

**Upload a document**:

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "files=@/path/to/document.pdf"
```

**Get all documents**:

```bash
curl http://localhost:3000/api/documents
```

**Create a folder**:

```bash
curl -X POST http://localhost:3000/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Folder"}'
```

### Test with Frontend

1. Start backend: `npm run dev`
2. Start frontend: `cd ../frontend && npm run dev`
3. Upload documents through the UI
4. Watch AI processing in real-time!

## 📊 Performance

- Concurrent file uploads supported
- Background AI processing (non-blocking)
- Efficient file streaming
- Promise-based async operations

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 3000 is available
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### AI Processing fails

- Check Anthropic API key is valid
- Verify network connectivity
- Check file is readable
- Review server logs for errors

### File upload fails

- Check file size (max 10MB default)
- Verify file type is supported
- Ensure uploads directory exists and is writable

## 📝 Development Notes

### Adding New File Types

Edit `src/middleware/upload.js`:

```javascript
const allowedTypes = [
  "application/pdf",
  // Add new MIME types here
];
```

### Customizing AI Prompts

Edit `src/utils/aiProcessor.js`:

```javascript
// Modify summary generation prompt
const generateSummary = async (text) => {
  // Your custom prompt here
};
```

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use PM2 or similar process manager
3. Set up reverse proxy (nginx)
4. Configure proper logging
5. Use cloud storage for files
6. Implement database migrations
7. Add monitoring and alerts

## 📄 License

This is a case study project.

## 🤝 Contributing

This is a prototype. For improvements:

- Follow existing code structure
- Add error handling
- Update documentation
- Test thoroughly

## 📞 Support

Check the main project documentation:

- `../PROJECT-OVERVIEW.md` - Project architecture
- `../frontend/README.md` - Frontend docs
- `../AI-DOCUMENT-VAULT-REQUIREMENTS.md` - Requirements

---

**Built with ❤️ using Node.js, Express, and Anthropic Claude**

**Status**: ✅ Ready to use with frontend
