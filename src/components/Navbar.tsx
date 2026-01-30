import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Scan, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollIcon, setShowScrollIcon] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollIcon(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    window.scrollBy({ top: 300, behavior: "smooth" });
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Calendar", path: "/calendar" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
          : "border-primary-foreground/20 bg-gradient-hero"
      } ${showScrollIcon ? "pb-4 md:pb-0" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
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
              }`}
            >
              Chavara Cultural Center
            </motion.div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium transition-colors ${
                  isScrolled
                    ? `hover:text-primary ${
                        isActive(item.path)
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`
                    : `hover:text-white ${
                        isActive(item.path)
                          ? "text-white font-semibold"
                          : "text-primary-foreground"
                      }`
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute -bottom-[21px] left-0 right-0 h-0.5 ${
                      isScrolled ? "bg-primary" : "bg-white"
                    }`}
                  />
                )}
              </Link>
            ))}

            {/* LOGIN */}
            <Link
              to="/login"
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
              title="Login"
            >
              <User
                className={`h-6 w-6 ${
                  isScrolled
                    ? "text-muted-foreground hover:text-primary"
                    : "text-primary-foreground hover:text-white"
                }`}
              />
            </Link>

            {/* SCAN ICON (AFTER LOGIN) */}
            <Link
              to="/verify"
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
              title="Scan QR"
            >
              <Scan
                className={`h-6 w-6 ${
                  isScrolled
                    ? "text-muted-foreground hover:text-primary"
                    : "text-primary-foreground hover:text-white"
                }`}
              />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* SCROLL DOWN ICON - Mobile only */}
          {showScrollIcon && (
            <motion.button
              onClick={handleScrollDown}
              className="md:hidden p-2 rounded-full transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              title="Scroll down"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <ChevronDown
                  className={`h-5 w-5 ${
                    isScrolled
                      ? "text-muted-foreground hover:text-primary"
                      : "text-primary-foreground hover:text-white"
                  }`}
                />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-4"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-medium transition-all duration-300 rounded-lg mx-2 my-1 ${
                    isActive(item.path)
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-slate-100 hover:bg-slate-700/50 hover:text-blue-400"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* LOGIN */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 rounded-lg mx-2 my-1 text-slate-100 hover:bg-emerald-500/20 hover:text-emerald-400"
              >
                <User className="h-5 w-5" />
                Login
              </Link>
            </motion.div>

            {/* SCAN */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (navItems.length + 1) * 0.1 }}
            >
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 rounded-lg mx-2 my-1 text-slate-100 hover:bg-purple-500/20 hover:text-purple-400"
              >
                <Scan className="h-5 w-5" />
                Scan QR
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;