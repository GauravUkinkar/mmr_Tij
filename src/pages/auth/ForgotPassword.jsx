import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

  const ForgotPassword = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState({
    email: "",
  });

  const handleChange = (e) => { 
    setControls({ ...controls, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    console.log(controls);
    navigate("/otp");
  };



  return (
   <>
   <div className="parent h-screen">
      <div className="container flex justify-center items-center gap-4 flex-col">
        <form onSubmit={handleSubmit} className="card min-w-[400px] flex flex-col gap-4 items-center">
          <h1 className="text-3xl text-center font-medium mb-4">Forgot Password</h1>

          <input type="email" placeholder="Email" name="email" value={controls.email} onChange={handleChange} />

          <button className="btn w-full mt-4">Send OTP</button>
        </form>
        <p>
        <Link to="/">back to login</Link>
        </p>
      </div>
    </div>
   
   
   
   </>
  )
}

export default ForgotPassword