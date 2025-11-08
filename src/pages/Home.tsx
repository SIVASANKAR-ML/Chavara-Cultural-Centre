import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { upcomingEvents, pastEvents, reviews } from "@/data/events";

const heroImages = [
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop",
  "https://img.freepik.com/premium-photo/party-event-decoration-asia-beautiful-decorations-cultural-program-wedding-decorations_343960-18475.jpg",
  "https://kerala.me/wp-content/uploads/2015/11/kerala-culture.jpg",
];

// ✨ Add rotating hero dialogues
const heroDialogues = [
  "Experience the richness of Kerala’s cultural traditions through captivating performances, exhibitions, and events.",
  "Where every rhythm, color, and dance narrates a story of heritage.",
  "Celebrate the essence of art that connects generations together.",
  "Feel the soul of Kerala come alive through culture and creativity.",
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState(0);

  // Scroll to events section
  const scrollToEvents = () => {
    document.getElementById("upcoming-events")?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-rotate hero background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate dialogues
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
        <AnimatePresence>
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

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            Where Culture, Art, and Heritage Come Alive
          </motion.h1>

          {/* Animated Dialogue */}
          <div className="h-20 flex items-center justify-center">
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={scrollToEvents}
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6 mt-4"
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentImage === i ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {upcomingEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/calendar">
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
    </div>
  );
};

export default Home;
