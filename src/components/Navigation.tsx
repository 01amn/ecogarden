import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Menu,
  X,
  Camera,
  Search,
  Heart,
  User,
  BookOpen,
  MessageCircle
} from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const navItems = [
    { label: "Explore Plants", href: "#plants", icon: Search },
    { label: "Scanner", href: "#scanner", icon: Camera },
    { label: "Therapies", href: "#therapies", icon: Heart },
    { label: "Learn", href: "#learn", icon: BookOpen },
    { label: "About Us", href: "#about", icon: MessageCircle },
  ];

  // Handle active state on scroll would be added here, simplified for now to just click update
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveHash(href);
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl glass-panel rounded-2xl border border-white/20 shadow-herbal backdrop-blur-md px-6 py-3 flex items-center justify-between transition-all duration-300">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-herbal p-2 rounded-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground font-serif tracking-wide leading-none group-hover:text-primary transition-colors">Virtual Eco</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1">Herbal Garden</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center bg-secondary/30 rounded-full px-2 py-1 border border-white/10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-1.5 ${activeHash === item.href
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-white/50"
                }`}
            >
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium hover:bg-transparent">
              Sign In
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-gradient-herbal shadow-glow hover:shadow-herbal rounded-full px-5 transition-all duration-300 hover:-translate-y-0.5">
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-4 glass-panel rounded-2xl shadow-deep md:hidden animate-fade-up">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center space-x-3 text-foreground/80 hover:text-primary hover:bg-secondary/30 p-3 rounded-xl transition-all duration-200"
                >
                  <div className="bg-secondary/50 p-2 rounded-lg text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <Link to="/login" className="w-full block">
                <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full block">
                <Button className="w-full bg-gradient-herbal shadow-glow rounded-xl">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;