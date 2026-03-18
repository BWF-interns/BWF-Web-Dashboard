const asyncHandler = require("../middleware/asyncHandler");
const Complaint = require("../models/Complaint");
const { getWardenStudentIds } = require("../utils/helpers");

exports.getComplaints = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const studentIds = await getWardenStudentIds(req.user._id);

  const query = { student_id: { $in: studentIds } };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [complaints, total] = await Promise.all([
    Complaint.find(query)
      .populate("student_id", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Complaint.countDocuments(query),
  ]);

  const masked = complaints.map((c) => {
    const obj = c.toObject();
    if (obj.is_anonymous) obj.student_id = { _id: obj.student_id._id, name: "Anonymous" };
    return obj;
  });

  res.json({ complaints: masked, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

exports.resolveComplaint = asyncHandler(async (req, res) => {
  const studentIds = await getWardenStudentIds(req.user._id);
  const complaint = await Complaint.findOneAndUpdate(
    { _id: req.params.id, student_id: { $in: studentIds }, status: "OPEN" },
    { status: "RESOLVED", resolved_by: req.user._id, resolved_at: new Date() },
    { new: true }
  );
  if (!complaint) return res.status(404).json({ message: "Complaint not found or already resolved" });
  res.json({ complaint });
});

exports.escalateComplaint = asyncHandler(async (req, res) => {
  const studentIds = await getWardenStudentIds(req.user._id);
  const complaint = await Complaint.findOneAndUpdate(
    { _id: req.params.id, student_id: { $in: studentIds }, status: "OPEN" },
    { status: "ESCALATED" },
    { new: true }
  );
  if (!complaint) return res.status(404).json({ message: "Complaint not found or already handled" });
  res.json({ complaint });
});
