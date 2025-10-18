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

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    return response;
  },
  (error) => {
    console.error(
      "❌ Response error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
    }

    return Promise.reject(error);
  }
);

// Test function to verify token and setup
export const testTokenSetup = async () => {
  try {
    // Check localStorage directly
    const token = localStorage.getItem("token");

    // Test with a protected route
    const response = await axiosInstance.get("/orders");

    return response;
  } catch (error) {
    console.error("❌ Protected route test failed:", error);
    throw error;
  }
};
