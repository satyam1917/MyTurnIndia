const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
      price: { type: Number, required: true },
      paymentId: { type: String, required: true },
      paymentStatus: { type: String, enum: ['Paid', 'Failed'], default: 'Failed' }, // Enum for payment status
      purchaseDate: { type: Date, default: Date.now },
    },
    { timestamps: true } // Adds `createdAt` and `updatedAt` fields
  );
  
  const Order = mongoose.model('Order', OrderSchema);
  
  module.exports = Order;
  