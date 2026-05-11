const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is Required']
  },

  cartItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is Required.']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is Required'],
        min: [1, 'Quantity must be at least 1']
      },
      subtotal: {
        type: Number,
        required: [true, 'Subtotal is Required'],
        min: [0, 'Subtotal cannot be negative']
      }
    }
  ],

  totalPrice: {
    type: Number,
    required: [true, 'Total Price is Required.'],
    min: [0, 'Total price cannot be negative']
  },

  orderedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);