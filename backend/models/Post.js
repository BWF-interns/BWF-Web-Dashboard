const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    content: { type: String, required: true, trim: true },
    image_url: { type: String, default: null },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewed_at: { type: Date, default: null },
  },
  { timestamps: true }
);

postSchema.index({ student_id: 1, status: 1 });

module.exports = mongoose.model("Post", postSchema);
