import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShowTime } from "@/data/events";

interface ShowTimeSelectorProps {
  showTimes: ShowTime[];
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

const ShowTimeSelector = ({
  showTimes,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: ShowTimeSelectorProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="font-serif font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Select Date
        </h3>
        <div className="flex flex-wrap gap-3">
          {showTimes.map((show) => (
            <motion.button
              key={show.date}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(show.date)}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                selectedDate === show.date
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border hover:border-primary hover:bg-primary/5"
              )}
            >
              {formatDate(show.date)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-serif font-bold text-xl text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Select Show Time
          </h3>
          <div className="flex flex-wrap gap-3">
            {showTimes
              .find((show) => show.date === selectedDate)
              ?.times.map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTimeSelect(time)}
                  className={cn(
                    "px-6 py-3 rounded-lg font-semibold transition-all",
                    selectedTime === time
                      ? "bg-accent text-accent-foreground shadow-lg"
                      : "bg-card border border-border hover:border-accent hover:bg-accent/5"
                  )}
                >
                  {time}
                </motion.button>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShowTimeSelector;
