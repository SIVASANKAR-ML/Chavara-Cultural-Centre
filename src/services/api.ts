import { axiosClient } from "@/lib/axios";

/* =========================
   Types & Interfaces
========================= */

export interface RowPricing {
  row_from: string;
  row_to: string;
  price: number;
}

export interface EventSchedule {
  name: string;
  show_date: string;
  show_time: string;
  slot_capacity: number;
  status: string;
  row_wise_pricing: RowPricing[]; // NEW: Added row pricing
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

const mapEvent = (ev: any): ChavaraEvent => {
  console.log('=== mapEvent called ===');
  console.log('Raw event data:', ev);
  console.log('Raw schedules:', ev.schedules);
  
  if (ev.schedules) {
    ev.schedules.forEach((sched: any, idx: number) => {
      console.log(`\nSchedule ${idx}:`, {
        name: sched.name,
        raw_row_wise_pricing: sched.row_wise_pricing,
        pricing_is_array: Array.isArray(sched.row_wise_pricing),
        pricing_length: sched.row_wise_pricing?.length,
        full_schedule: sched,
        keys: Object.keys(sched)
      });
    });
  }
  
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
    schedules: ev.schedules?.map((schedule: any) => {
      // IMPORTANT: Access row_wise_pricing safely and preserve it
      const pricing = schedule.row_wise_pricing;
      console.log(`Mapping schedule ${schedule.name}:`, {
        raw_pricing: pricing,
        is_array: Array.isArray(pricing),
        length: pricing?.length
      });
      
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
  
  console.log('Mapped event:', mapped);
  console.log('Mapped schedules with pricing:', 
    mapped.schedules.map(s => ({
      name: s.name, 
      pricing_count: s.row_wise_pricing.length,
      pricing: s.row_wise_pricing
    }))
  );
  console.log('=== mapEvent complete ===\n');
  
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

    console.log('fetchEvents raw response:', response.data.message);
    
    // IMPORTANT: Deep clone to prevent mutation
    const clonedData = JSON.parse(JSON.stringify(response.data.message || []));
    console.log('fetchEvents cloned data:', clonedData);
    
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

    console.log('Raw API response for event:', response.data.message);
    console.log('Schedules from API:', response.data.message?.schedules);
    
    // Log each schedule's row_wise_pricing
    if (response.data.message?.schedules) {
      response.data.message.schedules.forEach((sched: any, idx: number) => {
        console.log(`Schedule ${idx} (${sched.name}):`, {
          name: sched.name,
          row_wise_pricing: sched.row_wise_pricing,
          keys: Object.keys(sched)
        });
      });
    }
    
    // IMPORTANT: Deep clone to prevent mutation
    const clonedData = JSON.parse(JSON.stringify(response.data.message));
    console.log('Cloned data schedules:', clonedData?.schedules);
    
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