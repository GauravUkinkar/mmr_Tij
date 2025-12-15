import React from 'react'
import notFound from '../assets/404-3.gif'
import { Link, useNavigate } from 'react-router-dom'
const Four04 = () => {
    const navigate = useNavigate()
  return (
    <div className="parent h-screen bg-white"> 
      <div className="container flex flex-col items-center justify-center gap-2">
        <img src={notFound} alt="404" className='w-[300px]' />
        <h1 className="text-4xl font-bold">404</h1>
        <p >Oops...! something went wrong</p>
       <div className="flex gap-2" >
        <button className="btn" onClick={() => navigate(-1)}>Go Back</button>
        <Link to="/" className="btn">Go Home</Link>
       </div>
      </div>
    </div>
  )
}

export default Four04
