const express =require('express')
const { auth, isStudent } = require('../middlewares/auth')
const { capturePayment, verifyPayment } = require("../controllers/Payment")
const router=express.Router()

router.post('/capturePayment',auth,isStudent,capturePayment)
router.post('/verifyPayment' ,auth ,isStudent,verifyPayment)
module.exports=router