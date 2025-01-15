import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: '/api', // This will work with your Next.js rewrites
  // other config...
});