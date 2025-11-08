import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import VenueCard from "@/components/VenueCard";
import { upcomingEvents, pastEvents, reviews,venue } from "@/data/events";

const Home = () => {
  const scrollToEvents = () => {
    document.getElementById("upcoming-events")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply",
          }}
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-6"
          >
            Where Culture, Art, and Heritage Come Alive
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          >
            Experience the richness of Kerala's cultural traditions through captivating performances, exhibitions, and events.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={scrollToEvents}
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
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
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View Full Calendar
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Venues bookings
      <section id="venues" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
            Venues
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of cultural performances and exhibitions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {venue.map((venue, index) => (
            <VenueCard key={venue.id} event={venue} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
        </motion.div>
      </section> */}

      {/* Previous Events Videos */}
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

      {/* Reviews / Testimonials */}
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
              <p className="text-muted-foreground text-sm mb-4 italic">
                "{review.comment}"
              </p>
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
            <Link to="/calendar">
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
