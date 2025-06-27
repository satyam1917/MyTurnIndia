const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true }, // Hashed password
      otp: { type: String, default: '1516' },
      role: { type: String, default: 'admin' },
      createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // References to created courses
    },
    { timestamps: true } // Adds `createdAt` and `updatedAt` fields
  );
  
  const Admin = mongoose.model('Admin', AdminSchema);
  
  module.exports = Admin;
  