import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from 'html2canvas'; 
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Download, 
  Home, 
  User,
  CreditCard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosClient } from "@/lib/axios"; 
import { getBookingDetails } from "@/services/api";
import { toast } from "sonner";

interface Booking {
  booking_id: string;
  customer_name: string;
  phone: string;
  email: string;
  event_title: string;
  event_date: string;
  event_time: string;
  seats: string[];
  total_amount: number;
  booking_date: string;
  status: string;
  event_image?: string; 
  venue?: string;
}

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null); 
  const autoDownloadTriggered = useRef(false); // Ref to prevent double execution in strict mode
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [secureQrData, setSecureQrData] = useState<string>(""); 

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return;
      try {
        const bookingData = await getBookingDetails(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          const qrRes = await axiosClient.get("/method/chavara_booking.api.booking.get_secure_qr_code", {
            params: { booking_id: bookingId }
          });
          if (typeof qrRes.data.message === 'string') {
            setSecureQrData(qrRes.data.message);
          }
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
        toast.error("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  // High-quality PNG Download logic
  const handleDownloadPNG = async (isAuto = false) => {
    if (!ticketRef.current) return;
    
    // Only show "generating" toast if the user clicked manually
    let toastId;
    if (!isAuto) {
      toastId = toast.loading("Generating high-quality ticket...");
    }
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#f1f5f9",
        logging: false,
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `Ticket-${booking?.booking_id}.png`;
      link.href = image;
      link.click();
      
      if (!isAuto) {
        toast.success("Ticket saved to gallery!", { id: toastId });
      } else {
        toast.success("Ticket downloaded automatically");
      }
    } catch (err) {
      console.error("Download Error:", err);
      if (!isAuto) {
        toast.error("Generation failed. Please try a screenshot.", { id: toastId });
      }
    }
  };

  // --- AUTO DOWNLOAD LOGIC ---
  useEffect(() => {
    // We only trigger if data is loaded, and we haven't triggered in this component lifecycle
    if (booking && secureQrData && !autoDownloadTriggered.current) {
      const storageKey = `downloaded_${bookingId}`;
      
      // Check if this specific ticket was already downloaded in this session (e.g., after a refresh)
      if (!sessionStorage.getItem(storageKey)) {
        autoDownloadTriggered.current = true;
        
        // Timeout ensures the QR code and images are actually painted on the screen before capturing
        const timer = setTimeout(() => {
          handleDownloadPNG(true);
          sessionStorage.setItem(storageKey, "true");
        }, 1500); 

        return () => clearTimeout(timer);
      }
    }
  }, [booking, secureQrData, bookingId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Securing your entry pass...</p>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </div>
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-8 md:pt-28 md:pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* PAGE HEADER */}
        <div className="text-center mb-8">
            <div className="inline-flex p-2 bg-green-100 rounded-full mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Booking Confirmed</h1>
            <p className="text-slate-500 text-sm font-medium">Please present this digital pass at the gate.</p>
        </div>

        {/* TICKET FOR CAPTURE */}
        <div ref={ticketRef} className="p-4 rounded-3xl"> 
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            {/* TOP CARD: EVENT BANNER & INFO */}
            <Card className="rounded-t-[32px] rounded-b-none border-none shadow-xl overflow-hidden bg-white">
              <div className="relative h-52 w-full bg-slate-200">
                <img 
                  src={booking.event_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'} 
                  crossOrigin="anonymous" 
                  className="w-full h-full object-cover" 
                  alt={booking.event_title}
                  onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Confirmed Event</p>
                  <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none truncate">
                      {booking.event_title}
                  </h2>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12}/> Date
                      </p>
                      <p className="font-bold text-slate-800 text-lg">{formatDate(booking.event_date)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12}/> Time
                      </p>
                      <p className="font-bold text-slate-800 text-lg">{booking.event_time}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12}/> Venue Location
                    </p>
                    <p className="font-bold text-slate-700">{booking.venue || "Chavara Cultural Centre, Kochi"}</p>
                </div>
              </div>
            </Card>

            {/* PERFORATED CUT LINE */}
            <div className="relative h-8 bg-white flex items-center justify-between overflow-hidden">
              <div className="absolute -left-4 w-8 h-8 bg-slate-100 rounded-full shadow-inner" />
              <div className="w-full border-t-2 border-dashed border-slate-200 mx-6" />
              <div className="absolute -right-4 w-8 h-8 bg-slate-100 rounded-full shadow-inner" />
            </div>

            {/* BOTTOM CARD: QR CODE & SEATS */}
            <Card className="rounded-b-[32px] rounded-t-none border-none shadow-xl bg-white p-8">
              <div className="flex flex-col md:flex-row items-center gap-10">
                  {/* QR SECTION */}
                  <div className="bg-white p-3 border-2 border-slate-50 rounded-2xl shadow-inner">
                    {secureQrData ? (
                        <QRCodeSVG value={secureQrData} size={160} level="H" includeMargin />
                    ) : (
                        <div className="w-[160px] h-[160px] flex items-center justify-center bg-slate-50 animate-pulse rounded-lg">
                           <span className="text-[10px] text-slate-300 font-bold uppercase">Signing...</span>
                        </div>
                    )}
                  </div>

                  {/* SEAT INFO */}
                  <div className="flex-1 w-full space-y-5 text-center md:text-left">
                      <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
                             Your Assigned Seats
                          </p>
                          <p className="text-4xl font-black text-orange-600 tracking-tighter">
                              {booking.seats.join(", ")}
                          </p>
                      </div>
                      
                      <div className="flex justify-between md:justify-start md:gap-12 px-2">
                          <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                              <p className="font-mono text-xs font-bold text-slate-600">{booking.booking_id}</p>
                          </div>
                          <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transaction</p>
                              <p className="text-sm font-black text-slate-800">₹{booking.total_amount}</p>
                          </div>
                      </div>
                  </div>
              </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Amount Paid</span>
                    <span className="font-bold text-2xl text-primary">₹{booking.total_amount}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                      <CreditCard size={12} className="text-green-600"/>
                      <p className="text-[10px] font-black text-green-600 uppercase">Verified Entry Pass</p>
                  </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* INTERACTIVE BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14 rounded-2xl border-2 border-primary text-primary font-black active:scale-95 transition-transform"
              onClick={() => handleDownloadPNG(false)}
            >
                <Download className="mr-2 h-5 w-5" /> DOWNLOAD PNG
            </Button>
            <Button 
              className="flex-1 h-14 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              onClick={() => navigate("/")}
            >
                <Home className="mr-2 h-5 w-5" /> FINISH
            </Button>
        </div>

        <div className="mt-10 px-6 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                * This is a digital entry ticket. You can present this PNG image at the venue gates. 
                Unique verification hash included. Duplication is strictly prohibited.
            </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;