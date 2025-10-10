import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CloudRain, AlertTriangle, Sun } from "lucide-react";

interface WeatherSectionProps {
  language: "en" | "hi" | "gu";
}

export const WeatherSection = ({ language }: WeatherSectionProps) => {
  const translations = {
    en: {
      title: "Weather Alerts",
      refresh: "Refresh",
      alerts: [
        { severity: "high", message: "Heavy rainfall expected in next 48 hours", icon: CloudRain },
        { severity: "medium", message: "Strong winds warning for tomorrow", icon: AlertTriangle },
        { severity: "low", message: "Sunny weather for next 5 days", icon: Sun },
      ],
    },
    hi: {
      title: "मौसम चेतावनी",
      refresh: "रिफ्रेश",
      alerts: [
        { severity: "high", message: "अगले 48 घंटों में भारी बारिश की उम्मीद", icon: CloudRain },
        { severity: "medium", message: "कल तेज हवाओं की चेतावनी", icon: AlertTriangle },
        { severity: "low", message: "अगले 5 दिनों के लिए धूप का मौसम", icon: Sun },
      ],
    },
    gu: {
      title: "હવામાન ચેતવણીઓ",
      refresh: "રિફ્રેશ",
      alerts: [
        { severity: "high", message: "આગામી 48 કલાકમાં ભારે વરસાદની અપેક્ષા", icon: CloudRain },
        { severity: "medium", message: "આવતીકાલ માટે તેજ પવનની ચેતવણી", icon: AlertTriangle },
        { severity: "low", message: "આગામી 5 દિવસ માટે સની હવામાન", icon: Sun },
      ],
    },
  };

  const t = translations[language];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{t.title}</CardTitle>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t.refresh}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {t.alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
            >
              <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm leading-relaxed">{alert.message}</p>
                <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
