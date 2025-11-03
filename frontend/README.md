# AI Document Vault - Frontend

A modern, React-based frontend for the AI Document Vault application. This application provides an intuitive interface for uploading, managing, and interacting with documents, enhanced with AI-powered summaries and markdown generation.

## 🚀 Features

- **📁 File Management**: Intuitive file and folder explorer with hierarchical organization
- **📤 Drag & Drop Upload**: Easy document upload with drag-and-drop support
- **🤖 AI Integration**: Automatic document summarization and markdown generation using Anthropic's Claude
- **📄 Multi-View Display**: View documents in original, summary, or markdown format
- **🎨 Modern UI**: Clean, responsive design with smooth animations
- **⚡ Real-time Updates**: Live progress tracking for uploads and AI processing
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Dropzone** - File upload with drag-and-drop
- **React Markdown** - Markdown rendering
- **Lucide React** - Beautiful icon set

## 📋 Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn
- Backend API server running (see backend documentation)

## 🔧 Installation

1. **Clone the repository** (if not already done):

   ```bash
   cd case-study/frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your backend API URL:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

## 🚀 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Layout components (MainLayout)
│   │   ├── documents/      # Document-related components
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── FileExplorer.tsx
│   │   │   └── DocumentViewer.tsx
│   │   └── common/         # Shared components
│   ├── pages/              # Page components
│   │   └── VaultPage.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── store/              # State management (Zustand)
│   │   └── documentStore.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useDocuments.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   ├── App.css
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env.example           # Example environment variables
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design Choices

### State Management

We use **Zustand** for state management due to its simplicity and minimal boilerplate compared to Redux. It provides a clean API for managing global state with TypeScript support.

### Styling Approach

Custom CSS with modern features:

- CSS Variables for theming
- Flexbox and Grid for layouts
- CSS animations for smooth transitions
- Responsive design with media queries

### Component Architecture

- **Functional components** with React Hooks
- **Custom hooks** for business logic separation
- **Type-safe props** with TypeScript interfaces
- **Component co-location** - CSS files next to components

### API Integration

- Centralized API service layer in `services/api.ts`
- Axios for HTTP requests with interceptors
- Type-safe API responses using TypeScript generics
- Error handling at both service and component levels

## 🔄 Key Features Explained

### Document Upload

- Supports multiple file formats (PDF, DOC, DOCX, TXT, MD)
- Drag-and-drop interface using `react-dropzone`
- Real-time upload progress tracking
- Automatic AI processing status updates

### File Explorer

- Hierarchical folder structure
- Create folders and subfolders
- Navigate through documents easily
- Visual indicators for processing status

### Document Viewer

- Three view modes: Original, Summary, Markdown
- Tab-based navigation between views
- Markdown rendering with syntax highlighting
- Loading states and error handling

## 🔌 API Integration

The frontend expects the following API endpoints:

- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `GET /api/documents/:id/content` - Get original document content
- `DELETE /api/documents/:id` - Delete document
- `POST /api/folders` - Create folder
- `GET /api/folders` - Get all folders
- `GET /api/folders/tree` - Get folder tree structure

## 📝 Assumptions

1. **Backend API**: Assumes a RESTful backend API is running and accessible
2. **File Formats**: Supports text-based documents (PDF, DOC, DOCX, TXT, MD)
3. **AI Processing**: Backend handles AI integration with Anthropic's Claude
4. **Authentication**: Not implemented in this prototype (can be added as needed)
5. **File Storage**: Backend manages file storage (local filesystem or cloud)

## 🐛 Known Limitations

- No authentication/authorization (to be added in future iterations)
- Limited file format support (primarily text-based documents)
- No collaborative features (comments, sharing)
- No offline support
- Browser compatibility: Modern browsers only (Chrome, Firefox, Safari, Edge)

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] Real-time collaboration features
- [ ] Advanced search and filtering
- [ ] Document version control
- [ ] Bulk operations
- [ ] Export/download functionality
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

## 🧪 Testing

To add tests (recommended for production):

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## 📦 Dependencies

### Main Dependencies

- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `zustand` - State management
- `axios` - HTTP client
- `react-dropzone` - File uploads
- `react-markdown` - Markdown rendering
- `lucide-react` - Icons

### Dev Dependencies

- `@vitejs/plugin-react` - React plugin for Vite
- `typescript` - Type checking
- `vite` - Build tool

## 🤝 Contributing

This is a prototype/case study project. For improvements:

1. Follow the existing code structure
2. Maintain TypeScript types
3. Keep components small and focused
4. Add CSS files co-located with components
5. Update documentation as needed

## 📄 License

This is a case study project. Check with your organization for licensing details.

## 🆘 Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port.

### API Connection Issues

- Verify the backend server is running
- Check the `VITE_API_URL` in your `.env` file
- Check browser console for CORS errors

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📞 Support

For issues or questions, please refer to the main project documentation or contact the development team.

---

**Built with ❤️ using React and TypeScript**
