import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Upload,
  Scan,
  CheckCircle,
  Leaf,
  Brain,
  Sparkles,
  FileImage,
  Loader,
  X,
  ArrowRight,
  Shield,
  Bookmark
} from "lucide-react";

interface ScanResult {
  plantName: string;
  sanskrit: string;
  scientificName: string;
  confidence: number;
  properties: string[];
  dosha: 'vata' | 'pitta' | 'kapha' | 'tridoshic';
  benefits: string[];
  therapyRecommendations: string[];
  statusMessage?: string;
  predictions?: { plant: string; confidence: number }[];
}

const mockScanResult: ScanResult = {
  plantName: "Tulsi",
  sanskrit: "तुलसी (Ocimum sanctum)",
  scientificName: "Ocimum tenuiflorum",
  confidence: 94.7,
  properties: ["Adaptogenic", "Antimicrobial", "Anti-inflammatory", "Immunomodulator"],
  dosha: "tridoshic",
  benefits: ["Respiratory health", "Stress relief", "Immunity boost", "Mental clarity"],
  therapyRecommendations: [
    "Chew 5-7 fresh leaves daily on empty stomach for immunity",
    "Tulsi tea with honey for respiratory issues",
    "Tulsi oil for skin conditions",
    "Meditation with Tulsi for mental peace"
  ],
  predictions: [
    { plant: "Tulsi", confidence: 0.947 },
    { plant: "Mint", confidence: 0.032 },
    { plant: "Basil", confidence: 0.011 }
  ]
};

const AIScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setScanResult(null); // Reset result on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const performScan = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to scan plant");
      }

      const responseData = await res.json();
      
      console.log("Scanner API Response:", responseData);
      
      const payload = responseData.data ?? responseData;

      if (responseData.status === "success" || responseData.status === "uncertain") {
        setScanResult({
          ...payload,
          statusMessage: responseData.status === "uncertain" ? responseData.message : undefined,
          predictions: responseData.predictions ?? payload.predictions
        });
      } else if (responseData.status === "error") {
        console.warn("Scan Error:", responseData.message);
        // Show error message as scan result
        setScanResult({
          plantName: responseData.message || "Unable to Identify the plant",
          sanskrit: "",
          scientificName: "",
          confidence: 0,
          properties: [],
          dosha: "vata",
          benefits: [],
          therapyRecommendations: [],
          statusMessage: responseData.message,
          predictions: responseData.predictions
        });
      }
    } catch (error) {
      console.error("Error scanning plant:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const clearScan = () => {
    setUploadedImage(null);
    setSelectedFile(null);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const isUnknown = scanResult?.plantName === "not registered" || scanResult?.plantName === "Unable to Identify the plant" || scanResult?.plantName === "This plant or image is not registered yet" || scanResult?.plantName === "Try clearer image" || scanResult?.plantName.includes("Identified as") || scanResult?.plantName === "Invalid or corrupted image file.";

  return (
    <section id="scanner" className="py-24 bg-gradient-to-b from-secondary/10 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 section-content relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <span className="text-accent font-medium tracking-wider uppercase text-sm mb-3 block">AI Powered</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
              Instant Plant Identification
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload a photo to instantly identify medicinal plants using our advanced AI.
              Get detailed ayurvedic properties, benefits, and personalized therapy recommendations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Scanner Interface */}
            <div className="animate-fade-up order-2 lg:order-1" style={{ animationDelay: "0.2s" }}>
              <Card className="overflow-hidden border-none shadow-herbal bg-white/80 dark:bg-black/40 backdrop-blur-xl">
                <div className="p-1 bg-gradient-herbal"></div>
                <div className="p-8">
                  <div className="text-center">
                    {!uploadedImage ? (
                      <div className="mb-8">
                        <div className="bg-primary/5 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center relative group">
                          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
                          <Camera className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-serif">Scan Your Plant</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          Drag & drop or click to upload a clear image of the plant leaf or flower.
                        </p>
                      </div>
                    ) : (
                      <div className="mb-8 relative group">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg mx-auto max-w-sm aspect-video bg-black/5">
                          <img
                            src={uploadedImage}
                            alt="Uploaded plant"
                            className="w-full h-full object-contain"
                          />
                          {!isScanning && !scanResult && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={clearScan}
                                className="rounded-full w-10 h-10"
                                title="Remove Image"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </div>
                          )}
                          {isScanning && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                              <Loader className="w-10 h-10 text-white animate-spin mb-3" />
                              <p className="text-white font-medium animate-pulse">Analyzing...</p>
                            </div>
                          )}
                        </div>
                        {isScanning && (
                          <div className="w-full max-w-sm mx-auto mt-4">
                            <p className="text-xs text-center text-muted-foreground mb-2 flex items-center justify-center gap-2">
                              <Brain className="w-3 h-3 animate-pulse text-accent" />
                              Processing with MobileNetV2 Classification AI
                            </p>
                            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-herbal animate-[progress_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: '0% 50%' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Area */}
                    {!isScanning && (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                          id="scanner-file-input"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {!uploadedImage ? (
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/30 min-w-[200px] h-12 rounded-xl"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Photo
                          </Button>
                        ) : (
                          !scanResult && (
                            <div className="flex gap-3 w-full max-w-sm mx-auto">
                              <Button
                                onClick={clearScan}
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-dashed border-2"
                              >
                                Change Photo
                              </Button>
                              <Button
                                onClick={performScan}
                                className="flex-1 bg-gradient-herbal text-white shadow-glow hover:shadow-herbal h-12 rounded-xl"
                              >
                                <Scan className="w-5 h-5 mr-2" />
                                Identify
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="bg-secondary/30 p-4 text-center border-t border-secondary/50">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3 text-primary" />
                    Secure & Private • AI Accuracy 98%
                  </p>
                </div>
              </Card>
            </div>

            {/* Scan Results */}
            <div className="order-1 lg:order-2 animate-fade-up flex flex-col justify-center h-full" style={{ animationDelay: "0.4s" }}>
              {scanResult ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-herbal rounded-[2rem] opacity-20 blur-xl animate-pulse"></div>
                  <Card className="relative p-8 shadow-2xl bg-white/95 dark:bg-black/90 backdrop-blur-xl border-white/20 rounded-[2rem] overflow-visible">

                    {/* Badge */}
                    {!isUnknown && (
                      <div className="absolute -top-5 right-8">
                        <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 animate-bounce">
                          <Sparkles className="w-4 h-4" />
                          {scanResult.confidence}% Match
                        </div>
                      </div>
                    )}
                    
                    {/* Uncertain / Low Confidence Banner */}
                    {scanResult.statusMessage && !isUnknown && (
                       <div className="mb-6 bg-yellow-500/10 border border-yellow-500/50 text-yellow-700 dark:text-yellow-400 p-4 rounded-xl flex items-start gap-3">
                         <Shield className="w-5 h-5 shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                         <p className="text-sm font-medium">{scanResult.statusMessage}</p>
                       </div>
                    )}

                    {/* Plant Header */}
                    <div className={`mb-8 ${!isUnknown ? "border-b border-border/50 pb-6" : "pb-2"}`}>
                      <h3 className={`text-3xl font-bold text-foreground mb-1 font-serif ${isUnknown ? "text-center mt-4" : ""}`}>
                        {scanResult.plantName}
                      </h3>
                      {!isUnknown && (
                        <>
                          <p className="text-primary font-medium text-lg mb-2">{scanResult.sanskrit}</p>
                          <p className="text-sm text-muted-foreground italic font-serif flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> {scanResult.scientificName}
                          </p>
                        </>
                      )}
                    </div>

                    {!isUnknown ? (
                      <div className="space-y-8">
                        {/* Top 3 Predictions */}
                        {scanResult.predictions && scanResult.predictions.length > 0 && (
                          <div className="bg-secondary/10 p-4 rounded-2xl border border-border/50">
                            <h5 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                              <Brain className="w-4 h-4" /> Top Predictions
                            </h5>
                            <div className="space-y-3">
                              {scanResult.predictions.map((pred, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="font-medium text-foreground capitalize">{pred.plant}</span>
                                  <div className="flex items-center gap-3 basis-1/2">
                                    <div className="h-2 flex-grow bg-primary/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary" style={{ width: `${pred.confidence * 100}%` }}></div>
                                    </div>
                                    <span className="text-muted-foreground tabular-nums w-10 text-right">
                                      {(pred.confidence * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Properties & Dosha */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-secondary/20 p-4 rounded-2xl">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Ayush Properties</h5>
                            <div className="flex flex-wrap gap-2">
                              {scanResult.properties.slice(0, 3).map((prop, i) => (
                                <span key={i} className="text-xs font-semibold bg-white dark:bg-black/20 text-foreground px-2 py-1 rounded-md border border-black/5">
                                  {prop}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-secondary/20 p-4 rounded-2xl flex flex-col justify-center">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Dosha Balance</h5>
                            <Badge variant="outline" className={`${getDoshaColor(scanResult.dosha)} self-start px-3 py-1.5`}>
                              {scanResult.dosha.charAt(0).toUpperCase() + scanResult.dosha.slice(1)} Balancing
                            </Badge>
                          </div>
                        </div>

                        {/* Benefits List */}
                        <div>
                          <h5 className="font-semibold text-foreground mb-4 flex items-center">
                            <CheckCircle className="w-4 h-4 text-primary mr-2" /> Key Health Benefits
                          </h5>
                          <ul className="grid grid-cols-1 gap-3">
                            {scanResult.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-3 shrink-0"></span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Therapy Recommendation Highlight */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                          <h5 className="font-semibold text-primary mb-3 flex items-center">
                            <Brain className="w-4 h-4 mr-2" /> Recommended Therapy
                          </h5>
                          <p className="text-sm text-foreground/80 italic">
                            "{scanResult.therapyRecommendations[0]}"
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-2">
                          <div className="flex gap-4">
                            <Button 
                              onClick={() => {
                                sessionStorage.setItem('plantSearchQuery', scanResult.plantName);
                                window.dispatchEvent(new Event('plantSearchUpdate'));
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
                              className="flex-1 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-lg"
                            >
                              Get Full Report
                            </Button>
                            <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-2">
                              <Bookmark className="w-5 h-5 text-muted-foreground" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            onClick={clearScan}
                            className="w-full h-12 rounded-xl border-dashed border-2 hover:bg-secondary/50 text-muted-foreground"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Scan Another Plant
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-muted-foreground flex flex-col items-center">
                        <div className="bg-secondary/20 p-4 rounded-full mb-4">
                          <Shield className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm max-w-sm mx-auto">
                          {scanResult.plantName === "Unable to Identify the plant" || scanResult.plantName === "Try clearer image"
                            ? "We detected a plant, but our AI couldn't confidently identify it (match < 60%). Try uploading a clearer picture or capturing the leaves and flowers more closely."
                            : scanResult.plantName.includes("Identified as") 
                            ? "We identified a plant class but couldn't find matching detailed properties in our database. It might not be fully supported yet."
                            : "We couldn't positively identify this plant in our database of Ayurvedic medicinal plants. Our database is continuously growing, but this specific plant may not be supported yet, or the image might not contain a plant."}
                        </p>
                        <Button
                          onClick={clearScan}
                          className="mt-6 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Try Another Image
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-foreground mb-6 font-serif leading-tight">
                    Unlock Nature's <br />
                    <span className="text-primary">Hidden Secrets</span>
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Don't just look at plants—understand them. Our AI identifies species, analyzes medicinal values, and provides traditional Ayurvedic usage in seconds.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
                      <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                        <Scan className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-foreground">Advanced Accuracy</h4>
                        <p className="text-xs text-muted-foreground">Powered by MobileNetV2 Image Classification</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
                      <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                        <Leaf className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-foreground">Instant Insights</h4>
                        <p className="text-xs text-muted-foreground">Properties, Dosha, and Remedies</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIScanner;