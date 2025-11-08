import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Venue } from "@/data/events";


interface VenueCardProps {
  event: Venue;
  index?: number;
}

const VenueCard = ({ event, index = 0 }: VenueCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Card className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {event.capacity}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="font-serif font-bold text-xl text-foreground line-clamp-2">
            {event.name}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {event.location}
          </p>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(event.showTimes[0].date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-2xl font-bold text-primary">₹{event.price}</span>
              <span className="text-sm text-muted-foreground ml-1">onwards</span>
            </div>
            <Link to={`/venue/${event.id}`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VenueCard;
