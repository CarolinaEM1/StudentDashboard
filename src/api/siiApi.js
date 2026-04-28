import axios from "axios";

const siiApi = axios.create({
  baseURL: "/sii-api",
});

siiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default siiApi;