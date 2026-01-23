import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  totalSeats?: number;
  bookedSeats: string[];
  lockedSeats?: string[];
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
  J: { left: range(1, 12), right: range(13, 23) },
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

type RowGroup = "AE" | "FJ" | "KP" | "QS";

const ROW_GROUPS: Record<RowGroup, string[]> = {
  AE: ["A", "B", "C", "D", "E"],
  FJ: ["F", "G", "H", "I", "J"],
  KP: ["K", "L", "M", "N", "O", "P"],
  QS: ["Q", "R", "S"],
};

const ROW_COLORS: Record<RowGroup, { available: string; selected: string }> = {
  AE: {
    available: "border-red-500 text-red-600 hover:bg-red-50",
    selected: "bg-red-500 border-red-600 text-white",
  },
  FJ: {
    available: "border-purple-500 text-purple-600 hover:bg-purple-60",
    selected: "bg-purple-500 border-purple-600 text-white",
  },
  KP: {
    available: "border-green-500 text-green-600 hover:bg-green-50",
    selected: "bg-green-500 border-green-600 text-white",
  },
  QS: {
    available: "border-blue-500 text-blue-600 hover:bg-blue-50",
    selected: "bg-blue-500 border-blue-600 text-white",
  },
};

function getRowGroup(row: string): RowGroup | null {
  return (Object.keys(ROW_GROUPS) as RowGroup[]).find(group =>
    ROW_GROUPS[group].includes(row)
  ) ?? null;
}


const SeatSelector = ({ totalSeats, bookedSeats, lockedSeats = [], onSeatsChange }: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId) || lockedSeats.includes(seatId)) return;
    const total = totalSeats ?? Object.values(SEAT_MAP).reduce((acc, cur) => acc + cur.left.length + cur.right.length, 0);
    const remaining = Math.max(0, total - bookedSeats.length - lockedSeats.length - selectedSeats.length);
    if (!selectedSeats.includes(seatId) && remaining <= 0) {
      // eslint-disable-next-line no-alert
      alert("No more seats available for this show.");
      return;
    }
    const updated = selectedSeats.includes(seatId)
      ? selectedSeats.filter((s) => s !== seatId)
      : [...selectedSeats, seatId];
    
    setSelectedSeats(updated);
    onSeatsChange(updated);
  };

  const seatStatus = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (lockedSeats.includes(seatId)) return "locked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  function Seat(seatId: string) {
    const status = seatStatus(seatId);
    const row = seatId[0]; // A, B, C...
    const group = getRowGroup(row);
    const colors = group ? ROW_COLORS[group] : null;  

    return (
      <motion.button
        key={seatId}
        whileHover={status !== "booked" ? { scale: 1.1 } : {}}
        whileTap={status !== "booked" ? { scale: 0.9 } : {}}
        disabled={status === "booked" || status === "locked"}
        onClick={() => toggleSeat(seatId)}
        className={cn(
          "w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-full text-[8px] xs:text-[10px] sm:text-sm border-2 font-semibold flex items-center justify-center shrink-0 transition-all",
          status === "booked" && "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed",
          status === "locked" && "bg-yellow-100 border-yellow-300 text-yellow-600 cursor-not-allowed",
           status === "selected" && colors?.selected,
        status === "available" && colors?.available
        )}
      >
        {seatId.slice(1)}
      </motion.button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-white py-8">
      
      {/* SEATING AREA - Enables horizontal scroll like BookMyShow */}
      <div className="w-full overflow-x-auto pb-8 px-2 scrollbar-hide touch-pan-x">
        <div className="min-w-fit flex flex-col items-center mx-auto space-y-2 xs:space-y-3">
          {Object.entries(SEAT_MAP).map(([row, blocks]) => (
            <div 
              key={row} 
              className={cn(
                "flex items-center gap-2 sm:gap-4",
                row === 'J' && "mb-8" // Standard aisle gap between rows
              )}
            >
            <div 
                key={row} 
                className={cn(
                  "flex items-center gap-2 sm:gap-4",
                  row === 'K' && "mt-8"   // 👈 gap between J and L
                )}
            >
            
              {/* LEFT ROW LABEL */}
              <span className="w-4 text-center text-[10px] sm:text-sm text-gray-400 font-bold uppercase">{row}</span>

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
                {row === 'J' && Array(1).fill(0).map((_, i) => (
                  <div key={`pr-${i}`} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9" />
                ))}
              </div>

              {/* RIGHT ROW LABEL */}
              <span className="w-4 text-center text-[10px] sm:text-sm text-gray-400 font-bold uppercase">{row}</span>
            </div>
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
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300" /> Locked</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200" /> Sold</div>
      </div>
    </div>
  );
};

export default SeatSelector;