import { motion } from "framer-motion";
import { Heart, Users, Award, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  const stats = [
    { icon: CalendarIcon, label: "Events Hosted", value: "500+" },
    { icon: Users, label: "Happy Visitors", value: "50,000+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Heart, label: "Years of Service", value: "15+" },
  ];

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
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground mb-4">
              About Us
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Preserving and celebrating Kerala's rich cultural heritage
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-lg text-muted-foreground"
          >
            <p>
              Chavara Cultural Center stands as a beacon of artistic excellence and cultural preservation in Kerala. For over 15 years, we have been dedicated to showcasing the finest expressions of traditional and contemporary art forms.
            </p>
            <p>
              Our mission is to create a vibrant space where artists and audiences come together to celebrate the rich tapestry of Kerala's cultural heritage. From classical dance performances to folk music festivals, from art exhibitions to theatrical productions, we curate experiences that inspire, educate, and entertain.
            </p>
            <p>
              We believe in making culture accessible to all. Our state-of-the-art facilities, combined with our commitment to authenticity and excellence, ensure that every event is a memorable experience for our visitors.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center shadow-card hover:shadow-elegant transition-all">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
