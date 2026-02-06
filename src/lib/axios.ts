import axios from "axios";

export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || ""}/api`,
  withCredentials: true,
});

// Cache the token in memory to avoid calling the server for EVERY single post
let cachedToken: string | null = null;

/**
 * Fetches a CSRF token from the server
 */
export async function getCSRFToken() {
  if (cachedToken) return cachedToken;

  try {
    const response = await axios.get(
      "/api/method/chavara_booking.api.seat_lock.get_csrf_token",
      { withCredentials: true }
    );
    cachedToken = response.data.message;
    return cachedToken;
  } catch (err) {
    console.error("Fetch CSRF error", err);
    return null;
  }
}

// Interceptor to handle Tokens and Data Formatting
axiosClient.interceptors.request.use(async (config: any) => {
  if (config.method === "post") {
    // 1. Get Token
    const token = await getCSRFToken();
    if (token) {
      config.headers["X-Frappe-CSRF-Token"] = token;
    }

    // 2. Ensure data is formatted as Form Data for Frappe whitelisted methods
    if (config.data && typeof config.data === "object" && !(config.data instanceof URLSearchParams)) {
      const params = new URLSearchParams();
      Object.entries(config.data).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      config.data = params;
      // Set the header explicitly
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
  }
  return config;
});