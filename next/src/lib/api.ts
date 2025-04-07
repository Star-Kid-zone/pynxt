'use client'
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.request.use((config) => {
//     if (typeof window !== "undefined") {
//       const cookieStr = document.cookie;
//       const jwtMatch = cookieStr.match(/(?:^|; )jwt=([^;]*)/);
//       const token = jwtMatch ? decodeURIComponent(jwtMatch[1]) : null;
  
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
  
//     return config;
//   });
  

export default api;
