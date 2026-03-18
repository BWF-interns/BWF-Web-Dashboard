const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    education: { type: String, trim: true },
    interests: [{ type: String }],
    address: { type: String, trim: true },
    guardian_info: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },
    assigned_warden_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.index({ assigned_warden_id: 1 });
studentSchema.index({ name: "text" });

module.exports = mongoose.model("Student", studentSchema);
