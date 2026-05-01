import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PlantExplorer from "@/components/PlantExplorer";
import AIScanner from "@/components/AIScanner";
import TherapyRecommendations from "@/components/TherapyRecommendations";
import UserDashboard from "@/components/UserDashboard";
import WelcomeDialog from "@/components/WelcomeDialog";
import { Leaf, MessageCircle, BookOpen, Heart, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <WelcomeDialog />
      <Navigation />

      {/* Main Content */}
      <main>
        <Hero />

        {/* Plant Explorer Section */}
        <div id="plants" className="scroll-mt-20">
          <PlantExplorer />
        </div>

        {/* AI Scanner Section */}
        <div id="scanner" className="scroll-mt-20">
          <AIScanner />
        </div>

        {/* Therapy Recommendations Section */}
        <div id="therapies" className="scroll-mt-20">
          <TherapyRecommendations />
        </div>

        {/* Learn Section */}
        <section id="learn" className="py-24 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
          {/* Decorative floating leaves */}
          <Leaf className="floating-leaf floating-leaf-1 text-primary" />
          <Leaf className="floating-leaf floating-leaf-2 text-primary-glow" />
          <Leaf className="floating-leaf floating-leaf-3 text-accent" />

          <div className="container mx-auto px-4 section-content">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-fade-up">
                <span className="text-accent font-medium tracking-wider uppercase text-sm mb-3 block">Educational Resources</span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                  The Wisdom of AYUSH
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Discover the traditional knowledge system of Ayurveda, Yoga, Unani, Siddha, and Homoeopathy for holistic wellness.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {/* Plant Identification */}
                <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 group">
                  <div className="bg-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-serif">Plant Identification</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Learn to identify medicinal plants by their leaves, flowers, and unique characteristics. Understanding plant morphology is the first step in herbal medicine.
                  </p>
                  <ul className="space-y-3">
                    {["Leaf shape & arrangement", "Flower structure", "Stem characteristics", "Seasonal variations"].map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground/80">
                        <ArrowRight className="w-4 h-4 text-primary mr-2" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AYUSH Principles */}
                <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 group">
                  <div className="bg-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-serif">AYUSH Principles</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Understand the fundamental concepts of Ayurveda. Learn about doshas (energies), rasas (tastes), and virya (potency).
                  </p>
                  <ul className="space-y-3">
                    {["Three Doshas (Vata, Pitta, Kapha)", "Six Tastes (Rasa)", "Hot & Cold Potency (Virya)", "Individual constitution (Prakriti)"].map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground/80">
                        <ArrowRight className="w-4 h-4 text-primary mr-2" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growing Plants */}
                <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 group">
                  <div className="bg-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-serif">Growing Medicinal Plants</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Master the art of cultivating your own herbal garden. Learn about soil, water, sunlight, and seasonal care requirements.
                  </p>
                  <ul className="space-y-3">
                    {["Soil preparation", "Watering & drainage", "Sunlight requirements", "Harvesting techniques"].map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground/80">
                        <ArrowRight className="w-4 h-4 text-primary mr-2" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Featured Plants Info */}
              <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-deep">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--accent),transparent_70%)]" />

                <h3 className="text-3xl font-bold mb-10 text-center font-serif relative z-10">Quick Reference: Top Medicinal Plants</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <h4 className="font-bold text-xl mb-2 flex items-center"><span className="text-2xl mr-2">🌿</span> Tulsi</h4>
                    <p className="text-sm opacity-90 mb-3 block">Respiratory health, immunity, stress relief</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Tridoshic</span>
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Pungent</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <h4 className="font-bold text-xl mb-2 flex items-center"><span className="text-2xl mr-2">🌿</span> Ashwagandha</h4>
                    <p className="text-sm opacity-90 mb-3 block">Stress management, energy, sleep</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Kapha</span>
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Bitter</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <h4 className="font-bold text-xl mb-2 flex items-center"><span className="text-2xl mr-2">🌿</span> Turmeric</h4>
                    <p className="text-sm opacity-90 mb-3 block">Anti-inflammatory, joint health, digestion</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Kapha</span>
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Bitter</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <h4 className="font-bold text-xl mb-2 flex items-center"><span className="text-2xl mr-2">🌿</span> Neem</h4>
                    <p className="text-sm opacity-90 mb-3 block">Skin health, blood purification, dental</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Pitta</span>
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Bitter</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <h4 className="font-bold text-xl mb-2 flex items-center"><span className="text-2xl mr-2">🌿</span> Aloe Vera</h4>
                    <p className="text-sm opacity-90 mb-3 block">Skin healing, digestive health, cooling</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Pitta</span>
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Sweet</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                    <h4 className="font-bold text-xl mb-2 flex items-center"><span className="text-2xl mr-2">🌿</span> Brahmi</h4>
                    <p className="text-sm opacity-90 mb-3 block">Memory enhancement, mental clarity</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Tridoshic</span>
                      <span className="text-xs bg-black/20 px-2 py-1 rounded font-medium">Bitter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 bg-secondary/10 relative">
          <div className="container mx-auto px-4 section-content">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="text-accent font-medium tracking-wider uppercase text-sm mb-3 block">Our Story</span>
                  <h2 className="text-4xl font-bold text-foreground mb-6 font-serif leading-tight">
                    Bridging Ancient Wisdom with Modern AI
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Virtual Eco-Herbal Garden is dedicated to preserving and promoting traditional AYUSH medicine through innovative AI-powered solutions.
                  </p>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Preservation</h4>
                        <p className="text-muted-foreground text-sm">Documenting and digitizing rare medicinal plant knowledge.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Accessibility</h4>
                        <p className="text-muted-foreground text-sm">Making herbal wisdom available to everyone, globally.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Education</h4>
                        <p className="text-muted-foreground text-sm">Empowering communities to take charge of their wellness.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-herbal opacity-10 blur-3xl rounded-full" />
                  <div className="glass-card p-10 rounded-[2rem] relative z-10 border border-white/40">
                    <h3 className="text-2xl font-bold mb-6 font-serif">What We Offer</h3>
                    <ul className="space-y-4 text-foreground/80">
                      <li className="flex items-start gap-4 p-4 bg-background/50 rounded-xl hover:bg-background transition-colors">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="block text-foreground">AI Plant Scanner</strong>
                          <span className="text-sm text-muted-foreground">Instant identification using computer vision</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 bg-background/50 rounded-xl hover:bg-background transition-colors">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="block text-foreground">Educational Resources</strong>
                          <span className="text-sm text-muted-foreground">Guides on identification & principles</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 bg-background/50 rounded-xl hover:bg-background transition-colors">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="block text-foreground">Personalized Therapy</strong>
                          <span className="text-sm text-muted-foreground">Dosha-based recommendations</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">

              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-primary p-2 rounded-xl">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-white">Virtual Eco</h3>
                    <p className="text-white/60 text-xs uppercase tracking-widest">Herbal Garden</p>
                  </div>
                </div>
                <p className="text-white/60 mb-8 max-w-md leading-relaxed">
                  Empowering communities through AI-powered plant recognition and personalized
                  AYUSH therapy recommendations for holistic wellness.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-white/5 p-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="bg-white/5 p-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                    <BookOpen className="w-5 h-5" />
                  </button>
                  <button className="bg-white/5 p-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-white mb-6">Quick Links</h4>
                <ul className="space-y-4 text-sm text-white/60">
                  <li><a href="#plants" className="hover:text-primary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Plant Database</a></li>
                  <li><a href="#scanner" className="hover:text-primary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>AI Plant Scanner</a></li>
                  <li><a href="#therapies" className="hover:text-primary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>AYUSH Therapies</a></li>
                  <li><a href="#about" className="hover:text-primary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>About Us</a></li>
                </ul>
              </div>

              {/* AYUSH Resources */}
              <div>
                <h4 className="font-bold text-white mb-6">Resources</h4>
                <ul className="space-y-4 text-sm text-white/60">
                  <li><a href="#" className="hover:text-primary transition-colors">Dosha Assessment</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Herbal Remedies</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Safety Guidelines</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Expert Consultation</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
              <p>
                © 2025 Virtual Eco-Herbal Garden. All rights reserved.
              </p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
