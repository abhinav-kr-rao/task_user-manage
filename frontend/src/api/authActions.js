// frontend/src/api/authActions.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/auth";

// --- ACTION 1: LOGIN ---
export const loginAction = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });

    if (res.data.token) {
      // Save to LocalStorage here (Clean Separation)
      localStorage.setItem("token", res.data.token);

      // Decode and return the user data so React can use it
      const decoded = jwtDecode(res.data.token);
      return { success: true, user: decoded };
    }

    return { success: false, error: "No token received" };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Login failed",
    };
  }
};

// --- ACTION 2: SIGNUP ---
export const signupAction = async (formData) => {
  try {
    console.log("Trying to singup");

    const res = await axios.post(`${API_URL}/signup`, formData);
    console.log("receives ", res);

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Signup failed",
    };
  }
};

// --- ACTION 3: LOGOUT ---
export const logoutAction = () => {
  // Pure logic: just clear the storage
  localStorage.removeItem("token");
};
