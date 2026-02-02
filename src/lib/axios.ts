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
    // 1. Handle CSRF Token
    const token = await getCSRFToken();
    if (token) {
      config.headers["X-Frappe-CSRF-Token"] = token;
    }

    // 2. Handle Data Formatting (Fixes the Content-Length: 0 issue)
    // We only transform if data is a plain object. 
    // If it's already URLSearchParams or FormData, we leave it alone.
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof URLSearchParams) &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(config.data)) {
        // Convert arrays or objects to strings so Frappe can read them
        const val = typeof value === "object" ? JSON.stringify(value) : String(value);
        params.append(key, val);
      }
      config.data = params;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});