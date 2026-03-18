const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    category: {
      type: String,
      enum: ["Food", "Medical", "Education", "Misc"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

expenseSchema.index({ student_id: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
