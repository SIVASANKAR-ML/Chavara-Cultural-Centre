import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    // {name : "Venue", path: "/venue" },  
    { name: "Calendar", path: "/calendar" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    // { name: "Blog", path: "/blog" },  // Removed Blog link
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      isScrolled
        ? "border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        : "border-primary-foreground/20 bg-gradient-hero"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src={logo}
              alt="Chavara Cultural Center Logo"
              className="h-10 w-10 md:h-12 md:w-12"
              whileHover={{ scale: 1.05 }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`text-xl font-roboto font-medium md:text-2xl ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}>
              Chavara Cultural Center
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium transition-colors ${
                  isScrolled
                    ? `hover:text-primary ${isActive(item.path) ? "text-primary font-semibold" : "text-muted-foreground"}`
                    : `hover:text-white ${isActive(item.path) ? "text-white font-semibold" : "text-primary-foreground"}`
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute -bottom-[21px] left-0 right-0 h-0.5 ${
                      isScrolled ? "bg-primary" : "bg-white"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Profile / Login Icon */}
            <Link
              to="/login"
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
              title="Login"
            >
              <User className={`h-6 w-6 ${
                isScrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground hover:text-white"
              }`} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-primary-foreground/20 bg-gradient-hero py-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 font-medium transition-colors ${
                  isScrolled
                    ? `hover:text-primary ${isActive(item.path) ? "text-primary font-semibold" : "text-muted-foreground"}`
                    : `hover:text-white ${isActive(item.path) ? "text-white font-semibold" : "text-primary-foreground"}`
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Profile Icon inside Mobile Menu */}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 py-2 font-medium transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-primary"
                  : "text-primary-foreground hover:text-white"
              }`}
            >
              <User className="h-5 w-5" /> Login
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
