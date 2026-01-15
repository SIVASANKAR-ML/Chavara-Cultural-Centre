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
  schedules: ev.schedules || [],
  image: ev.event_image || '/placeholder-event.jpg',
});

export async function fetchEvents(search?: string): Promise<ChavaraEvent[]> {
  const url = `/api/method/chavara_booking.api.get_chavara_events${search ? `?search=${search}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch events list');
  
  const data = await response.json();
  return (data.message || []).map(mapEvent);
}

export async function fetchEventById(id: string): Promise<ChavaraEvent | null> {
  const url = `/api/method/chavara_booking.api.get_event_details?event_id=${encodeURIComponent(id)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorMsg = await response.text();
    console.error("Backend Error:", errorMsg);
    return null;
  }
  
  const data = await response.json();
  return data.message ? mapEvent(data.message) : null;
}

export async function createBooking(bookingData: {
  eventId: string;
  scheduleId: string;
  customerName: string;
  phone: string;
  email: string;
  selectedSeats: string[];
  totalAmount: number;
}) {
  const formData = new FormData();
  formData.append('event_id', bookingData.eventId);
  formData.append('schedule_id', bookingData.scheduleId);
  formData.append('customer_name', bookingData.customerName);
  formData.append('phone', bookingData.phone);
  formData.append('email', bookingData.email);
  formData.append('selected_seats', bookingData.selectedSeats.join(','));
  formData.append('total_amount', bookingData.totalAmount.toString());
  
  const response = await fetch('/api/method/chavara_booking.api.create_booking', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) throw new Error('Failed to create booking');
  
  const data = await response.json();
  return data.message;
}

export async function getBookingDetails(bookingId: string) {
  const response = await fetch(`/api/method/chavara_booking.api.get_booking_details?booking_id=${encodeURIComponent(bookingId)}`);
  
  if (!response.ok) throw new Error('Failed to fetch booking details');
  
  const data = await response.json();
  return data.message;
}

export async function getBookedSeats(eventId: string, scheduleId: string) {
  const response = await fetch(`/api/method/chavara_booking.api.get_booked_seats?event_id=${encodeURIComponent(eventId)}&schedule_id=${encodeURIComponent(scheduleId)}`);
  
  if (!response.ok) throw new Error('Failed to fetch booked seats');
  
  const data = await response.json();
  return data.message || [];
}

export async function lockSeats(eventId: string, scheduleId: string, seats: string[]) {
  const formData = new FormData();
  formData.append('event_id', eventId);
  formData.append('schedule_id', scheduleId);
  formData.append('seats', seats.join(','));
  
  const response = await fetch('/api/method/chavara_booking.api.lock_seats', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) throw new Error('Failed to lock seats');
  
  const data = await response.json();
  return data.message;
}

export async function getLockedSeats(scheduleId: string) {
  const response = await fetch(`/api/method/chavara_booking.api.get_locked_seats?schedule_id=${encodeURIComponent(scheduleId)}`);
  
  if (!response.ok) throw new Error('Failed to fetch locked seats');
  
  const data = await response.json();
  return data.message || [];
}

