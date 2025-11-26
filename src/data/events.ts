export interface ShowTime {
  date: string;
  times: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  showTimes: ShowTime[];
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

export interface Venue {
  id: string;
  name: string;
  location: string;
  image: string;
  showTimes: ShowTime[];
  capacity: string;
  price: number;

}

export interface Abouts {
  id: string;
  name: string;
  title: string;
  image: string;

}

export const venue: Venue[] = [
  {
    id: "ven-001",
    name: "Main Auditorium",
    location: "Chavara Cultural Center, Kochi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Wien_-_Staatsoper%2C_Zuschauerraum_mit_B%C3%BChne.JPG/1200px-Wien_-_Staatsoper%2C_Zuschauerraum_mit_B%C3%BChne.JPG",
    showTimes: [
      { date: "2025-12-15", times: ["18:00", "20:30"] },
      { date: "2025-12-16", times: ["18:00"] },
      { date: "2025-12-17", times: ["16:00", "19:00"] }
    ],
    capacity: "50 Seats",
    price: 40000
  },
  {
    id: "ven-002",
    name: "Open Air Theater",
    location: "Chavara Cultural Center, Kochi",
    image: "https://www.pricemyers.com/img/project_header/224/2560_x1440_2.jpg",
    showTimes: [
      { date: "2025-12-20", times: ["19:00"] },
      { date: "2025-12-21", times: ["17:00", "20:00"] }
    ],
    capacity: "50 Seats",
    price: 40000
  },
  {
    id: "ven-003",
    name: "Gallery Hall",
    location: "Chavara Cultural Center, Kochi",
    image: "https://www.explorebees.com/uploads/Durbar%20Hall%20Art%20Gallery%20(6).JPG",
    showTimes: [
      { date: "2025-12-25", times: ["10:00", "14:00"] },
      { date: "2025-12-26", times: ["10:00", "14:00", "17:00"] },
      { date: "2025-12-27", times: ["10:00"] }
    ],
    capacity: "50 Seats",
    price: 25000
  }
];

export const upcomingEvents: Event[] = [
  {
    id: "evt-001",
    title: "Classical Bharatanatyam Performance",
    description: "Experience the grace and elegance of traditional Bharatanatyam dance by renowned artists from Kerala. A mesmerizing evening of classical Indian dance.",
    showTimes: [
      { date: "2025-12-15", times: ["18:00", "20:30"] },
      { date: "2025-12-16", times: ["18:00"] },
      { date: "2025-12-17", times: ["16:00", "19:00"] }
    ],
    image: "https://thumbs.dreamstime.com/b/group-classical-odissi-dancers-performing-odissi-dance-stage-konark-temple-odisha-india-odissi-dance-also-known-as-155047464.jpg",
    category: "Dance",
    price: 500,
    totalSeats: 50,
    venue: "Main Auditorium"
  },
  {
    id: "evt-002",
    title: "Kerala Folk Music Festival",
    description: "Immerse yourself in the rich tapestry of Kerala's folk music traditions. Featuring authentic instruments and celebrated folk musicians.",
    showTimes: [
      { date: "2025-12-20", times: ["19:00"] },
      { date: "2025-12-21", times: ["17:00", "20:00"] }
    ],
    image: "https://cdn-cms.orchidsinternationalschool.com/blog/Kerala%20Folk%20Songs.jpg",
    category: "Music",
    price: 400,
    totalSeats: 50,
    venue: "Open Air Theater"
  },
  {
    id: "evt-003",
    title: "Contemporary Art Exhibition",
    description: "Explore the intersection of tradition and modernity through stunning contemporary artworks by local and national artists.",
    showTimes: [
      { date: "2025-12-25", times: ["10:00", "14:00"] },
      { date: "2025-12-26", times: ["10:00", "14:00", "17:00"] },
      { date: "2025-12-27", times: ["10:00"] }
    ],
    image: "https://utsav.gov.in/public/uploads/event_cover_image/event_533/16576023091116776677.jpg",
    category: "Art",
    price: 200,
    totalSeats: 50,
    venue: "Gallery Hall"
  },
  {
    id: "evt-004",
    title: "Traditional Kathakali Theatre",
    description: "Witness the elaborate costumes and dramatic storytelling of Kathakali, one of Kerala's most iconic classical dance-drama forms.",
    showTimes: [
      { date: "2025-12-28", times: ["18:30", "21:00"] },
      { date: "2025-12-29", times: ["18:30"] }
    ],
    image: "https://kerala.me/wp-content/uploads/2015/11/kerala-culture.jpg",
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
    videoUrl: "https://www.youtube.com/embed/xUM9GVOxB_o",
    description: "A captivating performance of Mohiniyattam that enchanted our audience."
  },
  {
    id: "past-002",
    title: "Carnatic Music Concert - September 2025",
    date: "2025-09-20",
    videoUrl: "https://www.youtube.com/embed/Yn5XWJst_zc",
    description: "An evening of soulful Carnatic music by maestros."
  },
  {
    id: "past-003",
    title: "Heritage Arts Showcase - August 2025",
    date: "2025-08-10",
    videoUrl: "https://www.youtube.com/embed/zmoca-B1kTQ",
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


export const Abouts: Abouts[] = [
  {
    id: "at-001",
    name: "REV.FR.THOMAS CHATHAMPARAMBIL CMI",
    title: "Prior General",
    image: "#",
  },

  {
    id: "at-002",
    name: "REV.FR.MARTIN MALLATH CMI",
    title: "Chairman & Gen.Councilor for Edu.",
    image: "#",
  },

  {
    id: "at-003",
    name: "FR. BIJU VADAKKEL CMI",
    title: "Director,Chavara Institute",
    image: "#",
  },

  {
    id: "at-004",
    name: "FR. ANIL PUTHUPARAMBIL CM",
    title: "Director Chavara Cultural Centre",
    image: "#",
  },
 
];