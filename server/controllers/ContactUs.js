const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender");
require("dotenv").config();


exports.contactUsController = async(req, res)=>{
    try{
        const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

        const response = await mailSender(
            email,
            "Your data send successfully",
            contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
        );

    console.log("Email Res ", response)
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}