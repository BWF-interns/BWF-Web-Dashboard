const router = require("express").Router();
const { verifyToken, checkRole } = require("../middleware/auth");

const { getDashboard } = require("../controllers/dashboardController");
const { getStudents, getStudent, createStudent, updateStudent } = require("../controllers/studentController");
const { getActivities, approveActivity, rejectActivity } = require("../controllers/activityController");
const { addExpense, getExpenses } = require("../controllers/expenseController");
const { getPendingPosts, approvePost, rejectPost } = require("../controllers/postController");
const { getComplaints, resolveComplaint, escalateComplaint } = require("../controllers/complaintController");

// All warden routes require auth + warden role
router.use(verifyToken, checkRole(["warden", "admin"]));

// Dashboard
router.get("/dashboard", getDashboard);

// Students
router.get("/students", getStudents);
router.get("/students/:id", getStudent);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);

// Activities
router.get("/activities", getActivities);
router.put("/activities/:id/approve", approveActivity);
router.put("/activities/:id/reject", rejectActivity);

// Expenses
router.post("/expenses", addExpense);
router.get("/expenses", getExpenses);

// Posts
router.get("/posts/pending", getPendingPosts);
router.put("/posts/:id/approve", approvePost);
router.put("/posts/:id/reject", rejectPost);

// Complaints
router.get("/complaints", getComplaints);
router.put("/complaints/:id/resolve", resolveComplaint);
router.put("/complaints/:id/escalate", escalateComplaint);

module.exports = router;
