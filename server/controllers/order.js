// controllers/order.js
const Order = require("../models/Order");
const Cart = require("../models/Cart"); // adjust path/name if different
const { errorHandler } = require("../auth");

// POST /order/checkout
module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      // must be this exact shape/text per slides
      return res.status(400).send({ error: "No Items to Checkout" });
    }

    const order = await Order.create({
      userId,
      productsOrdered: cart.cartItems.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        subtotal: i.subtotal
      })),
      totalPrice: cart.totalPrice,
      purchasedOn: new Date()
    });

    // clear cart after order
    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    // must be this exact text per slides
    return res.status(201).send({ message: "Ordered Successfully" });
  } catch (err) {
    return errorHandler(err, req, res);
  }
};

// GET /order/my-orders
module.exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).send({ orders });
  } catch (err) {
    return errorHandler(err, req, res);
  }
};

// GET /order/all-orders (admin)
module.exports.getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ orders });
  } catch (err) {
    return errorHandler(err, _req, res);
  }
};