const Student = require("../models/Student");

const getWardenStudentIds = async (wardenId) => {
  const students = await Student.find({ assigned_warden_id: wardenId }).select("_id");
  return students.map((s) => s._id);
};

module.exports = { getWardenStudentIds };
