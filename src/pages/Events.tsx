import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { upcomingEvents, pastEvents, type Event as EventType } from "@/data/events";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ================= TYPEWRITER HEADING ================= */
const TypewriterHeading = ({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};
/* ===================================================== */

const Events = () => {
  const today = new Date();

  const pad = (n: number) => `${n}`.padStart(2, "0");
  const localYYYYMMDD = `${today.getFullYear()}-${pad(
    today.getMonth() + 1
  )}-${pad(today.getDate())}`;

  const eventEarliestDate = (evt: EventType) => {
    const dates = evt.showTimes.map((s) => s.date).sort();
    return dates[0];
  };

  const upcoming = [...upcomingEvents]
    .filter((e) => eventEarliestDate(e) >= localYYYYMMDD)
    .sort((a, b) => (eventEarliestDate(a) > eventEarliestDate(b) ? 1 : -1));

  const now = new Date();
  const LIVE_WINDOW_MS = 2 * 60 * 60 * 1000;

  const isLive = (dateStr: string, timeStr: string) => {
    const start = new Date(`${dateStr}T${timeStr}:00`);
    const end = new Date(start.getTime() + LIVE_WINDOW_MS);
    return now >= start && now <= end;
  };

  let liveEvents = upcomingEvents.filter((evt) =>
    evt.showTimes.some(
      (st) =>
        st.date === localYYYYMMDD &&
        st.times.some((t) => isLive(st.date, t))
    )
  );

  if (liveEvents.length === 0) {
    liveEvents = [
      {
        id: "demo-1",
        title: "Live Jazz Concert",
        description: "Smooth jazz session happening right now from NYC.",
        image: "#",
        showTimes: [{ date: localYYYYMMDD, times: ["19:00"] }],
      } as EventType,
      {
        id: "demo-2",
        title: "Art & Culture Festival",
        description: "Experience live art performances.",
        image: "#",
        showTimes: [{ date: localYYYYMMDD, times: ["18:30"] }],
      } as EventType,
    ];
  }

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
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
            Events
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse upcoming events, see what is live now, and watch highlights
            from past performances.
          </p>
        </motion.div>

        {/* LIVE NOW */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>

            <TypewriterHeading
              text="Live Now"
              className="font-serif font-bold text-2xl text-red-600"
            />
          </div>

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
                    <h3 className="font-serif font-semibold text-lg mb-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {evt.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link to={`/event/${evt.id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                      <span className="text-xs text-red-600 font-semibold">
                        Live
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-4 w-4 rounded-full border-2 border-orange-500 animate-spin"></div>

            <TypewriterHeading
              text="Upcoming Events"
              delay={0.2}
              className="font-serif font-bold text-2xl text-orange-600"
            />
          </div>

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

        {/* PAST EVENTS */}
        <section className="bg-muted/30 py-10 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse"></div>

            <TypewriterHeading
              text="Past Events & Highlights"
              delay={0.3}
              className="font-serif font-bold text-2xl text-amber-600"
            />
          </div>

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
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
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