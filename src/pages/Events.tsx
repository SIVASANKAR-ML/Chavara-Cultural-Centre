import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { upcomingEvents, pastEvents, type Event as EventType } from "@/data/events";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Events = () => {
  const today = new Date();

  const pad = (n: number) => `${n}`.padStart(2, "0");
  const localYYYYMMDD = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  // Helper to determine the earliest show date of an event
  const eventEarliestDate = (evt: EventType) => {
    const dates = evt.showTimes.map((s) => s.date).sort();
    return dates[0];
  };

  // Upcoming events: those with earliest show date >= today
  const upcoming = [...upcomingEvents]
    .filter((e) => eventEarliestDate(e) >= localYYYYMMDD)
    .sort((a, b) => (eventEarliestDate(a) > eventEarliestDate(b) ? 1 : -1));

  // Live event detection: check if any showtime is today and within a 2-hour window
  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000;
  const LIVE_WINDOW_MS = 2 * ONE_HOUR; // 2 hours

  const isLive = (dateStr: string, timeStr: string) => {
    const start = new Date(`${dateStr}T${timeStr}:00`);
    const end = new Date(start.getTime() + LIVE_WINDOW_MS);
    return now >= start && now <= end;
  };

  let liveEvents = upcomingEvents.filter((evt) =>
    evt.showTimes.some((st) =>
      st.date === localYYYYMMDD && st.times.some((t) => isLive(st.date, t))
    )
  );

  // --- DEMO LIVE EVENTS (for display only) ---
  if (liveEvents.length === 0) {
    liveEvents = [
      {
        id: "demo-1",
        title: "Live Jazz Concert",
        description: "Smooth jazz session happening right now from NYC.",
        image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=800",
        showTimes: [{ date: localYYYYMMDD, times: ["19:00"] }],
      } as EventType,
      {
        id: "demo-2",
        title: "Art & Culture Festival",
        description: "Experience live art performances.",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800",
        showTimes: [{ date: localYYYYMMDD, times: ["18:30"] }],
      } as EventType,
    ];
  }

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
            Events
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse upcoming events, see what is live now, and watch highlights from past
            performances.
          </p>
        </motion.div>

<section className="mb-10">
  <h2 className="font-serif font-bold text-2xl text-foreground mb-4">
    Live Now
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {liveEvents.map((evt, idx) => (
      <motion.div
        key={evt.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.08, duration: 0.4 }}
      >
        <Card className="overflow-hidden shadow-card hover:shadow-elegant transition-all">
          <div className="relative aspect-[2/1] bg-muted">
            <img
              src={evt.image}
              alt={evt.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-1">
              {evt.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {evt.description}
            </p>
            <div className="flex items-center justify-between">
              <Link to={`/event/${evt.id}`}>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3"
                >
                  View
                </Button>
              </Link>
              <span className="text-xs text-secondary font-semibold">
                Live
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
</section>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="font-serif font-bold text-2xl text-foreground mb-4">
            Upcoming Events
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">
              No upcoming events at the moment. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {upcoming.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        <section className="bg-muted/30 py-10 rounded-lg">
          <h2 className="font-serif font-bold text-2xl text-foreground mb-6">
            Past Events & Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elegant transition-all"
              >
                <div className="relative aspect-video bg-muted group cursor-pointer">
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Events;
