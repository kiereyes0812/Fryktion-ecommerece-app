// routes/order.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");

// Block admins from checking out (slides: NON-admin checkout)
const verifyNonAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return res.status(403).json({ message: "Admins cannot checkout" });
  }
  next();
};

// Place an order (NON-admin)
router.post("/checkout", verify, orderController.createOrder);

// Retrieve logged-in user's orders
router.get("/my-orders", verify, orderController.getMyOrders);

// Retrieve all users' orders (Admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;