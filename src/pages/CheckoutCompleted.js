import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import Spinner from '../utils/Spinner';
const CheckoutCompleted = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sessionId=searchParams.get("session_id")
    const navigate=useNavigate()
    const {token}=useSelector((store)=>store.auth)


    const BASE_URL = 'http://localhost:4000/api/v1'; // Replace with your actual base URL

    async function verifyPayments(){
        const body={
            sessionId : sessionId
        }
        const headers={
            'Content-Type':"application/json",
            Authorization :`Bearer ${token}`
        }
        const response=await fetch(`${BASE_URL}/payment/verifyPayment`,{
            method :"POST",
            headers : headers,
            body:JSON.stringify(body)
        })
        const data=await response.json()
        if(data.success===false)
        {
            toast.error("Payment failed")
            navigate("/")
        }
        toast.success(data.message)
        navigate('/dashboard/enrolled-courses')
    }
    useEffect(()=>{
      verifyPayments()
    },[searchParams])
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl mb-4">Your Payment is Processing</h2>
        <div className="flex items-center justify-center">
         <Spinner/>
          <p className="ml-4">Please wait while we verify your payment...</p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCompleted