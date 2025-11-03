const fs = require("fs").promises;
const path = require("path");

const DB_PATH = path.join(__dirname, "../../data/db.json");

// Initialize database
const initDB = async () => {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    // Create initial database structure
    const initialData = {
      documents: [],
      folders: [],
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

// Read database
const readDB = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { documents: [], folders: [] };
  }
};

// Write database
const writeDB = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
    throw error;
  }
};

// Document operations
const getAllDocuments = async () => {
  const db = await readDB();
  return db.documents;
};

const getDocumentById = async (id) => {
  const db = await readDB();
  return db.documents.find((doc) => doc.id === id);
};

const createDocument = async (document) => {
  const db = await readDB();
  db.documents.push(document);
  await writeDB(db);
  return document;
};

const updateDocument = async (id, updates) => {
  const db = await readDB();
  const index = db.documents.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    db.documents[index] = { ...db.documents[index], ...updates };
    await writeDB(db);
    return db.documents[index];
  }
  return null;
};

const deleteDocument = async (id) => {
  const db = await readDB();
  const index = db.documents.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    const document = db.documents[index];
    db.documents.splice(index, 1);
    await writeDB(db);
    return document;
  }
  return null;
};

// Folder operations
const getAllFolders = async () => {
  const db = await readDB();
  return db.folders;
};

const getFolderById = async (id) => {
  const db = await readDB();
  return db.folders.find((folder) => folder.id === id);
};

const createFolder = async (folder) => {
  const db = await readDB();
  db.folders.push(folder);
  await writeDB(db);
  return folder;
};

const deleteFolder = async (id) => {
  const db = await readDB();
  const index = db.folders.findIndex((folder) => folder.id === id);
  if (index !== -1) {
    const folder = db.folders[index];
    db.folders.splice(index, 1);
    await writeDB(db);
    return folder;
  }
  return null;
};

const getDocumentsByFolder = async (folderId) => {
  const db = await readDB();
  return db.documents.filter((doc) => doc.folderId === folderId);
};

module.exports = {
  initDB,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getAllFolders,
  getFolderById,
  createFolder,
  deleteFolder,
  getDocumentsByFolder,
};
