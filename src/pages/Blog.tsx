"use client";

import { motion } from "framer-motion";
import { CalendarDays, Heart, Users } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Empowering Lives Through Education",
    image: "/images/education.jpg",
    date: "October 28, 2025",
    category: "Charity",
    description:
      "Our scholarship drive helps underprivileged children in rural Kerala access quality education. Discover how your small support makes a lifelong impact.",
  },
  {
    id: 2,
    title: "Traditional Art Revival: Kathakali for the Next Generation",
    image: "/images/kathakali.jpg",
    date: "October 12, 2025",
    category: "Culture",
    description:
      "A look inside our cultural workshops designed to preserve Kerala’s traditional art forms. Meet the new generation of performers carrying the torch forward.",
  },
  {
    id: 3,
    title: "Feeding Hope: Monthly Community Meal Program",
    image: "/images/charity-food.jpg",
    date: "September 25, 2025",
    category: "Service",
    description:
      "Our volunteers serve over 800 meals every month to families in need. Join our next event and be part of a movement that spreads kindness and connection.",
  },
  {
    id: 4,
    title: "Women Empowerment Workshops in Kochi",
    image: "/images/women-empowerment.jpg",
    date: "August 15, 2025",
    category: "Social Impact",
    description:
      "Through skill training and mentoring sessions, we help women build financial independence and confidence in their communities.",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/images/hero-blog.jpg')", // 🖼️ Replace with your hero image
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <h1 className="text-5xl font-bold mb-4 font-serif">
            Stories of Culture, Compassion & Change
          </h1>
          <p className="text-lg text-gray-200">
            Explore inspiring updates from our community initiatives, cultural
            programs, and charity events.
          </p>
        </motion.div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif text-gray-800">
          Latest Articles & Updates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${post.image})`,
                }}
              />
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays className="h-4 w-4" />
                  <span>{post.date}</span>
                  <span className="px-2">•</span>
                  <span className="font-medium text-primary">{post.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm">{post.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <button className="text-primary font-medium hover:underline">
                    Read More →
                  </button>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    {post.category === "Charity" && <Heart className="h-4 w-4 text-red-500" />}
                    {post.category === "Culture" && <Users className="h-4 w-4 text-blue-500" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
