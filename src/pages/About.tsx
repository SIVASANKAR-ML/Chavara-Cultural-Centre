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
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white">
      {/* Hero Section with Cultural Pattern Overlay */}
      <section className="relative bg-gradient-hero py-20 md:py-28 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white rotate-45" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <p className="text-sm font-semibold text-white tracking-widest uppercase">Est. 1971</p>
              </div>
            </motion.div>

            <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-6 leading-tight">
              About <span className="text-orange-200">Our Legacy</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-body text-white/95 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Preserving and celebrating Kerala's rich cultural heritage through
              art, education, and community empowerment
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-white" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0,32L80,29.3C160,27,320,21,480,21.3C640,21,800,27,960,29.3C1120,32,1280,32,1360,32L1440,32L1440,48L1360,48C1280,48,1120,48,960,48C800,48,640,48,480,48C320,48,160,48,80,48L0,48Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Story Content */}
          <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
            {/* Decorative Accent */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden md:block md:col-span-1"
            >
              <div className="sticky top-32">
                <div className="w-1 h-40 bg-gradient-to-b from-orange-500 via-orange-400 to-transparent rounded-full" />
              </div>
            </motion.div>

            {/* Main Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-11 space-y-8"
            >
              
              <Card className="overflow-hidden border-none shadow-2xl rounded-3xl">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Image Section */}
                <div className="md:col-span-2 relative h-64 md:h-auto">
                 {/* Image */}
                 <div className="flex-shrink-0">
                  <img
                    src="https://www.chavaraculturalcentre.com/images/resource/feature-1.jpg"
                    alt="Fr. Anil Philip CMI"
                    className="w-100 h-full rounded-tl-3xl rounded-bl-3xl md:rounded-l-3xl md:rounded-r-none shadow-lg"
                  />
                </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/20" />
                </div>

                {/* Content Section */}
                <div className="md:col-span-3 p-6 md:p-10 bg-gradient-to-br from-white to-orange-50/30">
                  <div className="mb-4">
                    <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full mb-4">
                      <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Director's Vision</span>
                    </div>
                  </div>

                  <h5 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                    Fr. Anil Philip CMI
                  </h5>
                  
                  <p className="text-sm font-semibold text-orange-600 mb-6 uppercase tracking-wide">
                    Director, Chavara Cultural Centre
                  </p>

                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Chavara Cultural Centre, Kochi, inspired by St. Kuriakose Elias Chavara, 
                    promotes education, culture, and social service. Committed to{" "}
                    unity, compassion, and sustainable development, 
                    the Centre provides platforms for learning, creativity, and community building, fostering 
                    harmony in humanity while preserving heritage and empowering generations for a brighter future.
                  </p>

                  <motion.a
                    href="https://www.franilphilipcmi.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span>Read More </span>
                    <svg 
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </Card>
          

              <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
                  A Journey Spanning Five Decades
                </h2>
                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Chavara Cultural Centre, Cochin opened wide its altruistic doors in <strong className="text-orange-600 font-semibold">1971</strong> with 
                    the sole aim to develop, strengthen and enhance communities through art, culture as well as education. 
                    Serving also as a meeting point for diverse philanthropic as well as culturally-enriching activities, 
                    the Centre lays special emphasis on Women Empowerment, 
                    Social Reformation and 
                    Spirituality
                  </p>

                  {/* Highlighted Quote Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="my-10 p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-l-4 border-orange-500 shadow-sm"
                  >
                    <p className="text-xl md:text-2xl font-semibold text-gray-800 italic leading-relaxed">
                      "In fond memory of the great visionary St. Kuriakose Elias Chavara"
                    </p>
                    <p className="text-sm text-gray-600 mt-4 font-medium">
                      Founder of CMI & CMC Religious Institutes
                    </p>
                  </motion.div>

                  <p className="text-gray-700 leading-relaxed text-lg">
                    Chavara Cultural Centre was established in fond memory of the great visionary 
                    <strong className="text-gray-900 font-semibold"> St. Kuriakose Elias Chavara</strong> - founder of two mainstream 
                    Catholic Religious Institutes in India <strong className="text-gray-900 font-semibold">"Carmelites of Mary Immaculate (CMI)"</strong> as 
                    well as <strong className="text-gray-900 font-semibold">"Congregation of the Mother of Carmel" (CMC)</strong>. 
                    Together, these congregations have a united strength of over <strong className="text-orange-600 font-semibold">10,000</strong>, 
                    successfully managing <strong className="text-orange-600 font-semibold">1200 odd Educational institutes</strong>, Healthcare 
                    and Socio-Religious organizations across <strong className="text-orange-600 font-semibold">31 nations</strong> all over the world.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-lg">
                    We believe in making culture accessible to all. Our state-of-the-art facilities, combined with 
                    our commitment to authenticity and excellence, ensure that every event is a memorable experience 
                    for our visitors.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section with Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className="p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white group relative overflow-hidden">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-300" />
                    
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex p-4 bg-orange-100 rounded-2xl group-hover:bg-orange-200 transition-colors duration-300">
                        <stat.icon className="h-7 w-7 md:h-8 md:w-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <p className="text-3xl md:text-4xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                        {stat.value}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section with Enhanced Layout */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-5 py-1.5 bg-orange-100 rounded-full">
                <p className="text-sm font-bold text-orange-600 tracking-wider uppercase">Meet Our Team</p>
              </div>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 mb-6">
              The Faces Behind <span className="text-orange-600">The Magic</span>
            </h2>
            <p className="font-body text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Meet the passionate individuals who bring our cultural vision to life through 
              dedication, creativity, and unwavering commitment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {Abouts.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <AboutCard event={event} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center p-10 md:p-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h3 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">
              Join Us in Celebrating Culture
            </h3>
            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              Experience the richness of Kerala's heritage through our upcoming events and programs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => window.location.href = '/events'}
            >
              Explore Upcoming Events
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;

