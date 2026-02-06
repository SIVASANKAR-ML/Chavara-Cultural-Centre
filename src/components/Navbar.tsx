import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Scan, ChevronDown, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
import { checkScannerAccess, logout } from "@/services/api"; // Added these imports

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  
  // NEW: State to track if user is staff
  const [isStaff, setIsStaff] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollIcon(window.scrollY < 100);
    };

    // NEW: Check if user is staff on mount and when location changes
    const verifyUser = async () => {
      const staffStatus = await checkScannerAccess();
      setIsStaff(staffStatus);
      setIsLoggedIn(!!localStorage.getItem("user_id"));
    };

    verifyUser();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]); // Re-verify whenever the page changes

  const handleLogout = async () => {
    await logout();
    setIsStaff(false);
    setIsLoggedIn(false);
    navigate("/login");
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
  className={`fixed top-0 left-0 right-0 w-full z-50 border-b transition-all duration-300 ${
    isScrolled
      ? "border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      : "border-primary-foreground/20 bg-gradient-hero"
  } ${showScrollIcon ? "pb-4 md:pb-0" : ""}`}
>
      <div className="w-full">
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
              Chavara Shows
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
              </Link>
            ))}

            {/* SCAN ICON (VISIBLE ONLY FOR STAFF) */}
            {isStaff && (
              <Link
                to="/verify"
                className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                  isScrolled ? "hover:bg-orange-100" : "hover:bg-white/10"
                }`}
                title="Staff Scanner"
              >
                <Scan
                  className={`h-6 w-6 ${
                    isScrolled ? "text-orange-600" : "text-white"
                  }`}
                />
                <span className={`text-xs font-bold uppercase ${isScrolled ? 'text-orange-600' : 'text-white'}`}>Scanner</span>
              </Link>
            )}

            {/* LOGIN / LOGOUT */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled ? "hover:bg-red-50 text-red-500" : "hover:bg-white/10 text-white"
                }`}
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            ) : (
              <Link
                to="/login"
                className={`p-2 rounded-full transition-colors ${
                  isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                }`}
                title="Login"
              >
                <User
                  className={`h-6 w-6 ${
                    isScrolled ? "text-muted-foreground" : "text-primary-foreground"
                  }`}
                />
              </Link>
            )}
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
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t bg-slate-900 py-4 w-screen -ml-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-100 border-b border-slate-800"
              >
                {item.name}
              </Link>
            ))}

            {/* SCAN (MOBILE - STAFF ONLY) */}
            {isStaff && (
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 font-medium text-orange-400 bg-orange-500/10"
              >
                <Scan className="h-5 w-5" />
                Staff Gate Scanner
              </Link>
            )}

            {/* LOGIN / LOGOUT (MOBILE) */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 font-medium text-red-400"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 font-medium text-slate-100"
              >
                <User className="h-5 w-5" />
                Staff Login
              </Link>
            )}
          </motion.div>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;