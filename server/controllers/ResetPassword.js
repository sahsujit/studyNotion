const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

exports.resetPasswordToken = async (req, res) => {
    try {

        const email = req.body.email;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Your email is not registered with us"
            })
        };

        const token = crypto.randomBytes(20).toString('hex');

        const updatedDetails = await User.findOneAndUpdate({ email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000
            }, { new: true });

            console.log("DETAILS", updatedDetails);



        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email,
                                "Password Reset Link",
                                `Password Reset Link : ${url}`);

        return res.status(200).json({
            success:true,
            message:"Email sent Successfully, please check your email and change password"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password mail"
        })
    }
}


exports.resetPassword = async (req, res) =>{
    try{
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password is not matching"
            })
        }

        const userDetails = await User.findOne({token:token});

        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid"
            })
        };

        if(!userDetails.resetPasswordExpires > Date.now()){
            return res.json({
                success:false,
                message:"Token  has expired, please regenerate the token"
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword}, {new:true});

            return res.status(200).json({
                success:true,
                message:"Password reset successfully"
            })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while  reset password "
        })
    }
}