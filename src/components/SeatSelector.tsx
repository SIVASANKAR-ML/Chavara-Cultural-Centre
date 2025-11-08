import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  totalSeats: number;
  bookedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
}

const SeatSelector = ({ totalSeats, bookedSeats, onSeatsChange }: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const rows = 5; // A-E
  const seatsPerRow = Math.ceil(totalSeats / rows);
  
  const getSeatId = (row: number, col: number) => {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, D, E
    return `${rowLetter}${col + 1}`;
  };
  
  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return; // Can't select booked seats
    
    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId];
      onSeatsChange(newSeats);
      return newSeats;
    });
  };
  
  const getSeatStatus = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };
  
  const getSeatColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-primary cursor-not-allowed';
      case 'selected':
        return 'bg-accent hover:bg-accent/90 cursor-pointer';
      case 'available':
      default:
        return 'bg-green-500 hover:bg-green-600 cursor-pointer';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-full max-w-2xl h-2 bg-gradient-to-r from-transparent via-muted to-transparent" />
        <p className="text-sm text-muted-foreground">Screen</p>
      </div>
      
      {/* Seats Grid */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center gap-2">
            <span className="w-6 text-center font-semibold text-muted-foreground">
              {String.fromCharCode(65 + rowIndex)}
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: seatsPerRow }).map((_, colIndex) => {
                const seatId = getSeatId(rowIndex, colIndex);
                const status = getSeatStatus(seatId);
                
                return (
                  <motion.button
                    key={seatId}
                    whileHover={status !== 'booked' ? { scale: 1.1 } : {}}
                    whileTap={status !== 'booked' ? { scale: 0.95 } : {}}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={status === 'booked'}
                    className={cn(
                      "w-10 h-10 rounded-lg text-xs font-semibold transition-all",
                      getSeatColor(status),
                      status === 'selected' && "text-accent-foreground",
                      status === 'booked' && "text-primary-foreground opacity-70"
                    )}
                    title={`Seat ${seatId} - ${status}`}
                  >
                    {colIndex + 1}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary" />
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
      </div>
      
      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/10 rounded-lg border border-primary/20"
        >
          <p className="font-semibold text-foreground">
            Selected Seats: <span className="text-primary">{selectedSeats.join(', ')}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Total: {selectedSeats.length} seat(s)
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SeatSelector;
