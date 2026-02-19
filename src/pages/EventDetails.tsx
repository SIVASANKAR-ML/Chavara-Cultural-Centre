import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tag, ArrowLeft, Loader2, Info, User, Share2, Heart } from "lucide-react";
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
    window.scrollTo(0, 0);
  }, []);

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
    const schedule = event.schedules[0];
    if (!schedule.row_wise_pricing?.length) return null;
    return Math.min(...schedule.row_wise_pricing.map(p => p.price));
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleBookTickets = () => {
    const schedule = event.schedules?.find(s => 
      s.show_date === selectedDate && s.show_time === selectedTime
    );
    if (schedule) {
      navigate(`/verify/${eventId}/${schedule.name}`);
    }
  };

  return (
    <>
      {/* Desktop View - Original */}
      <div className="hidden lg:block min-h-screen bg-[#F5F5F5] pb-12">
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
              <div className="lg:sticky lg:top-24 space-y-6">
                
                {/* PICK A SESSION CARD */}
                <Card className="p-8 shadow-elegant border-none rounded-2xl bg-white">
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
                          onClick={handleBookTickets}
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
                {event.hosts && event.hosts.length > 0 && (
                  <div className="space-y-4">
                    {event.hosts.map((host, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white rounded-2xl shadow-elegant border-none flex items-center gap-4"
                      >
                        <div className="w-16 h-16 flex-shrink-0">
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/10 bg-slate-50">
                            {host.host_image ? (
                              <img 
                                src={host.host_image} 
                                alt={host.host_name} 
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
                            {host.host_name}
                          </p>
                          <p className="text-primary text-xs font-bold uppercase tracking-wider">
                            Event Host
                          </p>
                          {host.discription && (
                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2 italic">
                              {host.discription}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - BookMyShow Style */}
      <div className="lg:hidden min-h-screen bg-white">
        {/* Hero Image with Back Button */}
        <div className="relative h-[280px] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${event.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-black/70 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          {/* Share & Like Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-black/70 transition-colors">
              <Share2 className="h-4 w-4 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-black/70 transition-colors">
              <Heart className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h1 className="text-2xl font-bold text-white mb-1">{event.title}</h1>
            <p className="text-sm text-orange-300 font-semibold">{event.day}</p>
          </div>
        </div>

        {/* Content */}
        <div className="pb-24">
          {/* Price Badge */}
          {lowestSeatPrice && (
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Price starts from</p>
                  <p className="text-xl font-black text-gray-900">₹{lowestSeatPrice}</p>
                </div>
                <div className="text-orange-500">
                  <Tag size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Show Times Section */}
          {transformedShowTimes.length > 0 && (
            <div className="py-4 border-b-8 border-gray-100">
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
            </div>
          )}

          {/* About Section */}
          <div className="p-4 border-b-8 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="text-orange-500" size={20} />
              About the Event
            </h2>
            <div 
              className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description }} 
            />
          </div>

          {/* Event Hosts */}
          {event.hosts && event.hosts.length > 0 && (
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User className="text-orange-500" size={20} />
                Event Hosts
              </h2>
              <div className="space-y-3">
                {event.hosts.map((host, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-orange-100 bg-white">
                        {host.host_image ? (
                          <img 
                            src={host.host_image} 
                            alt={host.host_name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {host.host_name}
                      </p>
                      <p className="text-orange-600 text-xs font-semibold uppercase">
                        Host
                      </p>
                      {host.discription && (
                        <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">
                          {host.discription}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Button */}
        {transformedShowTimes.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-20">
            {selectedDate && selectedTime ? (
              <Button 
                onClick={handleBookTickets}
                className="w-full h-14 text-base font-bold rounded-lg"
              >
                Book Tickets
              </Button>
            ) 
            
            : (
              <Button 
                disabled
                className="w-full h-14 text-base font-bold rounded-lg"
              >
                Select Date & Time
              </Button>
            )
            }
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetails;