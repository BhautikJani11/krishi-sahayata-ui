import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CloudRain, AlertTriangle, Sun, Loader2 } from "lucide-react";
import { apiClient, type WeatherAlert } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WeatherSectionProps {
  language: "en" | "hi" | "gu";
}

export const WeatherSection = ({ language }: WeatherSectionProps) => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeatherAlerts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getWeatherAlerts({
        location: "Delhi,IN",
        language: language
      });
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weather alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAlerts();
  }, [language]);
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
        <Button variant="outline" size="sm" onClick={fetchWeatherAlerts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t.refresh}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const iconMap: Record<string, any> = {
              'CloudRain': CloudRain,
              'AlertTriangle': AlertTriangle,
              'Sun': Sun,
            };
            const Icon = iconMap[alert.icon || 'Sun'] || Sun;
            
            // Get message in current language
            const message = language === 'hi' ? alert.message_hi :
                           language === 'gu' ? alert.message_gu :
                           alert.message_en;
            
            return (
              <div
                key={alert.id || index}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-relaxed">{message}</p>
                  <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No alerts available</p>
        )}
      </CardContent>
    </Card>
  );
};
