const mongoose = require('mongoose');

// Event Schema
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    isPaid: { type: Boolean, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);



// Create Event model
const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
