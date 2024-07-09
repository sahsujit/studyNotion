import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { getCourseDetails } from "../services/operations/courseAPI";
import RatingStars from "../components/common/RatingStars";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BsGlobe } from "react-icons/bs";
import {formattedDate} from "../utils/dateFormatter";
import CourseContent from "../components/core/CourseDetailsPage/CourseContent";
import AddToCart from "../components/core/CourseDetailsPage/AddToCart";
import { CircularProgress } from "@mui/material";
// import axios from "axios";
import GetAvgRating from "../utils/avgRating"

import { courseEndpoints } from "../services/api";
// import ReviewSlider from "../components/common/ReviewSlider";
import Spinner from "../utils/Spinner";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import Footer from "../components/common/Footer";
const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loadings, setLoading] = useState(false);
  async function getCourseDetails() {
    setLoading(true);
    const response = await fetchCourseDetails(courseId);
    if (response) setCourseDetails(response.data);
    setLoading(false);
  }
  useEffect(() => {
    setCourseDetails(null)
    getCourseDetails();
  }, [courseId]);

  const [reviewData,setReviewData]=useState(null)
  // const fetchReview= async ()=>{
  
  //  try {
  //   let response =await axios.get(courseEndpoints.GET_ALL_RATING_API) 
  //   if(response.data.success)
  //   {
  //     console.log(response.data.allRatings.filter((item)=>item.course?._id===courseId))

  //     setReviewData(response.data.allRatings.filter((item)=>item.course?._id===courseId))
  //   }
  //  } catch (error) {
  //   console.log(error)
  //  }
    
  // } 

  useEffect(() => {
    const count = GetAvgRating(courseDetails?.data?.courseDetails.ratingAndReviews)
    setReviewData(count)
  }, [courseDetails])

  // useEffect(()=>{
  //   if(courseDetails)
  //   fetchReview()
  // },[courseDetails])

  if (courseDetails === null) return 
  <div className="flex justify-center items-center">
  <Spinner></Spinner>
</div>;

  return (
    <div>
      
      <section className="bg-richblack-800">
        <div className="max-w-[1200px] mx-auto py-8">
          <div className="flex flex-col space-y-3 w-[62%]">
            <h2 className="text-richblack-5 font-medium text-[30px] leading-[38px]">
              {courseDetails.courseName}
            </h2>
            <p className="text-richblack-200 text-[16x]">
              {courseDetails.courseDescription}
            </p>

            <div className="flex flex-row items-center space-x-2 text-[18px] ">
              <span className="text-yellow-100">4</span>
              <RatingStars Review_Count={4} Star_Size={20} />
              <span className="text-richblack-25">{`(450 ratings)`}</span>
              <span className="text-richblack-25">349,343 students</span>
            </div>
            <div>
              <p className="text-richblack-25">
                Created By {" "}
                {`${courseDetails.instructor.firstName }
                 
                  ${courseDetails.instructor.lastName}`}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-3">
              <div className="text-[18px] flex flex-row items-center  text-richblack-25">
                <IoIosInformationCircleOutline size={20} />
                <p className="ml-2">
                  Created at {formattedDate(courseDetails.createdAt)}
                </p>
              </div>
              <div className="text-[18px] flex flex-row items-center text-richblack-25">
                <BsGlobe size={16} />
                <p className="ml-2">English</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-richblack-900 pt-8">
      <div className="max-w-[1200px] mx-auto">
          
          
           <div className="flex flex-row space-x-6 justify-between">
           <CourseContent data={courseDetails}></CourseContent>
           <AddToCart data={courseDetails}/>
           </div>
        </div>
      </section>

      <Footer/>
      {/* <div className="max-w-[1200px] mx-auto mt-8 pb-[90px]">
          <h2 className="text-center text-richblack-5 leading-[44px] mb-10 text-[36px] font-semibold">
            Reviews from other learners
          </h2>
          {
            reviewData===null ? 
            <div className="flex justify-center items-center">
              <CircularProgress/>
            </div>
            : reviewData.length===0 ? <div className="text-richblack-5 text-center text-2xl">No reviews found</div>
            : <ReviewSlider data={reviewData}/>
          }
          <div>

          </div>
        </div> */}
    </div>
  );
};

export default CourseDetails;
