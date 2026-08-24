const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  items: {
    type: Array,
    required: [true, 'Order items are required'],
    validate: {
      validator: function(val) {
        return Array.isArray(val) && val.length > 0;
      },
      message: 'Items must be a non-empty array'
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  deliveryAddress: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
      message: '{VALUE} is not a valid order status'
    },
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
