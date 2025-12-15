import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const NewPassword = () => {
  const [controls, setControls] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => { 
    setControls({ ...controls, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    console.log(controls);
  };  
  return (
    <div className="parent  h-screen  ">
      <div  className="container flex justify-center  items-center gap-4 flex-col"  >
        <form onSubmit={handleSubmit} className="card min-w-[400px]  flex flex-col gap-4 items-center">
          <h1 className="text-3xl text-center font-medium mb-4">Reset Password</h1>

          <input type="password" placeholder="password" name="password" value={controls.password} onChange={handleChange} />
          <input type="cnfpassword" placeholder="confirm password" name="cnfpassword" value={controls.cnfpassword} onChange={handleChange} />

          <button className="btn w-full mt-4">Reset </button>
          
        </form>
        
      </div>
    </div>
  );
}

export default NewPassword