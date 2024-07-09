import React from 'react'
import RatingStars from '../../../common/RatingStars'
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../../../slices/cartSlice';
const CartItem = ({data}) => {
    const dispatch=useDispatch()
  return (
    <div className='flex flex-row justify-between py-5 border-b border-richblack-700'>
        <div className='flex flex-row space-x-6'>
        <img src={data?.thumbnail} alt=""  className='rounded-lg w-[200px] h-[170px] object-cover'/>
        <div>
            <h2 className='text-richblack-5 mb-2 text-[18px] font-medium'>{data?.courseName}</h2>
            <p className='text-richblack-300 text-[16px]'>{data?.category?.name}</p>
           <div className='flex flex-row items-center space-x-2 mt-2'>
           <span className="text-yellow-100">4</span>
              <RatingStars Review_Count={4} Star_Size={20} />
           </div>
        </div>
        </div>
        <div className='flex flex-col space-y-5'>
            <button onClick={()=>dispatch(removeFromCart(data._id))} className='p-3 bg-richblack-800 border border-richblack-700 rounded-lg text-pink-200 space-x-2 font-medium text-[16px]  flex flex-row items-center'>
                <RiDeleteBin6Line size={20}/>
                <p>Remove</p>
            </button>
            <p className='text-yellow-50 text-[24px] font-semibold '>Rs. {data?.price}</p>
        </div>
    </div>
  )
}

export default CartItem