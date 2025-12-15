import axios from "axios";

const API_URL = process.env.Base_URL;


export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

