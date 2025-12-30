import { useState } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { upcomingEvents } from "@/data/events";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return upcomingEvents.filter(event => {
      return event.showTimes.some(showTime => {
        const eventDate = new Date(showTime.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    });
  };

  // Check if date has events
  const hasEvents = (date: Date) => {
    return upcomingEvents.some(event => {
      return event.showTimes.some(showTime => {
        const eventDate = new Date(showTime.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    });
  };

  // Get selected date events
  const selectedDateEvents = selectedDate instanceof Date 
    ? getEventsForDate(selectedDate) 
    : [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "long",
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
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

      {/* Calendar Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
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
                  Dates with events are highlighted
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Events for Selected Date */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 shadow-elegant">
              <h2 className="font-serif font-bold text-2xl text-foreground mb-6">
                Events on {selectedDate instanceof Date ? formatDate(selectedDate) : "Selected Date"}
              </h2>

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex gap-4">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <h3 className="font-serif font-bold text-lg text-foreground">
                            {event.title}
                          </h3>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>
                                {event.showTimes
                                  .filter(st => st.date === (selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : ''))
                                  .flatMap(st => st.times)
                                  .join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-primary" />
                              <span>{event.category}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
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
                  <p className="text-muted-foreground">
                    No events scheduled for this date.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check other dates or browse our upcoming events.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* All Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <h2 className="font-serif font-bold text-3xl text-foreground mb-8 text-center">
            All Upcoming Events
          </h2>
          
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="p-6 shadow-card hover:shadow-elegant transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif font-bold text-2xl text-foreground">
                        {event.title}
                      </h3>
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {event.category}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>
                          {event.showTimes.length > 1 
                            ? `${event.showTimes.length} dates available` 
                            : new Date(event.showTimes[0].date).toLocaleDateString("en-US", { 
                                month: "long", 
                                day: "numeric", 
                                year: "numeric" 
                              })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Multiple showtimes</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-primary">₹{event.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">onwards</span>
                      </div>
                      <Link to={`/event/${event.id}`}>
                        <Button className="bg-primary hover:bg-primary/90">
                          View Details & Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      <style>{`
        .calendar-wrapper .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .react-calendar__tile {
          padding: 1rem 0.5rem;
          position: relative;
        }
        
        .react-calendar__tile.has-events::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: hsl(var(--primary));
          border-radius: 50%;
        }
        
        .react-calendar__tile--active {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        .react-calendar__tile--active:enabled:hover {
          background-color: hsl(var(--primary)) !important;
        }
        
        .react-calendar__tile:enabled:hover {
          background-color: hsl(var(--accent));
        }
        
        .react-calendar__navigation button {
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .react-calendar__navigation button:enabled:hover {
          background-color: hsl(var(--accent));
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;