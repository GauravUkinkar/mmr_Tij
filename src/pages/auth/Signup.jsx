import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {

  const [controls, setControls] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setControls({ ...controls, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    console.log(controls);
  };

  return (
    <>
      <div className="parent h-screen">
        <div className="container flex justify-center items-center gap-4 flex-col">
          <form onSubmit={handleSubmit} className="card min-w-[400px] flex flex-col gap-4 items-center">
            <h1 className="text-3xl text-center font-medium mb-4">Sign Up</h1>

            <input type="text" placeholder="Full Name" name="fullName" value={controls.fullName} onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" value={controls.email} onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" value={controls.password} onChange={handleChange} />
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={controls.confirmPassword} onChange={handleChange} />

            <button className="btn w-full mt-4">Sign Up</button>
          </form>
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
