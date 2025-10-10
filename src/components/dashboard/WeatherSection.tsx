import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CloudRain, AlertTriangle, Sun } from "lucide-react";
import { apiGet } from "@/lib/api";

interface WeatherSectionProps {
  language: "en" | "hi" | "gu";
}

type Alert = { severity: "low" | "medium" | "high"; message: string; icon: string };
const iconMap: Record<string, any> = { CloudRain, AlertTriangle, Sun };

export const WeatherSection = ({ language }: WeatherSectionProps) => {
  const [title, setTitle] = useState("Weather Alerts");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ title: string; alerts: Alert[] }>(
        `/api/content/weather?language=${language}`
      );
      setTitle(data.title);
      setAlerts(data.alerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [language]);

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
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchWeather} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {loading ? "..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
            >
              {iconMap[Icon] ? (
                <iconMap[Icon] className="h-5 w-5 mt-0.5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 mt-0.5 text-muted-foreground" />
              )}
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
