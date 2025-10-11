import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { apiClient, type Scheme } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SchemesSectionProps {
  language: "en" | "hi" | "gu";
}

export const SchemesSection = ({ language }: SchemesSectionProps) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const fetchSchemes = async () => {
    console.log(`[SchemesSection] Fetching schemes for language: ${language}`);
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getSchemes(language, true);
      console.log(`[SchemesSection] Successfully fetched ${data.length} schemes:`, data);
      setSchemes(data);
      
      if (data.length === 0) {
        console.warn('[SchemesSection] No schemes returned from API');
        setError('No schemes found. Please try refreshing the page.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[SchemesSection] Error fetching schemes:', errorMessage, error);
      setError('Failed to load schemes. Please check your connection and try again.');
      toast({
        title: "Error Loading Schemes",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`[SchemesSection] Language changed to: ${language}, re-fetching schemes`);
    fetchSchemes();
  }, [language]);

  const translations = {
    en: {
      title: "Government Schemes",
      apply: "Apply Now",
      showMore: "Show All Schemes",
      showLess: "Show Less",
      loading: "Loading schemes...",
      retry: "Retry",
    },
    hi: {
      title: "सरकारी योजनाएं",
      apply: "अभी आवेदन करें",
      showMore: "सभी योजनाएं दिखाएं",
      showLess: "कम दिखाएं",
      loading: "योजनाएं लोड हो रही हैं...",
      retry: "पुनः प्रयास करें",
    },
    gu: {
      title: "સરકારી યોજનાઓ",
      apply: "હમણાં અરજી કરો",
      showMore: "બધી યોજનાઓ બતાવો",
      showLess: "ઓછું બતાવો",
      loading: "યોજનાઓ લોડ થઈ રહી છે...",
      retry: "ફરી પ્રયાસ કરો",
    },
  };

  const t = translations[language];

  // Show only 2 schemes initially, expand to all on click
  const displayedSchemes = showAll ? schemes : schemes.slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
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
                onClick={fetchSchemes}
                className="ml-4"
              >
                {t.retry}
              </Button>
            </AlertDescription>
          </Alert>
        ) : schemes.length > 0 ? (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {displayedSchemes.map((scheme) => {
                console.log(`[SchemesSection] Rendering scheme:`, {
                  id: scheme.id,
                  name: scheme.name,
                  category: scheme.category,
                });
                
                return (
                  <AccordionItem key={scheme.id} value={scheme.id}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-start justify-between w-full pr-2">
                        <span className="font-semibold">{scheme.name}</span>
                        {scheme.category && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">
                            {scheme.category}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Description</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {scheme.description}
                          </p>
                        </div>
                        
                        {scheme.eligibility && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Eligibility</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {scheme.eligibility}
                            </p>
                          </div>
                        )}
                        
                        {scheme.benefits && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Benefits</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {scheme.benefits}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {scheme.application_url && (
                        <Button 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => {
                            console.log(`[SchemesSection] Opening application URL: ${scheme.application_url}`);
                            window.open(scheme.application_url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          {t.apply}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            
            {schemes.length > 2 && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setShowAll(!showAll);
                  console.log(`[SchemesSection] Toggle show all: ${!showAll}`);
                }}
              >
                {showAll ? t.showLess : `${t.showMore} (${schemes.length - 2} more)`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No schemes available</p>
            <Button 
              variant="link" 
              onClick={fetchSchemes}
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
