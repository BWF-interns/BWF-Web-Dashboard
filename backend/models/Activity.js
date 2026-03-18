const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    type: { type: String, required: true, trim: true },
    hours: { type: Number, default: 0 },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    comments: { type: String, trim: true },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewed_at: { type: Date, default: null },
  },
  { timestamps: true }
);

activitySchema.index({ student_id: 1, status: 1 });

module.exports = mongoose.model("Activity", activitySchema);
