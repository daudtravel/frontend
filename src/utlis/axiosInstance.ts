import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  // withCredentials: true,
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Debug: Log the token retrieval
    const token = localStorage.getItem("token");
    console.log("🔍 Token from localStorage:", token);
    console.log("🔍 Request URL:", config.url);
    console.log("🔍 Base URL:", config.baseURL);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added to headers");
    } else {
      console.log("❌ No token found in localStorage");
    }

    // Debug: Log final headers
    console.log("🔍 Final headers:", config.headers);

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - token might be expired or invalid");
      // Optional: Clear token and redirect
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Test function to verify token and setup
export const testTokenSetup = async () => {
  try {
    console.log("🧪 Testing token setup...");

    // Check localStorage directly
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);

    // Test with a protected route
    const response = await axiosInstance.get("/orders");
    console.log("✅ Protected route test successful:", response.data);

    return response;
  } catch (error) {
    console.error("❌ Protected route test failed:", error);
    throw error;
  }
};
