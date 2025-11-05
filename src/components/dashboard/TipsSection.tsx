import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Wheat, Droplets, Bug, Loader2 } from "lucide-react";
import { apiClient, type Tip } from "@/lib/api"; // This imports the correct Tip type
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TipsSectionProps {
  language: "en" | "hi" | "gu";
}

const translationsData = {
  en: {
    title: "Farming Tips",
    readMore: "Read More",
    season: "Season",
    allSeasons: "All Seasons",
  },
  hi: {
    title: "खेती टिप्स",
    readMore: "और पढ़ें",
    season: "मौसम",
    allSeasons: "सभी मौसम",
  },
  gu: {
    title: "ખેતી ટીપ્સ",
    readMore: "વધુ વાંચો",
    season: "મોસમ",
    allSeasons: "બધી ઋતુઓ",
  },
};

export const TipsSection = ({ language }: TipsSectionProps) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [season, setSeason] = useState<string>("all"); // Default to 'all'
  const { toast } = useToast();

  const fetchTips = async () => {
    setLoading(true);
    try {
      const langToFetch = language || 'en';
      // Pass the selected season to the API client
      const data = await apiClient.getTips(langToFetch, undefined, season, true);
      console.log('Tips fetched:', { language: langToFetch, season, count: data.length, sample: data[0] });
      setTips(data);
    } catch (error) { // <-- This line was fixed (removed the 'S')
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

  // Re-fetch tips when language or season changes
  useEffect(() => {
    fetchTips();
  }, [language, season]); 

  // Safely get translations, default to 'en'
  const translations = translationsData[language || 'en'];
  const visibleTips = showAll ? tips : tips.slice(0, 2);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <CardTitle>{translations.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Select onValueChange={setSeason} value={season}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={translations.season} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.allSeasons}</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="monsoon">Monsoon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!loading && tips.length > 2 && (
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : translations.readMore}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : tips.length > 0 ? (
          <div className="grid gap-4">
            {visibleTips.map((tip) => {
              const iconMap: Record<string, any> = {
                'Sprout': Sprout,
                'Wheat': Wheat,
                'Droplets': Droplets,
                'Bug': Bug,
              };
              const Icon = iconMap[tip.icon || 'Sprout'] || Sprout;
              
              // --- THIS IS THE FIX ---
              // Using tip.title, tip.description, and tip.content to match api.ts
              
              return (
                <Card key={tip.id} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                        
                        {tip.content && (
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap pt-2 border-t mt-2">
                            {tip.content}
                          </p>
                        )}
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No data found—try refreshing</p>
        )}
      </CardContent>
    </Card>
  );
};

