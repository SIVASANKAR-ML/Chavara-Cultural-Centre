import { motion } from "framer-motion";
import { Play, History } from "lucide-react"; 
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { pastEvents as highlightVideos } from "@/data/events"; 
import { fetchEvents, type ChavaraEvent } from "@/services/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ================= TYPEWRITER HEADING ================= */
const TypewriterHeading = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string; }) => {
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

const Events = () => {
  const [events, setEvents] = useState<ChavaraEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // --- TIME CONSTANTS ---
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const currentTimeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

  // --- REFINED FILTER LOGIC ---

  // 1. LIVE NOW: Has a show exactly today
  const liveEvents = events.filter(event => 
    event.schedules?.some(sch => sch.show_date === todayStr)
  );

  // 2. UPCOMING: Has a future schedule OR (no schedules and startDate is future)
  const upcoming = events.filter(event => {
    const hasFutureSchedule = event.schedules?.some(sch => {
      if (sch.show_date > todayStr) return true;
      if (sch.show_date === todayStr) return sch.show_time >= currentTimeStr;
      return false;
    });

    if (hasFutureSchedule) return true;
    
    // Fallback: if no schedules are added yet, check the main startDate
    if (!event.schedules || event.schedules.length === 0) {
      return event.startDate >= todayStr;
    }
    
    return false;
  }).sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

  // 3. REAL PAST EVENTS FROM CHAVARA (DYNAMIC): Not Live and Not Upcoming
  const realPastEvents = events.filter(event => {
    const isLive = liveEvents.some(e => e.id === event.id);
    const isUpcoming = upcoming.some(e => e.id === event.id);
    return !isLive && !isUpcoming;
  }).sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12">
        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground">Events</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse upcoming events, see what is live now, and watch highlights from past performances.
          </p>
        </motion.div>

        {loading && <div className="text-center py-20 animate-pulse">Loading Chavara events...</div>}
        
        {!loading && !error && (
          <>
            {/* LIVE NOW SECTION */}
            {liveEvents.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <TypewriterHeading text="Live Now" className="font-serif font-bold text-2xl text-red-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {liveEvents.map((evt, idx) => (
                    <EventCard key={evt.id} event={evt} index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* UPCOMING EVENTS SECTION */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-4 w-4 rounded-full border-2 border-orange-500 animate-spin"></div>
                <TypewriterHeading text="Upcoming Events" delay={0.2} className="font-serif font-bold text-2xl text-orange-600" />
              </div>
              {upcoming.length === 0 ? (
                <p className="text-muted-foreground">No upcoming events at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcoming.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              )}
            </section>

            {/* PAST EVENTS FROM CHAVARA (RESTORED SECTION) */}
            {realPastEvents.length > 0 && (
              <section className="mb-12 pt-10 border-t">
                <div className="flex items-center gap-3 mb-6">
                  <History className="h-6 w-6 text-muted-foreground" />
                  <TypewriterHeading text="Past Events from Chavara" className="font-serif font-bold text-2xl text-muted-foreground" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                  {realPastEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* PAST HIGHLIGHTS & VIDEOS (ORIGINAL MOCK SECTION) */}
            <section className="bg-muted/30 py-10 rounded-lg px-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse"></div>
                <TypewriterHeading text="Past Highlights & Videos" delay={0.3} className="font-serif font-bold text-2xl text-amber-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {highlightVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elegant transition-all"
                  >
                    <div className="relative aspect-video bg-muted group cursor-pointer">
                      <iframe
                        src={video.videoUrl}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                        <Play className="h-16 w-16 text-white opacity-80" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif font-bold text-lg text-foreground mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{video.date}</p>
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  );
};

export default Events;