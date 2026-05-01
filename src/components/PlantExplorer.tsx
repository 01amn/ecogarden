import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Leaf,
  Heart,
  Brain,
  Shield,
  Droplets,
  Sun,
  Star,
  Bookmark,
  ArrowRight,
  Camera
} from "lucide-react";

// Import plant images
// Import plant images
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
  difficulty: 'easy' | 'medium' | 'hard';
  season: string[];
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

const PlantExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [bookmarkedPlants, setBookmarkedPlants] = useState<string[]>([]);

  useEffect(() => {
    const handleSearchUpdate = () => {
      const storedQuery = sessionStorage.getItem('plantSearchQuery');
      if (storedQuery) {
        setSearchQuery(storedQuery);
        setSelectedFilter("all");
        sessionStorage.removeItem('plantSearchQuery');
      }
    };

    // Check initially
    handleSearchUpdate();

    // Listen for custom event from Hero or AIScanner
    window.addEventListener('plantSearchUpdate', handleSearchUpdate);
    return () => {
      window.removeEventListener('plantSearchUpdate', handleSearchUpdate);
    };
  }, []);

  const filteredPlants = samplePlants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.sanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === "all" ||
      plant.dosha === selectedFilter ||
      plant.difficulty === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const toggleBookmark = (plantId: string) => {
    setBookmarkedPlants(prev =>
      prev.includes(plantId)
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

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
      case 'vata': return 'text-ayush-vata border-ayush-vata/30 bg-ayush-vata/10';
      case 'pitta': return 'text-ayush-pitta border-ayush-pitta/30 bg-ayush-pitta/10';
      case 'kapha': return 'text-ayush-kapha border-ayush-kapha/30 bg-ayush-kapha/10';
      default: return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  return (
    <section id="plants" className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-10" />
      <Leaf className="absolute top-40 -left-10 w-24 h-24 text-primary/5 rotate-45" />
      <Leaf className="absolute bottom-40 -right-10 w-32 h-32 text-primary/5 -rotate-12" />

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <span className="text-accent font-medium tracking-wider uppercase text-sm mb-3 block">Botanical Wisdom</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
              Explore Medicinal Plants
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dive into our comprehensive database of AYUSH-approved medicinal plants.
              Discover their properties, benefits, and how to grow them in your own garden.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl p-4 rounded-3xl shadow-herbal border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center">

                {/* Search */}
                <div className="flex-1 relative w-full flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search plants by name, benefits, or Sanskrit name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-xl bg-background/50 border-transparent focus:bg-background transition-all w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById('scanner-file-input') as HTMLInputElement;
                      if (input) input.click();
                      const scannerSec = document.getElementById('scanner');
                      if (scannerSec) {
                        const offsetPosition = scannerSec.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    }}
                    className="h-12 px-4 rounded-xl border-primary/20 text-primary hover:bg-primary/10 shadow-sm transition-all flex items-center gap-2 shrink-0"
                    title="Scan Plant Leaves"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">Scan</span>
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                  <Filter className="w-5 h-5 text-muted-foreground shrink-0 hidden md:block" />
                  <div className="flex gap-2">
                    {["all", "vata", "pitta", "kapha", "easy", "medium"].map((filter) => (
                      <Button
                        key={filter}
                        size="sm"
                        variant={selectedFilter === filter ? "default" : "outline"}
                        onClick={() => setSelectedFilter(filter)}
                        className={`rounded-full px-6 ${selectedFilter === filter
                          ? "bg-primary hover:bg-primary/90 text-white shadow-md border-transparent"
                          : "bg-background/50 border-border hover:bg-background hover:text-primary"
                          }`}
                      >
                        {filter === "all" ? "All Plants" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant, index) => (
                <div
                  key={plant.id}
                  className="group rounded-3xl bg-white dark:bg-black/20 border border-white/10 shadow-soft hover:shadow-herbal transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full animate-fade-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(plant.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors z-10"
                    >
                      <Bookmark className={`w-5 h-5 ${bookmarkedPlants.includes(plant.id) ? 'fill-accent text-accent' : 'text-white'}`} />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1 font-serif">{plant.name}</h3>
                      <p className="text-white/90 text-sm font-medium">{plant.sanskrit}</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className={`${getDoshaColor(plant.dosha)} px-3 py-1`}>
                        {getDoshaIcon(plant.dosha)}
                        <span className="ml-1 capitalize">{plant.dosha}</span>
                      </Badge>
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70">
                        {plant.virya === 'hot' ? '🔥' : '❄️'} {plant.virya}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {plant.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Key Benefits</span>
                        <div className="flex flex-wrap gap-2">
                          {plant.benefits.slice(0, 3).map((benefit, i) => (
                            <span key={i} className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-accent/10 text-accent-foreground border border-accent/20">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md group-hover:shadow-glow transition-all">
                          Read More
                        </Button>
                        <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary rounded-xl">
                          <Brain className="w-4 h-4 mr-2" />
                          Therapy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No plants found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                  }}
                  className="mt-4 text-primary"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Load More */}
          <div className="text-center pb-8 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <Button size="lg" variant="outline" className="px-10 h-12 rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300">
              Load More Plants <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantExplorer;