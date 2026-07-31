import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({setIsLogin}) => {
  const [error, setError] = useState({});
  const [controls, setControls] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleValidation = (values) => {
    let errors = {};

    if (!values.email.trim()) {
      errors.email = "Please enter a valid email.";
    }

    if (!values.password.trim()) {
      errors.password = "Please enter a valid password.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setControls({ ...controls, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = handleValidation(controls);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
     
        const response = await axios.post(
          `${import.meta.env.VITE_PORT_FRONTEND}api/user/login`,
          controls
        );

        if (response.status === 200) {
          toast.success("Login successful!");
       
          localStorage.setItem("login" , true);
          setIsLogin(true);
          navigate("/");
        }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    }
  };
  

  return (
    <div className="parent h-screen">
      <div className="container flex justify-center items-center gap-4 flex-col">
        <form
          onSubmit={handleSubmit}
          className="card min-w-[400px] flex flex-col gap-4 items-center"
        >
          <h1 className="text-3xl text-center font-medium mb-4">Login</h1>

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={controls.email}
            onChange={handleChange}
          />
          {error.email && (
            <span className="text-red-500 text-sm">{error.email}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={controls.password}
            onChange={handleChange}
          />
          {error.password && (
            <span className="text-red-500 text-sm">{error.password}</span>
          )}

          <button type="submit" className="btn w-full mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
