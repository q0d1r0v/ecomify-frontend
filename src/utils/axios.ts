// imports
import axios from "axios";

// base url
const ClientBaseURL = import.meta.env.VITE_APP_BASE_URL;
const AdminBaseURL = import.meta.env.VITE_APP_ADMIN_BASE_URL;

// client
export const client = axios.create({
  baseURL: ClientBaseURL,
  headers: {
    Accept: "application/json",
  },
});

// admin base url
export const admin = axios.create({
  baseURL: AdminBaseURL,
  headers: {
    Accept: "application/json",
  },
});

admin.interceptors.request.use((request: any) => {
  // access token
  const access_token = localStorage.getItem("access_token");

  // clear headers from request
  if (!request.headers) {
    request.headers = {};
  }

  // set token
  if (access_token) {
    request.headers.Authorization = `Bearer ${access_token}`;
  }

  return request;
});

// check to origin
admin.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response.status === 401) {
      localStorage.clear();
      location.reload();
    }
    return Promise.reject(error);
  }
);
