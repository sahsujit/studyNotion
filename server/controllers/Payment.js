const course = require("../models/Course");
const user = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
require('dotenv').config()
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
// const endpointSecret = process.env.ENDPOINT_SECRET
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);
const courseProgress=require('../models/CourseProgress')

async function capturePayment(req, res) {
  let { courses } = req.body;
  const userId = req.user.id;
  if (courses.length === 0)
    return res.json({
      success: false,
      message: "Please provide Course Id",
    });
  console.log(courses);
  let totalAmount = 0;
  for (let courseId in courses) {
    console.log(courseId);
    let Course;
    try {
      Course = await course.findById(courses[courseId]);
      if (!Course) {
        return res.status(200).json({
          success: false,
          message: "Cloud not find course",
        });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (Course.studentsEnrolled.includes(userId)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled",
        });
      }
      totalAmount += Course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  try {
    //  console.log(typeof JSON.stringify(courses))
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: Math.random(Date.now()).toString().substring(2),
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Course",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],

      success_url:`http://localhost:3000/checkout-completed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.FRONTEND_URL,
      metadata: {
        userId: userId,
        courses: JSON.stringify(courses),
      },
    });
    return res.status(200).json({
      success: true,
      message: session,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cloud not Initiate Order",
    });
  }
}

// async function verfiyPayment(request,response){
//        const sig = request.headers['stripe-signature'];

//         let event;

//         try {
//           event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//           console.log("webhook verified")
//         } catch (err) {
//           console.log(err)
//           response.status(400).send(`Webhook Error: ${err.message}`);
//           return;
//         }

//         // Handle the event
//         switch (event.type) {
//           case 'checkout.session.completed':
//             const checkoutSessionCompleted = event.data.object;
//             console.log(checkoutSessionCompleted)
//             let {metadata,client_reference_id,amount_total}=checkoutSessionCompleted
//             const courses=JSON.parse(metadata.courses)
//             const userId=metadata.userId
//             amount_total=amount_total/100
//             const enrolledStudent =await user.findById(userId)
//             await mailSender(enrolledStudent.email,'Payment Received',paymentSuccessEmail(enrolledStudent.firstName,amount_total,client_reference_id))
//            await enrollStudents(courses,userId,response)
//             break;
//           // ... handle other event types
//           default:
//             console.log(`Unhandled event type ${event.type}`);
//             response.send()
//         }
//       }
async function verifyPayment(req, res) {
 try{
    console.log(req.body)
    const { sessionId } = req.body;
    const checkoutSessionCompleted = await stripe.checkout.sessions.retrieve(sessionId);
  console.log(checkoutSessionCompleted);
  let { metadata, client_reference_id, amount_total } =
    checkoutSessionCompleted;
  const courses = JSON.parse(metadata.courses);
  const userId = metadata.userId;
  amount_total = amount_total / 100;
  const enrolledStudent = await user.findById(userId);
  for (let courseId in courses) {
    console.log(courseId);

    console.log("courses", enrolledStudent)
    let Course;
    try {
      Course = await course.findById(courses[courseId]);
      if (!Course) {
        return res.status(200).json({
          success: false,
          message: "Cloud not find course",
        });
      }
    
      if (Course.studentsEnrolled.includes(userId)) {
        return res.status(200).json({
          success: true,
          message: "Student is already enrolled",
        });
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  await mailSender(
    enrolledStudent.email,
    "Payment Received",
    paymentSuccessEmail(
      enrolledStudent.firstName,
      amount_total,
      client_reference_id
    )
  );
  await enrollStudents(courses, userId, res);
    res.json({
        success : true,
        message : "Payment is successfully and student is enrolled",
        checkoutSessionCompleted
    })

 }
 catch(error)
 {
    console.log(error)
    return res.status(400).json({
        success : false,
        message : error.message
    })
 }

}

async function enrollStudents(courses, userId, res) {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses or userId",
    });
  }

  try {
    for (let courseId in courses) {
      const enrolledCourse = await course.findOneAndUpdate(
        { _id: courses[courseId] },
        { $push: { studentsEnrolled: userId },$inc :{sold : 1} },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
      const enrolledStudent = await user.findByIdAndUpdate(
        userId,
        { $push: { courses: courses[courseId] } },
        { new: true }
      );
      const newCourseProgress=await courseProgress.create({
        courseId : courses[courseId],
        userId : userId,
        
        completedVideos:[] ,
      })
      await user.findByIdAndUpdate(userId,{$push :{courseProgress : newCourseProgress._id}})
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          enrolledStudent.firstName
        )
      );
      console.log("Email sent Successfully");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { verifyPayment, capturePayment };
