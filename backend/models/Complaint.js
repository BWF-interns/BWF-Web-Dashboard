const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED", "ESCALATED"],
      default: "OPEN",
    },
    is_anonymous: { type: Boolean, default: false },
    resolved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolved_at: { type: Date, default: null },
  },
  { timestamps: true }
);

complaintSchema.index({ student_id: 1, status: 1 });

module.exports = mongoose.model("Complaint", complaintSchema);
