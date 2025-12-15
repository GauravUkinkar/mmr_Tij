import React, { useState, useEffect } from "react";
import { registerUser } from "../apis/userApis";

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const handleRegister = async () => {
      if (userData.name && userData.email && userData.password) {
        const response = await registerUser(userData);
        if (response.success) {
          setResponseMessage("Registration successful!");
        } else {
          setResponseMessage(response.message || "Registration failed.");
        }
      }
    };

    handleRegister();
  }, [userData]); // Trigger useEffect when userData changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger the useEffect by updating userData
    setUserData({ ...userData });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default SignUpPage;