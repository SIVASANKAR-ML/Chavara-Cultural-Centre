import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Calendar as CalendarIcon, Clock, MapPin, Tag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchEvents, ChavaraEvent } from "@/services/api"; // Real API

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [events, setEvents] = useState<ChavaraEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // 1. Fetch and Filter for UPCOMING events only
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();

        // --- FILTER FOR UPCOMING ONLY ---
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const currentTimeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

        const upcomingFiltered = data.filter(event => {
          // Check if at least one schedule is in the future
          return event.schedules?.some(sch => {
            if (sch.show_date > todayStr) return true;
            if (sch.show_date === todayStr) return sch.show_time >= currentTimeStr;
            return false;
          });
        });
        // --------------------------------

        setEvents(upcomingFiltered);
      } catch (error) {
        console.error("Failed to load calendar data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /**
   * Helper: Formats a JS Date object to YYYY-MM-DD string
   */
  const formatToFrappeDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Logic: Filter events to show in the RIGHT-SIDE CARD.
   */
  const getEventsForDate = (date: Date) => {
    const target = formatToFrappeDate(date);
    return events.filter(event => 
      event.schedules?.some(s => s.show_date === target)
    );
  };

  /**
   * Logic: Show the YELLOW DOT on the calendar.
   */
  const hasEvents = (date: Date) => {
    const target = formatToFrappeDate(date);
    return events.some(event => 
      event.schedules?.some(s => s.show_date === target)
    );
  };

  const selectedDateEvents = selectedDate instanceof Date 
    ? getEventsForDate(selectedDate) 
    : [];

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "long",
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header - Kept original bg-gradient-hero */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground mb-4">
              Event Calendar
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Browse upcoming events and plan your visit
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {/* View Mode Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex gap-2 w-fit mx-auto"
        >
          <div className="inline-flex gap-1 bg-muted/50 p-1 rounded-full border border-border">
            {['calendar', 'list'].map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setViewMode(mode as 'calendar' | 'list')}
                className={`relative px-6 py-2 rounded-full font-medium transition-all capitalize ${
                  viewMode === mode
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {viewMode === mode && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 40 }}
                  />
                )}
                {mode}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6 shadow-elegant">
                  <h2 className="font-serif font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                    Select a Date
                  </h2>
                  
                  <div className="calendar-wrapper">
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      tileClassName={({ date }) => {
                        return hasEvents(date) ? "has-events" : "";
                      }}
                      minDate={new Date()}
                      className="w-full border-none shadow-none"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Dates with upcoming events are highlighted
                    </p>
                  </motion.div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="p-6 shadow-elegant h-full sticky top-24">
                  <h2 className="font-serif font-bold text-2xl text-foreground mb-6">
                    Events on <span className="text-primary">{selectedDate instanceof Date ? formatDateLabel(selectedDate) : "Selected Date"}</span>
                  </h2>

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <div className="flex justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
                          />
                        </div>
                        <p className="text-muted-foreground mt-4">Syncing schedules...</p>
                      </motion.div>
                    ) : selectedDateEvents.length > 0 ? (
                      <motion.div
                        key="events"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {selectedDateEvents.map((event, idx) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10, x: -20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.3 }}
                            whileHover={{ x: 5 }}
                            className="p-4 bg-gradient-to-r from-muted/50 to-muted/20 rounded-lg border border-border hover:border-primary transition-all cursor-pointer group"
                          >
                            <div className="flex gap-3">
                              <img src={event.image} alt={event.title} className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-foreground line-clamp-1">{event.title}</h3>
                                <div className="space-y-1 text-xs text-muted-foreground mt-2">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    <span className="line-clamp-1">
                                      {event.schedules
                                        ?.filter(st => st.show_date === formatToFrappeDate(selectedDate as Date))
                                        .map(st => st.show_time)
                                        .join(', ')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    <span className="line-clamp-1">{event.venue}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                                  <span className="font-bold text-primary text-sm">₹{event.price}</span>
                                  <Link to={`/event/${event.id}`}>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90 h-7 px-3 text-xs group-hover:gap-1 gap-0 transition-all">
                                      Book <ChevronRight className="h-3 w-3" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <CalendarIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-muted-foreground">No upcoming events scheduled for this date.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif font-bold text-3xl text-foreground mb-8 text-center">
                All Upcoming Events
              </h2>
              
              <div className="space-y-4">
                {events.length > 0 ? events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="p-6 shadow-card hover:shadow-elegant transition-all">
                      <div className="flex flex-col md:flex-row gap-6">
                        <motion.img
                          src={event.image}
                          alt={event.title}
                          className="w-full md:w-48 h-48 object-cover rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-serif font-bold text-2xl text-foreground">{event.title}</h3>
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap"
                            >
                              {event.day}
                            </motion.span>
                          </div>
                          <div className="text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: event.description }} />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                            <motion.div
                              className="flex items-center gap-2 text-muted-foreground"
                              whileHover={{ x: 5 }}
                            >
                              <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>Starts: {event.startDate}</span>
                            </motion.div>
                            <motion.div
                              className="flex items-center gap-2 text-muted-foreground"
                              whileHover={{ x: 5 }}
                            >
                              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{event.venue}</span>
                            </motion.div>
                            <motion.div
                              className="flex items-center gap-2 text-muted-foreground"
                              whileHover={{ x: 5 }}
                            >
                              <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>₹{event.price}</span>
                            </motion.div>
                          </div>
                          <motion.div
                            className="flex items-center justify-between pt-4 border-t mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="text-2xl font-bold text-primary">₹{event.price}</span>
                            <Link to={`/event/${event.id}`}>
                              <Button className="bg-primary hover:bg-primary/90 group-hover:gap-2 gap-0 transition-all">
                                View Details <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No upcoming events found.
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style>{`
        .calendar-wrapper .react-calendar { width: 100%; border: none; font-family: inherit; }
        .react-calendar__tile {
          padding: 1.2rem 0.5rem;
          position: relative;
          transition: all 0.2s ease;
          border-radius: 0.5rem;
        }
        .react-calendar__tile.has-events::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7));
          border-radius: 50%;
          box-shadow: 0 0 8px hsl(var(--primary) / 0.5);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) scale(1.3); opacity: 0.7; }
        }
        .react-calendar__tile--active {
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.9)) !important;
          color: hsl(var(--primary-foreground)) !important;
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.3) !important;
          transform: scale(1.05);
          border: none !important;
        }
        .react-calendar__tile--active:enabled:hover {
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.9)) !important;
          box-shadow: 0 6px 16px hsl(var(--primary) / 0.4) !important;
          transform: scale(1.08);
          border: none !important;
        }
        .react-calendar__tile:enabled:hover {
          background: transparent !important;
          border: 1.5px solid hsl(var(--primary)) !important;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.15) !important;
          color: hsl(var(--foreground));
        }
        .react-calendar__navigation button {
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.2s ease;
          color: hsl(var(--foreground));
        }
        .react-calendar__navigation button:enabled:hover {
          background-color: hsl(var(--accent)) !important;
          transform: scale(1.08);
        }
        .react-calendar__tile.has-events.react-calendar__tile--active::after {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;