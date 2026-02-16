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

  const formatDateMobile = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, dayNum, month };
  };

  const formatTime = (timeStr: string) => {
    // Handle time format like "21:59:48.104132" -> "21:59"
    if (!timeStr) return timeStr;
    const timeParts = timeStr.split(".");
    const mainTime = timeParts[0]; // Get "21:59:48"
    const timeComponents = mainTime.split(":");
    return `${timeComponents[0]}:${timeComponents[1]}`; // Return "21:59"
  };

  const formatTime12Hour = (timeStr: string) => {
    if (!timeStr) return timeStr;
    const timeParts = timeStr.split(".");
    const mainTime = timeParts[0];
    const [hours, minutes] = mainTime.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      {/* Desktop View - Original */}
      <div className="hidden lg:block space-y-6">
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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateSelect(show.date)}
                className={cn(
                  "px-6 py-3 rounded-lg font-semibold transition-all",
                  selectedDate === show.date
                    ? "bg-primary from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/40 ring-2 ring-orange-300 ring-offset-2"
                    : "bg-primary text-primary-foreground shadow-lg"
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
                        ? "bg-primary from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/40 ring-2 ring-orange-300 ring-offset-2"
                        : "bg-accent text-accent-foreground shadow-lg"
                    )}
                  >
                    {formatTime(time)}
                  </motion.button>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile View - BookMyShow Style */}
      <div className="lg:hidden space-y-4">
        {/* Date Selection - Horizontal Scroll */}
        <div>
          <h3 className="font-bold text-base text-gray-900 mb-3 px-4">Select Date</h3>
          <div className="overflow-x-auto scrollbar-hide px-4">
            <div className="flex gap-3 pb-2">
              {showTimes.map((show) => {
                const { day, dayNum, month } = formatDateMobile(show.date);
                const isSelected = selectedDate === show.date;
                
                return (
                  <motion.button
                    key={show.date}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDateSelect(show.date)}
                    className={cn(
                      "flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-lg border-2 transition-all",
                      isSelected
                        ? "bg-primary border-primary-600 text-white shadow-lg"
                        : "bg-white border-gray-200 text-gray-700 active:bg-gray-50"
                    )}
                  >
                    <p className={cn(
                      "text-xs font-semibold uppercase mb-1",
                      isSelected ? "text-white" : "text-gray-500"
                    )}>
                      {day}
                    </p>
                    <p className="text-2xl font-bold mb-0.5">{dayNum}</p>
                    <p className={cn(
                      "text-xs uppercase",
                      isSelected ? "text-red-100" : "text-gray-500"
                    )}>
                      {month}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Selection - Card Style */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="px-4"
          >
            <h3 className="font-bold text-base text-gray-900 mb-3">Select Show Time</h3>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-3 gap-2">
                {showTimes
                  .find((show) => show.date === selectedDate)
                  ?.times.map((time) => {
                    const isSelected = selectedTime === time;
                    
                    return (
                      <motion.button
                        key={time}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTimeSelect(time)}
                        className={cn(
                          "relative py-3 px-2 rounded-lg border-2 transition-all text-center",
                          isSelected
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "bg-white border-gray-200 text-gray-700 active:bg-gray-50"
                        )}
                      >
                        <p className="text-sm font-bold">{formatTime12Hour(time)}</p>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
              </div>
            </div>

            {/* Availability Note */}
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Available seats will be shown after time selection
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ShowTimeSelector;