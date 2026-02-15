import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChavaraEvent } from "@/services/api"; // Import your new interface

interface EventCardProps {
  event: ChavaraEvent; // Use the real interface
  index?: number;
}

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  // Professional date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date TBA";
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
      <Card className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Event+Image'; }}
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {event.day}
          </div>
        </div>
        
        <div className="p-6 space-y-4 flex-grow flex flex-col">
          <h3 className="font-serif font-bold text-xl text-foreground line-clamp-2">
            {event.title}
          </h3>
          
          {/* We strip HTML tags from the Text Editor description for the card preview */}
          <p className="text-muted-foreground text-sm line-clamp-2">
            {event.description.replace(/<[^>]*>?/gm, '')}
          </p>
          
          <div className="space-y-2 text-sm text-muted-foreground flex-grow">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(event.endDate)}</span>
            </div>
        
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">Chavara Cultural Centre</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              {/* <span className="text-2xl font-bold text-primary">₹{event.price}</span> */}
              <span className="text-sm text-muted-foreground ml-1">onwards</span>
            </div>
            <Link to={`/event/${event.id}`}>
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

export default EventCard;