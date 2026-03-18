const asyncHandler = require("../middleware/asyncHandler");
const Activity = require("../models/Activity");
const { getWardenStudentIds } = require("../utils/helpers");

exports.getActivities = asyncHandler(async (req, res) => {
  const { status, student_id, page = 1, limit = 20 } = req.query;
  const studentIds = await getWardenStudentIds(req.user._id);

  const query = { student_id: { $in: studentIds } };
  if (status) query.status = status;
  if (student_id && studentIds.some((id) => id.toString() === student_id)) {
    query.student_id = student_id;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [activities, total] = await Promise.all([
    Activity.find(query)
      .populate("student_id", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Activity.countDocuments(query),
  ]);

  res.json({ activities, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

exports.approveActivity = asyncHandler(async (req, res) => {
  const studentIds = await getWardenStudentIds(req.user._id);
  const activity = await Activity.findOneAndUpdate(
    { _id: req.params.id, student_id: { $in: studentIds }, status: "PENDING" },
    { status: "APPROVED", reviewed_by: req.user._id, reviewed_at: new Date(), comments: req.body.comments },
    { new: true }
  );
  if (!activity) return res.status(404).json({ message: "Activity not found or already reviewed" });
  res.json({ activity });
});

exports.rejectActivity = asyncHandler(async (req, res) => {
  const studentIds = await getWardenStudentIds(req.user._id);
  const activity = await Activity.findOneAndUpdate(
    { _id: req.params.id, student_id: { $in: studentIds }, status: "PENDING" },
    { status: "REJECTED", reviewed_by: req.user._id, reviewed_at: new Date(), comments: req.body.comments },
    { new: true }
  );
  if (!activity) return res.status(404).json({ message: "Activity not found or already reviewed" });
  res.json({ activity });
});
