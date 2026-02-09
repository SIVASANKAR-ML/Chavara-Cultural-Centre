// import { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, Clock, MapPin, Calendar, Loader2, Ticket } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import SeatSelector from "@/components/SeatSelector";
// import { TermsAndConditionsModal } from "@/components/TermsAndConditionsModal";
// import { 
//   fetchEventById, 
//   createBooking, 
//   getBookedSeats, 
//   lockSeats, 
//   getLockedSeats, 
//   initiateRazorpayPayment, // NEW: Imported the payment function
//   type ChavaraEvent 
// } from "@/services/api";
// import { toast } from "sonner";

// interface BookingStep {
//   step: 1 | 2 | 3;
//   title: string;
// }

// const SeatBooking = () => {
//   const { eventId, scheduleId } = useParams();
//   const navigate = useNavigate();
  
//   const [event, setEvent] = useState<ChavaraEvent | null>(null);
//   const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//   const [totalPrice, setTotalPrice] = useState(0); 
//   const [currentStep, setCurrentStep] = useState<BookingStep>({ step: 1, title: "Select Seats" });
//   const [loading, setLoading] = useState(true);
//   const [bookedSeats, setBookedSeats] = useState<string[]>([]);
//   const [lockedSeats, setLockedSeats] = useState<string[]>([]);
//   const [isBooking, setIsBooking] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
  
//   // Customer details state
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     const loadEvent = async () => {
//       if (!eventId) return;
//       try {
//         const eventData = await fetchEventById(eventId);
//         setEvent(eventData);
        
//         if (scheduleId) {
//           const booked = await getBookedSeats(eventId, scheduleId);
//           setBookedSeats(booked);
//           const locked = await getLockedSeats(scheduleId);
//           setLockedSeats(locked);
//         }
//       } catch (error) {
//         console.error("Failed to load event:", error);
//         toast.error("Failed to load event details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadEvent();
//   }, [eventId, scheduleId]);

//   // Handle Seat Selection
//   const handleSeatsChange = async (seats: string[], price: number) => {
//     const newSeats = seats.filter(s => !selectedSeats.includes(s));
//     setSelectedSeats(seats);
//     setTotalPrice(price);
    
//     if (newSeats.length > 0 && eventId && scheduleId) {
//       try {
//         await lockSeats(eventId, scheduleId, newSeats);
//       } catch (error) {
//         toast.error("Some seats are already locked by another user");
//         const locked = await getLockedSeats(scheduleId);
//         setLockedSeats(locked);
//       }
//     }
//   };

//   const selectedSchedule = useMemo(() => {
//     return event?.schedules?.find(s => s.name === scheduleId);
//   }, [event?.schedules, scheduleId]);
  
//   const rowPricing = useMemo(() => {
//     return selectedSchedule?.row_wise_pricing || [];
//   }, [selectedSchedule]);
  
//   // Tax and Fee Calculations
//   const convenienceFee = selectedSeats.length > 0 ? Math.round(totalPrice * 0.12) : 0;
//   const finalAmount = totalPrice + convenienceFee;

//   // --- UPDATED PAYMENT FLOW ---
//   const handleProceedToPayment = async () => {
//     // Basic validation
//     if (selectedSeats.length === 0) {
//       toast.error("Please select at least one seat");
//       return;
//     }
    
//     // Step 1: Logic to move to Customer Details
//     if (currentStep.step === 1) {
//       setShowTermsModal(true);
//       return;
//     }
    
//     // Step 2: Logic to create booking and trigger Razorpay
//     if (!customerName || !phone || !email) {
//       toast.error("Please fill all customer details");
//       return;
//     }
    
//     setIsBooking(true);
    
//     try {
//       // A. Create the Booking record in Frappe (Status will be 'Pending')
//       const bookingResult = await createBooking({
//         eventId: eventId!,
//         scheduleId: scheduleId!,
//         customerName,
//         phone,
//         email,
//         selectedSeats,
//         totalAmount: finalAmount 
//       });
      
//       if (bookingResult && bookingResult.success) {
//         // B. Trigger Razorpay Modal
//         // We pass the booking_id returned from Frappe to the payment function
//         await initiateRazorpayPayment(
//           bookingResult.booking_id, 
//           { name: customerName, email, phone }, 
//           navigate
//         );
//       } else {
//         toast.error(bookingResult?.message || "Internal Server Error during booking");
//       }
//     } catch (error) {
//       console.error("Booking process error:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const handleAcceptTerms = () => {
//     setShowTermsModal(false);
//     setCurrentStep({ step: 2, title: "Review & Pay" });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center space-y-4">
//           <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto" />
//           <p className="text-slate-500 font-medium">Loading Layout...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div className="flex-1">
//               <h1 className="font-bold text-lg text-slate-900">{event?.title}</h1>
//               <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
//                 <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{selectedSchedule?.show_date}</div>
//                 <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{selectedSchedule?.show_time}</div>
//                 <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event?.venue || "Main Hall"}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="bg-white border-b overflow-x-auto no-scrollbar">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center gap-8 min-w-max">
//             {[
//               { step: 1, title: "Select Seats" },
//               { step: 2, title: "Review & Pay" },
//               { step: 3, title: "Confirmation" }
//             ].map((item, index) => (
//               <div key={item.step} className="flex items-center gap-2">
//                 <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
//                   currentStep.step >= item.step 
//                     ? "bg-green-500 border-green-500 text-white" 
//                     : "bg-white border-gray-200 text-gray-400"
//                 }`}>
//                   {item.step}
//                 </div>
//                 <span className={`text-sm font-bold ${
//                   currentStep.step >= item.step ? "text-green-600" : "text-gray-400"
//                 }`}>
//                   {item.title}
//                 </span>
//                 {index < 2 && <div className="w-12 h-0.5 bg-gray-100" />}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8 flex-1">
//         <div className="grid lg:grid-cols-4 gap-8">
          
//           <div className="lg:col-span-3">
//             <Card className="p-6 md:p-10 rounded-[24px] border-none shadow-sm bg-white">
//               {currentStep.step === 1 ? (
//                 <div className="space-y-8">
//                   <div>
//                     <h2 className="text-2xl font-black text-slate-900">Select Seats</h2>
//                     <p className="text-slate-500">Pick your preferred spot in the arena</p>
//                   </div>
                  
//                   <SeatSelector
//                     bookedSeats={bookedSeats}
//                     lockedSeats={lockedSeats}
//                     rowPricing={rowPricing}
//                     onSeatsChange={handleSeatsChange}
//                   />
//                 </div>
//               ) : (
//                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                   <div>
//                     <h2 className="text-2xl font-black text-slate-900">Customer Details</h2>
//                     <p className="text-slate-500">Complete information for ticket generation</p>
//                   </div>
                  
//                   <div className="space-y-6 max-w-md">
//                     <div className="space-y-2">
//                       <Label htmlFor="name" className="font-bold text-slate-700">Full Name *</Label>
//                       <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Siva Sankar" className="h-12 rounded-xl" />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="font-bold text-slate-700">Phone Number *</Label>
//                       <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" type="tel" className="h-12 rounded-xl" />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="email" className="font-bold text-slate-700">Email Address *</Label>
//                       <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-12 rounded-xl" />
//                     </div>
                    
//                     <Button variant="ghost" onClick={() => setCurrentStep({ step: 1, title: "Select Seats" })} className="text-orange-600 font-bold">
//                       Change Seats
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           </div>

//           {/* Sidebar Summary */}
//           <div className="lg:col-span-1">
//             <Card className="p-8 sticky top-24 rounded-[32px] border-none shadow-xl bg-white">
//               <h3 className="font-black text-xl mb-6 text-slate-900">Summary</h3>
              
//               <div className="space-y-4 mb-8 text-sm">
//                 <div>
//                   <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Event</p>
//                   <p className="font-bold text-slate-800">{event.title}</p>
//                 </div>
                
//                 {selectedSeats.length > 0 && (
//                   <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
//                     <p className="text-[10px] uppercase font-bold text-orange-400 tracking-widest flex items-center gap-1">
//                       <Ticket size={10}/> Seats
//                     </p>
//                     <p className="font-black text-orange-600 text-lg">{selectedSeats.join(", ")}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Pricing Breakdown */}
//               <div className="border-t border-slate-100 pt-6 space-y-4">
//                 <div className="flex justify-between text-sm font-medium">
//                   <span className="text-slate-500">Tickets ({selectedSeats.length})</span>
//                   <span className="text-slate-900">₹{totalPrice.toLocaleString()}</span>
//                 </div>

//                 <div className="flex justify-between text-sm font-medium">
//                   <span className="text-slate-500">Convenience Fee</span>
//                   <span className="text-slate-900">₹{convenienceFee.toLocaleString()}</span>
//                 </div>

//                 <div className="bg-slate-50 p-3 rounded-xl space-y-1">
//                     <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
//                       <span>Base Amt</span>
//                       <span>₹{Math.round(convenienceFee / 1.18).toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
//                       <span>GST (18%)</span>
//                       <span>₹{Math.round(convenienceFee * (18/118)).toLocaleString()}</span>
//                     </div>
//                 </div>

//                 <div className="flex justify-between items-end pt-2 border-t border-slate-100">
//                   <span className="font-bold text-slate-400 uppercase text-xs">Total</span>
//                   <span className="text-3xl font-black text-green-600 leading-none">₹{finalAmount.toLocaleString()}</span>
//                 </div>
//               </div>

//               <Button
//                 className="w-full mt-8 h-16 rounded-2xl text-lg font-black shadow-lg active:scale-95 transition-all"
//                 disabled={selectedSeats.length === 0 || isBooking}
//                 onClick={handleProceedToPayment}
//               >
//                 {isBooking ? (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="animate-spin h-5 w-5" />
//                     Securely Booking...
//                   </div>
//                 ) : currentStep.step === 1 ? (
//                   "Continue to Details"
//                 ) : (
//                   `Pay ₹${finalAmount.toLocaleString()}`
//                 )}
//               </Button>
              
//               {selectedSeats.length > 0 && currentStep.step === 1 && (
//                 <p className="text-[10px] font-bold text-slate-400 mt-4 text-center uppercase tracking-widest animate-pulse">
//                   Seats locked for 5:00
//                 </p>
//               )}
//             </Card>
//           </div>
//         </div>
//       </div>

//       <TermsAndConditionsModal
//         open={showTermsModal}
//         onAccept={handleAcceptTerms}
//         onCancel={() => setShowTermsModal(false)}
//       />
//     </div>
//   );
// };

// export default SeatBooking;

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Calendar, Loader2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SeatSelector from "@/components/SeatSelector";
import { TermsAndConditionsModal } from "@/components/TermsAndConditionsModal";
import { 
  fetchEventById, 
  createBooking, 
  getBookedSeats, 
  lockSeats, 
  getLockedSeats, 
  initiateRazorpayPayment,
  checkScannerAccess, // NEW: Added to check for Admin role
  createAdminBooking, // NEW: Added for skip-payment booking
  type ChavaraEvent 
} from "@/services/api";
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
  const [totalPrice, setTotalPrice] = useState(0); 
  const [currentStep, setCurrentStep] = useState<BookingStep>({ step: 1, title: "Select Seats" });
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // NEW: Track Admin status
  
  // Customer details state
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      try {
        const eventData = await fetchEventById(eventId);
        setEvent(eventData);
        
        // Check if current user is an Admin/Staff
        const adminStatus = await checkScannerAccess();
        setIsAdmin(adminStatus);

        if (scheduleId) {
          const booked = await getBookedSeats(eventId, scheduleId);
          setBookedSeats(booked);
          const locked = await getLockedSeats(scheduleId);
          setLockedSeats(locked);
        }
      } catch (error) {
        console.error("Failed to load event:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId, scheduleId]);

  // Handle Seat Selection
  const handleSeatsChange = async (seats: string[], price: number) => {
    const newSeats = seats.filter(s => !selectedSeats.includes(s));
    setSelectedSeats(seats);
    setTotalPrice(price);
    
    if (newSeats.length > 0 && eventId && scheduleId) {
      try {
        await lockSeats(eventId, scheduleId, newSeats);
      } catch (error) {
        toast.error("Some seats are already locked by another user");
        const locked = await getLockedSeats(scheduleId);
        setLockedSeats(locked);
      }
    }
  };

  const selectedSchedule = useMemo(() => {
    return event?.schedules?.find(s => s.name === scheduleId);
  }, [event?.schedules, scheduleId]);
  
  const rowPricing = useMemo(() => {
    return selectedSchedule?.row_wise_pricing || [];
  }, [selectedSchedule]);
  
  // Tax and Fee Calculations
  const convenienceFee = selectedSeats.length > 0 ? Math.round(totalPrice * 0.12) : 0;
  const finalAmount = totalPrice + convenienceFee;

  // --- UPDATED PAYMENT FLOW ---
  const handleProceedToPayment = async () => {
    // Basic validation
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    
    // Step 1: Logic to move to Customer Details
    if (currentStep.step === 1) {
      setShowTermsModal(true);
      return;
    }
    
    // Step 2: Logic to create booking and trigger Razorpay or confirm directly for admin
    if (!customerName || !phone || !email) {
      toast.error("Please fill all customer details");
      return;
    }
    
    setIsBooking(true);
    
    try {
      if (isAdmin) {
        // Admin/Staff: Book directly without Razorpay (Status = Paid)
        const adminBookingResult = await createAdminBooking({
          eventId: eventId!,
          scheduleId: scheduleId!,
          customerName,
          phone,
          email,
          selectedSeats,
          totalAmount: finalAmount 
        });
        
        if (adminBookingResult && adminBookingResult.success) {
          toast.success("Booking confirmed successfully!");
          navigate("/", { replace: true });
        } else {
          toast.error(adminBookingResult?.message || "Failed to create admin booking");
        }
      } else {
        // Regular User: Create booking and proceed to Razorpay payment
        const bookingResult = await createBooking({
          eventId: eventId!,
          scheduleId: scheduleId!,
          customerName,
          phone,
          email,
          selectedSeats,
          totalAmount: finalAmount 
        });
        
        if (bookingResult && bookingResult.success) {
          // B. Trigger Razorpay Modal
          // We pass the booking_id returned from Frappe to the payment function
          await initiateRazorpayPayment(
            bookingResult.booking_id, 
            { name: customerName, email, phone }, 
            navigate
          );
        } else {
          toast.error(bookingResult?.message || "Internal Server Error during booking");
        }
      }
    } catch (error) {
      console.error("Booking process error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };
  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    setCurrentStep({ step: 2, title: "Review & Pay" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto" />
          <p className="text-slate-500 font-medium">Loading Layout...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800 mb-2">Event not found</p>
          <Button onClick={() => navigate("/events")} variant="outline">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-lg text-slate-900">{event?.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{selectedSchedule?.show_date}</div>
                <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{selectedSchedule?.show_time}</div>
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event?.venue || "Main Hall"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-8 min-w-max">
            {[
              { step: 1, title: "Select Seats" },
              { step: 2, title: "Review & Pay" },
              { step: 3, title: "Confirmation" }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  currentStep.step >= item.step 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "bg-white border-gray-200 text-gray-400"
                }`}>
                  {item.step}
                </div>
                <span className={`text-sm font-bold ${
                  currentStep.step >= item.step ? "text-green-600" : "text-gray-400"
                }`}>
                  {item.title}
                </span>
                {index < 2 && <div className="w-12 h-0.5 bg-gray-100" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-3">
            <Card className="p-6 md:p-10 rounded-[24px] border-none shadow-sm bg-white">
              {currentStep.step === 1 ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Select Seats</h2>
                    <p className="text-slate-500">Pick your preferred spot in the arena</p>
                  </div>
                  
                  <SeatSelector
                    bookedSeats={bookedSeats}
                    lockedSeats={lockedSeats}
                    rowPricing={rowPricing}
                    onSeatsChange={handleSeatsChange}
                  />
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Customer Details</h2>
                    <p className="text-slate-500">Complete information for ticket generation</p>
                  </div>
                  
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-bold text-slate-700">Full Name *</Label>
                      <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Siva Sankar" className="h-12 rounded-xl" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-bold text-slate-700">Phone Number *</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" type="tel" className="h-12 rounded-xl" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold text-slate-700">Email Address *</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-12 rounded-xl" />
                    </div>
                    
                    <Button variant="ghost" onClick={() => setCurrentStep({ step: 1, title: "Select Seats" })} className="text-orange-600 font-bold">
                      Change Seats
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-24 rounded-[32px] border-none shadow-xl bg-white">
              <h3 className="font-black text-xl mb-6 text-slate-900">Summary</h3>
              
              <div className="space-y-4 mb-8 text-sm">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Event</p>
                  <p className="font-bold text-slate-800">{event.title}</p>
                </div>
                
                {selectedSeats.length > 0 && (
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-[10px] uppercase font-bold text-orange-400 tracking-widest flex items-center gap-1">
                      <Ticket size={10}/> Seats
                    </p>
                    <p className="font-black text-orange-600 text-lg">{selectedSeats.join(", ")}</p>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Tickets ({selectedSeats.length})</span>
                  <span className="text-slate-900">₹{totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Convenience Fee</span>
                  <span className="text-slate-900">₹{convenienceFee.toLocaleString()}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>Base Amt</span>
                      <span>₹{Math.round(convenienceFee / 1.18).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>GST (18%)</span>
                      <span>₹{Math.round(convenienceFee * (18/118)).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-400 uppercase text-xs">Total</span>
                  <span className="text-3xl font-black text-green-600 leading-none">₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full mt-8 h-16 rounded-2xl text-lg font-black shadow-lg active:scale-95 transition-all"
                disabled={selectedSeats.length === 0 || isBooking}
                onClick={handleProceedToPayment}
              >
                {isBooking ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    {isAdmin ? "Admin Confirming..." : "Securely Booking..."}
                  </div>
                ) : currentStep.step === 1 ? (
                  "Continue to Details"
                ) : (
                  isAdmin ? `Confirm Booking (Admin)` : `Pay ₹${finalAmount.toLocaleString()}`
                )}
              </Button>
              
              {selectedSeats.length > 0 && currentStep.step === 1 && (
                <p className="text-[10px] font-bold text-slate-400 mt-4 text-center uppercase tracking-widest animate-pulse">
                  Seats locked for 5:00
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>

      <TermsAndConditionsModal
        open={showTermsModal}
        onAccept={handleAcceptTerms}
        onCancel={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export default SeatBooking;