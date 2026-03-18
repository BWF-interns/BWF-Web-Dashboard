const Joi = require("joi");
const Student = require("../models/Student");
const asyncHandler = require("../middleware/asyncHandler");

const studentSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().min(5).max(30).required(),
  education: Joi.string().allow("").optional(),
  interests: Joi.array().items(Joi.string()).optional(),
  address: Joi.string().allow("").optional(),
  guardian_info: Joi.object({
    name: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    relation: Joi.string().allow("").optional(),
  }).optional(),
  is_active: Joi.boolean().optional(),
});

exports.getStudents = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const query = { assigned_warden_id: req.user._id };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { education: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [students, total] = await Promise.all([
    Student.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    Student.countDocuments(query),
  ]);

  res.json({ students, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

exports.getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    _id: req.params.id,
    assigned_warden_id: req.user._id,
  });
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ student });
});

exports.createStudent = asyncHandler(async (req, res) => {
  const { error } = studentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const student = await Student.create({
    ...req.body,
    assigned_warden_id: req.user._id,
  });
  res.status(201).json({ student });
});

exports.updateStudent = asyncHandler(async (req, res) => {
  const { error } = studentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, assigned_warden_id: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ student });
});
