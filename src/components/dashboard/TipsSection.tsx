import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Wheat, Droplets, Bug } from "lucide-react";

interface TipsSectionProps {
  language: "en" | "hi";
}

export const TipsSection = ({ language }: TipsSectionProps) => {
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
  };

  const t = translations[language];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {t.tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
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
                      <Button variant="link" className="p-0 h-auto text-primary">
                        {t.readMore} →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
