import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Otp = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: "",
  });

  const handleChange = (e) => {
    setControls({ ...controls, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(controls);
    // TODO: Add OTP sending logic here
    // navigate("/verify-otp"); // Navigate to OTP verification page after sending
  };


  const handleResend = () => {
    console.log("Resending OTP");
  };

  



  return (
    <div className="parent h-screen">
      <div className="container flex justify-center items-center gap-4 flex-col">
        <form
          onSubmit={handleSubmit}
          className="card min-w-[400px] flex flex-col gap-4 items-center"
        >
          <h1 className="text-3xl text-center font-medium mb-4">Enter OTP</h1>

          <div className="flex gap-2 otp-input"> 
            <input
              type="text"
              name="otp1"  
              value={controls.otp1}
              onChange={handleChange}
              minLength={1}
              maxLength={1}
            />
            <input
              type="text"
              name="otp2"
              value={controls.otp2}
              onChange={handleChange}
              minLength={1}
              maxLength={1}
            />
            <input
              type="text"
              name="otp3"
              value={controls.otp3}
              onChange={handleChange}
              minLength={1}
              maxLength={1}
            />{" "}
            <input
              type="text"
              name="otp4"
              value={controls.otp4}
              onChange={handleChange}
                minLength={1}
              maxLength={1}
            />{" "}
            <input
              type="text"
              name="otp5"
              value={controls.otp5}
              onChange={handleChange}
              minLength={1}
              maxLength={1}
            />{" "}
            <input
              type="text"
              name="otp6"
              value={controls.otp6}
              onChange={handleChange}
              minLength={1}
              maxLength={1}
            />
          </div>

          <button type="submit" className="btn w-full mt-4">
            Verify OTP
          </button>
        </form>
        <p>unable to receive OTP? <a className="txt-link" onClick={handleResend}>Resend OTP</a></p>
      </div>
    </div>
  );
};

export default Otp;
