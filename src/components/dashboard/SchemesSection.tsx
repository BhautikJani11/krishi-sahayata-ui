import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";

interface SchemesSectionProps {
  language: "en" | "hi";
}

export const SchemesSection = ({ language }: SchemesSectionProps) => {
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
  };

  const t = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {t.schemes.map((scheme, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {scheme.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {scheme.description}
                </p>
                <Button size="sm" className="w-full sm:w-auto">
                  {t.apply}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
