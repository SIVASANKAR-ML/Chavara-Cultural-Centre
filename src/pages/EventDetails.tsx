import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tag, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SeatSelector from "@/components/SeatSelector";
import ShowTimeSelector from "@/components/ShowTimeSelector";
import { fetchEventById, ChavaraEvent } from "@/services/api"; // Updated import
import { toast } from "sonner";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  // NEW: State for real data
  const [event, setEvent] = useState<ChavaraEvent | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  // FETCH: Get real event details and schedules from Frappe
  useEffect(() => {
    async function loadEventData() {
      if (!eventId) return;
      try {
        setLoading(true);
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event:", error);
        toast.error("Error loading event details");
      } finally {
        setLoading(false);
      }
    }
    loadEventData();
  }, [eventId]);

  // TRANSFORMATION: Convert Frappe's flat schedules into grouped showTimes for your selector
  const transformedShowTimes = useMemo(() => {
    if (!event?.schedules) return [];
    
    const groups: { [key: string]: string[] } = {};
    event.schedules.forEach((sch) => {
      if (!groups[sch.show_date]) {
        groups[sch.show_date] = [];
      }
      groups[sch.show_date].push(sch.show_time);
    });

    return Object.keys(groups).map((date) => ({
      date,
      times: groups[date],
    }));
  }, [event]);

  useEffect(() => {
    // Load booked seats from localStorage (keeping your existing feature)
    const bookingsData = localStorage.getItem("bookings");
    if (bookingsData && event && selectedDate && selectedTime) {
      const bookings = JSON.parse(bookingsData);
      const eventBookings = bookings.filter(
        (b: any) => 
          b.eventId === event.id && 
          b.eventDate === selectedDate && 
          b.eventTime === selectedTime
      );
      const seats = eventBookings.flatMap((b: any) => b.seats);
      setBookedSeats(seats);
    }
  }, [event, selectedDate, selectedTime]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-primary font-bold">Loading Event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "long",
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bookingId = `BK2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const bookingsData = localStorage.getItem("bookings");
    const bookings = bookingsData ? JSON.parse(bookingsData) : [];
    
    const newBooking = {
      id: bookingId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: selectedDate,
      eventTime: selectedTime,
      seats: selectedSeats,
      totalAmount: selectedSeats.length * (event.price || 0),
      bookingDate: new Date().toISOString(),
    };

    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    setIsBooking(false);
    toast.success("Booking successful!");
    navigate(`/booking-confirmation/${bookingId}`);
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Event Banner */}
      <section className="relative h-[40vh] min-h-[300px]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${event.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      </section>

      {/* Event Details */}
      <section className="container mx-auto px-4 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 shadow-elegant">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
                  {event.title}
                </h1>
                {/* Fixed: Use dangerouslySetInnerHTML for Frappe Text Editor content */}
                <div 
                  className="text-muted-foreground text-lg mb-6 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }} 
                />
              </div>
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                {event.day}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-semibold text-foreground">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold text-foreground">₹{event.price} per seat</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Dates</p>
                  <p className="font-semibold text-foreground">{transformedShowTimes.length} dates</p>
                </div>
              </div>
            </div>

            {/* Show Time Selection - Now uses REAL data from Event Schedule */}
            <div className="border-t border-border pt-8 mb-8">
              {transformedShowTimes.length > 0 ? (
                <ShowTimeSelector
                  showTimes={transformedShowTimes}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                    setSelectedSeats([]);
                  }}
                  onTimeSelect={setSelectedTime}
                />
              ) : (
                <p className="text-center text-muted-foreground py-4">No schedules available for this event yet.</p>
              )}
            </div>

            {/* Seat Selection - Remains unchanged */}
            {selectedDate && selectedTime && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-border pt-8">
                <h2 className="font-serif font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Select Your Seats
                </h2>
                <SeatSelector
                  totalSeats={event.maxCapacity || 100} // Use real capacity from Frappe
                  bookedSeats={bookedSeats}
                  onSeatsChange={setSelectedSeats}
                />
              </motion.div>
            )}

            {/* Booking Summary - Remains unchanged */}
            {selectedSeats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Seats</p>
                    <p className="text-2xl font-bold text-foreground">{selectedSeats.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{selectedSeats.length * (event.price || 0)}
                    </p>
                  </div>
                </div>
                <button onClick={handleBooking} disabled={isBooking} className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-lg py-6">
                  {isBooking ? "Processing Payment..." : "Proceed to Book"}
                </button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default EventDetails;