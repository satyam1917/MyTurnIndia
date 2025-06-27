const mongoose = require('mongoose');

// Event Schema
const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);



// Create Event model
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;
