# 🚀 How to Run AI Document Vault

## ✅ Node.js Upgraded!

You now have **Node.js v20.19.5** installed and set as default! 🎉

---

## 🎯 Quick Start (2 Steps)

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd /Users/sanjeev/Study/case-study/backend
node src/server.js
```

You should see:

```
✅ Database initialized
╔═══════════════════════════════════════════════════════╗
║   🚀  AI Document Vault Backend Server Running       ║
║   📍  Port: 3000                                      ║
╚═══════════════════════════════════════════════════════╝
```

✅ **Backend is now running on http://localhost:3000**

---

### Step 2: Start the Frontend

Open a **NEW terminal** (keep backend running) and run:

```bash
cd /Users/sanjeev/Study/case-study
./START-FRONTEND.sh
```

OR manually:

```bash
cd /Users/sanjeev/Study/case-study/frontend
nvm use 20
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend is now running on http://localhost:5173**

---

## 🌐 Access the Application

### Option 1: Full React Application (Recommended)

Open your browser and go to:

```
http://localhost:5173
```

### Option 2: Test Interface (Simple HTML)

If React app doesn't work, use the test interface:

```
http://localhost:3000/test.html
```

---

## 🧪 Test the API Directly

You can also test the backend API using curl:

```bash
# Check if backend is running
curl http://localhost:3000/health

# Create a test file
echo "This is a test document about artificial intelligence and machine learning." > test.txt

# Upload it
curl -X POST http://localhost:3000/api/documents/upload \
  -F "files=@test.txt"

# Wait 10-20 seconds for AI processing, then check results
curl http://localhost:3000/api/documents
```

---

## 📊 What to Expect

1. **Upload a document** using drag-and-drop or file picker
2. **Watch the progress** - File uploads immediately
3. **AI processing starts** - Takes 10-30 seconds
4. **View AI results**:
   - Click on the document
   - See the **Summary** tab (AI-generated summary)
   - See the **Markdown** tab (cleaned markdown version)

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 3000 is busy
lsof -i :3000
# Kill the process if needed
kill -9 <PID>
```

### Frontend won't start

```bash
# Make sure you're using Node.js 20
nvm use 20
node --version  # Should show v20.19.5

# Clear npm cache if needed
cd frontend
rm -rf node_modules .vite
npm install
npm run dev
```

### Both servers running but can't connect

- Make sure you're accessing `http://localhost:5173` (with http, not https)
- Check browser console for errors (F12)
- Verify backend `.env` file has the correct API key

---

## 🎉 You're All Set!

Both servers should now be running:

- ✅ **Backend**: http://localhost:3000
- ✅ **Frontend**: http://localhost:5173

Start uploading documents and see the AI magic happen! 🤖✨

---

## 💡 Tips

- Keep both terminal windows open while using the app
- Backend processes AI in the background - be patient!
- Claude API generates high-quality summaries and markdown
- You can upload multiple files at once
- Create folders to organize your documents

---

## 📞 Need Help?

Check the documentation:

- `README.md` - Main project overview
- `FULLSTACK-COMPLETE.md` - Complete setup guide
- `backend/README.md` - Backend API docs
- `frontend/README.md` - Frontend docs

---

**Enjoy your AI Document Vault!** 🚀
