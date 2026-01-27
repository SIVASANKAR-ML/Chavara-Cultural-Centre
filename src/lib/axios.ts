import axios from "axios";

// Helper to get the CSRF token from Frappe cookies
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export const axiosClient = axios.create({
  // If VITE_BACKEND_URL is empty, it results in "/api", which is perfect
  baseURL: `${import.meta.env.VITE_BACKEND_URL || ""}/api`,
  withCredentials: true, // Important for Frappe sessions
});

// Add the CSRF token to every request header
axiosClient.interceptors.request.use((config) => {
  const csrfToken = getCookie("sid"); // Or "last_site_status"
  if (csrfToken) {
    config.headers["X-Frappe-CSRF-Token"] = csrfToken;
  }
  return config;
});