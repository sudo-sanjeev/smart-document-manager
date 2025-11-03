const { generateId } = require("../utils/idGenerator");
const path = require("path");
const fs = require("fs").promises;
const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentsByFolder,
} = require("../utils/database");
const { processDocument } = require("../utils/aiProcessor");

/**
 * Upload and process documents
 */
const uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    const { folderId } = req.body;
    const uploadedDocuments = [];

    // Create document records for all uploaded files
    for (const file of req.files) {
      const document = {
        id: generateId(),
        name: file.originalname,
        originalName: file.originalname,
        path: file.path,
        folderId: folderId || null,
        size: file.size,
        type: file.mimetype,
        uploadedAt: new Date().toISOString(),
        summary: null,
        markdown: null,
        processingStatus: "processing",
      };

      await createDocument(document);
      uploadedDocuments.push(document);

      // Process document with AI in the background
      processDocumentAsync(document.id, file.path);
    }

    res.status(201).json({
      success: true,
      data: uploadedDocuments,
      message: `${uploadedDocuments.length} file(s) uploaded successfully. AI processing started.`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload documents",
      message: error.message,
    });
  }
};

/**
 * Process document asynchronously (background job)
 */
const processDocumentAsync = async (documentId, filePath) => {
  try {
    console.log(`Starting AI processing for document ${documentId}`);

    const result = await processDocument(filePath);

    if (result.success) {
      await updateDocument(documentId, {
        summary: result.summary,
        markdown: result.markdown,
        processingStatus: "completed",
      });
      console.log(`Document ${documentId} processed successfully`);
    } else {
      await updateDocument(documentId, {
        processingStatus: "failed",
      });
      console.error(`Document ${documentId} processing failed:`, result.error);
    }
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    await updateDocument(documentId, {
      processingStatus: "failed",
    });
  }
};

/**
 * Get all documents
 */
const getDocuments = async (req, res) => {
  try {
    const documents = await getAllDocuments();
    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve documents",
    });
  }
};

/**
 * Get document by ID
 */
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve document",
    });
  }
};

/**
 * Get document content (download original file)
 */
const getDocumentContent = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Check if file exists
    try {
      await fs.access(document.path);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: "File not found on server",
      });
    }

    // Send file
    res.sendFile(path.resolve(document.path));
  } catch (error) {
    console.error("Get document content error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve document content",
    });
  }
};

/**
 * Delete document
 */
const removeDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await deleteDocument(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.path);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete document",
    });
  }
};

/**
 * Get documents by folder
 */
const getDocumentsByFolderId = async (req, res) => {
  try {
    const { folderId } = req.params;
    const documents = await getDocumentsByFolder(folderId);

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Get documents by folder error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve documents",
    });
  }
};

module.exports = {
  uploadDocuments,
  getDocuments,
  getDocument,
  getDocumentContent,
  removeDocument,
  getDocumentsByFolderId,
};
