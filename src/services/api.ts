export interface ChavaraEvent {
  id: string;               // maps from 'name'
  title: string;            // maps from 'event_title'
  startDate: string;        // maps from 'start_date'
  endDate: string;          // maps from 'end_date'
  venue: string;
  maxCapacity: number;      // maps from 'max_capacity'
  image: string;            // maps from 'event_image'
  day: string;
  status: string;
  description: string;
}

/**
 * Helper: Maps Frappe Chavara Event to Frontend Interface
 */
const mapEvent = (ev: any): ChavaraEvent => ({
  id: ev.name,
  title: ev.event_title,
  startDate: ev.start_date,
  endDate: ev.end_date,
  venue: ev.venue,
  maxCapacity: ev.max_capacity || 0,
  day: ev.day,
  status: ev.status,
  description: ev.description || '',
  // Handles the image path (proxy handles /files/...)
  image: ev.event_image || '/placeholder-event.jpg',
});

export async function fetchEvents(search?: string): Promise<ChavaraEvent[]> {
  const url = `/api/method/chavara_booking.api.get_chavara_events${search ? `?search=${search}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch events');
  
  const data = await response.json();
  return (data.message || []).map(mapEvent);
}

export async function fetchEventById(id: string): Promise<ChavaraEvent | null> {
  const url = `/api/method/chavara_booking.api.get_event_details?event_id=${encodeURIComponent(id)}`;
  const response = await fetch(url);
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return data.message ? mapEvent(data.message) : null;
}