//[SECTION] Dependencies and Modules
const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin} = require("../auth");


//[SECTION] Routing Component
const router = express.Router();


//[SECTION] Route for User Registration
router.post('/register', userController.registerUser);

//[SECTION] Route for User Login
router.post('/login', userController.loginUser);


//[Section] Activity: Route for retrieving user details
router.get('/details', verify, userController.getProfile);


// [Section] Route for Updating Password
router.patch('/update-password', verify, userController.updatePassword)

//[Section] Route for Updating User as Admin
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.setAsAdmin)



module.exports = router;


