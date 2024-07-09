const RatingAndReview = require("../models/RatingAndReview");
const User = require('../models/User');
const Course = require("../models/Course");
const mongoose = require("mongoose");


exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        },
        );

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message:'Student is not enrolled in the course',
            })
        };

        const alreadyReviewed  = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        });

        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Course already reviewed"
            })
        };

        const ratingReview = await RatingAndReview.create({
            rating, review,
            user:userId,
            course:courseId
        });

       const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push:{
                    ratingsAndReviews:ratingReview._id,
                }
            },
            {new:true}
        );
        console.log(updatedCourseDetails);

        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview
        })
    }
    catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


//get avg rating

exports.getAverageRating = async(req, res)=>{
    try{
        const courseId = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ]);


        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating:result[0].averageRating
            })
        };

        return res.status(200).json({
            success:true,
            message:"Average rating is 0 , no rating given till now",
            averageRating:0
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


//get all rating and reviews

exports.getAllRating = async(req, res)=>{
    try{
        const allRating = await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName"
                                })
                                .exec();
        
        return res.status(200).json({
            success:true,
            message:"All rating and reviews fetched successfully",
            data:allRating
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}