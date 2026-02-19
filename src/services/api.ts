import { axiosClient } from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

declare var Razorpay: any;

/* =========================
   Types & Interfaces
========================= */

export interface RowPricing {
  row_from: string;
  row_to: string;
  price: number;
}


export interface HostDetail {
  host_name: string;
  host_image: string;
  discription: string; // Matching your DB spelling
}

export interface EventSchedule {
  name: string;
  show_date: string;
  show_time: string;
  slot_capacity: number;
  status: string;
  row_wise_pricing: RowPricing[];
}

export interface ChavaraEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  maxCapacity: number;
  image: string;
  day: string;
  status: string;
  description: string;
  price: number;
  schedules?: EventSchedule[];
  // host_name?: string;
  // host_img?: string;
  // host_description?: string;
  hosts: HostDetail[]; // NEW: Updated to array
}

interface FrappeResponse<T> {
  message: T;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  customer?: string;
  seats?: string;
  event?: string;
}
/* =========================
   Mappers
========================= */

const mapEvent = (ev: any): ChavaraEvent => {
  const mapped = {
    id: ev.name,
    title: ev.event_title,
    startDate: ev.start_date,
    endDate: ev.end_date,
    venue: ev.venue || "TBA",
    maxCapacity: ev.max_capacity || 0,
    day: ev.day,
    status: ev.status,
    description: ev.description || "",
    price: ev.price || 0,
    image: ev.event_image || "/placeholder-event.jpg",
    
    // NEW: Map the host_details child table array
    hosts: ev.host_details?.map((h: any) => ({
      host_name: h.host_name,
      host_image: h.host_image,
      discription: h.discription // Matches the DB field name typo
    })) || [],

    schedules: ev.schedules?.map((schedule: any) => {
      const pricing = schedule.row_wise_pricing;
      
      return {
        name: schedule.name,
        show_date: schedule.show_date,
        show_time: schedule.show_time,
        slot_capacity: schedule.slot_capacity,
        status: schedule.status,
        // Ensure we keep the array, even if empty
        row_wise_pricing: Array.isArray(pricing) ? pricing : [],
      };
    }) || [],
  };
  
  return mapped;
};

/* =========================
   API Functions
========================= */

/** Fetch all events */
export async function fetchEvents(
  search?: string
): Promise<ChavaraEvent[]> {
  try {
    const response = await axiosClient.get<
      FrappeResponse<any[]>
    >("/method/chavara_booking.api.api.get_chavara_events", {
      params: search ? { search } : {},
    });

    // IMPORTANT: Deep clone to prevent mutation
    const clonedData = JSON.parse(JSON.stringify(response.data.message || []));
    
    return clonedData.map(mapEvent);
  } catch (error) {
    console.error("fetchEvents error:", error);
    return [];
  }
}

/** Fetch single event details */
export async function fetchEventById(
  id: string
): Promise<ChavaraEvent | null> {
  try {
    const response = await axiosClient.get<
      FrappeResponse<any>
    >("/method/chavara_booking.api.api.get_event_details", {
      params: { event_id: id },
    });

    // IMPORTANT: Deep clone to prevent mutation
    const clonedData = JSON.parse(JSON.stringify(response.data.message));
    
    return clonedData
      ? mapEvent(clonedData)
      : null;
  } catch (error) {
    console.error("fetchEventById error:", error);
    return null;
  }
}

/** Create booking */
export async function createBooking(bookingData: {
  eventId: string;
  scheduleId: string;
  customerName: string;
  phone: string;
  email: string;
  selectedSeats: string[];
  totalAmount: number;
}) {
  const response = await axiosClient.post<
    FrappeResponse<any>
  >("/method/chavara_booking.api.booking.create_booking", {
    event_id: bookingData.eventId,
    schedule_id: bookingData.scheduleId,
    customer_name: bookingData.customerName,
    phone: bookingData.phone,
    email: bookingData.email,
    selected_seats: bookingData.selectedSeats.join(","),
    total_amount: bookingData.totalAmount,
  });

  return response.data.message;
}

/** Get booking details */
export async function getBookingDetails(bookingId: string) {
  const response = await axiosClient.get<
    FrappeResponse<any>
  >("/method/chavara_booking.api.booking.get_booking_details", {
    params: { booking_id: bookingId },
  });

  return response.data.message;
}

/** Get already booked seats */
export async function getBookedSeats(
  eventId: string,
  scheduleId: string
) {
  const response = await axiosClient.get<
    FrappeResponse<string[]>
  >("/method/chavara_booking.api.booking.get_booked_seats", {
    params: {
      event_id: eventId,
      schedule_id: scheduleId,
    },
  });

  return response.data.message || [];
}

/** Lock seats temporarily */
export async function lockSeats(
  eventId: string,
  scheduleId: string,
  seats: string[],
  recaptchaToken?: string
){
  try {
    const response = await axiosClient.post<
      FrappeResponse<any>
    >("/method/chavara_booking.api.seat_lock.lock_seats", {
      event_id: eventId,
      schedule_id: scheduleId,
      seats: seats.join(","),
      recaptcha_token: recaptchaToken
    });

    const result = response.data.message;
    
    // Handle failed seats
    if (result.failed_seats && result.failed_seats.length > 0) {
      console.warn("Some seats failed to lock:", result.failed_seats);
      toast.warning(`Some seats unavailable: ${result.failed_seats.join(", ")}`);
    }
    
    return result;
  } catch (error: any) {
    console.error("lockSeats error:", error);
    throw error;
  }
}

/** Get locked seats */
export async function getLockedSeats(scheduleId: string) {
  try {
    const response = await axiosClient.get<
      FrappeResponse<string[]>
    >("/method/chavara_booking.api.seat_lock.get_locked_seats", {
      params: { schedule_id: scheduleId },
    });

    return response.data.message || [];
  } catch (error) {
    console.error("getLockedSeats error:", error);
    return [];
  }
}


/** NEW: Release seat locks when user deselects them */
export async function releaseMyLocks(scheduleId: string, seats: string[]) {
  try {
    if (seats.length === 0) return { success: true };
    
    const response = await axiosClient.post<
      FrappeResponse<any>
    >("/method/chavara_booking.api.seat_lock.release_my_locks", {
      schedule_id: scheduleId,
      seats: seats.join(",")
    });

    return response.data.message;
  } catch (error) {
    console.error("releaseMyLocks error:", error);
    return { success: false };
  }
}

/**
 * Fetches a CSRF token from the server.
 * This is REQUIRED for the login POST request to work.
 */
export async function ensureCSRFToken() {
  try {
    const response = await axios.get('/api/method/chavara_booking.api.seat_lock.get_csrf_token', { withCredentials: true });
    const token = response.data.message;
    if (token) {
      axiosClient.defaults.headers.common['X-Frappe-CSRF-Token'] = token;
    }
    return token;
  } catch (error) {
    console.error("CSRF Fetch Error:", error);
    return null;
  }
}

/**
 * Checks if the currently logged-in user has scanning permissions.
 */
export async function checkScannerAccess(): Promise<boolean> {
  try {
    const response = await axiosClient.get("/method/chavara_booking.api.ticket_verification.check_scanner_access");
    return response.data.message === true;
  } catch (error: any) {
    // 403 is expected for guest/non-staff users — not a real error
    if (error?.response?.status !== 403) {
      console.error("checkScannerAccess error:", error);
    }
    return false;
  }
}

/* =========================
   Existing Functions
========================= */

export async function login(usr: string, pwd: string) {
  // Pass a simple object. The interceptor will turn this into Form Data.
  const response = await axiosClient.post("/method/login", {
    usr: usr,
    pwd: pwd,
  });
  
  if (response.status === 200) {
    localStorage.setItem("user_id", response.data.full_name || usr);
    return response.data;
  }
  return null;
}
export async function logout() {
  await axiosClient.post("/method/logout");
  localStorage.clear();
  window.location.href = "/login";
}

export async function verify_and_log_entry(
  qrString: string
): Promise<VerificationResponse> {
  // We explicitly create the form data here to ensure no mismatch
  const params = new URLSearchParams();
  params.append("qr_string", qrString); 

  const response = await axiosClient.post<FrappeResponse<VerificationResponse>>(
    "/method/chavara_booking.api.ticket_verification.verify_and_log_entry",
    params
  );

  return response.data.message;
}

declare var Razorpay: any;


// Helper to load external scripts in React
const loadRazorpayScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};


declare var Razorpay: any;

export async function initiateRazorpayPayment(bookingId: string, customerData: any, navigate: any) {
  const isScriptLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!isScriptLoaded) {
    toast.error("Razorpay SDK failed to load.");
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append("booking_id", bookingId);

    const orderRes = await axiosClient.post("/method/chavara_booking.api.payment.create_rzp_order", params);
    
    // 1. DESTUCTURE THE RESPONSE
    const { order, gateway_key } = orderRes.data.message;

    const options = {
      // 2. USE THE DYNAMIC KEY
      key: gateway_key, 
      amount: order.amount,
      currency: "INR",
      name: "Chavara Cultural Centre",
      description: `Booking #${bookingId}`,
      order_id: order.id,
      handler: async function (response: any) {
        const verifyParams = new URLSearchParams();
        verifyParams.append("rzp_response", JSON.stringify(response));
        verifyParams.append("booking_id", bookingId);

        const verifyRes = await axiosClient.post("/method/chavara_booking.api.payment.verify_payment", verifyParams);

        if (verifyRes.data.message.success) {
          // Confirm seat locks with payment_id
          await axiosClient.post("/method/chavara_booking.api.seat_lock.confirm_seat_lock_after_booking", {
            schedule_id: order.receipt,
            seats: customerData.seats,
            payment_id: response.razorpay_payment_id
          });
          
          toast.success("Payment Successful!");
          setTimeout(() => {
            toast.success("Check Email for Ticket Details!");
          }, 2000); 
          navigate(`/booking-confirmation/${bookingId}`);
        } else {
          toast.error("Security check failed");
        }
      },
      prefill: {
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone
      },
      theme: { color: "#F97316" }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (error: any) {
    console.error("Razorpay Error:", error);
    toast.error("Could not start payment.");
  }
}

export async function createAdminBooking(bookingData: {
  eventId: string;
  scheduleId: string;
  customerName: string;
  phone: string;
  email: string;
  selectedSeats: string[];
  totalAmount?: number;
}) {
  const response = await axiosClient.post("/method/chavara_booking.api.booking.create_admin_booking", {
    event_id: bookingData.eventId,
    schedule_id: bookingData.scheduleId,
    customer_name: bookingData.customerName,
    phone: bookingData.phone,
    email: bookingData.email,
    selected_seats: bookingData.selectedSeats.join(","),
  });

  return response.data.message;
}