import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary-foreground mb-4">
              Contact Us
            </h1>
            <p className="font-body text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Get in touch with us for bookings, inquiries, or feedback
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="font-body text-muted-foreground">
                
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 shadow-card hover:shadow-elegant transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Address</h3>
                    <p className="font-body text-muted-foreground">
                      Chavara Cultural Center<br />
                      Karikkamuri Rd, Ernakulam South, <br />
                      Kochi, Ernakulam, Kerala 682011
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card hover:shadow-elegant transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Phone</h3>
                    <p className="font-body text-muted-foreground">
                    +91 9495142011<br />
                      
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card hover:shadow-elegant transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Email</h3>
                    <p className="font-body text-muted-foreground">
                    chavarakochi@gmail.com<br />
                      
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card hover:shadow-elegant transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Working Hours</h3>
                    <p className="font-body text-muted-foreground">
                      Monday - Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 shadow-elegant">
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="font-heading block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-heading block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="font-heading block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="font-heading block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="font-heading block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                    className="w-full resize-none font-body"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
        
    
      </section>

      <div style={{ width: "100%", height: "450px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.54378195433!2d76.28558967479323!3d9.971862490132114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08731a5a06f5cb%3A0xa5fc37f38ef4fe62!2sChavara%20Cultural%20Centre!5e0!3m2!1sen!2sin!4v1770373370364!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Chavara Cultural Centre Map"
            />
          </div>
          
    </div>
  );
};

export default Contact;
