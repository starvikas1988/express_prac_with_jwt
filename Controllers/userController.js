const userModel = require('../Models/userModel');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const handelUserSignUp = (req,res)=>{
    try{
        userModel.create(req.body)
        .then((response)=>{
            res.json({"Message":"User Created Successfully!!","user":response}).status(201)
        })
       .catch((err)=>{
        res.json({"Message":"Error while Passing User data",err:err}).status(500)
       })
    }catch(error){
        res.json({"Message":"Error while Passing User data",error:error}).status(500)
    }
}

const handelUserLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify the password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            id: user._id,  // Use user's ID or another identifier, not req.body
            userId:user.userId,
            email: user.email,
            userType: user.userType  // Add any other relevant non-sensitive information
        };

        // Sign the JWT token
        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: 'JWT token issue', error: err });
            }

            // Send success response with the token
            res.status(200).json({
                message: 'Logged in successfully!',
                token: token,
                user: {
                    id:user._id,
                    email: user.email,
                    userType: user.userType
                }
            });
        });
    } catch (err) {
        // Handle any unexpected errors
        res.status(500).json({ message: 'Error while logging in', error: err });
    }
};


const getUserDetails = (req,res)=>{
    
    try{
        const userId = req.body.userId;

        userModel.findOne({userId:userId})
        .then((response)=>{
            res.json({"user":response}).status(200)
        })
        .catch(err=>{
            res.json({"Message":"No such user found",err:err}).status(500)
        })
    }catch(err){
        res.json({"Message":"Error while fetching user details",err:err}).status(500)
    }
}

module.exports = {handelUserSignUp,handelUserLogin,getUserDetails}