import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from "lucide-react";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  Dates with upcoming events are highlighted
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 shadow-elegant h-full">
              <h2 className="font-serif font-bold text-2xl text-foreground mb-6">
                Events on {selectedDate instanceof Date ? formatDateLabel(selectedDate) : "Selected Date"}
              </h2>

              {loading ? (
                <div className="text-center py-12 animate-pulse text-muted-foreground">Syncing schedules...</div>
              ) : selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary transition-all"
                    >
                      <div className="flex gap-4">
                        <img src={event.image} alt={event.title} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg text-foreground">{event.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>
                                {event.schedules
                                  ?.filter(st => st.show_date === formatToFrappeDate(selectedDate as Date))
                                  .map(st => st.show_time)
                                  .join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4">
                            <span className="font-bold text-primary">₹{event.price}</span>
                            <Link to={`/event/${event.id}`}>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                Book Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming events scheduled for this date.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <h2 className="font-serif font-bold text-3xl text-foreground mb-8 text-center">
            Upcoming Events List
          </h2>
          
          <div className="space-y-4">
            {events.length > 0 ? events.map((event) => (
              <Card key={event.id} className="p-6 shadow-card hover:shadow-elegant transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <img src={event.image} alt={event.title} className="w-full md:w-48 h-48 object-cover rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif font-bold text-2xl text-foreground">{event.title}</h3>
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">{event.day}</span>
                    </div>
                    <div className="text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: event.description }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>Starts: {event.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <span className="text-2xl font-bold text-primary">₹{event.price}</span>
                      <Link to={`/event/${event.id}`}>
                        <Button className="bg-primary">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="text-center py-10 text-muted-foreground">No upcoming events found.</div>
            )}
          </div>
        </motion.div>
      </section>

      <style>{`
        .calendar-wrapper .react-calendar { width: 100%; border: none; font-family: inherit; }
        .react-calendar__tile { padding: 1.2rem 0.5rem; position: relative; }
        .react-calendar__tile.has-events::after {
          content: ''; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
          width: 6px; height: 6px; background-color: hsl(var(--primary)); border-radius: 50%;
        }
        .react-calendar__tile--active { background-color: hsl(var(--primary)) !important; color: hsl(var(--primary-foreground)) !important; }
        .react-calendar__tile--active:enabled:hover { background-color: hsl(var(--primary)) !important; }
        .react-calendar__tile:enabled:hover { background-color: hsl(var(--accent)); }
        .react-calendar__navigation button { font-size: 1.1rem; font-weight: 600; }
        .react-calendar__navigation button:enabled:hover { background-color: hsl(var(--accent)); }
      `}</style>
    </div>
  );
};

export default CalendarPage;