import { useState } from "react";
import { CheckCircle, XCircle, Scan } from "lucide-react";
import QRScanner from "@/components/QRScanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingData {
  bookingId: string;
  eventTitle: string;
  seats: string[];
  date: string;
}

const TicketVerification = () => {
  const [scanResult, setScanResult] = useState<BookingData | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    try {
      const bookingData: BookingData = JSON.parse(decodedText);
      setScanResult(bookingData);
      
      // Validate booking (check against localStorage or API)
      const bookingsData = localStorage.getItem("bookings");
      if (bookingsData) {
        const bookings = JSON.parse(bookingsData);
        const isValidBooking = bookings.some((b: any) => b.id === bookingData.bookingId);
        setIsValid(isValidBooking);
      } else {
        setIsValid(false);
      }
      
      setShowScanner(false);
    } catch (error) {
      setIsValid(false);
      setScanResult(null);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setIsValid(null);
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Scan className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-serif font-bold text-3xl text-foreground mb-2">
            Ticket Verification
          </h1>
          <p className="text-muted-foreground">
            Scan QR code to verify booking
          </p>
        </div>

        {!showScanner && !scanResult && (
          <div className="text-center">
            <Button onClick={() => setShowScanner(true)} size="lg">
              <Scan className="mr-2 h-5 w-5" />
              Start Scanning
            </Button>
          </div>
        )}

        {showScanner && (
          <QRScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={(error) => console.error("Scan error:", error)}
          />
        )}

        {scanResult && (
          <Card className="p-6">
            <div className="text-center mb-6">
              {isValid ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              
              <h2 className="text-2xl font-bold mb-2">
                {isValid ? "Valid Ticket" : "Invalid Ticket"}
              </h2>
            </div>

            {isValid && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono font-bold">{scanResult.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Event</p>
                  <p className="font-semibold">{scanResult.eventTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-semibold">{scanResult.seats.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{new Date(scanResult.date).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Button onClick={resetScan}>Scan Another Ticket</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TicketVerification;