import { motion } from "framer-motion";
import { Heart, Users, Award, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import AboutCard from "@/components/AboutCard";
import { Abouts } from "@/data/events";


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
            Chavara Cultural Centre, Cochin opened wide its altruistic doors in 1971 with the sole aim to develop, strengthen and enhance communities through art, culture as well as education. Serving also as a meeting point for diverse philanthropic as well as culturally-enriching activities, the Centre lays special emphasis on Women Empowerment, Social Reformation and Spirituality.
            </p>
            <p>
            Chavara Cultural Centre was established in fond memory of the great visionary St. Kuriakose Elias Chavara - founder of two mainstream Catholic Religious Institutes in India “Carmelites of Mary Immaculate (CMI)” as well as “Congregation of the Mother of Carmel” (CMC). Together, these congregations have a united strength of over 10,000, successfully managing 1200 odd Educational institutes, Healthcare and Socio-Religious organizations across 31 nations all over the world.
            </p>
            <p>
              We believe in making culture accessible to all. Our state-of-the-art facilities, combined with our commitment to authenticity and excellence, ensure that every event is a memorable experience for our visitors.
            </p>
          </motion.div>

           {/* Team Behind */}
          <section id="Team Behind" className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4">
                Team Behind
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate individuals who bring our cultural vision to life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Abouts.map((event, index) => (
                <AboutCard key={event.id} event={event} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              {/* <Link to="/calendar">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  View Full Calendar
                </Button>
              </Link> */}
            </motion.div>
          </section>

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
