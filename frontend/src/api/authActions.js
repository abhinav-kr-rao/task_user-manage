// frontend/src/api/authActions.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/auth";

// --- ACTION 1: LOGIN ---
export const loginAction = async (email, password) => {
  try {
    console.log(
      "trying to login with email : ",
      email,
      "  password- ",
      password
    );
    const res = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });

    // console.log("response in loginAction is ", res);
    const currToken = res;
    console.log("tying to get token is", currToken);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);

      console.log("token", res.data.token);

      const decoded = jwtDecode(res.data.token);

      console.log("login successful");

      return { success: true, user: decoded };
    }

    console.log("error in loginAction");

    return { success: false, error: "No token received" };
  } catch (err) {
    console.log("error log in authActions", err);

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

    const res = await axios.post(`${BASE_URL}/signup`, formData);
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
