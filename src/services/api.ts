/**
 * Interface for the nested Show Times / Schedules
 */
export interface EventSchedule {
  name: string;         // Unique ID of the schedule
  show_date: string;    // YYYY-MM-DD
  show_time: string;    // HH:mm:ss
  slot_capacity: number;
  status: string;       // "Open" or "Closed"
}

/**
 * Main Event Interface
 */
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
  schedules?: EventSchedule[]; // Added to handle the data from Event Schedule DocType
}

/**
 * Helper: Maps Frappe Chavara Event data to Frontend Types
 * This ensures your UI components always get clean data.
 */
const mapEvent = (ev: any): ChavaraEvent => ({
  id: ev.name,
  title: ev.event_title,
  startDate: ev.start_date,
  endDate: ev.end_date,
  venue: ev.venue || 'TBA',
  maxCapacity: ev.max_capacity || 0,
  day: ev.day,
  status: ev.status,
  description: ev.description || '',
  price: ev.price || 0,
  // If the backend sent schedules (for details page), include them here
  schedules: ev.schedules || [],
  // Handles the image path (proxy handles /files/ automatically)
  image: ev.event_image || '/placeholder-event.jpg',
});

/**
 * Fetch all published events (Used for List Pages/Home)
 */
export async function fetchEvents(search?: string): Promise<ChavaraEvent[]> {
  const url = `/api/method/chavara_booking.api.get_chavara_events${search ? `?search=${search}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch events list');
  
  const data = await response.json();
  return (data.message || []).map(mapEvent);
}

/**
 * Fetch single event with its specific show dates and times
 * (Used for the Event Detail Page)
 */
export async function fetchEventById(id: string): Promise<ChavaraEvent | null> {
  // Path matches your backend function get_event_details
  const url = `/api/method/chavara_booking.api.get_event_details?event_id=${encodeURIComponent(id)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorMsg = await response.text();
    console.error("Backend Error:", errorMsg);
    return null;
  }
  
  const data = await response.json();
  
  // data.message now contains the Event + the Schedules list from your Python logic
  return data.message ? mapEvent(data.message) : null;
}