const express = require('express');
const cartController = require('../controllers/cart');
const auth = require("../auth")

const { verify, verifyAdmin } = auth;

//Routing component
const router = express.Router();

//[SECTION] Route to enroll a user to a course
//router.post('/add-cart', verify, enrollmentController.enroll)

//[SECTION] Activity: Route to get the user's enrollements array
router.get('/get-cart', verify, cartController.getCart);

// Add to cart
router.post('/add-to-cart', verify, cartController.addToCart);

router.patch('/update-cart-quantity', verify, cartController.updateCartQuantity)

//Remove Item from Cart

router.patch('/:productId/remove-from-cart', verify, cartController.removeFromCart)



//Clear Cart

router.put('/clear-cart', verify, cartController.clearCart)


module.exports = router;