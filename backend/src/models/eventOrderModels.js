const mongoose = require('mongoose');
const EventOrderSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
      price: { type: Number, required: true },
      paymentId: { type: String, required: true },
      paymentStatus: { type: String, enum: ['Paid', 'Failed'], default: 'Failed' }, // Enum for payment status
      purchaseDate: { type: Date, default: Date.now },
    },
    { timestamps: true } // Adds `createdAt` and `updatedAt` fields
  );
  
  const EventOrder = mongoose.model('EventOrder', EventOrderSchema);
  
  module.exports = EventOrder;
  