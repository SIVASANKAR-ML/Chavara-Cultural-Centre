import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import VenueCard from "@/components/VenueCard";
// Removed upcomingEvents from this import
import { pastEvents, reviews, venue } from "@/data/events";
// Added API imports
import { fetchEvents, ChavaraEvent } from "@/services/api";



const heroImages = [
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop",
  "https://img.freepik.com/premium-photo/party-event-decoration-asia-beautiful-decorations-cultural-program-wedding-decorations_343960-18475.jpg",
  "https://kerala.me/wp-content/uploads/2015/11/kerala-culture.jpg",
];

const heroDialogues = [
  "Experience the richness of Kerala’s cultural traditions through captivating performances, exhibitions, and events.",
  "Where every rhythm, color, and dance narrates a story of heritage.",
  "Celebrate the essence of art that connects generations together.",
  "Feel the soul of Kerala come alive through culture and creativity.",
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  
  // NEW: State for real backend events
  const [events, setEvents] = useState<ChavaraEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UPDATED: Fetching and filtering logic based on Schedules
  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEvents();
        
        // --- START FILTER LOGIC ---
        const now = new Date();
        // Get current date in YYYY-MM-DD format
        const todayStr = now.toLocaleDateString('en-CA'); 
        // Get current time in HH:mm:ss format
        const currentTimeStr = now.toTimeString().split(' ')[0];

        const upcomingFiltered = data.filter(event => {
          // Check if event has at least one schedule in the future
          return event.schedules?.some(sch => {
            if (sch.show_date > todayStr) return true;
            if (sch.show_date === todayStr) return sch.show_time >= currentTimeStr;
            return false;
          });
        });
        // --- END FILTER LOGIC ---

        // Show only the first 4 upcoming filtered events
        setEvents(upcomingFiltered.slice(0, 4));
      } catch (error) {
        console.error("Error fetching home events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getEvents();
  }, []);

  const scrollToEvents = () => {
    document.getElementById("upcoming-events")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dialogueInterval = setInterval(() => {
      setCurrentDialogue((prev) => (prev + 1) % heroDialogues.length);
    }, 3000);
    return () => clearInterval(dialogueInterval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImages[currentImage]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              backgroundImage: `url('${heroImages[currentImage]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            Where Culture, Art, and Heritage Come Alive
          </motion.h1>

          <div className="h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={heroDialogues[currentDialogue]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
              >
                {heroDialogues[currentDialogue]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={scrollToEvents}
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-4 mt-4"
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                currentImage === i ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Events - CONNECTED TO BACKEND */}
      <section id="upcoming-events" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of cultural performances and exhibitions
          </p>
        </motion.div>
        {/*  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading Skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No upcoming events found.
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/events">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Full Calendar
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Past Events Section - Mock Data remains */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
              Highlights from Past Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Relive the magic of our previous performances
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
        </div>
      </section>

      {/* Reviews Section - Mock Data remains */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
            What Visitors Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from those who experienced our cultural events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card p-6 rounded-lg shadow-card hover:shadow-elegant transition-all"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mb-4 italic">"{review.comment}"</p>
              <div className="pt-4 border-t border-border">
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary-foreground mb-6">
              Ready to Experience Culture?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Check our calendar and book your seats for upcoming cultural events
            </p>
            <Link to="/events">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                Check Upcoming Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;