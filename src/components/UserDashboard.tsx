import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Leaf,
  Star,
  Trophy,
  Calendar,
  Heart,
  Brain,
  Target,
  TrendingUp,
  Award,
  Bookmark,
  Clock,
  CheckCircle,
  Plus,
  MoreVertical,
  Activity,
  Droplets,
  Sun
} from "lucide-react";

interface UserStats {
  ecoPoints: number;
  level: number;
  plantsScanned: number;
  therapiesCompleted: number;
  streakDays: number;
  badges: string[];
}

interface SavedPlant {
  id: string;
  name: string;
  sanskrit: string;
  dateAdded: string;
  status: 'growing' | 'harvested' | 'planning';
  image: string;
}

interface ActiveTherapy {
  id: string;
  title: string;
  plant: string;
  progress: number;
  daysLeft: number;
  nextDose: string;
}

const mockUserStats: UserStats = {
  ecoPoints: 2450,
  level: 7,
  plantsScanned: 23,
  therapiesCompleted: 8,
  streakDays: 15,
  badges: ["Plant Expert", "Therapy Pioneer", "Community Helper", "Ayush Scholar"]
};

// Placeholder images would be replaced by actual imports
const mockSavedPlants: SavedPlant[] = [
  { id: "1", name: "Tulsi", sanskrit: "तुलसी", dateAdded: "2024-01-15", status: "growing", image: "https://images.unsplash.com/photo-1596522354782-b73347c6d656?w=600&auto=format&fit=crop" },
  { id: "2", name: "Ashwagandha", sanskrit: "अश्वगंधा", dateAdded: "2024-01-10", status: "planning", image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600&auto=format&fit=crop" },
  { id: "3", name: "Turmeric", sanskrit: "हल्दी", dateAdded: "2024-01-08", status: "harvested", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop" }
];

const mockActiveTherapies: ActiveTherapy[] = [
  { id: "1", title: "Tulsi Tea for Immunity", plant: "Tulsi", progress: 60, daysLeft: 3, nextDose: "Evening, 6 PM" },
  { id: "2", title: "Ashwagandha Stress Relief", plant: "Ashwagandha", progress: 25, daysLeft: 18, nextDose: "Bedtime, 10 PM" }
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'growing': return <TrendingUp className="w-3 h-3" />;
      case 'harvested': return <CheckCircle className="w-3 h-3" />;
      case 'planning': return <Calendar className="w-3 h-3" />;
      default: return <Leaf className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'growing': return 'bg-green-100 text-green-700 hover:bg-green-200 border-none';
      case 'harvested': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-none';
      case 'planning': return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-none';
      default: return 'bg-gray-100 text-gray-700 border-none';
    }
  };

  return (
    <section id="dashboard" className="py-24 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-up">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">Welcome Back</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif">
                Wellness Dashboard
              </h2>
              <p className="text-muted-foreground mt-2">
                Track your herbal journey, manage therapies, and monitor your garden.
              </p>
            </div>

            <div className="mt-6 md:mt-0 flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">Today</p>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <Button className="rounded-full h-12 w-12 p-0 shadow-lg bg-white text-primary hover:bg-primary hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {[
              { label: "EcoPoints", value: mockUserStats.ecoPoints, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Plants Scanned", value: mockUserStats.plantsScanned, icon: Leaf, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Therapies", value: mockUserStats.therapiesCompleted, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
              { label: "Day Streak", value: mockUserStats.streakDays, icon: Trophy, color: "text-primary", bg: "bg-primary/10" }
            ].map((stat, i) => (
              <Card key={i} className="p-6 border-none shadow-soft hover:shadow-herbal transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-foreground group-hover:scale-110 origin-left transition-transform bg-clip-text">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Tabs */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl mb-8 w-full max-w-2xl mx-auto shadow-sm grid grid-cols-4">
                <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
                <TabsTrigger value="garden" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Garden</TabsTrigger>
                <TabsTrigger value="therapies" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Therapies</TabsTrigger>
                <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Badges</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                <div className="grid lg:grid-cols-3 gap-8">

                  {/* Left Col: Goals & Progress */}
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8 border-none shadow-herbal bg-white">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold font-serif">Weekly Goals</h3>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">View All</Button>
                      </div>

                      <div className="space-y-6">
                        {[
                          { label: "Therapy Compliance", value: 85, icon: Heart, color: "bg-rose-500" },
                          { label: "Community Helper", value: 40, icon: User, color: "bg-blue-500" },
                          { label: "Plant Research", value: 65, icon: Brain, color: "bg-amber-500" }
                        ].map((goal, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <goal.icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{goal.label}</span>
                              </div>
                              <span className="text-sm font-bold">{goal.value}%</span>
                            </div>
                            <Progress value={goal.value} className={`h-2.5 bg-secondary/30 ${goal.color.replace('bg-', 'text-')}`} />
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-8 border-none shadow-herbal bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold font-serif mb-2">Next Scheduled Dose</h3>
                          <p className="opacity-90 max-w-md mb-6">Your wellness journey is going great! Don't forget your evening dose.</p>

                          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <div className="bg-white p-2 rounded-lg">
                              <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">Ashwagandha Powder</p>
                              <p className="text-sm opacity-80">Today, 10:00 PM • Mixed with warm milk</p>
                            </div>
                          </div>
                        </div>
                        <Button className="bg-white text-primary hover:bg-white/90 shadow-lg rounded-xl h-12 px-6">
                          Mark as Taken
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Right Col: Recent Activity */}
                  <div className="lg:col-span-1">
                    <Card className="p-6 border-none shadow-herbal bg-white h-full">
                      <h3 className="text-xl font-bold font-serif mb-6">Recent Activity</h3>
                      <div className="space-y-6">
                        <div className="relative pl-6 border-l-2 border-dashed border-secondary">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                          <p className="text-sm font-bold text-foreground">Scanned Neem Plant</p>
                          <p className="text-xs text-muted-foreground mb-1">2 hours ago</p>
                          <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 hover:bg-green-200">+50 points</Badge>
                        </div>
                        <div className="relative pl-6 border-l-2 border-dashed border-secondary">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-sm"></div>
                          <p className="text-sm font-bold text-foreground">Completed Tulsi Therapy</p>
                          <p className="text-xs text-muted-foreground mb-1">Yesterday</p>
                          <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-200">+100 points</Badge>
                        </div>
                        <div className="relative pl-6 border-l-2 border-dashed border-secondary">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                          <p className="text-sm font-bold text-foreground">Earned 'Plant Expert' Badge</p>
                          <p className="text-xs text-muted-foreground mb-1">3 days ago</p>
                          <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-200">Achievement</Badge>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-8 rounded-xl border-dashed">
                        View Full History
                      </Button>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* My Garden Tab */}
              <TabsContent value="garden" className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold font-serif">My Herbal Garden</h3>
                  <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plant
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSavedPlants.map((plant) => (
                    <Card key={plant.id} className="overflow-hidden border-none shadow-soft hover:shadow-deep transition-all duration-300 group bg-white">
                      <div className="h-48 relative overflow-hidden">
                        {/* Placeholder image logic - in real app would verify source */}
                        <div className="absolute inset-0 bg-secondary/20">
                          {/* Using a solid color fallback if image fails, or gradient */}
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10"></div>
                        </div>

                        <div className="absolute top-4 right-4">
                          <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white w-8 h-8">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>

                        <div className="absolute bottom-4 left-4">
                          <Badge className={getStatusBadge(plant.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(plant.status)}
                              <span className="capitalize">{plant.status}</span>
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        <h4 className="text-xl font-bold text-foreground">{plant.name}</h4>
                        <p className="text-primary font-medium text-sm mb-4">{plant.sanskrit}</p>

                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Added {new Date(plant.dateAdded).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {plant.status === 'growing' ? (
                              <>
                                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                                <span>Water today</span>
                              </>
                            ) : (
                              <>
                                <Sun className="w-3.5 h-3.5 text-amber-500" />
                                <span>Full Sun</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-none hover:shadow-lg transition-all">
                            Care Guide
                          </Button>
                          <Button variant="outline" className="flex-1 rounded-xl border-primary/20 text-foreground">
                            Update
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Add New Card Placeholder */}
                  <div className="border-2 border-dashed border-secondary rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-primary/60 group-hover:text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-1">Grow Your Collection</h4>
                    <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                      Scan a new plant or search the database to add to your garden.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Active Therapies Tab */}
              <TabsContent value="therapies" className="animate-in slide-in-from-bottom-5 duration-500">
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-8 space-y-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-2xl font-bold font-serif">Active Plans</h3>
                      <Button variant="outline" className="rounded-full">History</Button>
                    </div>

                    {mockActiveTherapies.map((therapy) => (
                      <Card key={therapy.id} className="p-6 border-none shadow-herbal hover:shadow-lg transition-all bg-white relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-herbal"></div>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5">
                                  {therapy.daysLeft} days remaining
                                </Badge>
                                <h4 className="text-xl font-bold text-foreground">{therapy.title}</h4>
                                <p className="text-sm text-muted-foreground pt-1 flex items-center gap-2">
                                  <Leaf className="w-3 h-3 text-primary" /> Using {therapy.plant}
                                </p>
                              </div>
                            </div>

                            <div className="mt-6">
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium text-foreground">Progress</span>
                                <span className="text-muted-foreground">{therapy.progress}%</span>
                              </div>
                              <Progress value={therapy.progress} className="h-2.5 rounded-full" />
                            </div>
                          </div>

                          <div className="min-w-[200px] p-5 bg-secondary/20 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Clock className="w-6 h-6 text-primary mb-2" />
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Next Dose</p>
                            <p className="font-bold text-foreground">{therapy.nextDose}</p>
                            <Button size="sm" className="mt-3 w-full rounded-lg bg-white shadow-sm hover:shadow text-foreground border border-gray-100">
                              Take Now
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="md:col-span-4 space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 shadow-none">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" /> Daily Tip
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        "Consistent small dosages of adaptogens like Ashwagandha are more effective than large occasional doses. Stick to your schedule!"
                      </p>
                      <Button variant="link" className="text-accent-foreground p-0 h-auto font-semibold">Read more tips</Button>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="animate-in slide-in-from-bottom-5 duration-500">
                <Card className="p-10 border-none shadow-herbal bg-gradient-to-br from-white to-secondary/10 text-center mb-8">
                  <div className="inline-block p-4 rounded-full bg-gradient-herbal shadow-glow mb-6">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-2">Level {mockUserStats.level} Healer</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                    You're doing great! Earn 550 more EcoPoints to reach Level {mockUserStats.level + 1} and unlock advanced formulation guides.
                  </p>

                  <div className="max-w-md mx-auto relative h-4 bg-secondary/50 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 bg-primary w-3/4 shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                  </div>
                  <div className="max-w-md mx-auto flex justify-between text-xs font-bold text-muted-foreground mt-2 px-1">
                    <span>Level {mockUserStats.level}</span>
                    <span>Level {mockUserStats.level + 1}</span>
                  </div>
                </Card>

                <h4 className="text-xl font-bold mb-6 px-2">Earned Badges</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {mockUserStats.badges.map((badge, index) => (
                    <div key={index} className="group flex flex-col items-center p-6 bg-white rounded-3xl border border-secondary shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-y-full group-hover:translate-y-[-200%] transition-transform duration-700"></div>
                        <Award className={`w-10 h-10 ${index % 2 === 0 ? 'text-amber-500' : 'text-primary'}`} />
                      </div>
                      <h4 className="font-semibold text-foreground text-center mb-1">{badge}</h4>
                      <span className="text-xs text-muted-foreground">Nov 2024</span>
                    </div>
                  ))}

                  {/* Locked Badge */}
                  <div className="flex flex-col items-center p-6 bg-secondary/5 rounded-3xl border border-dashed border-secondary opacity-70">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 grayscale">
                      <Award className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-muted-foreground text-center mb-1">Master Herbalist</h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" /> Complete 5 more therapies
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component for Sparkles icon in tips (since it wasn't imported initially in the big block)
function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export default UserDashboard;