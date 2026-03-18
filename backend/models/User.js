const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["admin", "warden", "student"], default: "warden" },
    assigned_warden_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model("User", userSchema);
