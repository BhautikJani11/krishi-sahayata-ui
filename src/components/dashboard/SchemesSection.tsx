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

export const SchemesSection = ({ language }: SchemesSectionProps) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getSchemes(language, true);
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
  }, [language]);
  const translations = {
    en: {
      title: "Government Schemes",
      apply: "Apply Now",
      schemes: [
        {
          name: "PM-KISAN",
          description: "Direct income support of ₹6,000 per year to farmer families. Three installments of ₹2,000 each.",
        },
        {
          name: "Soil Health Card Scheme",
          description: "Free soil testing to help farmers improve productivity through balanced use of fertilizers.",
        },
        {
          name: "Pradhan Mantri Fasal Bima Yojana",
          description: "Crop insurance scheme providing financial support against crop loss due to natural calamities.",
        },
      ],
    },
    hi: {
      title: "सरकारी योजनाएं",
      apply: "अभी आवेदन करें",
      schemes: [
        {
          name: "पीएम-किसान",
          description: "किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता। ₹2,000 की तीन किस्तें।",
        },
        {
          name: "मृदा स्वास्थ्य कार्ड योजना",
          description: "उर्वरकों के संतुलित उपयोग के माध्यम से किसानों को उत्पादकता में सुधार करने में मदद के लिए मुफ्त मिट्टी परीक्षण।",
        },
        {
          name: "प्रधानमंत्री फसल बीमा योजना",
          description: "प्राकृतिक आपदाओं के कारण फसल नुकसान के खिलाफ वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना।",
        },
      ],
    },
    gu: {
      title: "સરકારી યોજનાઓ",
      apply: "હમણાં અરજી કરો",
      schemes: [
        {
          name: "પીએમ-કિસાન",
          description: "ખેડૂત પરિવારોને દર વર્ષે ₹6,000 ની સીધી આવક સહાય. ₹2,000 ની ત્રણ હપ્તા.",
        },
        {
          name: "માટી આરોગ્ય કાર્ડ યોજના",
          description: "ખાતરના સંતુલિત ઉપયોગ દ્વારા ખેડૂતોને ઉત્પાદકતા સુધારવામાં મદદ કરવા માટે મફત માટી પરીક્ષણ.",
        },
        {
          name: "પ્રધાનમંત્રી ફસલ વીમા યોજના",
          description: "કુદરતી આફતોને કારણે પાકના નુકસાન સામે નાણાકીય સહાય પૂરી પાડતી પાક વીમા યોજના.",
        },
      ],
    },
  };

  const t = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : schemes.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {schemes.map((scheme) => {
              const name = language === 'hi' ? scheme.name_hi :
                          language === 'gu' ? scheme.name_gu :
                          scheme.name_en;
              const description = language === 'hi' ? scheme.description_hi :
                                 language === 'gu' ? scheme.description_gu :
                                 scheme.description_en;
              
              return (
                <AccordionItem key={scheme.id} value={scheme.id}>
                  <AccordionTrigger className="text-left">
                    {name || scheme.name_en}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description || scheme.description_en}
                    </p>
                    {scheme.application_url && (
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => window.open(scheme.application_url, '_blank')}
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
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No schemes available</p>
        )}
      </CardContent>
    </Card>
  );
};
