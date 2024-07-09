import React from 'react'
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnectors';
import { catalogData } from '../api';

export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
  try{

    const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,{
        categoryId: categoryId
    });
        
    if(!response?.data?.success)
    throw new Error("Could not fetch category data")

    result = response?.data;
    console.log("result",result);


  }
  catch(error){
    console.log("Error in getting Category Page Data : ", error);
    toast.error(error.message);
    result = error.response?.data;
  }

  toast.dismiss(toastId);
  return result;
}

