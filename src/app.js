const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper: Load and save DB
const dbPath = path.join(__dirname, "database", "gradeRecheck.json");
function loadDB() {
  if (!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// API: Health check or welcome
app.get("/", (req, res) => {
  res.json({ message: "Grade Recheck Microservice API is running." });
});

// API: Submit Grade Recheck Form
app.post("/api/grade-recheck", (req, res) => {
  const { studentId, firstName, lastName, courseId, reason } = req.body;
  if (!studentId || !firstName || !lastName || !courseId || !reason) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const db = loadDB();
  const newEntry = {
    id: Date.now(),
    studentId: String(studentId),
    firstName,
    lastName,
    courseId,
    reason,
    status: "pending",
    rejectReason: " ",
    createdAt: new Date().toISOString(),
  };
  db.push(newEntry);
  saveDB(db);
  res.status(201).json({ success: true, entry: newEntry });
});

// API: Get all submissions (for manager)
app.get("/api/submissions", (req, res) => {
  res.json(loadDB());
});

// API: Get single submission by id
app.get("/api/submissions/:id", (req, res) => {
  const db = loadDB();
  const entry = db.find(e => String(e.id) === req.params.id);
  if (!entry) return res.status(404).json({ error: "Not found" });
  res.json(entry);
});

// API: Update status (manager)
app.post("/api/submissions/:id/status", (req, res) => {
  const { status, rejectReason } = req.body;
  const db = loadDB();
  const idx = db.findIndex(e => String(e.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db[idx].status = status;
  if (status === "rejected") {
    db[idx].rejectReason = rejectReason || "";
  } else {
    db[idx].rejectReason = null;
  }
  saveDB(db);
  res.json({ success: true });
});

// (Optional) Serve static files if you want to host the React build here
// app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Microservice API is running on http://localhost:${PORT}`);
});