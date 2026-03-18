const asyncHandler = require("../middleware/asyncHandler");
const Joi = require("joi");
const Expense = require("../models/Expense");
const { getWardenStudentIds } = require("../utils/helpers");

const expenseSchema = Joi.object({
  student_id: Joi.string().required(),
  category: Joi.string().valid("Food", "Medical", "Education", "Misc").required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().allow(""),
  date: Joi.date().required(),
});

exports.addExpense = asyncHandler(async (req, res) => {
  const { error } = expenseSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const studentIds = await getWardenStudentIds(req.user._id);
  const isOwned = studentIds.some((id) => id.toString() === req.body.student_id);
  if (!isOwned) return res.status(403).json({ message: "Student not assigned to you" });

  const expense = await Expense.create({ ...req.body, added_by: req.user._id });
  res.status(201).json({ expense });
});

exports.getExpenses = asyncHandler(async (req, res) => {
  const { student_id, category, from, to, page = 1, limit = 20 } = req.query;
  const studentIds = await getWardenStudentIds(req.user._id);

  const query = { student_id: { $in: studentIds } };
  if (student_id && studentIds.some((id) => id.toString() === student_id)) {
    query.student_id = student_id;
  }
  if (category) query.category = category;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [expenses, total] = await Promise.all([
    Expense.find(query)
      .populate("student_id", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 }),
    Expense.countDocuments(query),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyAgg = await Expense.aggregate([
    { $match: { student_id: { $in: studentIds }, date: { $gte: monthStart } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const monthlyTotal = monthlyAgg[0]?.total || 0;

  res.json({ expenses, total, monthlyTotal, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});
