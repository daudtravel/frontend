import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,  // Add this if you're using cookies
  headers: {
    'Content-Type': 'application/json'
  }
});