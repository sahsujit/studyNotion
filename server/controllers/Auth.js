const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator")
// const otpGen = require("otp-gen-agent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
const {passwordUpdated} = require("../mail/templates/passwordUpdate")
require('dotenv').config();


exports.signup = async(req, res) =>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){
            return  res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        };

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword does not match, please try again"
            })
        };


        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message:"User already exists"
            })
        };

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("recentOtp", recentOtp);

        if(recentOtp.length === 0){
            return res.status(404).json({
                success:false,
                message: "OTP not found"
            })
        } else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10);
         // Create the user
         let approved = ""
         approved === "Instructor" ? (approved = false) : (approved = true)

        const  profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        });

        const user = await User.create({
            firstName,
            lastName,
            password:hashedPassword,
            additionalDetails:profileDetails._id,
            email,
            approved:approved,
            contactNumber,
            accountType,
            // image:""
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user
        });

    }
    catch(error){
        console.log("error while registering user", error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered , please try again"
        })
    }
};


exports.login = async(req, res) => {
    try{
            // Get email and password from request body
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again"
            });
        };
    // Find user with provided email
        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signUp first"
            });
        };

        // if(await bcrypt.compare(password, user.password)){
        //     const payload = {
        //         email:user.email,
        //         id:user._id,
        //         accountType:user.accountType,
        //     };

        //     const token = jwt.sign(payload, process.env.JWT_SECRET,{
        //         expiresIn:"24h",
        //     });
        //     user.token = token;
        //     user.password = undefined;

        //     const options = {
        //         httpOnly:true,
        //         expires: new Date(Date.now() + 3*24*60*60*1000),
        //     }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { email: user.email, id: user._id, role: user.role },
              process.env.JWT_SECRET,
              {
                expiresIn: "24h",
              }
            )
      
            // Save token to user document in database
            user.token = token
            user.password = undefined
            // Set cookie for token and return success response
            const options = {
              expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            }

            res.cookie("token", token , options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            });
        }
    }
    catch(error){
         console.log(error);
         return res.status(401).json({
            success:false,
            message:"Login failure, please try again"
         });
    }
};
//send OTP

exports.sendotp = async(req, res) =>{
    try{
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message:"User already registered",
            })
        };

        // const otp = await otpGen();

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });


        const result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                
            });
            // result = await OTP.findOne({otp: otp});
        };

        const otpPayload = {email, otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message:"OTP sent successfully",
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};



//signUp



//login 



exports.changePassword = async(req, res) =>{
    try{
        const userDetails = await User.findById(req.user.id);

        const {oldPassword, newPassword} = req.body;

        const isPasswordMatch = await bcrypt.compare(
            oldPassword, userDetails.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"The password is incorrect"
            })
        };

        const encryptedPassword = await bcrypt.hash(newPassword , 10);

        const updatedUserPassword = await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedPassword},
            {new:true}

        );

        try{
            const emailResponse = await mailSender(
                updatedUserPassword.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserPassword.email,
                    `Password updated successfully for ${updatedUserPassword.firstName} ${updatedUserPassword.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response)

        }
        catch(error){
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
              success: false,
              message: "Error occurred while sending email",
              error: error.message,
            })
        }
        
        return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    }
    catch(error){
        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while updating password",
          error: error.message,
        })
    }
}