import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Calendar, Clock, MapPin, Ticket, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosClient } from "@/lib/axios"; // Added axiosClient
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
}

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [secureQrData, setSecureQrData] = useState<string>(""); // New state for signed data

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return;
      
      try {
        const bookingData = await getBookingDetails(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          
          // --- NEW: Fetch Secure Signed QR String from Frappe ---
          const qrRes = await axiosClient.get("/method/chavara_booking.api.booking.get_secure_qr_code", {
            params: { booking_id: bookingId }
          });
          setSecureQrData(qrRes.data.message);
          // -----------------------------------------------------
          
        } else {
          toast.error("Booking not found");
        }
      } catch (error) {
        console.error("Failed to load booking:", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-primary font-bold">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Booking Not Found</h2>
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

  const handleDownloadQR = () => {
    const canvas = document.createElement("canvas");
    const svg = document.querySelector("#qr-code") as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `ticket-${booking.booking_id}.png`;
        downloadLink.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Message */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <CheckCircle className="h-20 w-20 text-primary" />
            </motion.div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Booking Confirmed!
            </h1>
            <p className="font-body text-muted-foreground text-lg">
              Your tickets have been successfully booked
            </p>
          </div>

          {/* Ticket Card */}
          <Card className="p-8 shadow-elegant mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Booking Details */}
              <div className="space-y-6">
                <div>
                  <p className="font-subheading text-sm text-muted-foreground mb-1">Booking ID</p>
                  <p className="font-mono font-bold text-xl text-primary">{booking.booking_id}</p>
                </div>

                <div>
                  <p className="font-subheading text-sm text-muted-foreground mb-1">Event</p>
                  <p className="font-display font-bold text-xl text-foreground">{booking.event_title}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-subheading text-sm text-muted-foreground">Date</p>
                      <p className="font-heading font-semibold text-foreground">{formatDate(booking.event_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-subheading text-sm text-muted-foreground">Time</p>
                      <p className="font-heading font-semibold text-foreground">{booking.event_time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-subheading text-sm text-muted-foreground">Seats</p>
                      <p className="font-heading font-semibold text-foreground">{booking.seats.join(", ")}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Amount Paid</span>
                    <span className="font-bold text-2xl text-primary">₹{booking.total_amount}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section - UPDATED TO USE SECURE DATA */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-6 bg-white rounded-lg shadow-card">
                  {secureQrData ? (
                    <QRCodeSVG
                      id="qr-code"
                      value={secureQrData}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
                      <p className="text-xs text-muted-foreground animate-pulse">Generating Secure Ticket...</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Show this secure QR code at the entrance
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadQR}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="mr-2 h-5 w-5" />
              Download QR Code
            </Button>
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </div>

          {/* Important Information */}
          <Card className="mt-8 p-6 bg-muted/30">
            <h3 className="font-heading font-semibold text-foreground mb-3">Important Information</h3>
            <ul className="font-body space-y-2 text-sm text-muted-foreground">
              <li>• Please arrive at least 30 minutes before the event start time</li>
              <li>• Carry a valid ID proof for verification</li>
              <li>• This QR code is your entry ticket - keep it safe</li>
              <li>• Photography and videography may be restricted during the performance</li>
              <li>• Seats are non-transferable and non-refundable</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;