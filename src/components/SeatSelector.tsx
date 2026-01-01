import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  totalSeats?: number;
  bookedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
}

const SEAT_MAP: Record<
  string,
  { left: number[]; right: number[] }
> = {
  // Row A Logic: 5 above 12, 6 above 13
  A: { left: [1, 2, 3, 4, 5], right: [6, 7, 8, 9, 10, 11, 12, 13, 14] },
  B: { left: range(1, 12), right: range(13, 24) },
  C: { left: range(1, 12), right: range(13, 24) },
  D: { left: range(1, 12), right: range(13, 24) },
  E: { left: range(1, 12), right: range(13, 24) },
  F: { left: range(1, 12), right: range(13, 24) },
  G: { left: range(1, 12), right: range(13, 24) },
  H: { left: range(1, 12), right: range(13, 24) },
  I: { left: range(1, 12), right: range(13, 24) },
  J: { left: range(1, 12), right: range(13, 24) },
  K: { left: range(1, 12), right: range(13, 24) },
  L: { left: range(1, 12), right: range(13, 24) },
  M: { left: range(1, 12), right: range(13, 24) },
  N: { left: range(1, 12), right: range(13, 24) },
  O: { left: range(1, 12), right: range(13, 24) },
  P: { left: range(1, 12), right: range(13, 24) },
  Q: { left: range(1, 12), right: range(13, 24) },
  R: { left: range(1, 12), right: range(13, 24) },
  S: { left: range(1, 12), right: range(13, 24) },
};

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

const SeatSelector = ({ totalSeats, bookedSeats, onSeatsChange }: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;
    const total = totalSeats ?? Object.values(SEAT_MAP).reduce((acc, cur) => acc + cur.left.length + cur.right.length, 0);
    const remaining = Math.max(0, total - bookedSeats.length - selectedSeats.length);
    // If trying to select a new seat but no remaining capacity, prevent it
    if (!selectedSeats.includes(seatId) && remaining <= 0) {
      // Simple user feedback
      // eslint-disable-next-line no-alert
      alert("No more seats available for this show.");
      return;
    }
    setSelectedSeats((prev) => {
      const updated = prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId];
      onSeatsChange(updated);
      return updated;
    });
  };

  const seatStatus = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  function Seat(seatId: string) {
    const status = seatStatus(seatId);
    return (
      <motion.button
        key={seatId}
        whileHover={status !== "booked" ? { scale: 1.1 } : {}}
        whileTap={status !== "booked" ? { scale: 0.9 } : {}}
        disabled={status === "booked"}
        onClick={() => toggleSeat(seatId)}
        className={cn(
          "w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-full text-[8px] xs:text-[10px] sm:text-xs border font-semibold flex items-center justify-center shrink-0 transition-all",
          status === "booked" && "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed",
          status === "selected" && "bg-green-500 text-white border-green-600 shadow-md",
          status === "available" && "border-green-500 text-green-600 hover:bg-green-50"
        )}
      >
        {seatId.slice(1)}
      </motion.button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-white py-10">
      
      {/* SEATING AREA - Enables horizontal scroll like BookMyShow */}
      <div className="w-full overflow-x-auto pb-12 px-4 scrollbar-hide touch-pan-x">
        <div className="min-w-fit flex flex-col items-center mx-auto space-y-2 sm:space-y-3">
          {Object.entries(SEAT_MAP).map(([row, blocks]) => (
            <div 
              key={row} 
              className={cn(
                "flex items-center gap-2 sm:gap-4",
                row === 'J' && "mb-8" // Standard aisle gap between rows
              )}
            >
              {/* LEFT ROW LABEL */}
              <span className="w-4 text-center text-[10px] sm:text-xs text-gray-400 font-bold uppercase">{row}</span>

              {/* LEFT BLOCK */}
              <div className="flex gap-1 sm:gap-2">
                {/* Row A Padding: Add 7 empty spaces so seat 5 aligns with seat 12 below */}
                {row === 'A' && Array(7).fill(0).map((_, i) => (
                  <div key={`pl-${i}`} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9" />
                ))}
                {blocks.left.map(num => Seat(`${row}${num}`))}
              </div>

              {/* MAIN AISLE */}
              <div className="w-6 sm:w-10" />

              {/* RIGHT BLOCK */}
              <div className="flex gap-1 sm:gap-2">
                {blocks.right.map(num => Seat(`${row}${num}`))}
                {/* Row A End Padding: 3 spaces to keep row visual balance */}
                {row === 'A' && Array(3).fill(0).map((_, i) => (
                  <div key={`pr-${i}`} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9" />
                ))}
              </div>

              {/* RIGHT ROW LABEL */}
              <span className="w-4 text-center text-[10px] sm:text-xs text-gray-400 font-bold uppercase">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SCREEN SECTION (Now at the Bottom) */}
      <div className="w-full max-w-sm sm:max-w-md mt-6 px-4">
        <div className="flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">All eyes this way</p>
          <div className="relative w-full h-2">
            {/* Curved Screen Effect */}
            <div className="absolute inset-0 bg-gray-200 rounded-[100%] scale-y-50 shadow-[0_-15px_30px_rgba(0,0,0,0.05)]" />
          </div>
          <p className="text-[10px] text-gray-300 mt-4">Screen</p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex gap-6 mt-10 text-[10px] sm:text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-green-500" /> Available</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> Selected</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200" /> Sold</div>
      </div>
    </div>
  );
};

export default SeatSelector;