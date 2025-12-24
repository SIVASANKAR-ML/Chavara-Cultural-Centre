import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  bookedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
}

/**
 * EXACT AUDITORIUM STRUCTURE
 * (matches your image logic)
 */
const SEAT_MAP: Record<
  string,
  { left: number[]; right: number[] }
> = {
    A: { left: [     1,2,3,4,5], right: [6,7,8,9,10,11,12,13,14] },

  B: { left: range(1,12), right: range(13,24) },
  C: { left: range(1,12), right: range(13,24) },
  D: { left: range(1,12), right: range(13,24) },
  E: { left: range(1,12), right: range(13,24) },
  F: { left: range(1,12), right: range(13,24) },
  G: { left: range(1,12), right: range(13,24) },
  H: { left: range(1,12), right: range(13,24) },
  I: { left: range(1,12), right: range(13,24) },
  J: { left: range(1,12), right: range(13,24) },
  K: { left: range(1,12), right: range(13,24) },
  L: { left: range(1,12), right: range(13,24) },
  M: { left: range(1,12), right: range(13,24) },
  N: { left: range(1,12), right: range(13,24) },
  O: { left: range(1,12), right: range(13,24) },
  P: { left: range(1,12), right: range(13,24) },
  Q: { left: range(1,12), right: range(13,24) },
  R: { left: range(1,12), right: range(13,24) },
  S: { left: range(1,12), right: range(13,24) },
};

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

const SeatSelector = ({ bookedSeats, onSeatsChange }: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      const updated = prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
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

  return (
    <div className="space-y-8">

      {/* SCREEN */}
      <div className="text-center">
        <div className="mx-auto h-2 max-w-3xl bg-gradient-to-r from-transparent via-muted to-transparent" />
        <p className="text-sm text-muted-foreground mt-1">Screen</p>
      </div>

      {/* SEATS */}
      <div>
        {Object.entries(SEAT_MAP).map(([row, blocks]) => (
          <div key={row} className={`flex justify-center items-center gap-4 ${row === 'J' ? 'mb-8' : 'mb-3'}`}>

            {/* LEFT ROW LABEL */}
            <span className="w-5 text-right text-muted-foreground">{row}</span>

            {/* LEFT BLOCK */}
            <div className="flex gap-2">
              {blocks.left.map(num => {
                const seatId = `${row}${num}`;
                return Seat(seatId);
              })}
            </div>

            {/* AISLE */}
            <div className="w-10" />

            {/* RIGHT BLOCK */}
            <div className="flex gap-2">
              {blocks.right.map(num => {
                const seatId = `${row}${num}`;
                return Seat(seatId);
              })}
            </div>

            {/* RIGHT ROW LABEL */}
            <span className="w-5 text-left text-muted-foreground">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );

  function Seat(seatId: string) {
    const status = seatStatus(seatId);

    return (
      <motion.button
        key={seatId}
        whileHover={status !== "booked" ? { scale: 1.1 } : {}}
        whileTap={status !== "booked" ? { scale: 0.95 } : {}}
        disabled={status === "booked"}
        onClick={() => toggleSeat(seatId)}
        className={cn(
  "w-7 h-7 sm:w-9 sm:h-9 rounded-full text-[10px] sm:text-xs border font-semibold",
  status === "booked" && "bg-muted/40 border-muted text-muted-foreground",
  status === "selected" && "bg-green-500 text-white border-green-600",
  status === "available" &&
    "border-green-500 text-green-600 hover:bg-green-50"
)}

      >
        {seatId.slice(1)}
      </motion.button>
    );
  }
};

export default SeatSelector;
