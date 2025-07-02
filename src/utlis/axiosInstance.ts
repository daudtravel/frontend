import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "http://localhost:3001/api",
// });

export const axiosInstance = axios.create({
  baseURL: "https://api.daudtravel.com/api",
  withCredentials: true,
});
