import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from './CartItem'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { resetCart } from '../../../../slices/cartSlice'
const Cart = () => {
    const {cart,totalItems,total}=useSelector((state)=>state.cart)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    async function makePayment(){
    const stripe = await loadStripe('pk_test_51PNcvVP7v1jDSs7diwOdtxC4N1gBXuLwHyVWWsHLMNmb6e57z9KpsDv59Y6dtI1hr7TzTHzZSmILzD464UdtNDFU00Ns1R6NBf');
    const body={
        courses :cart.map((item)=>item._id)
    }
    const headers={
        'Content-Type':"application/json",
        Authorization :`Bearer ${token}`
    }
    const toastId=toast.loading("Loading...")
    const response=await fetch('http://localhost:4000/api/v1/payment/capturePayment',{
        method :"POST",
        headers : headers,
        body:JSON.stringify(body)
    })
    const {message}=await response.json()
    console.log(message.id)
    const result =stripe.redirectToCheckout({
        sessionId : message.id
    })
    if(result.error)
    console.log(result.error)
dispatch(resetCart())
    toast.dismiss(toastId)
     }

  return (
    <div className='w-full'>
     <div className='p-6'>
      <p className='text-[14px] leading-[22px] mb-3 text-richblack-300'>Home / Dashboard / <span className='capitalize text-yellow-50'>Cart</span></p>
     <h2 className='text-richblack-5 font-medium text-[30px] leading-[38px]'>My Cart</h2>
     </div>
     <div className='py-3 mx-6 border-b max-w-[1200px] border-richblack-700 text-[16px] font-semibold text-richblack-400'>
        {cart.length} {" "} Courses in Cart 
     </div>
    {
        cart.length>0 &&  <div className='flex flex-row ml-6 max-w-[1200px]  justify-between '>
        <div className='w-[70%]'>
            {
                cart.map((item,index)=>{
                    return <CartItem key={index} data={item}/>
                })
            }
        </div>
        <div className='p-6 h-fit w-[25%] bg-richblack-800 rounded-lg border border-richblack-700 mt-6'>
            <p className='text-richblack-200 text-[14px] font-semibold '>Total: </p>
            <p className='text-yellow-50 font-semibold my-1 '>Rs. {total}</p>
            <button className='py-3 mt-4 rounded-lg px-6 text-center text-richblack-900 bg-yellow-50 text-[16px] font-medium w-full' onClick={makePayment}>
                Buy Now
            </button>
        </div>
     </div>
    }
    </div>
  )
}

export default Cart