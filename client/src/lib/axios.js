import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
