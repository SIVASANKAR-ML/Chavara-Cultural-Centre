import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Scan } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
import { Html5QrcodeScanner } from "html5-qrcode";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!scannerOpen) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        alert(`Scanned: ${decodedText}`);
        scanner.clear();
        setScannerOpen(false);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerOpen]);

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
      }`}
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
            <button
              onClick={() => setScannerOpen(true)}
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
            </button>
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
            className="md:hidden border-t border-primary-foreground/20 bg-gradient-hero py-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 font-medium transition-colors ${
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

            {/* LOGIN */}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 py-2 font-medium transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-primary"
                  : "text-primary-foreground hover:text-white"
              }`}
            >
              <User className="h-5 w-5" />
              Login
            </Link>

            {/* SCAN */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setScannerOpen(true);
              }}
              className={`flex items-center gap-2 py-2 font-medium transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-primary"
                  : "text-primary-foreground hover:text-white"
              }`}
            >
              <Scan className="h-5 w-5" />
              Scan QR
            </button>
          </motion.div>
        )}
      </div>

      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-sm p-4 relative">
            <button
              onClick={() => setScannerOpen(false)}
              className="absolute right-3 top-3 p-1 rounded hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-center font-semibold mb-3">
              Scan QR Code
            </h2>

            <div id="qr-reader" className="w-full" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
