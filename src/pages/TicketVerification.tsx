import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for redirection
import { 
  CheckCircle, 
  XCircle, 
  Scan, 
  Loader2, 
  User, 
  Armchair, 
  Calendar,
  RefreshCw,
  ShieldAlert
} from "lucide-react";
import QRScanner from "@/components/QRScanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { verify_and_log_entry, VerificationResponse, checkScannerAccess } from "@/services/api";

const TicketVerification = () => {
  const [scanResult, setScanResult] = useState<VerificationResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  
  // New States for Security
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // --- NEW: Security Check Logic ---
  useEffect(() => {
    async function checkAccess() {
      try {
        const isStaff = await checkScannerAccess(); // Calls Python backend role check
        if (!isStaff) {
          toast.error("Restricted Area: Staff Only");
          navigate("/login"); // Kick them out to login page
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        navigate("/login");
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAccess();
  }, [navigate]);

  // Function called when the camera successfully reads a QR string
  const handleScanSuccess = async (decodedText: string) => {
    if (isProcessing) return; 
    setIsProcessing(true);
    try {
      // Call the API service function
      // Note: We use the function imported from @/services/api
      const result = await verify_and_log_entry(decodedText);

      setScanResult(result);
      setShowScanner(false);
      
      if (result.success) {
        toast.success("Access Granted");
      } else {
        toast.error(result.message);
      }
      
    } catch (error: any) {
      console.error("Scan error:", error);
      toast.error("Format Error: Invalid QR Code");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setShowScanner(true);
    setIsProcessing(false);
  };

  // --- UI: Loading State while checking roles ---
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Verifying Staff Access...
        </p>
      </div>
    );
  }

  // Only render the scanner if the user is authorized
  if (!isAuthorized) return null;

  return (
    <div className={`min-h-[100dvh] py-10 transition-colors duration-500 flex flex-col justify-center ${
      !scanResult 
        ? 'bg-slate-50' 
        : scanResult.success 
          ? 'bg-green-600' 
          : 'bg-red-600'
    }`}>
      <div className="container mx-auto px-4 max-w-md w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-3 rounded-full mb-4 ${scanResult ? 'bg-white/20' : 'bg-orange-500/10'}`}>
            <Scan className={`h-8 w-8 ${scanResult ? 'text-white' : 'text-orange-600'}`} />
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${scanResult ? 'text-white' : 'text-slate-900'}`}>
            Entry Gate
          </h1>
          <p className={`${scanResult ? 'text-white/80' : 'text-slate-500'} font-medium`}>
            Chavara Cultural Centre
          </p>
        </div>

        {showScanner ? (
          /* CAMERA VIEW */
          <Card className="overflow-hidden border-4 border-white shadow-2xl relative aspect-square bg-black rounded-3xl">
            <QRScanner onScanSuccess={handleScanSuccess} />
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
                <Loader2 className="h-12 w-12 animate-spin mb-2" />
                <p className="font-bold uppercase tracking-tighter text-sm">Validating...</p>
              </div>
            )}
          </Card>
        ) : (
          /* RESULT VIEW */
          <Card className="p-8 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300 border-none rounded-3xl">
            {scanResult?.success ? (
              <div className="space-y-6">
                <CheckCircle className="h-32 w-32 text-green-500 mx-auto" />
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">GRANTED</h2>
                  <p className="text-green-600 font-bold uppercase tracking-widest mt-1">Access Permitted</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100 text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <User className="text-slate-400" size={20}/>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Customer</p>
                      <p className="text-lg font-bold text-slate-800 truncate">{scanResult.customer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-full shadow-sm">
                        <Armchair className="text-orange-600" size={20}/>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Confirmed Seats</p>
                      <p className="text-3xl font-black text-orange-600 leading-none">
                        {scanResult.seats}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t pt-4">
                    <Calendar className="text-slate-400" size={16}/>
                    <p className="text-xs font-bold text-slate-500 truncate uppercase">{scanResult.event}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-10">
                <XCircle className="h-32 w-32 text-red-500 mx-auto" />
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">DENIED</h2>
                  <div className="bg-red-50 p-4 rounded-xl mt-4 border border-red-100">
                    <p className="text-red-700 font-bold text-lg leading-tight">
                        {scanResult?.message || "Invalid Entry Attempt"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              className="w-full h-20 text-2xl font-black shadow-lg rounded-2xl active:scale-95 transition-transform" 
              variant={scanResult?.success ? "default" : "destructive"}
              onClick={resetScan}
            >
              <RefreshCw className="mr-3 h-6 w-6" />
              SCAN NEXT
            </Button>
          </Card>
        )}

        {/* Device Footer info */}
        <div className="mt-10 flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full animate-pulse ${scanResult ? 'bg-white' : 'bg-green-500'}`} />
                <p className={`text-[10px] font-bold uppercase tracking-widest ${scanResult ? 'text-white/60' : 'text-slate-400'}`}>
                    Terminal Online
                </p>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${scanResult ? 'text-white/60' : 'text-slate-400'}`}>
                Staff: {localStorage.getItem('user_id')?.split('@')[0] || 'Admin'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default TicketVerification;