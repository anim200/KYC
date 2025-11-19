// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: false, // change to true if using cookies later
});
