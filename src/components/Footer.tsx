import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin,Linkedin  } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-primary">
              Chavara Cultural Center
            </h3>
            <p className="text-sm text-muted-foreground">
              Celebrating and preserving the rich cultural heritage of Kerala through art, music, and dance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="/calendar" className="text-muted-foreground hover:text-primary transition-colors">
                  Calendar
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Chavara Cultural Centre, Kerala, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 9495142011</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>chavarakochi@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          {/* Developed By Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © Chavara Cultural Center 2025 – All Rights Reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Developed by</span>
              <a
                href="https://www.linkedin.com/in/paul-shaji/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                <span>Paul Shaji</span>
                <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </a>
              <span className="text-muted-foreground/50">•</span>
              <a
                href="https://www.linkedin.com/in/sivasankar22/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                <span>Sivasankar M</span>
                <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        </div>
    </footer>

  );
};

export default Footer;
