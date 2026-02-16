import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, MapPin, Calendar, Clock, Ticket, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ChavaraEvent } from "@/services/api";

interface MobileBookingConfirmProps {
  event: ChavaraEvent;
  selectedSeats: string[];
  selectedSchedule: {
    name: string;
    show_date: string;
    show_time: string;
  };
  customerName: string;
  phone: string;
  email: string;
  totalPrice: number;
  convenienceFee: number;
  finalAmount: number;
  onBack: () => void;
  onConfirm: () => void;
  isBooking: boolean;
  isAdmin: boolean;
}

const MobileBookingConfirm = ({
  event,
  selectedSeats,
  selectedSchedule,
  customerName,
  phone,
  email,
  totalPrice,
  convenienceFee,
  finalAmount,
  onBack,
  onConfirm,
  isBooking,
  isAdmin
}: MobileBookingConfirmProps) => {
  const [showConvenienceFee, setShowConvenienceFee] = useState(false);

  // Format date for better display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format time for 12-hour display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:hidden">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-lg">Confirm booking</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Event Details Card */}
        <Card className="m-4 p-4 rounded-xl border-none shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {formatDate(selectedSchedule.show_date)} | {formatTime(selectedSchedule.show_time)}
              </p>
              {/* <p className="text-xs text-gray-500">{event.event_language || 'Hindi'} (2D)</p> */}
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl text-gray-900">{selectedSeats.length}</div>
              <div className="text-xs text-red-500 flex items-center gap-1">
                <Ticket size={12} />
                Ticket
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 mb-2">
            {selectedSeats.join(', ')}
          </div>
          
          <div className="text-xs text-gray-600">
            <MapPin className="inline h-3 w-3 mr-1" />
            {'Chavara Cultural Centre'}
          </div>
          
          {/* Cancellation Info */}
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-xs font-semibold text-amber-900 mb-1">Cancellation Unavailable</p>
            <p className="text-xs text-amber-700">This venue does not support booking cancellation.</p>
          </div>
        </Card>

        {/* Pricing Breakdown */}
        <Card className="m-4 p-4 rounded-xl border-none shadow-sm">
          <div className="space-y-3">
            {/* Ticket Price */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Ticket(s) price</span>
              <span className="font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</span>
            </div>

            {/* Convenience Fee with Dropdown */}
            <div>
              <button 
                onClick={() => setShowConvenienceFee(!showConvenienceFee)}
                className="w-full flex justify-between items-center"
              >
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  Convenience fees
                  {showConvenienceFee ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
                <span className="font-semibold text-gray-900">₹{convenienceFee.toFixed(2)}</span>
              </button>
              
              {showConvenienceFee && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 ml-4 space-y-2 text-xs text-gray-600"
                >
                  <div className="flex justify-between">
                    <span>Base Amount</span>
                    <span>₹{Math.round(convenienceFee / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Integrated GST (18%)</span>
                    <span>₹{Math.round(convenienceFee * (18/118)).toFixed(2)}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Optional: Contribution Section */}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">Give to Underprivileged Musicians</p>
                  <p className="text-xs text-gray-500">(₹1 per ticket) <span className="text-blue-600 underline">VIEW T&C</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">₹0.00</p>
                  <button className="text-xs text-red-500 font-medium">Add ₹{selectedSeats.length}.00</button>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="pt-3 border-t flex justify-between items-center">
              <span className="font-bold text-gray-900">Order total</span>
              <span className="font-bold text-lg text-gray-900">₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Customer Details */}
        <Card className="m-4 p-4 rounded-xl border-none shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-900">For Sending Booking Details</h3>
            <button onClick={onBack} className="text-sm text-red-500 font-medium flex items-center gap-1">
              <span>✏️</span> Edit
            </button>
          </div>
          
          <div className="space-y-1 text-sm text-gray-700">
            <p>{phone} | {email}</p>
            <p className="text-xs text-gray-500">{customerName}</p>
            <p className="text-xs text-gray-500">Kerala (for GST purposes)</p>
          </div>
        </Card>

        {/* Apply Offers */}
        <Card className="m-4 p-4 rounded-xl border-none shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎟️</span>
            <span className="font-semibold text-gray-900">Apply Offers</span>
          </div>
          <ChevronRight className="text-gray-400" />
        </Card>

        {/* Consent */}
        <div className="mx-4 mb-4">
          <p className="text-xs text-gray-600">
            By proceeding, I express my consent to complete this transaction.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">₹{finalAmount.toFixed(2)}</p>
          </div>
          <Button
            onClick={onConfirm}
            disabled={isBooking}
            className="flex-1 h-12 rounded-lg bg-primary hover:bg-red-700 text-white font-bold text-base"
          >
            {isBooking ? (
              "Processing..."
            ) : isAdmin ? (
              "Confirm Booking"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBookingConfirm;