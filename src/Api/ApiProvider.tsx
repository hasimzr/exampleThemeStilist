"use client";

import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { DEVELOPER_SITE, BASE_URL } from "./ApiConstants";

interface ApiProviderProps {
  children: React.ReactNode;
}

// Global configuration
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Developer-Site"] = DEVELOPER_SITE;

/**
 * Interceptor setup logic.
 * We initialize it outside the component so it's ready as soon as the module is imported on the client.
 */
const initializeInterceptors = () => {
  if (typeof window === "undefined") return;

  // Add the request interceptor
  axios.interceptors.request.use((config) => {
    const currentUser = localStorage.getItem("currentUser");
    let token: string | null = currentUser
      ? JSON.parse(currentUser).token
      : null;

    // Fallback to standalone token if not in currentUser
    if (!token) {
      token = localStorage.getItem("token");
    }

    const langCode = localStorage.getItem("currentLanguageCode");
    if (langCode) {
      config.headers["Accept-Language"] = langCode;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Add the response interceptor
  axios.interceptors.response.use((response) => {
    if (response?.data?.token) {
      localStorage.setItem("token", response?.data?.token);
    }
    return response;
  }, (error) => {
    if (error.response) {
      const { data } = error.response;
      const errorMessage = data?.message || data?.errorCode || "Bir hata oluştu";
      
      // Toast notice
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #ef4444',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("İşlem sırasında beklenmedik bir hata oluştu.");
    }
    return Promise.reject(error);
  });
};

// Execute initialization immediately on client load
if (typeof window !== "undefined") {
  // Simple check to avoid double-binding in development HMR
  if (!(axios.interceptors.request as any).handlers?.length) {
    initializeInterceptors();
  }
}

const ApiProvider: React.FC<ApiProviderProps> = (props) => {
  return <>{props.children}</>;
};

export default ApiProvider;