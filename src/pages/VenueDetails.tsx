import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tag, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SeatSelector from "@/components/SeatSelector";
import ShowTimeSelector from "@/components/ShowTimeSelector";
import { upcomingEvents,venue } from "@/data/events";
import { toast } from "sonner";

const VenueDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  const event = upcomingEvents.find(e => e.id === eventId);

  useEffect(() => {
    // Load booked seats from localStorage for selected date/time
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

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate booking ID
    const bookingId = `BK2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Save booking to localStorage
    const bookingsData = localStorage.getItem("bookings");
    const bookings = bookingsData ? JSON.parse(bookingsData) : [];
    
    const newBooking = {
      id: bookingId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: selectedDate,
      eventTime: selectedTime,
      seats: selectedSeats,
      totalAmount: selectedSeats.length * event.price,
      bookingDate: new Date().toISOString(),
    };

    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    setIsBooking(false);
    toast.success("Booking successful!");

    // Navigate to confirmation page
    navigate(`/booking-confirmation/${bookingId}`);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 shadow-elegant">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
                  {event.title}
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  {event.description}
                </p>
              </div>
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                {event.category}
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
                  <p className="font-semibold text-foreground">{event.showTimes.length} dates</p>
                </div>
              </div>
            </div>

            {/* Show Time Selection */}
            <div className="border-t border-border pt-8 mb-8">
              <ShowTimeSelector
                showTimes={event.showTimes}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setSelectedSeats([]);
                }}
                onTimeSelect={setSelectedTime}
              />
            </div>

            {/* Seat Selection */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border-t border-border pt-8"
              >
                <h2 className="font-serif font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Select Your Seats
                </h2>

                <SeatSelector
                  totalSeats={event.totalSeats}
                  bookedSeats={bookedSeats}
                  onSeatsChange={setSelectedSeats}
                />
              </motion.div>
            )}

            {/* Booking Summary */}
            {selectedSeats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Seats</p>
                    <p className="text-2xl font-bold text-foreground">{selectedSeats.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{selectedSeats.length * event.price}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                >
                  {isBooking ? "Processing Payment..." : "Proceed to Book"}
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default VenueDetails;
