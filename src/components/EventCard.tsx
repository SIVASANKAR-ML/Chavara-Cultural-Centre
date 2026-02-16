import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChavaraEvent } from "@/services/api";
import { useMemo } from "react";

interface EventCardProps {
  event: ChavaraEvent;
  index?: number;
}

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  // Professional date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date TBA";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  // Get the lowest price from schedules
  const lowestPrice = useMemo(() => {
    if (!event?.schedules?.length) return null;
    const schedule = event.schedules[0];
    if (!schedule.row_wise_pricing?.length) return null;
    return Math.min(...schedule.row_wise_pricing.map(p => p.price));
  }, [event]);

  // Strip HTML and truncate description
  const cleanDescription = event.description.replace(/<[^>]*>?/gm, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link to={`/event/${event.id}`} className="block h-full">
        <Card className="overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 h-full relative group bg-white">
          {/* Image Section - 100% of card */}
          <div className="relative h-full min-h-[400px] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { 
                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Event+Image'; 
              }}
            />
            
            {/* Gradient Overlay - Darker for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300" />
            
            {/* Day Badge - Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                {event.day}
              </div>
            </div>

            {/* Price Badge - Top Left */}
            {lowestPrice && (
              <div className="absolute top-3 left-3 z-10">
                <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-lg">
                  <Tag className="h-3.5 w-3.5 text-orange-600" />
                  <span className="text-sm font-black text-gray-900">₹{lowestPrice}</span>
                  <span className="text-xs text-gray-600">onwards</span>
                </div>
              </div>
            )}

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              {/* Title */}
              <h3 className="font-bold text-xl text-white line-clamp-2 leading-tight mb-3 drop-shadow-lg">
                {event.title}
              </h3>
              
              {/* Date & Venue Info */}
              <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(event.endDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium truncate">Chavara Cultural Centre</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold rounded-lg h-12 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                asChild
              >
                <span className="flex items-center justify-center gap-2">
                  Book Now
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Hover Overlay with View Details */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="px-6 py-3 bg-white rounded-full flex items-center gap-2 shadow-xl">
                  <span className="font-bold text-gray-900 text-sm">View Details</span>
                  <ArrowRight className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EventCard;