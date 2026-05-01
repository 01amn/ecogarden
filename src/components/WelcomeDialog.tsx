import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Leaf, Sparkles } from "lucide-react";

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show on homepage (root path)
    if (location.pathname === "/") {
      // Always show on every page load/refresh to homepage
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setOpen(true);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      // Close dialog if navigating away from homepage
      setOpen(false);
    }
  }, [location.pathname]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl border-none shadow-2xl bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-3xl overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-herbal"></div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Leaf className="w-32 h-32 rotate-12 text-primary" />
        </div>

        <div className="p-8 pb-0">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
              <Leaf className="w-8 h-8 text-primary" />
            </div>

            <DialogTitle className="text-3xl md:text-4xl font-bold text-center mb-2 font-serif text-foreground">
              Virtual Eco-Herbal Garden
            </DialogTitle>

            <div className="flex items-center justify-center gap-2 text-primary font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AYUSH Powered Intelligence</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </DialogHeader>

          <div className="py-2 text-center">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Welcome to your sanctuary of botanical wisdom. Explore medicinal plants,
              identify species with AI, and discover personalized ayurvedic therapies for a holistic lifestyle.
            </p>
          </div>
        </div>

        <div className="p-8 pt-6">
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-herbal text-lg h-14 rounded-xl shadow-glow hover:shadow-herbal transition-all hover:scale-[1.02]"
            >
              Start Exploring
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4 opacity-70">
            Based on authentic AYUSH System knowledge and therapeutic properties.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
