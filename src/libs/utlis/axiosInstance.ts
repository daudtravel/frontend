import axios from "axios";


// export  const axiosInstance = axios.create({
//     baseURL: 'http://localhost:3000/api', 
//     withCredentials: true, 
//   });

export  const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, 
  withCredentials: true, 
});