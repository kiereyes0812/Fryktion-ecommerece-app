//[SECTION] Dependencies and Modules
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../auth');



const { errorHandler, createAccessToken } = auth;


module.exports.registerUser = (req, res) => {
    if (typeof req.body.firstName !== 'string' || typeof req.body.lastName !== 'string') {
        return res.status(400).send({message: 'Invalid data type'});
    }
    // Checks if the email is in the right format
    else if (!req.body.email.includes("@")){
        return res.status(400).send({error: 'Email Invalid'});
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ error: 'Mobile number invalid'});
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({error: 'Password must be atleast 8 characters'});
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({message: 'Registered Successfully'}))
        .catch(error => errorHandler(error, req, res));
    }
};


module.exports.loginUser = (req, res) => {
    //if the request includes the @ symbol
    if (req.body.email.includes("@")) {
        return User.findOne({ email : req.body.email })
    .then(result => {
        if(result == null){
            return res.status(404).send({ error: 'No email found'});
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).send({
                    access : auth.createAccessToken(result)
                 });
            } else {
                return res.status(401).send({error: 'Email and Password do not match'});
            }
        }
    })
    .catch(error => errorHandler(error, req, res));

    } else {
         //if the email does not contain an "@", send a bad request status with false value
         return res.status(400).send({error: 'Invalid Email'});
    }
};







  
module.exports.getProfile = (req, res) => {
 
  return User.findById(req.user.id)
    .then(user => {

        if(!user) {
            //if the user has an invalid token, we would be sending a message 'invalid signature'
            return res.status(404).send({message: 'user not found'})
        } else {
            user.password = "";
            res.status(200).send(user)
        }
       
    })
    .catch(error => errorHandler(error, req, res));
};




 module.exports.setAsAdmin = (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndUpdate(id, { isAdmin: true }, { new: true })
        .then((updated) => {
            if (!updated) {
                return res.status(404).send({ error: 'User not Found' });
            }
            // Return entire updated user (as shown in screenshot, includes password hash and __v)
            return res.status(200).send({ updatedUser: updated });
        })
        .catch((err) => {
            // Return EXACT shape required by the slide (no wrapping)
            return res.status(500).send({
                error: 'Failed in Find',
                details: err
            });
        });
};


module.exports.updatePassword = (req, res, next) => {

    const userId = req.user.id;
    const {newPassword} = req.body;

    if(!newPassword || newPassword.length<8){

        return res.status(400).send({error: 'Password must be atleast 8 characters'});

    } 

        const hashed = bcrypt.hashSync(newPassword, 10);

    User.findByIdAndUpdate(userId, { password: hashed }, { new: true })
        .then((updated) => {
            if (!updated) {
                // If somehow the user in token does not exist anymore
                return res.status(404).send({ error: 'User not found' });
            }
            return res.status(201).send({ message: 'Password reset successfully' });
        })
        .catch((err) => errorHandler(err, req, res, next));


}




