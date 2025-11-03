# AI Document Vault - Case Study Requirements

## Objective

The goal of this project is to design and build a prototype of an AI-powered document management system, which we'll call the **"AI Document Vault"**. The core idea is to create a user-friendly interface for uploading, managing, and interacting with documents, where AI is used to automatically process and enrich the documents with summaries and other structured data.

## Background

In many professional environments, managing a large number of documents (like reports, contracts, articles, etc.) is a common challenge. Finding information quickly and understanding the gist of a document without reading it entirely can save a lot of time. The AI Document Vault aims to solve this by providing a central place to store documents and using AI to make them more accessible and useful.

---

## Requirements

### User Interface (UI)

- [x] A clean and intuitive interface for a document "vault"
- [x] A file and folder explorer view to navigate the uploaded documents
- [x] A mechanism to upload one or more documents, ideally with drag-and-drop support
- [x] A view to display a selected document's content, along with the AI-generated summary and markdown

### Backend

- [x] A simple backend service (e.g., using Node.js/Express, Python/FastAPI, or any other framework you are comfortable with)
- [x] An endpoint to handle file uploads
- [x] The backend should be able to store the files (local file system recommended for this prototype, or use S3/Supabase Storage)
- [x] Store the generated summary and markdown associated with each file
  - **Note:** The quality of these markdown and generated summary is NOT the core aspect of this case study, and even a first barebones draft version generated with a simple prompt would be sufficient

### AI Integration

- [x] Upon file upload, the backend should call an external AI service (e.g., Anthropic's Claude) to process the document's content
- [x] You will be provided with an API key for this service
- [x] For each uploaded document, generate:
  1. **A concise summary of the document**
  2. **A markdown version of the document** that cleans up the structure and formatting
- [x] The original document, its summary, and markdown version should be associated and retrievable

---

## Suggested Technical Stack

### Frontend

- React, Vue, or Angular

### Backend

- Node.js (with Express) or Python (with FastAPI)

### AI Service

- Anthropic Claude API (or a similar large language model)

---

## Deliverables

1. **Source Code**

   - Complete source code for both frontend and backend applications

2. **README.md** file with:

   - Clear instructions on how to set up and run the project
   - A brief explanation of your design choices and architecture
   - Any assumptions you made

3. **(Optional but recommended)**
   - A short video or a few screenshots demonstrating the final application

---

## Evaluation Criteria

You will be evaluated on:

### 1. Code Quality

- Clarity, organization, and efficiency of your code

### 2. User Experience (UX)

- The usability and design of your application

### 3. Problem Solving

- How you approached the requirements and the technical challenges

### 4. Completeness

- How many of the required features you were able to implement

### 5. Communication

- The clarity of your documentation and, if applicable, your presentation of the project

---

## Implementation Checklist

### Phase 1: Project Setup

- [x] Initialize React frontend project
- [x] Set up backend (Node.js/Express or Python/FastAPI)
- [x] Configure project structure
- [x] Set up version control (Git)

### Phase 2: Core UI Components

- [x] Create document vault layout
- [x] Build file/folder explorer component
- [x] Implement drag-and-drop file upload
- [x] Create document viewer component
- [x] Design summary display panel

### Phase 3: Backend Development

- [x] Create file upload endpoint
- [x] Implement file storage system
- [x] Set up database/storage for metadata
- [x] Create API endpoints for document retrieval
- [x] Handle file associations (original, summary, markdown)

### Phase 4: AI Integration

- [x] Integrate Anthropic Claude API
- [x] Implement summary generation
- [x] Implement markdown conversion
- [x] Handle API errors and edge cases
- [x] Test AI processing pipeline

### Phase 5: Polish & Testing

- [x] Error handling
- [x] Loading states and user feedback
- [x] Responsive design
- [x] Testing (unit, integration)
- [x] Documentation

### Phase 6: Documentation

- [x] Write comprehensive README
- [x] Document API endpoints
- [x] Add setup instructions
- [ ] Create demo video/screenshots (optional)

---

## Notes & Assumptions

_(Document your assumptions here as you build)_

-
-
- ***

## Good Luck! 🚀
