import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import EventDetails from "./pages/EventDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import Login from "./pages/Login";      // ✅ Added login page
import Signup from "./pages/Signup";    // ✅ Added signup page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* Navbar stays on all pages */}
          <Navbar />

          {/* Main content area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/event/:eventId" element={<EventDetails />} />
              <Route
                path="/booking-confirmation/:bookingId"
                element={<BookingConfirmation />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />

              {/* ✅ Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
