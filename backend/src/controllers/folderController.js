const { generateId } = require("../utils/idGenerator");
const {
  getAllFolders,
  getFolderById,
  createFolder,
  deleteFolder,
} = require("../utils/database");

/**
 * Create a new folder
 */
const createNewFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Folder name is required",
      });
    }

    const folder = {
      id: generateId(),
      name,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };

    await createFolder(folder);

    res.status(201).json({
      success: true,
      data: folder,
      message: "Folder created successfully",
    });
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create folder",
    });
  }
};

/**
 * Get all folders
 */
const getFolders = async (req, res) => {
  try {
    const folders = await getAllFolders();
    res.json({
      success: true,
      data: folders,
    });
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve folders",
    });
  }
};

/**
 * Get folder by ID
 */
const getFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await getFolderById(id);

    if (!folder) {
      return res.status(404).json({
        success: false,
        error: "Folder not found",
      });
    }

    res.json({
      success: true,
      data: folder,
    });
  } catch (error) {
    console.error("Get folder error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve folder",
    });
  }
};

/**
 * Delete folder
 */
const removeFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await deleteFolder(id);

    if (!folder) {
      return res.status(404).json({
        success: false,
        error: "Folder not found",
      });
    }

    res.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete folder",
    });
  }
};

/**
 * Get folder tree structure
 */
const getFolderTree = async (req, res) => {
  try {
    const folders = await getAllFolders();

    // Build tree structure
    const folderMap = new Map();
    const rootFolders = [];

    // Create a map of all folders
    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build the tree
    folders.forEach((folder) => {
      const folderWithChildren = folderMap.get(folder.id);
      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId);
        parent.children.push(folderWithChildren);
      } else {
        rootFolders.push(folderWithChildren);
      }
    });

    res.json({
      success: true,
      data: rootFolders,
    });
  } catch (error) {
    console.error("Get folder tree error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve folder tree",
    });
  }
};

module.exports = {
  createNewFolder,
  getFolders,
  getFolder,
  removeFolder,
  getFolderTree,
};
