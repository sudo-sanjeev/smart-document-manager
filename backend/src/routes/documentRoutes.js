const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadDocuments,
  getDocuments,
  getDocument,
  getDocumentContent,
  removeDocument,
  getDocumentsByFolderId,
} = require("../controllers/documentController");

// Upload documents (supports multiple files)
router.post("/upload", upload.array("files", 10), uploadDocuments);

// Get all documents
router.get("/", getDocuments);

// Get document by ID
router.get("/:id", getDocument);

// Get document content (download original file)
router.get("/:id/content", getDocumentContent);

// Delete document
router.delete("/:id", removeDocument);

// Get documents by folder
router.get("/folder/:folderId", getDocumentsByFolderId);

module.exports = router;
