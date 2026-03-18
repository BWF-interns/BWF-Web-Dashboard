const Student = require("../models/Student");
const Activity = require("../models/Activity");
const Expense = require("../models/Expense");
const Post = require("../models/Post");
const Complaint = require("../models/Complaint");
const asyncHandler = require("../middleware/asyncHandler");

exports.getDashboard = asyncHandler(async (req, res) => {
  const wardenId = req.user._id;

  const students = await Student.find({ assigned_warden_id: wardenId }).select("_id name is_active");
  const studentIds = students.map((s) => s._id);
  const totalStudents = students.length;
  const inactiveStudents = students.filter((s) => !s.is_active).length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    pendingActivities,
    pendingPosts,
    openComplaints,
    monthlyExpAgg,
    recentActivities,
    recentExpenses,
    recentComplaints,
  ] = await Promise.all([
    Activity.countDocuments({ student_id: { $in: studentIds }, status: "PENDING" }),
    Post.countDocuments({ student_id: { $in: studentIds }, status: "PENDING" }),
    Complaint.countDocuments({ student_id: { $in: studentIds }, status: "OPEN" }),
    Expense.aggregate([
      { $match: { student_id: { $in: studentIds }, date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Activity.find({ student_id: { $in: studentIds } })
      .populate("student_id", "name")
      .sort({ createdAt: -1 })
      .limit(5),
    Expense.find({ student_id: { $in: studentIds } })
      .populate("student_id", "name")
      .sort({ createdAt: -1 })
      .limit(5),
    Complaint.find({ student_id: { $in: studentIds } })
      .populate("student_id", "name")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const monthlyExpenses = monthlyExpAgg[0]?.total || 0;

  const feed = [
    ...recentActivities.map((a) => ({
      type: "activity",
      message: `${a.student_id?.name} submitted activity: ${a.type}`,
      status: a.status,
      time: a.createdAt,
    })),
    ...recentExpenses.map((e) => ({
      type: "expense",
      message: `Expense added for ${e.student_id?.name}: ₹${e.amount} (${e.category})`,
      time: e.createdAt,
    })),
    ...recentComplaints.map((c) => ({
      type: "complaint",
      message: c.is_anonymous
        ? "Anonymous complaint raised"
        : `${c.student_id?.name} raised a complaint`,
      status: c.status,
      time: c.createdAt,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

  res.json({
    summary: { totalStudents, pendingActivities, pendingPosts, monthlyExpenses, openComplaints, inactiveStudents },
    feed,
  });
});
