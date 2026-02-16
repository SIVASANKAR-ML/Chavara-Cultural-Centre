import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RowPricing {
  row_from: string;
  row_to: string;
  price: number;
}

interface SeatSelectorProps {
  totalSeats?: number;
  bookedSeats: string[];
  lockedSeats?: string[];
  rowPricing?: RowPricing[]; // NEW: Row-wise pricing from API
  onSeatsChange: (seats: string[], totalPrice: number) => void; // Updated to include price
}

const SEAT_MAP: Record<
  string,
  { left: number[]; right: number[] }
> = {
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

const SeatSelector = ({ 
  totalSeats, 
  bookedSeats, 
  lockedSeats = [], 
  rowPricing = [],
  onSeatsChange 
}: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Debug: Log rowPricing when component mounts or updates
  console.log('SeatSelector rowPricing:', rowPricing);

  // NEW: Function to get price for a specific row
  const getRowPrice = (row: string): number => {
    const pricing = rowPricing.find(p => {
      const from = p.row_from.toUpperCase();
      const to = p.row_to.toUpperCase();
      return row >= from && row <= to;
    });
    
    console.log(`Row ${row} pricing:`, pricing?.price || 0);
    return pricing?.price || 0;
  };

  // NEW: Calculate total price based on selected seats
  const calculateTotalPrice = (seats: string[]): number => {
    return seats.reduce((total, seatId) => {
      const row = seatId[0];
      return total + getRowPrice(row);
    }, 0);
  };

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId) || lockedSeats.includes(seatId)) return;
    const total = totalSeats ?? Object.values(SEAT_MAP).reduce((acc, cur) => acc + cur.left.length + cur.right.length, 0);
    const remaining = Math.max(0, total - bookedSeats.length - lockedSeats.length - selectedSeats.length);
    if (!selectedSeats.includes(seatId) && remaining <= 0) {
      alert("No more seats available for this show.");
      return;
    }
    const updated = selectedSeats.includes(seatId)
      ? selectedSeats.filter((s) => s !== seatId)
      : [...selectedSeats, seatId];
    
    setSelectedSeats(updated);
    // NEW: Calculate and pass price immediately
    const totalPrice = calculateTotalPrice(updated);
    onSeatsChange(updated, totalPrice);
  };

  const seatStatus = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (lockedSeats.includes(seatId)) return "locked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  function Seat(seatId: string) {
    const status = seatStatus(seatId);
    const row = seatId[0];
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
          "w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full text-[7px] sm:text-[8px] md:text-xs border-2 font-semibold flex items-center justify-center shrink-0 transition-all",
          status === "booked" && "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed",
          status === "locked" && "bg-yellow-100 border-yellow-300 text-yellow-600 cursor-not-allowed",
          status === "selected" && colors?.selected,
          status === "available" && colors?.available
        )}
        style={{ touchAction: 'manipulation' }}
      >
        {seatId.slice(1)}
      </motion.button>
    );
  }

  // NEW: Get unique row groups with pricing
  const getRowGroupPricing = (): { group: RowGroup; price: number }[] => {
    const groups: RowGroup[] = ["AE", "FJ", "KP", "QS"];
    return groups.map(group => {
      const firstRow = ROW_GROUPS[group][0];
      const price = getRowPrice(firstRow);
      return { group, price };
    });
  };

  const rowGroupPricing = getRowGroupPricing();

  return (
    <div className="w-full flex flex-col items-center bg-white py-8">
      
      {/* NEW: Price legend at the top */}
      {rowPricing.length > 0 && (
        <div className="w-full max-w-4xl mb-6 px-3">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Pricing by Row</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {rowGroupPricing.map(({ group, price }) => (
              <div 
                key={group}
                className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg border bg-white"
              >
                <div className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2",
                  ROW_COLORS[group].available.includes("red") && "border-red-500",
                  ROW_COLORS[group].available.includes("purple") && "border-purple-500",
                  ROW_COLORS[group].available.includes("green") && "border-green-500",
                  ROW_COLORS[group].available.includes("blue") && "border-blue-500"
                )} />
                <div className="text-[10px] sm:text-sm">
                  <div className="font-semibold text-gray-700">₹{price}</div>
                  <div className="text-gray-500 text-[9px] sm:text-[10px]">{group}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEATING AREA */}
      <div className="w-full overflow-x-auto pb-8 px-2 scrollbar-hide " style={{ touchAction: 'pan-y pan-x' }}>
        <div className="min-w-fit flex flex-col items-center mx-auto space-y-1 sm:space-y-2">
          {Object.entries(SEAT_MAP).map(([row, blocks]) => (
  <div key={row}>
    
    {/* SEAT ROW — unchanged */}
    <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
      <span className="w-3 sm:w-4 text-center text-[8px] sm:text-[10px] md:text-sm text-gray-400 font-bold uppercase">
        {row}
      </span>

      <div className="flex gap-0.5 sm:gap-1 md:gap-2">
        {row === 'A' &&
          Array(7).fill(0).map((_, i) => (
            <div key={`pl-${i}`} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          ))
        }
        {blocks.left.map(num => Seat(`${row}${num}`))}
      </div>

      <div className="w-3 sm:w-5 md:w-10" />

      <div className="flex gap-0.5 sm:gap-1 md:gap-2">
        {blocks.right.map(num => Seat(`${row}${num}`))}
        {row === 'A' &&
          Array(3).fill(0).map((_, i) => (
            <div key={`pr-${i}`} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          ))
        }
        {row === 'J' &&
          Array(1).fill(0).map((_, i) => (
            <div key={`pr-${i}`} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          ))
        }
      </div>

      <span className="w-3 sm:w-4 text-center text-[8px] sm:text-[10px] md:text-sm text-gray-400 font-bold uppercase">
        {row}
      </span>
    </div>

    {/* ✅ REAL WALKWAY — DOES NOT TOUCH SEAT COLORS */}
    {row === "J" && (
      <div className="h-16 flex items-center justify-center">
        <div className="w-full border-t border-dashed border-gray-300 text-[10px] text-gray-400 text-center">
          WALKWAY
        </div>
      </div>
    )}
  </div>
))}

        </div>
      </div>

      {/* SCREEN SECTION */}
      <div className="w-full max-w-sm sm:max-w-md mt-4 sm:mt-6 px-4">
        <div className="flex flex-col items-center">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-400 mb-2">All eyes this way</p>
          <div className="relative w-full h-2">
            <div className="absolute inset-0 bg-gray-200 rounded-[100%] scale-y-50 shadow-[0_-15px_30px_rgba(0,0,0,0.05)]" />
          </div>
          <p className="text-[8px] sm:text-[10px] text-gray-300 mt-2">Screen</p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 mt-6 text-[8px] sm:text-[10px] text-gray-500 font-medium px-4">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-green-500" /> Available</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" /> Selected</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-100 border border-yellow-300" /> Locked</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200" /> Sold</div>
      </div>

      {/* NEW: Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Selected Seats ({selectedSeats.length})
            </span>
            <span className="text-base sm:text-lg font-bold text-green-600">
              ₹{calculateTotalPrice(selectedSeats)}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 break-words">
            {selectedSeats.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;