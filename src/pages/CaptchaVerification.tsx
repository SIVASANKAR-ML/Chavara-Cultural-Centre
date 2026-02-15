import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const CaptchaVerification = () => {
  const { eventId, scheduleId } = useParams(); // ✅ This captures 'schedule.name' from the URL
  const navigate = useNavigate();
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const grecaptcha = (window as any).grecaptcha;
      if (grecaptcha && grecaptcha.render) {
        try {
          const widgetId = grecaptcha.render('recaptcha-container', {
            'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Replace with your actual key
            'theme': 'light',
            'size': 'normal',
          });
          setRecaptchaWidgetId(widgetId);
        } catch (e) {
          console.error('reCAPTCHA render error:', e);
          toast.error("Failed to load verification. Please refresh.");
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyAndContinue = () => {
    const grecaptcha = (window as any).grecaptcha;
    
    if (!grecaptcha || recaptchaWidgetId === null) {
      toast.error("Verification not loaded. Please wait a moment.");
      return;
    }

    const token = grecaptcha.getResponse(recaptchaWidgetId);
    
    if (!token) {
      toast.error("Please complete the verification");
      return;
    }

    setIsVerifying(true);
    
    // Store verification in sessionStorage (optional security)
    sessionStorage.setItem(`verified_${eventId}_${scheduleId}`, 'true');
    
    // Navigate to seat booking page
    setTimeout(() => {
      toast.success("Verification successful!");
      navigate(`/seat-booking/${eventId}/${scheduleId}`); // ✅ scheduleId = schedule.name from URL
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-black text-lg text-slate-900">Security Verification</h1>
              <p className="text-xs text-slate-500 font-medium">Confirm you're human to continue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 rounded-3xl border-none shadow-2xl bg-white">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Verify You're Human
              </h2>
              <p className="text-sm text-slate-500">
                This helps us prevent bots and ensure fair seat allocation for everyone
              </p>
            </div>

            {/* reCAPTCHA Container */}
            <div className="flex justify-center mb-6">
              <div id="recaptcha-container" className="transform scale-95 sm:scale-100"></div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleVerifyAndContinue}
              disabled={isVerifying}
              className="w-full h-14 rounded-xl text-base font-black shadow-lg hover:shadow-xl transition-all"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Verifying...
                </div>
              ) : (
                "Continue to Seat Selection"
              )}
            </Button>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Protected by reCAPTCHA and subject to Google's{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                  Terms of Service
                </a>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CaptchaVerification;