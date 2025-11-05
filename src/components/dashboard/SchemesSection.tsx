import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, Loader2 } from "lucide-react";
import { apiClient, type Scheme } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SchemesSectionProps {
  language: "en" | "hi" | "gu";
}

// --- ADD THIS TRANSLATION OBJECT ---
const translationsData = {
  en: {
    title: "Government Schemes",
    readMore: "Read More",
    showLess: "Show Less",
  },
  hi: {
    title: "सरकारी योजनाएं",
    readMore: "और पढ़ें",
    showLess: "कम दिखाएं",
  },
  gu: {
    title: "સરકારી યોજનાઓ",
    readMore: "વધુ વાંચો",
    showLess: "ઓછું બતાવો",
  },
};
// --- END OF ADDITION ---

export const SchemesSection = ({ language }: SchemesSectionProps) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  // --- ADD THIS LINE ---
  // Safely get translations, default to 'en'
  const translations = translationsData[language || 'en'];

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      // Use the language prop, but default to 'en' just in case
      const langToFetch = language || 'en';
      const data = await apiClient.getSchemes(langToFetch, true);
      console.log('Schemes fetched:', { language: langToFetch, count: data.length, sample: data[0] });
      setSchemes(data);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schemes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [language]); // Re-fetches when language changes

  const visibleSchemes = showAll ? schemes : schemes.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* --- UPDATE THIS LINE --- */}
        <CardTitle>{translations.title}</CardTitle>
        
        {!loading && schemes.length > 3 && (
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
            {/* --- UPDATE THIS LINE --- */}
            {showAll ? translations.showLess : translations.readMore}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : schemes.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {visibleSchemes.map((scheme) => {
              
              // This part is already correct from our last fix
              // It uses scheme.name, which is now coming from your API
              
              return (
                <AccordionItem key={scheme.id} value={scheme.id}>
                  <AccordionTrigger className="text-left">
                    {scheme.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {scheme.description}
                    </p>
                    {scheme.application_url && (
                      <Button
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => window.open(scheme.application_url, '_blank')}
                      >
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No data found—try refreshing</p>
        )}
      </CardContent>
    </Card>
  );
};

