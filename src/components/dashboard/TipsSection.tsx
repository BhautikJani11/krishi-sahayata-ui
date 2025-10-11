import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Wheat, Droplets, Bug, Loader2 } from "lucide-react";
import { apiClient, type Tip } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface TipsSectionProps {
  language: "en" | "hi" | "gu";
}

export const TipsSection = ({ language }: TipsSectionProps) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [season, setSeason] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const fetchTips = async () => {
    setLoading(true);
    try {
      console.log('[Tips] fetching', { language, season });
      const data = await apiClient.getTips(language, undefined, season, true);
      console.log('[Tips] fetched', { count: data?.length, sample: data?.[0] });
      setTips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tips:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [language, season]);
  const translations = {
    en: {
      title: "Farming Tips",
      readMore: "Read More",
      tips: [
        {
          icon: Sprout,
          title: "Crop Rotation",
          description: "Improve soil health by rotating crops each season.",
        },
        {
          icon: Wheat,
          title: "Wheat Sowing",
          description: "Best practices for winter wheat cultivation and timing.",
        },
        {
          icon: Droplets,
          title: "Irrigation Tips",
          description: "Efficient water management for better yields.",
        },
        {
          icon: Bug,
          title: "Pest Control",
          description: "Natural and organic pest management techniques.",
        },
      ],
    },
    hi: {
      title: "खेती टिप्स",
      readMore: "और पढ़ें",
      tips: [
        {
          icon: Sprout,
          title: "फसल चक्र",
          description: "प्रत्येक मौसम में फसलों को घुमाकर मिट्टी के स्वास्थ्य में सुधार करें।",
        },
        {
          icon: Wheat,
          title: "गेहूं की बुवाई",
          description: "सर्दियों में गेहूं की खेती और समय के लिए सर्वोत्तम प्रथाएं।",
        },
        {
          icon: Droplets,
          title: "सिंचाई टिप्स",
          description: "बेहतर उपज के लिए कुशल जल प्रबंधन।",
        },
        {
          icon: Bug,
          title: "कीट नियंत्रण",
          description: "प्राकृतिक और जैविक कीट प्रबंधन तकनीक।",
        },
      ],
    },
    gu: {
      title: "ખેતી ટીપ્સ",
      readMore: "વધુ વાંચો",
      tips: [
        {
          icon: Sprout,
          title: "પાક પરિભ્રમણ",
          description: "દરેક મોસમમાં પાકોને ફેરવીને જમીનના સ્વાસ્થ્યમાં સુધારો કરો.",
        },
        {
          icon: Wheat,
          title: "ઘઉંની વાવણી",
          description: "શિયાળુ ઘઉંની ખેતી અને સમય માટે શ્રેષ્ઠ પ્રથાઓ.",
        },
        {
          icon: Droplets,
          title: "સિંચાઈ ટીપ્સ",
          description: "વધુ સારી ઉપજ માટે કાર્યક્ષમ પાણી વ્યવસ્થાપન.",
        },
        {
          icon: Bug,
          title: "જીવાત નિયંત્રણ",
          description: "કુદરતી અને કાર્બનિક જીવાત વ્યવસ્થાપન તકનીકો.",
        },
      ],
    },
  };

  const t = translations[language];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t.title}</CardTitle>
          <div className="flex items-center gap-2">
            <select
              className="border rounded-md text-sm px-2 py-1 bg-background"
              value={season || ''}
              onChange={(e) => setSeason(e.target.value || undefined)}
            >
              <option value="">All seasons</option>
              <option value="rabi">Rabi</option>
              <option value="kharif">Kharif</option>
              <option value="zaid">Zaid</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading tips...</span>
            </div>
          </div>
        ) : tips.length > 0 ? (
          <div className="grid gap-4">
            {(showAll ? tips : tips.slice(0, 2)).map((tip) => {
              const iconMap: Record<string, any> = {
                'Sprout': Sprout,
                'Wheat': Wheat,
                'Droplets': Droplets,
                'Bug': Bug,
              };
              const Icon = iconMap[tip.icon || 'Sprout'] || Sprout;
              
              const title = language === 'hi' ? tip.title_hi :
                           language === 'gu' ? tip.title_gu :
                           tip.title_en;
              const description = language === 'hi' ? tip.description_hi :
                                 language === 'gu' ? tip.description_gu :
                                 tip.description_en;
              
              return (
                <Card key={tip.id} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{title || tip.title_en}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {description || tip.description_en}
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={() => setShowAll((s) => !s)}
                        >
                          {showAll ? 'Show Less' : t.readMore} →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {tips.length > 2 && (
              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => setShowAll((s) => !s)} className="text-primary">
                  {showAll ? 'Show Less' : 'Read More'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No data found—try refreshing</p>
        )}
      </CardContent>
    </Card>
  );
};
