const express = require("express");
const router = express.Router();
const {
  createNewFolder,
  getFolders,
  getFolder,
  removeFolder,
  getFolderTree,
} = require("../controllers/folderController");

// Create folder
router.post("/", createNewFolder);

// Get all folders
router.get("/", getFolders);

// Get folder tree structure
router.get("/tree", getFolderTree);

// Get folder by ID
router.get("/:id", getFolder);

// Delete folder
router.delete("/:id", removeFolder);

module.exports = router;
