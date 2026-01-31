import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Scan, 
  Loader2, 
  User, 
  Armchair, 
  Calendar,
  RefreshCw
} from "lucide-react";
import QRScanner from "@/components/QRScanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { verify_and_log_entry, VerificationResponse } from "@/services/api";
import { axiosClient } from "@/lib/axios";

const TicketVerification = () => {
  const [scanResult, setScanResult] = useState<VerificationResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScanner, setShowScanner] = useState(true);

  // Function called when the camera successfully reads a QR string
const handleScanSuccess = async (decodedText: string) => {
  setIsProcessing(true);
  try {
    // We send the decodedText (the signed string) directly to the verification API
    const response = await axiosClient.post(
      "/method/chavara_booking.api.ticket_verification.verify_and_log_entry",
      { qr_string: decodedText } // Use the new param name: qr_string
    );

    const result = response.data.message;
    setScanResult(result);
    setShowScanner(false);
    
  } catch (error) {
    toast.error("Network Error");
  } finally {
    setIsProcessing(false);
  }
};

  // Resets the UI to allow another scan
  const resetScan = () => {
    setScanResult(null);
    setShowScanner(true);
    setIsProcessing(false);
  };

  return (
    <div className={`min-h-screen py-10 transition-colors duration-500 ${
      !scanResult 
        ? 'bg-slate-50' 
        : scanResult.success 
          ? 'bg-green-500' 
          : 'bg-red-500'
    }`}>
      <div className="container mx-auto px-4 max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-3 rounded-full mb-4 ${scanResult ? 'bg-white/20' : 'bg-primary/10'}`}>
            <Scan className={`h-8 w-8 ${scanResult ? 'text-white' : 'text-primary'}`} />
          </div>
          <h1 className={`text-3xl font-black ${scanResult ? 'text-white' : 'text-slate-900'}`}>
            Entry Gate
          </h1>
          <p className={`${scanResult ? 'text-white/80' : 'text-slate-500'}`}>
            Chavara Cultural Centre
          </p>
        </div>

        {showScanner ? (
          /* CAMERA VIEW */
          <Card className="overflow-hidden border-4 border-white shadow-2xl relative">
            <QRScanner onScanSuccess={handleScanSuccess} />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10">
                <Loader2 className="h-12 w-12 animate-spin mb-2" />
                <p className="font-bold">Verifying Ticket...</p>
              </div>
            )}
          </Card>
        ) : (
          /* RESULT VIEW (Green or Red Screen) */
          <Card className="p-8 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300 border-none">
            {scanResult?.success ? (
              <div className="space-y-6">
                <CheckCircle className="h-32 w-32 text-green-500 mx-auto" />
                <div>
                  <h2 className="text-4xl font-black text-slate-900">GRANTED</h2>
                  <p className="text-green-600 font-bold uppercase tracking-widest mt-1">Valid Ticket</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100 text-left">
                  <div className="flex items-start gap-3">
                    <User className="text-slate-400 mt-1" size={20}/>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Customer</p>
                      <p className="text-lg font-bold text-slate-800">{scanResult.customer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Armchair className="text-primary mt-1" size={20}/>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Seats Assigned</p>
                      <p className="text-2xl font-black text-primary leading-none">
                        {scanResult.seats}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t pt-3">
                    <Calendar className="text-slate-400 mt-1" size={20}/>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Event</p>
                      <p className="text-sm font-medium text-slate-600">{scanResult.event}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-10">
                <XCircle className="h-32 w-32 text-red-500 mx-auto" />
                <div>
                  <h2 className="text-4xl font-black text-slate-900">DENIED</h2>
                  <p className="text-red-600 font-bold text-lg mt-2 px-4">
                    {scanResult?.message || "Invalid Entry Attempt"}
                  </p>
                </div>
              </div>
            )}

            <Button 
              className="w-full h-20 text-2xl font-black shadow-lg rounded-2xl" 
              variant={scanResult?.success ? "default" : "destructive"}
              onClick={resetScan}
            >
              <RefreshCw className="mr-3 h-6 w-6" />
              SCAN NEXT
            </Button>
          </Card>
        )}

        {/* Footer info */}
        <p className={`text-center mt-8 text-sm font-medium ${scanResult ? 'text-white/60' : 'text-slate-400'}`}>
          Staff ID: {localStorage.getItem('user_id') || 'Active Staff'}
        </p>
      </div>
    </div>
  );
};

export default TicketVerification;