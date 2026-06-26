import axios from "axios";

const API = axios.create({
  baseURL: "https://job-tracker-jmf6.onrender.com",
  withCredentials: true,
});

export default API;