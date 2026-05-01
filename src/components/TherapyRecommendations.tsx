import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Brain,
  Shield,
  Droplets,
  Sun,
  Zap,
  Clock,
  User,
  Leaf,
  Star,
  ArrowRight
} from "lucide-react";

interface Therapy {
  id: string;
  title: string;
  condition: string;
  plant: string;
  dosha: 'vata' | 'pitta' | 'kapha' | 'tridoshic';
  preparation: string;
  dosage: string;
  duration: string;
  benefits: string[];
  precautions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  effectiveness: number;
}

const therapies: Therapy[] = [
  {
    id: "1",
    title: "Tulsi Tea for Respiratory Health",
    condition: "Cough & Cold",
    plant: "Tulsi (Holy Basil)",
    dosha: "tridoshic",
    preparation: "Boil 10-12 fresh tulsi leaves in 1 cup water for 5 minutes. Add honey and ginger if desired.",
    dosage: "1 cup, 2-3 times daily",
    duration: "5-7 days",
    benefits: ["Relieves cough", "Reduces congestion", "Boosts immunity", "Anti-inflammatory"],
    precautions: ["Avoid during pregnancy", "Consult doctor for chronic conditions"],
    difficulty: "beginner",
    effectiveness: 92
  },
  {
    id: "2",
    title: "Ashwagandha Stress Relief",
    condition: "Stress & Anxiety",
    plant: "Ashwagandha",
    dosha: "vata",
    preparation: "Mix 1 tsp ashwagandha powder with warm milk and honey before bedtime.",
    dosage: "1 tsp powder daily",
    duration: "4-6 weeks",
    benefits: ["Reduces stress", "Improves sleep", "Enhances energy", "Balances cortisol"],
    precautions: ["Not for pregnant women", "May interact with medications"],
    difficulty: "beginner",
    effectiveness: 88
  },
  {
    id: "3",
    title: "Turmeric Golden Milk",
    condition: "Joint Pain & Inflammation",
    plant: "Turmeric (Haldi)",
    dosha: "kapha",
    preparation: "Heat 1 cup milk with 1 tsp turmeric powder, pinch of black pepper, and honey.",
    dosage: "1 cup before bed",
    duration: "2-4 weeks",
    benefits: ["Anti-inflammatory", "Joint pain relief", "Better sleep", "Immune support"],
    precautions: ["May increase bleeding risk", "Avoid with gallstones"],
    difficulty: "beginner",
    effectiveness: 85
  }
];

const conditions = [
  { id: "respiratory", name: "Respiratory", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "digestive", name: "Digestive", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "mental", name: "Mental Health", icon: Brain, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "immunity", name: "Immunity", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "skin", name: "Skin Care", icon: Sun, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "joint", name: "Joint Health", icon: Droplets, color: "text-purple-500", bg: "bg-purple-500/10" }
];

const TherapyRecommendations = () => {
  const [selectedCondition, setSelectedCondition] = useState("respiratory");
  const [selectedDosha, setSelectedDosha] = useState<string>("all");

  const filteredTherapies = therapies.filter(therapy => {
    const matchesDosha = selectedDosha === "all" || therapy.dosha === selectedDosha || therapy.dosha === "tridoshic";
    return matchesDosha;
  });

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'vata': return <Droplets className="w-3 h-3" />;
      case 'pitta': return <Sun className="w-3 h-3" />;
      case 'kapha': return <Shield className="w-3 h-3" />;
      default: return <Heart className="w-3 h-3" />;
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata': return 'text-ayush-vata bg-ayush-vata/10 border-ayush-vata/20';
      case 'pitta': return 'text-ayush-pitta bg-ayush-pitta/10 border-ayush-pitta/20';
      case 'kapha': return 'text-ayush-kapha bg-ayush-kapha/10 border-ayush-kapha/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600';
    }
  };

  return (
    <section id="therapies" className="py-24 bg-gradient-to-b from-background to-secondary/10 relative">
      {/* Decorative floating leaves */}
      <Leaf className="floating-leaf floating-leaf-1 text-primary hidden md:block" />
      <Leaf className="floating-leaf floating-leaf-3 text-accent hidden md:block" />

      <div className="container mx-auto px-4 section-content relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <span className="text-primary font-medium tracking-wider uppercase text-sm mb-3 block">Natural Healing</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
              Personalized AYUSH Therapies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover evidence-based herbal therapies tailored to your health needs,
              rooted in ancient wisdom and validated by modern research.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar / Top bar for filters */}
            <div className="lg:col-span-1 space-y-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {/* Condition Categories */}
              <div>
                <h3 className="text-lg font-bold mb-4 font-serif">Health Focus</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {conditions.map((condition) => (
                    <button
                      key={condition.id}
                      onClick={() => setSelectedCondition(condition.id)}
                      className={`flex items-center p-3 rounded-xl transition-all duration-300 text-left ${selectedCondition === condition.id
                          ? "bg-white shadow-herbal border-l-4 border-primary translate-x-1"
                          : "bg-transparent hover:bg-white/50 border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${condition.bg} ${condition.color}`}>
                        <condition.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm">{condition.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dosha Filter */}
              <div>
                <h3 className="text-lg font-bold mb-4 font-serif">Dosha Balance</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {["all", "vata", "pitta", "kapha"].map((dosha) => (
                    <Button
                      key={dosha}
                      size="sm"
                      variant={selectedDosha === dosha ? "default" : "ghost"}
                      onClick={() => setSelectedDosha(dosha)}
                      className={`justify-start ${selectedDosha === dosha
                          ? "bg-primary text-white"
                          : "hover:bg-primary/5"
                        }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${dosha === 'vata' ? 'bg-ayush-vata' :
                          dosha === 'pitta' ? 'bg-ayush-pitta' :
                            dosha === 'kapha' ? 'bg-ayush-kapha' : 'bg-gray-300'
                        }`} />
                      {dosha === "all" ? "All Doshas" : dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-1 gap-6">
                {filteredTherapies.map((therapy, index) => (
                  <Card
                    key={therapy.id}
                    className="overflow-hidden border-none shadow-soft hover:shadow-deep transition-all duration-300 animate-fade-up bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="grid md:grid-cols-12 gap-0">
                      {/* Left Header Section */}
                      <div className="md:col-span-4 bg-gradient-to-br from-primary/5 to-transparent p-6 border-r border-black/5 dark:border-white/5 flex flex-col justify-between">
                        <div>
                          <Badge variant="outline" className={`${getDoshaColor(therapy.dosha)} border mb-4 px-3 py-1`}>
                            {getDoshaIcon(therapy.dosha)}
                            <span className="ml-1 capitalize">{therapy.dosha}</span>
                          </Badge>

                          <h3 className="text-2xl font-bold text-foreground mb-2 font-serif">{therapy.title}</h3>
                          <p className="text-primary font-medium flex items-center mb-1">
                            <Leaf className="w-4 h-4 mr-1" />
                            {therapy.plant}
                          </p>
                          <p className="text-sm text-muted-foreground">Best for: {therapy.condition}</p>
                        </div>

                        <div className="mt-8">
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <Star className="w-4 h-4 text-accent/30 fill-accent/30" />
                            <span className="text-xs font-semibold ml-2 text-foreground">{therapy.effectiveness}% Effective</span>
                          </div>
                          <Badge variant="secondary" className={`${getDifficultyColor(therapy.difficulty)} border-none`}>
                            {therapy.difficulty.charAt(0).toUpperCase() + therapy.difficulty.slice(1)} Level
                          </Badge>
                        </div>
                      </div>

                      {/* Right Details Section */}
                      <div className="md:col-span-8 p-6">
                        <Tabs defaultValue="preparation" className="w-full">
                          <TabsList className="bg-muted/50 p-1 rounded-xl mb-6 w-full justify-start">
                            <TabsTrigger value="preparation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Preparation</TabsTrigger>
                            <TabsTrigger value="benefits" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Benefits</TabsTrigger>
                            <TabsTrigger value="precautions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Safety</TabsTrigger>
                          </TabsList>

                          <TabsContent value="preparation" className="space-y-6 animate-in fade-in-50 duration-300">
                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl">
                              <h5 className="font-semibold text-foreground mb-2 flex items-center">
                                <Zap className="w-4 h-4 text-amber-500 mr-2" />
                                How to Prepare
                              </h5>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {therapy.preparation}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-start p-3 bg-muted/30 rounded-xl">
                                <Clock className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                <div>
                                  <h6 className="text-xs font-bold text-foreground uppercase tracking-wide">Dosage</h6>
                                  <p className="text-sm text-muted-foreground">{therapy.dosage}</p>
                                </div>
                              </div>
                              <div className="flex items-start p-3 bg-muted/30 rounded-xl">
                                <User className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                <div>
                                  <h6 className="text-xs font-bold text-foreground uppercase tracking-wide">Duration</h6>
                                  <p className="text-sm text-muted-foreground">{therapy.duration}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="benefits" className="space-y-4 animate-in fade-in-50 duration-300">
                            <div className="grid grid-cols-2 gap-3">
                              {therapy.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/10 rounded-xl">
                                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                                    <Leaf className="w-3 h-3 text-green-600 dark:text-green-400" />
                                  </div>
                                  <span className="text-sm font-medium">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="precautions" className="space-y-4 animate-in fade-in-50 duration-300">
                            <div className="space-y-3">
                              {therapy.precautions.map((precaution, i) => (
                                <div key={i} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-950/10 rounded-xl border border-red-100 dark:border-red-900/20">
                                  <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-red-800 dark:text-red-200">{precaution}</span>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="flex gap-4 mt-8 pt-6 border-t border-border/50">
                          <Button className="flex-1 bg-gradient-herbal shadow-glow hover:shadow-herbal">
                            Add to My Plan
                          </Button>
                          <Button variant="outline" className="flex-1 border-primary/20 text-primary hover:bg-primary/5">
                            Details <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <div className="glass-panel p-10 rounded-[3rem] relative overflow-hidden max-w-4xl mx-auto shadow-2xl border-white/40">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-foreground mb-4 font-serif">
                  Not sure which therapy is right for you?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Take our comprehensive 2-minute dosha assessment to receive a customized wellness plan based on your unique constitution.
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-12 rounded-full font-bold shadow-glow hover:scale-105 transition-transform">
                  Take Free Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapyRecommendations;