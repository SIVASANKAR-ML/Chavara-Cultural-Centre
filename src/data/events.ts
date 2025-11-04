export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  category: string;
  price: number;
  totalSeats: number;
  venue: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PastEvent {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  description: string;
}

export const upcomingEvents: Event[] = [
  {
    id: "evt-001",
    title: "Classical Bharatanatyam Performance",
    description: "Experience the grace and elegance of traditional Bharatanatyam dance by renowned artists from Kerala. A mesmerizing evening of classical Indian dance.",
    date: "2025-12-15",
    time: "18:00",
    image: "https://images.unsplash.com/photo-1604762524889-bcde1e9bef2b?w=800&h=600&fit=crop",
    category: "Dance",
    price: 500,
    totalSeats: 50,
    venue: "Main Auditorium"
  },
  {
    id: "evt-002",
    title: "Kerala Folk Music Festival",
    description: "Immerse yourself in the rich tapestry of Kerala's folk music traditions. Featuring authentic instruments and celebrated folk musicians.",
    date: "2025-12-20",
    time: "19:00",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    category: "Music",
    price: 400,
    totalSeats: 50,
    venue: "Open Air Theater"
  },
  {
    id: "evt-003",
    title: "Contemporary Art Exhibition",
    description: "Explore the intersection of tradition and modernity through stunning contemporary artworks by local and national artists.",
    date: "2025-12-25",
    time: "10:00",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=600&fit=crop",
    category: "Art",
    price: 200,
    totalSeats: 50,
    venue: "Gallery Hall"
  },
  {
    id: "evt-004",
    title: "Traditional Kathakali Theatre",
    description: "Witness the elaborate costumes and dramatic storytelling of Kathakali, one of Kerala's most iconic classical dance-drama forms.",
    date: "2025-12-28",
    time: "18:30",
    image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=600&fit=crop",
    category: "Theatre",
    price: 600,
    totalSeats: 50,
    venue: "Main Auditorium"
  }
];

export const pastEvents: PastEvent[] = [
  {
    id: "past-001",
    title: "Mohiniyattam Performance - October 2025",
    date: "2025-10-15",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "A captivating performance of Mohiniyattam that enchanted our audience."
  },
  {
    id: "past-002",
    title: "Carnatic Music Concert - September 2025",
    date: "2025-09-20",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "An evening of soulful Carnatic music by maestros."
  },
  {
    id: "past-003",
    title: "Heritage Arts Showcase - August 2025",
    date: "2025-08-10",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "A celebration of Kerala's rich artistic heritage."
  }
];

export const reviews: Review[] = [
  {
    id: "rev-001",
    name: "Priya Menon",
    rating: 5,
    comment: "Absolutely stunning performance! The venue and organization were perfect. A memorable evening of culture and art.",
    date: "2025-10-20"
  },
  {
    id: "rev-002",
    name: "Rajesh Kumar",
    rating: 5,
    comment: "The Kathakali performance was breathtaking. Chavara Cultural Center preserves and promotes our heritage beautifully.",
    date: "2025-09-25"
  },
  {
    id: "rev-003",
    name: "Anjali Nair",
    rating: 4,
    comment: "Wonderful experience! The booking process was smooth, and the staff were very helpful. Highly recommend!",
    date: "2025-08-15"
  },
  {
    id: "rev-004",
    name: "Vikram Sharma",
    rating: 5,
    comment: "An authentic cultural experience. The ambiance and attention to detail made it truly special.",
    date: "2025-07-30"
  }
];
