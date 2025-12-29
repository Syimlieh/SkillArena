"use client";

import axios from "axios";

const apiClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => config);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Network error. Please try again.";
    error.message = normalizedMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
