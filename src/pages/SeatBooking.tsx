import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SeatSelector from "@/components/SeatSelector";
import { fetchEventById, createBooking, getBookedSeats, type ChavaraEvent } from "@/services/api";
import { toast } from "sonner";

interface BookingStep {
  step: 1 | 2 | 3;
  title: string;
}

const SeatBooking = () => {
  const { eventId, scheduleId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<ChavaraEvent | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<BookingStep>({ step: 1, title: "Select Seats" });
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  
  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      try {
        const eventData = await fetchEventById(eventId);
        setEvent(eventData);
        
        // Load booked seats for this schedule
        if (scheduleId) {
          const booked = await getBookedSeats(eventId, scheduleId);
          console.log('Booked seats from API:', booked);
          setBookedSeats(booked);
        }
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId, scheduleId]);

  const selectedSchedule = event?.schedules?.find(s => s.name === scheduleId);
  const ticketPrice = event?.price || 100;
  const totalAmount = selectedSeats.length * ticketPrice;

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    
    if (currentStep.step === 1) {
      setCurrentStep({ step: 2, title: "Customer Details" });
      return;
    }
    
    if (!customerName || !phone || !email) {
      toast.error("Please fill all customer details");
      return;
    }
    
    setIsBooking(true);
    
    try {
      const bookingResult = await createBooking({
        eventId: eventId!,
        scheduleId: scheduleId!,
        customerName,
        phone,
        email,
        selectedSeats,
        totalAmount: totalAmount + 50
      });
      
      console.log('Booking result:', bookingResult);
      
      if (bookingResult && bookingResult.success) {
        toast.success("Booking confirmed successfully!");
        navigate(`/booking-confirmation/${bookingResult.booking_id}`);
      } else {
        toast.error(bookingResult?.message || "Booking failed");
        console.error('Booking failed:', bookingResult);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking: " + (error as Error).message);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="font-bold text-lg">{event.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {selectedSchedule?.show_date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedSchedule?.show_time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.venue || "Main Hall"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-8">
            {[
              { step: 1, title: "Select Seats" },
              { step: 2, title: "Review & Pay" },
              { step: 3, title: "Confirmation" }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep.step >= item.step 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {item.step}
                </div>
                <span className={`text-sm ${
                  currentStep.step >= item.step ? "text-green-600" : "text-gray-500"
                }`}>
                  {item.title}
                </span>
                {index < 2 && <div className="w-8 h-px bg-gray-200 ml-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Seat Map or Customer Details */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {currentStep.step === 1 ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Select Your Seats</h2>
                    <p className="text-muted-foreground">
                      Click on available seats to select. You can select up to 10 seats.
                    </p>
                  </div>
                  
                  <SeatSelector
                    bookedSeats={bookedSeats}
                    onSeatsChange={setSelectedSeats}
                  />
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Customer Details</h2>
                    <p className="text-muted-foreground">
                      Please provide your details to complete the booking.
                    </p>
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep({ step: 1, title: "Select Seats" })}
                    >
                      Back to Seat Selection
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Event</p>
                  <p className="font-medium">{event.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {selectedSchedule?.show_date} at {selectedSchedule?.show_time}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{event.venue || "Main Hall"}</p>
                </div>
                
                {selectedSeats.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Seats</p>
                    <p className="font-medium">{selectedSeats.join(", ")}</p>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tickets ({selectedSeats.length})</span>
                  <span>₹{(selectedSeats.length * ticketPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>₹{selectedSeats.length > 0 ? 50 : 0}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{(totalAmount + (selectedSeats.length > 0 ? 50 : 0)).toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                disabled={selectedSeats.length === 0 || isBooking}
                onClick={handleProceedToPayment}
              >
                {isBooking ? (
                  "Creating Booking..."
                ) : currentStep.step === 1 ? (
                  selectedSeats.length === 0 
                    ? "Select Seats to Continue" 
                    : "Continue to Details"
                ) : (
                  `Confirm Booking ₹${(totalAmount + 50).toLocaleString()}`
                )}
              </Button>
              
              {selectedSeats.length > 0 && currentStep.step === 1 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Your seats will be held for 10 minutes
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;