const Cart = require("../models/Cart");
const { errorHandler } = require("../auth")

const Product = require("../models/Product");



module.exports.getCart = (req, res) => {
  const userId = req.user.id;

  Cart.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, cartItems: [], totalPrice: 0 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .then((cart) => {
      return res.status(200).send({ cart });
    })
    .catch((err) => {
      return errorHandler(err, req, res);
    });
};



module.exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, price, quantity } = req.body; // ignore subtotal from client

  Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) cart = new Cart({ userId, cartItems: [], totalPrice: 0 });

      const idx = cart.cartItems.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      const lineSubtotal = price * quantity;

      if (idx > -1) {
        // Update existing item
        cart.cartItems[idx].quantity += quantity;
        cart.cartItems[idx].subtotal =
          cart.cartItems[idx].quantity * price;
      } else {
        // Add new item
        cart.cartItems.push({
          productId,
          quantity,
          subtotal: lineSubtotal,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.cartItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      return cart.save();
    })
    .then((savedCart) => {
      return res.status(200).send({
        message: "Item added to cart successfully",
        cart: savedCart,
      });
    })
    .catch((err) => {
      return errorHandler(err, req, res);
    });
};


module.exports.updateCartQuantity = (req, res) => {
  const userId = req.user.id;
  const { productId, newQuantity } = req.body;

  // make sure newQuantity is always a number
  const qty = Number(newQuantity);

  Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ error: "Cart not found" });
      }

      // locate the item in cart
      const idx = cart.cartItems.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      if (idx === -1) {
        return res.status(404).send({ error: "Item not found in cart" });
      }

      if (qty === 0) {
        // remove the item if new quantity is 0
        cart.cartItems.splice(idx, 1);
      } else {
        const current = cart.cartItems[idx];

        // make sure we calculate using numbers only
        const unitPrice =
          Number(current.subtotal) / Number(current.quantity || 1);

        current.quantity = qty;
        current.subtotal = unitPrice * qty;
      }

      // recalc totalPrice safely as a number
      cart.totalPrice = cart.cartItems.reduce(
        (sum, item) => Number(sum) + Number(item.subtotal || 0),
        0
      );

      return cart.save();
    })
    .then((savedCart) => {
      if (savedCart) {
        return res.status(200).send({
          message: "Cart updated successfully",
          cart: savedCart,
        });
      }
    })
    .catch((err) => {
      return errorHandler(err, req, res);
    });
};




//Remove Item From The Cart

module.exports.removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ error: "Cart not found" });
      }

      // find the index of the item
      const idx = cart.cartItems.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      if (idx === -1) {
        return res.status(404).send({ error: "Item not found in cart" });
      }

      // remove the item
      cart.cartItems.splice(idx, 1);

      // recalc totalPrice
      cart.totalPrice = cart.cartItems.reduce(
        (sum, item) => Number(sum) + Number(item.subtotal || 0),
        0
      );

      return cart.save();
    })
    .then((savedCart) => {
      if (savedCart) {
        return res.status(200).send({
          message: "Item removed from cart successfully",
          cart: savedCart,
        });
      }
    })
    .catch((err) => {
      return errorHandler(err, req, res);
    });
};



//Clear Cart

module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    // clear all items
    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).send({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (err) {
    return errorHandler(err, req, res);
  }
};
