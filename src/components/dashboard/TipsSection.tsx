import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Wheat, Droplets, Bug, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { apiClient, type Tip } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TipsSectionProps {
  language: "en" | "hi" | "gu";
}

export const TipsSection = ({ language }: TipsSectionProps) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchTips = async () => {
    console.log(`[TipsSection] Fetching tips for language: ${language}, season: ${selectedSeason}`);
    setLoading(true);
    setError(null);
    
    try {
      const seasonParam = selectedSeason === "all" ? undefined : selectedSeason;
      const data = await apiClient.getTips(language, undefined, seasonParam, true);
      console.log(`[TipsSection] Successfully fetched ${data.length} tips:`, data);
      setTips(data);
      
      if (data.length === 0) {
        console.warn('[TipsSection] No tips returned from API');
        setError('No tips found. Please try refreshing the page.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[TipsSection] Error fetching tips:', errorMessage, error);
      setError('Failed to load tips. Please check your connection and try again.');
      toast({
        title: "Error Loading Tips",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`[TipsSection] Dependencies changed - language: ${language}, season: ${selectedSeason}`);
    fetchTips();
  }, [language, selectedSeason]);

  const toggleTipExpansion = (tipId: string) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(tipId)) {
      newExpanded.delete(tipId);
      console.log(`[TipsSection] Collapsed tip: ${tipId}`);
    } else {
      newExpanded.add(tipId);
      console.log(`[TipsSection] Expanded tip: ${tipId}`);
    }
    setExpandedTips(newExpanded);
  };

  const translations = {
    en: {
      title: "Farming Tips",
      readMore: "Read More",
      readLess: "Read Less",
      showMore: "Show All Tips",
      showLess: "Show Less",
      loading: "Loading tips...",
      retry: "Retry",
      seasonFilter: "Filter by Season",
      seasons: {
        all: "All Seasons",
        winter: "Winter",
        summer: "Summer",
        monsoon: "Monsoon",
        spring: "Spring",
        autumn: "Autumn",
      },
    },
    hi: {
      title: "खेती टिप्स",
      readMore: "और पढ़ें",
      readLess: "कम पढ़ें",
      showMore: "सभी टिप्स दिखाएं",
      showLess: "कम दिखाएं",
      loading: "टिप्स लोड हो रही हैं...",
      retry: "पुनः प्रयास करें",
      seasonFilter: "मौसम के अनुसार छाँटें",
      seasons: {
        all: "सभी मौसम",
        winter: "सर्दी",
        summer: "गर्मी",
        monsoon: "मानसून",
        spring: "वसंत",
        autumn: "शरद",
      },
    },
    gu: {
      title: "ખેતી ટીપ્સ",
      readMore: "વધુ વાંચો",
      readLess: "ઓછું વાંચો",
      showMore: "બધી ટીપ્સ બતાવો",
      showLess: "ઓછું બતાવો",
      loading: "ટીપ્સ લોડ થઈ રહી છે...",
      retry: "ફરી પ્રયાસ કરો",
      seasonFilter: "મોસમ પ્રમાણે ગાળો",
      seasons: {
        all: "બધી ઋતુઓ",
        winter: "શિયાળો",
        summer: "ઉનાળો",
        monsoon: "ચોમાસું",
        spring: "વસંત",
        autumn: "પાનખર",
      },
    },
  };

  const t = translations[language];

  // Icon mapping
  const iconMap: Record<string, any> = {
    'Sprout': Sprout,
    'Wheat': Wheat,
    'Droplets': Droplets,
    'Bug': Bug,
  };

  // Show only 2 tips initially, expand to all on click
  const displayedTips = showAll ? tips : tips.slice(0, 2);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t.title}</CardTitle>
        </div>
        
        {/* Season Filter */}
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t.seasonFilter} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.seasons.all}</SelectItem>
            <SelectItem value="winter">{t.seasons.winter}</SelectItem>
            <SelectItem value="summer">{t.seasons.summer}</SelectItem>
            <SelectItem value="monsoon">{t.seasons.monsoon}</SelectItem>
            <SelectItem value="spring">{t.seasons.spring}</SelectItem>
            <SelectItem value="autumn">{t.seasons.autumn}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t.loading}</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchTips}
                className="ml-4"
              >
                {t.retry}
              </Button>
            </AlertDescription>
          </Alert>
        ) : tips.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              {displayedTips.map((tip) => {
                const Icon = iconMap[tip.icon || 'Sprout'] || Sprout;
                const isExpanded = expandedTips.has(tip.id);
                
                console.log(`[TipsSection] Rendering tip:`, {
                  id: tip.id,
                  title: tip.title,
                  category: tip.category,
                  season: tip.season,
                  isExpanded,
                });
                
                return (
                  <Card 
                    key={tip.id} 
                    className="border-2 hover:border-primary transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-base leading-tight">
                              {tip.title}
                            </h3>
                            {tip.season && tip.season !== 'all' && (
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full whitespace-nowrap">
                                {t.seasons[tip.season as keyof typeof t.seasons] || tip.season}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tip.description}
                          </p>
                          
                          {/* Expandable Content */}
                          {isExpanded && tip.content && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-foreground leading-relaxed">
                                {tip.content}
                              </p>
                            </div>
                          )}
                          
                          {/* Read More Button */}
                          {tip.content && (
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-primary font-medium"
                              onClick={() => toggleTipExpansion(tip.id)}
                            >
                              {isExpanded ? (
                                <>
                                  {t.readLess} <ChevronUp className="ml-1 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  {t.readMore} <ChevronDown className="ml-1 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {tips.length > 2 && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setShowAll(!showAll);
                  console.log(`[TipsSection] Toggle show all: ${!showAll}`);
                }}
              >
                {showAll ? t.showLess : `${t.showMore} (${tips.length - 2} more)`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No tips available for the selected filter
            </p>
            <Button 
              variant="link" 
              onClick={fetchTips}
              className="mt-2"
            >
              {t.retry}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
