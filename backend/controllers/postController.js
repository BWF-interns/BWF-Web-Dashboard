const asyncHandler = require("../middleware/asyncHandler");
const Post = require("../models/Post");
const { getWardenStudentIds } = require("../utils/helpers");

exports.getPendingPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const studentIds = await getWardenStudentIds(req.user._id);

  const query = { student_id: { $in: studentIds }, status: "PENDING" };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate("student_id", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Post.countDocuments(query),
  ]);

  res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

exports.approvePost = asyncHandler(async (req, res) => {
  const studentIds = await getWardenStudentIds(req.user._id);
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, student_id: { $in: studentIds }, status: "PENDING" },
    { status: "APPROVED", approved_by: req.user._id, reviewed_at: new Date() },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: "Post not found or already reviewed" });
  res.json({ post });
});

exports.rejectPost = asyncHandler(async (req, res) => {
  const studentIds = await getWardenStudentIds(req.user._id);
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, student_id: { $in: studentIds }, status: "PENDING" },
    { status: "REJECTED", approved_by: req.user._id, reviewed_at: new Date() },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: "Post not found or already reviewed" });
  res.json({ post });
});
