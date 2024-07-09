
import React, { useState } from 'react';
import { GoDotFill } from "react-icons/go";
import Section from './Section';

const CourseContent = ({ data }) => {
  const sectionCount = data?.courseContent?.length || 0;
  const subSectionCount = data?.courseContent?.reduce((accumulator, currentValue) => accumulator + (currentValue.subSection?.length || 0), 0) || 0;
  const [collapse, setCollapse] = useState(false);

  const handleExpandAll = () => {
    setCollapse(true);
  };

  return (
    <div className='w-[62%]'>
      <div className="mb-[48px]">
        <h2 className="text-richblack-5 font-medium text-[30px] leading-[38px]">
          What you'll learn
        </h2>
        <div className="text-richblack-50 text-[14px] font-medium">
          {data?.whatYouWillLearn || "Loading..."}
        </div>
      </div>
      <h2 className="text-richblack-5 text-[24px] font-semibold">Course Content</h2> 
      <div className='flex flex-row justify-between mt-2 mb-4'>
        <div className='flex flex-row text-[14px] space-x-1 text-richblack-50 items-center'>
          <p>{sectionCount} {sectionCount <= 1 ? "section" : "sections"}</p>
          <GoDotFill />
          <p>{subSectionCount} {subSectionCount <= 1 ? "lecture" : "lectures"}</p>
          <GoDotFill />
          <p>7h 57m total length</p>
        </div>
        <div className='text-[14px] font-medium text-yellow-50'>
          <button onClick={handleExpandAll}>Collapse all sections</button>
        </div>
      </div>
      <div>
        {data?.courseContent?.map((sectionData, index) => (
          <Section key={index} section={sectionData} collapse={collapse} setCollapse={setCollapse} />
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-richblack-5 text-[24px] font-semibold">Author</h2>
        <div className="flex my-3 flex-row space-x-3 items-center">
          <img className="w-[50px] object-cover h-[50px] rounded-full" src={data?.instructor?.image || ""} alt="" />
          <div className="text-richblack-5 text-[16px] font-medium">
            {`${data?.instructor?.firstName || ""} ${data?.instructor?.lastName || ""}`}
          </div>
        </div>
        <div className="text-[14px] text-richblack-50">
          {data?.instructor?.additionalDetails?.about || ""}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
