import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Camera, Search, Leaf, Brain, Users, Star, CheckCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-herbal-garden.jpg";

// Import plant images and data
import aloeveraImage from "@/assets/plants/aloevera.jpeg";
import bambooImage from "@/assets/plants/bamboo.jpg";
import brahmiImage from "@/assets/plants/brahmi.png";
import curryImage from "@/assets/plants/curry.jpeg";
import gingerImage from "@/assets/plants/ginger.png";
import hibiscusImage from "@/assets/plants/hibiscus.png";
import mangoImage from "@/assets/plants/mango.png";
import marigoldImage from "@/assets/plants/marigold.jpg";
import mintImage from "@/assets/plants/mint.jpeg";
import neemImage from "@/assets/plants/neem.png";
import onionImage from "@/assets/plants/onion.png";
import papayaImage from "@/assets/plants/papaya.jpg";
import peepalImage from "@/assets/plants/peepal.png";
import roseImage from "@/assets/plants/rose.jpg";
import tulsiImage from "@/assets/plants/tulsi.jpeg";
import turmericImage from "@/assets/plants/turmeric.png";

interface Plant {
  id: string;
  name: string;
  sanskrit: string;
  scientificName: string;
  description: string;
  properties: string[];
  dosha: 'vata' | 'pitta' | 'kapha' | 'tridoshic';
  rasa: string[];
  virya: 'hot' | 'cold';
  benefits: string[];
  image: string;
}

const samplePlants: Plant[] = [
  {
    id: "1",
    name: "Tulsi",
    sanskrit: "तुलसी (Ocimum sanctum)",
    scientificName: "Ocimum tenuiflorum",
    description: "Sacred basil known for its adaptogenic and immunity-boosting properties.",
    properties: ["Adaptogenic", "Antimicrobial", "Anti-inflammatory", "Immunomodulator"],
    dosha: "tridoshic",
    rasa: ["Pungent", "Bitter"],
    virya: "hot",
    benefits: ["Respiratory health", "Stress relief", "Immunity boost"],
    image: tulsiImage,
    difficulty: "easy",
    season: ["All seasons"]
  },
  {
    id: "2",
    name: "Turmeric",
    sanskrit: "हल्दी (Curcuma longa)",
    scientificName: "Curcuma longa",
    description: "Golden spice with powerful anti-inflammatory properties.",
    properties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
    dosha: "kapha",
    rasa: ["Bitter", "Pungent"],
    virya: "hot",
    benefits: ["Joint health", "Skin healing", "Immunity"],
    image: turmericImage,
    difficulty: "easy",
    season: ["Monsoon", "Winter"]
  },
  {
    id: "3",
    name: "Neem",
    sanskrit: "नीम (Azadirachta indica)",
    scientificName: "Azadirachta indica",
    description: "Natural detoxifier with strong antibacterial properties.",
    properties: ["Antibacterial", "Antifungal", "Detoxifying"],
    dosha: "pitta",
    rasa: ["Bitter"],
    virya: "cold",
    benefits: ["Skin health", "Blood purification"],
    image: neemImage,
    difficulty: "easy",
    season: ["Summer"]
  },
  {
    id: "4",
    name: "Aloe Vera",
    sanskrit: "घृतकुमारी",
    scientificName: "Aloe barbadensis miller",
    description: "Cooling plant known for skin and healing benefits.",
    properties: ["Cooling", "Healing", "Moisturizing"],
    dosha: "pitta",
    rasa: ["Bitter", "Sweet"],
    virya: "cold",
    benefits: ["Skin care", "Wound healing"],
    image: aloeveraImage, // ✅ FIXED NAME
    difficulty: "easy",
    season: ["All seasons"]
  },
  {
    id: "5",
    name: "Brahmi",
    sanskrit: "ब्राह्मी",
    scientificName: "Bacopa monnieri",
    description: "Brain tonic that improves memory and focus.",
    properties: ["Nootropic", "Adaptogenic"],
    dosha: "tridoshic",
    rasa: ["Bitter"],
    virya: "cold",
    benefits: ["Memory", "Mental clarity"],
    image: brahmiImage,
    difficulty: "medium",
    season: ["Monsoon"]
  },
  {
    id: "6",
    name: "Bamboo",
    sanskrit: "वंश",
    scientificName: "Bambusa vulgaris",
    description: "Cooling plant useful in respiratory health.",
    properties: ["Cooling", "Strengthening"],
    dosha: "pitta",
    rasa: ["Sweet"],
    virya: "cold",
    benefits: ["Bone health"],
    image: bambooImage,
    difficulty: "medium",
    season: ["Monsoon"]
  },
  {
    id: "7",
    name: "Curry",
    sanskrit: "करी पत्ता",
    scientificName: "Murraya koenigii",
    description: "Improves digestion and hair health.",
    properties: ["Digestive", "Antioxidant"],
    dosha: "vata",
    rasa: ["Pungent"],
    virya: "hot",
    benefits: ["Digestion", "Hair growth"],
    image: curryImage,
    difficulty: "easy",
    season: ["Summer"]
  },
  {
    id: "8",
    name: "Ginger",
    sanskrit: "आर्द्रक",
    scientificName: "Zingiber officinale",
    description: "Warming herb for digestion and cold relief.",
    properties: ["Digestive", "Anti-inflammatory"],
    dosha: "kapha",
    rasa: ["Pungent"],
    virya: "hot",
    benefits: ["Cold relief", "Digestion"],
    image: gingerImage,
    difficulty: "easy",
    season: ["Winter"]
  },
  {
    id: "9",
    name: "Hibiscus",
    sanskrit: "जपा पुष्प",
    scientificName: "Hibiscus rosa-sinensis",
    description: "Used for hair and cooling effects.",
    properties: ["Cooling", "Hair nourishing"],
    dosha: "pitta",
    rasa: ["Sweet"],
    virya: "cold",
    benefits: ["Hair growth"],
    image: hibiscusImage,
    difficulty: "easy",
    season: ["Summer"]
  },
  {
    id: "10",
    name: "Mango",
    sanskrit: "आम्र",
    scientificName: "Mangifera indica",
    description: "Nutritive fruit with energy boosting properties.",
    properties: ["Nutritive"],
    dosha: "vata",
    rasa: ["Sweet"],
    virya: "hot",
    benefits: ["Energy"],
    image: mangoImage,
    difficulty: "medium",
    season: ["Summer"]
  },
  {
    id: "11",
    name: "Marigold",
    sanskrit: "गेंद",
    scientificName: "Tagetes erecta",
    description: "Healing flower used in skin care.",
    properties: ["Antiseptic"],
    dosha: "pitta",
    rasa: ["Bitter"],
    virya: "cold",
    benefits: ["Wound healing"],
    image: marigoldImage,
    difficulty: "easy",
    season: ["Winter"]
  },
  {
    id: "12",
    name: "Mint",
    sanskrit: "पुदीना",
    scientificName: "Mentha",
    description: "Refreshing herb with cooling effect.",
    properties: ["Cooling", "Digestive"],
    dosha: "pitta",
    rasa: ["Pungent"],
    virya: "cold",
    benefits: ["Digestion"],
    image: mintImage,
    difficulty: "easy",
    season: ["Summer"]
  },
  {
    id: "13",
    name: "Onion",
    sanskrit: "प्याज",
    scientificName: "Allium cepa",
    description: "Cooling vegetable with medicinal value.",
    properties: ["Cooling"],
    dosha: "pitta",
    rasa: ["Pungent"],
    virya: "cold",
    benefits: ["Heart health"],
    image: onionImage,
    difficulty: "easy",
    season: ["Winter"]
  },
  {
    id: "14",
    name: "Papaya",
    sanskrit: "पपिता",
    scientificName: "Carica papaya",
    description: "Improves digestion using natural enzymes.",
    properties: ["Digestive"],
    dosha: "vata",
    rasa: ["Sweet"],
    virya: "hot",
    benefits: ["Digestion"],
    image: papayaImage,
    difficulty: "easy",
    season: ["All seasons"]
  },
  {
    id: "15",
    name: "Peepal",
    sanskrit: "पीपल",
    scientificName: "Ficus religiosa",
    description: "Sacred tree with medicinal benefits.",
    properties: ["Cooling"],
    dosha: "pitta",
    rasa: ["Bitter"],
    virya: "cold",
    benefits: ["Respiratory health"],
    image: peepalImage,
    difficulty: "hard",
    season: ["All seasons"]
  },
  {
    id: "16",
    name: "Rose",
    sanskrit: "गुलाब",
    scientificName: "Rosa indica",
    description: "Cooling and calming flower.",
    properties: ["Cooling"],
    dosha: "pitta",
    rasa: ["Sweet"],
    virya: "cold",
    benefits: ["Stress relief"],
    image: roseImage,
    difficulty: "medium",
    season: ["Winter"]
  }
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [identifiedPlant, setIdentifiedPlant] = useState<Plant | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      // Find matching plant
      const foundPlant = samplePlants.find(plant =>
        plant.name.toLowerCase().includes(query) ||
        plant.sanskrit.toLowerCase().includes(query) ||
        plant.scientificName.toLowerCase().includes(query) ||
        plant.benefits.some(benefit => benefit.toLowerCase().includes(query))
      );

      if (foundPlant) {
        setIdentifiedPlant(foundPlant);
        setShowResultDialog(true);
        setUploadedImage(null); // No image for text search
      } else {
        // If no plant found, show a message
        alert(`No plant found matching "${searchQuery}". Try searching for: Tulsi, Ashwagandha, Turmeric, Neem, Aloe Vera, or Brahmi`);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        identifyPlant(file, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifyPlant = async (file: File, imageData: string) => {
    setIsIdentifying(true);
    setShowResultDialog(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/scan`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to scan plant");

      const response = await res.json();
      
      // Check response status first
      if (response.status === "error") {
        alert(`Error: ${response.message || "Unable to identify plant"}`);
        setShowResultDialog(false);
        setIsIdentifying(false);
        return;
      }

      // Extract data from nested or top-level response
      const data = response.data ?? response;

      if (!data.plantName) {
        alert("Could not identify plant. Please try a clearer image.");
        setShowResultDialog(false);
        setIsIdentifying(false);
        return;
      }

      const matchedLocal = samplePlants.find(p => p.name.toLowerCase() === data.plantName?.toLowerCase());

      if (matchedLocal) {
        setIdentifiedPlant(matchedLocal);
      } else {
        setIdentifiedPlant({
          id: "temp",
          name: data.plantName || "Unknown Plant",
          sanskrit: data.sanskrit || "",
          scientificName: data.scientificName || "",
          description: data.therapyRecommendations?.[0] || "No description available.",
          properties: data.properties || [],
          dosha: data.dosha || "tridoshic",
          rasa: ["Unknown"],
          virya: "cold",
          benefits: data.benefits || [],
          image: imageData
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error identifying plant. Please try again.");
    } finally {
      setIsIdentifying(false);
    }
  };


  const handleExploreTherapies = () => {
    const element = document.querySelector('#therapies');
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata': return 'text-ayush-vata border-ayush-vata/30 bg-ayush-vata/10';
      case 'pitta': return 'text-ayush-pitta border-ayush-pitta/30 bg-ayush-pitta/10';
      case 'kapha': return 'text-ayush-kapha border-ayush-kapha/30 bg-ayush-kapha/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  const features = [
    {
      icon: Camera,
      title: "AI Plant Scanner",
      description: "Identify medicinal plants instantly with our YOLOv8-powered recognition system"
    },
    {
      icon: Brain,
      title: "AYUSH Therapy",
      description: "Get personalized dosha-based therapy recommendations rooted in traditional wisdom"
    },
    {
      icon: Users,
      title: "Community Garden",
      description: "Share knowledge and experiences in our collaborative herbal wellness ecosystem"
    }
  ];

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Immersive Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      />

      {/* Premium Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-transparent mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />

      {/* Floating botanical elements */}
      <div className="absolute top-20 left-10 w-12 h-12 opacity-20 animate-leaf-float">
        <Leaf className="w-full h-full text-white" />
      </div>
      <div className="absolute top-40 right-20 w-8 h-8 opacity-30 animate-leaf-float" style={{ animationDelay: "2s" }}>
        <Leaf className="w-full h-full text-accent" />
      </div>
      <div className="absolute bottom-40 left-20 w-16 h-16 opacity-10 animate-leaf-float" style={{ animationDelay: "4s" }}>
        <Leaf className="w-full h-full text-white" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text & Search */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 text-white text-sm font-medium">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span>#1 Medicinal Plant Identification Platform</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] text-shadow-sm font-serif">
                Virtual Eco <br />
                <span className="text-accent italic">Herbal Garden</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg leading-relaxed font-light">
                Bridge ancient wisdom with modern technology. Discover nature's healing power through AI recognition and personalized AYUSH therapies.
              </p>

              {/* Search Bar - Glassmorphism */}
              <div className="max-w-xl mb-10">
                <input
                  id="hero-scanner-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <form onSubmit={handleSearch}>
                  <div className="bg-white/95 backdrop-blur-xl p-2 rounded-2xl shadow-deep flex items-center gap-2 transform transition-transform focus-within:scale-[1.02] duration-300">
                    <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
                    <Input
                      placeholder="Search herbs, ailments, or therapies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 bg-transparent text-lg h-12 placeholder:text-muted-foreground/70 focus-visible:ring-0 text-foreground min-w-[150px]"
                    />
                    <div className="flex gap-2 shrink-0">
                      <Button
                        type="button"
                        onClick={handleImageButtonClick}
                        variant="outline"
                        className="h-12 w-12 rounded-xl border-primary/20 text-primary hover:bg-primary/10 p-0"
                        title="Scan Plant Using Camera"
                      >
                        <Camera className="w-5 h-5" />
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 sm:px-6 h-12 shadow-glow transition-all duration-300"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full px-8 h-12 shadow-glow transition-transform hover:-translate-y-1">
                  Start Exploring
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleExploreTherapies}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-8 h-12 transition-all"
                >
                  Find Therapies <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Column: Feature Cards (Floating) */}
            <div className="hidden lg:grid grid-cols-2 gap-6 animate-float relative">
              <div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent blur-3xl -z-10" />

              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`glass-card p-6 rounded-3xl ${index === 1 ? 'translate-y-12' : ''}`}
                >
                  <div className="bg-gradient-leaf w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-leaf">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-serif">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-12 text-white/90">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Leaf className="w-5 h-5 text-accent" />
              </div>
              <span className="font-medium">500+ Medicinal Plants</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <span className="font-medium">1000+ AYUSH Therapies</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <span className="font-medium">98% Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Identification Result Dialog - Streamlined */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-none shadow-deep rounded-2xl">
          {isIdentifying ? (
            <div className="flex flex-col items-center justify-center py-20 px-8">
              <div className="bg-gradient-herbal p-6 rounded-full mb-8 animate-herbal-pulse shadow-glow">
                <Camera className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-serif">Identifying Plant...</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Analyzing botanical features using our AI models to find the best match.
              </p>
            </div>
          ) : identifiedPlant ? (
            <div className="grid md:grid-cols-2 h-full">
              {/* Image Side */}
              <div className="relative bg-secondary/30 h-64 md:h-auto">
                <img
                  src={uploadedImage || identifiedPlant.image}
                  alt={identifiedPlant.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <Badge className="bg-accent text-accent-foreground border-none mb-2">Match Found</Badge>
                    <h2 className="text-3xl font-bold text-white font-serif">{identifiedPlant.name}</h2>
                    <p className="text-white/90 italic">{identifiedPlant.scientificName}</p>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader className="mb-6">
                  <DialogTitle className="sr-only">Plant Details</DialogTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Sanskrit Name</span>
                    <Badge variant="outline" className={`${getDoshaColor(identifiedPlant.dosha)} capitalize`}>
                      {identifiedPlant.dosha} Balancing
                    </Badge>
                  </div>
                  <p className="text-2xl font-serif text-primary mt-1">{identifiedPlant.sanskrit}</p>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" /> Warning / Usage
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {identifiedPlant.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Therapeutic Properties</h4>
                    <div className="flex flex-wrap gap-2">
                      {identifiedPlant.properties.map((property, index) => (
                        <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Rasa (Taste)</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {identifiedPlant.rasa.map((r, i) => (
                          <span key={i} className="text-sm font-medium">{r}{i < identifiedPlant.rasa.length - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Virya (Potency)</span>
                      <div className="mt-2 text-sm font-medium capitalize">
                        {identifiedPlant.virya}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {identifiedPlant.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-foreground/80">
                          <CheckCircle className="w-4 h-4 text-primary/70" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-6 mt-6 border-t border-border">
                    <Button
                      onClick={() => {
                        sessionStorage.setItem('plantSearchQuery', identifiedPlant.name);
                        window.dispatchEvent(new Event('plantSearchUpdate'));
                        setShowResultDialog(false);
                        setUploadedImage(null);
                        setIdentifiedPlant(null);
                        setSearchQuery("");
                        const element = document.querySelector('#plants');
                        if (element) {
                          const navHeight = 80;
                          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                          const offsetPosition = elementPosition - navHeight;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg"
                    >
                      Explore Full Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      </Dialog>
    </div>
  );
};

export default Hero;