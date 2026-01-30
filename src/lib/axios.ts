import axios from "axios";

export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || ""}/api`,
  withCredentials: true,
});

/**
 * Fetches a CSRF token from the server since 'sid' is HttpOnly
 */
export async function getCSRFToken() {
  try {
    const response = await axios.get(
      "/api/method/chavara_booking.api.seat_lock.get_csrf_token",
      { withCredentials: true }
    );
    return response.data.message;
  } catch (err) {
    console.error("Fetch CSRF error", err);
    return null;
  }
}

axiosClient.interceptors.request.use(async (config) => {
  // Only need token for POST requests
  if (config.method === "post") {
    const token = await getCSRFToken();
    if (token) {
      config.headers["X-Frappe-CSRF-Token"] = token;
    }

    // Convert to Form Data for Frappe
    if (config.data && typeof config.data === "object") {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      const params = new URLSearchParams();
      Object.entries(config.data).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      config.data = params;
    }
  }
  return config;
});