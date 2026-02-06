import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tag, ArrowLeft, Loader2, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShowTimeSelector from "@/components/ShowTimeSelector";
import { fetchEventById, ChavaraEvent } from "@/services/api";
import { toast } from "sonner";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<ChavaraEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    async function loadEventData() {
      if (!eventId) return;
      try {
        setLoading(true);
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event:", error);
        toast.error("Error loading event details");
      } finally {
        setLoading(false);
      }
    }
    loadEventData();
  }, [eventId]);

  const lowestSeatPrice = useMemo(() => {
    if (!event?.schedules?.length) return null;
  
    // pick the schedule you care about
    const schedule = event.schedules[0];
  
    if (!schedule.row_wise_pricing?.length) return null;
  
    return Math.min(
      ...schedule.row_wise_pricing.map(p => p.price)
    );
  }, [event]);
  

  const transformedShowTimes = useMemo(() => {
    if (!event?.schedules) return [];
    const groups: { [key: string]: string[] } = {};
    event.schedules.forEach((sch) => {
      if (!groups[sch.show_date]) groups[sch.show_date] = [];
      groups[sch.show_date].push(sch.show_time);
    });
    return Object.keys(groups).map((date) => ({ date, times: groups[date] }));
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Event Not Found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-12">
      <div className="container mx-auto px-4 pt-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: BANNER & ABOUT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-elegant">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${event.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{event.title}</h1>
                <p className="text-primary font-semibold">{event.day}</p>
              </div>
            </div>

            <Card className="p-8 shadow-elegant border-none rounded-2xl bg-white">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                <Info className="text-primary" size={24} />
                About the event
              </h2>
              <div 
                className="text-muted-foreground text-lg leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }} 
              />
            </Card>
          </div>

          {/* RIGHT SECTION: SIDEBAR */}
          <div className="lg:col-span-1">
            {/* FIX: Move sticky to this container so children move together */}
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* PICK A SESSION CARD */}
              <Card className="p-8 shadow-elegant border-none rounded-2xl bg-white">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-serif font-bold">Pick a Session</h2>
                </div>

                {transformedShowTimes.length > 0 ? (
                  <>
                    <ShowTimeSelector
                      showTimes={transformedShowTimes}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onDateSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      onTimeSelect={setSelectedTime}
                    />
                    
                    {selectedDate && selectedTime ? (
                      <Button 
                        size="lg" 
                        onClick={() => {
                          const schedule = event.schedules?.find(s => 
                            s.show_date === selectedDate && s.show_time === selectedTime
                          );
                          if (schedule) {
                            navigate(`/seat-booking/${eventId}/${schedule.name}`);
                          }
                        }}
                        className="w-full mt-8 h-12 font-bold"
                      >
                        Book Tickets
                      </Button>
                    ) : (
                      <p className="mt-8 text-center text-muted-foreground text-sm font-medium border border-dashed rounded-lg py-4">
                        Please select a time to book
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No schedules available.</p>
                )}

                <div className="mt-8 pt-6 border-t flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Price Start From</p>
                    <p className="text-2xl font-bold text-foreground">₹{lowestSeatPrice}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <MapPin size={20} />
                  </div>
                </div>
              </Card>

              {/* ARTISTS / HOSTS SECTION */}
              {event.host_name && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white rounded-2xl shadow-elegant border-none flex items-center gap-4"
                >
                  {/* Fixed Circle Container */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/10 bg-slate-50">
                      {event.host_img ? (
                        <img 
                          src={event.host_img} 
                          alt={event.host_name} 
                          // FIX: object-cover makes the image fit inside the circle
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-foreground text-lg truncate">
                      {event.host_name}
                    </p>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider">
                      Event Host
                    </p>
                    {event.host_description && (
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                        {event.host_description}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;