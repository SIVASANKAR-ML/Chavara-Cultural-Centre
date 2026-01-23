import { axiosClient } from "@/lib/axios";

/* =========================
   Types & Interfaces
========================= */

export interface EventSchedule {
  name: string;
  show_date: string;
  show_time: string;
  slot_capacity: number;
  status: string;
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
}

interface FrappeResponse<T> {
  message: T;
}

/* =========================
   Mappers
========================= */

const mapEvent = (ev: any): ChavaraEvent => ({
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
  schedules: ev.schedules || [],
  image: ev.event_image || "/placeholder-event.jpg",
});

/* =========================
   API Functions
========================= */

/** Fetch all events */
export async function fetchEvents(
  search?: string
): Promise<ChavaraEvent[]> {
  const response = await axiosClient.get<
    FrappeResponse<any[]>
  >("/method/chavara_booking.api.api.get_chavara_events", {
    params: search ? { search } : {},
  });

  return (response.data.message || []).map(mapEvent);
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

    return response.data.message
      ? mapEvent(response.data.message)
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
  seats: string[]
) {
  const response = await axiosClient.post<
    FrappeResponse<any>
  >("/method/chavara_booking.api.seat_lock.lock_seats", {
    event_id: eventId,
    schedule_id: scheduleId,
    seats: seats.join(","),
  });

  return response.data.message;
}

/** Get locked seats */
export async function getLockedSeats(scheduleId: string) {
  const response = await axiosClient.get<
    FrappeResponse<string[]>
  >("/method/chavara_booking.api.seat_lock.get_locked_seats", {
    params: { schedule_id: scheduleId },
  });

  return response.data.message || [];
}
