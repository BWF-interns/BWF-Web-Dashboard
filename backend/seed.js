/**
 * Seed script — creates a demo warden account and sample data.
 * Run: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Student = require("./models/Student");
const Activity = require("./models/Activity");
const Expense = require("./models/Expense");
const Post = require("./models/Post");
const Complaint = require("./models/Complaint");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  // Clean up
  await Promise.all([
    User.deleteMany({}), Student.deleteMany({}),
    Activity.deleteMany({}), Expense.deleteMany({}),
    Post.deleteMany({}), Complaint.deleteMany({}),
  ]);

  // Create warden
  const warden = await User.create({
    name: "Priya Sharma",
    email: "warden@ngo.org",
    password_hash: "password123",
    role: "warden",
  });

  // Create students
  const students = await Student.insertMany([
    { name: "Arjun Kumar", age: 16, education: "Class 10", address: "Delhi", assigned_warden_id: warden._id, guardian_info: { name: "Ramesh Kumar", phone: "9876543210", relation: "Father" } },
    { name: "Meera Patel", age: 14, education: "Class 8", address: "Mumbai", assigned_warden_id: warden._id, guardian_info: { name: "Sunita Patel", phone: "9876543211", relation: "Mother" } },
    { name: "Ravi Singh", age: 17, education: "Class 11", address: "Jaipur", assigned_warden_id: warden._id, is_active: false, guardian_info: { name: "Mohan Singh", phone: "9876543212", relation: "Father" } },
  ]);

  // Activities
  await Activity.insertMany([
    { student_id: students[0]._id, type: "Sports", hours: 2, status: "PENDING" },
    { student_id: students[1]._id, type: "Art Workshop", hours: 3, status: "PENDING" },
    { student_id: students[0]._id, type: "Study Group", hours: 1, status: "APPROVED" },
  ]);

  // Expenses
  await Expense.insertMany([
    { student_id: students[0]._id, category: "Food", amount: 500, description: "Monthly meal", date: new Date(), added_by: warden._id },
    { student_id: students[1]._id, category: "Education", amount: 1200, description: "Books", date: new Date(), added_by: warden._id },
  ]);

  // Posts
  await Post.insertMany([
    { student_id: students[0]._id, content: "Had a great time at the sports event today!", status: "PENDING" },
    { student_id: students[1]._id, content: "Finished my art project. Really proud of it.", status: "PENDING" },
  ]);

  // Complaints
  await Complaint.insertMany([
    { student_id: students[0]._id, message: "The study room lights are not working.", status: "OPEN" },
    { student_id: students[1]._id, message: "I feel unsafe walking back after evening classes.", status: "OPEN", is_anonymous: true },
  ]);

  console.log("Seed complete!");
  console.log("Login: warden@ngo.org / password123");
  await mongoose.disconnect();
}

seed().catch(console.error);
