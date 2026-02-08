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
      }`}
    >
      {/* DESKTOP & MOBILE HEADER */}
      <div className="w-full px-4 md:px-0">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <motion.img
                src={logo}
                alt="Chavara Cultural Center Logo"
                className="h-10 w-10 md:h-12 md:w-12"
                whileHover={{ scale: 1.05 }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`font-roboto font-medium whitespace-nowrap text-sm md:text-lg lg:text-2xl ${
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                Chavara Shows
              </motion.div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-1 lg:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 lg:px-0 font-medium text-sm lg:text-base transition-colors ${
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
                  className={`ml-2 lg:ml-4 px-3 py-2 rounded-full transition-colors flex items-center gap-2 whitespace-nowrap text-sm ${
                    isScrolled ? "hover:bg-orange-100" : "hover:bg-white/10"
                  }`}
                  title="Staff Scanner"
                >
                  <Scan
                    className={`h-5 w-5 lg:h-6 lg:w-6 flex-shrink-0 ${
                      isScrolled ? "text-orange-600" : "text-white"
                    }`}
                  />
                  <span className={`text-xs lg:text-sm font-bold uppercase ${isScrolled ? 'text-orange-600' : 'text-white'}`}>
                    Scanner
                  </span>
                </Link>
              )}

              {/* LOGIN / LOGOUT */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className={`ml-2 lg:ml-4 p-2 rounded-full transition-colors flex-shrink-0 ${
                    isScrolled ? "hover:bg-red-50 text-red-500" : "hover:bg-white/10 text-white"
                  }`}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`ml-2 lg:ml-4 p-2 rounded-full transition-colors flex-shrink-0 ${
                    isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                  }`}
                  title="Login"
                >
                  <User
                    className={`h-5 w-5 lg:h-6 lg:w-6 ${
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
              className="md:hidden flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t bg-slate-900 w-full overflow-hidden"
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm text-slate-100 rounded hover:bg-slate-800 transition-colors truncate"
              >
                {item.name}
              </Link>
            ))}

            {/* SCAN (MOBILE - STAFF ONLY) */}
            {isStaff && (
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-orange-400 bg-orange-500/10 rounded hover:bg-orange-500/20 transition-colors"
              >
                <Scan className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Staff Gate Scanner</span>
              </Link>
            )}

            {/* LOGIN / LOGOUT (MOBILE) */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-3 text-sm font-medium text-red-400 rounded hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-slate-100 rounded hover:bg-slate-800 transition-colors"
              >
                <User className="h-5 w-5 flex-shrink-0" />
                <span>Staff Login</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;