import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient, type MandiPrice } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MandiSectionProps {
  language: "en" | "hi" | "gu";
}

const translationsData = {
  en: {
    title: "Live Mandi Prices",
    commodity: "Select Commodity",
    market: "Market",
    price: "Price (₹/Qtl.)",
    min: "Min",
    max: "Max",
    modal: "Modal",
    noData: "No data available for this commodity. Try another one.",
    error: "Failed to fetch market prices.",
    loading: "Loading prices...",
    refresh: "Refresh",
  },
  hi: {
    title: "लाइव मंडी भाव",
    commodity: "फसल चुनें",
    market: "मंडी",
    price: "मूल्य (₹/क्विंटल)",
    min: "न्यूनतम",
    max: "अधिकतम",
    modal: "औसत",
    noData: "इस फसल के लिए कोई डेटा उपलब्ध नहीं है। दूसरी फसल चुनें।",
    error: "बाजार मूल्य लाने में विफल।",
    loading: "कीमतें लोड हो रही हैं...",
    refresh: "रिफ्रेश",
  },
  gu: {
    title: "લાઇવ મંડી ભાવ",
    commodity: "પાક પસંદ કરો",
    market: "માર્કેટ",
    price: "કિંમત (₹/ક્વિન્ટલ)",
    min: "ન્યૂનતમ",
    max: "મહત્તમ",
    modal: "સરેરાશ",
    noData: "આ પાક માટે કોઈ ડેટા ઉપલબ્ધ નથી. બીજો પાક અજમાવો.",
    error: "બજાર ભાવ મેળવવામાં નિષ્ફળ.",
    loading: "કિંમતો લોડ થઈ રહી છે...",
    refresh: "રિફ્રેશ કરો",
  },
};

// Commodities that are commonly traded
const commodities = [
  { value: "Wheat", label: "Wheat / गेहूं / ઘઉં" },
  { value: "Rice", label: "Rice / चावल / ચોખા" },
  { value: "Bajra", label: "Bajra / बाजरा / બાજરી" },
  { value: "Maize", label: "Maize / मक्का / મકાઈ" },
  { value: "Cotton", label: "Cotton / कपास / કપાસ" },
  { value: "Groundnut", label: "Groundnut / मूंगफली / મગફળી" },
  { value: "Castor Seed", label: "Castor Seed / अरंडी / એરંડા" },
  { value: "Onion", label: "Onion / प्याज / ડુંગળી" },
  { value: "Potato", label: "Potato / आलू / બટાકા" },
  { value: "Tomato", label: "Tomato / टमाटर / ટામેટા" },
  { value: "Cumin", label: "Cumin / जीरा / જીરૂ" },
  { value: "Garlic", label: "Garlic / लहसुन / લસણ" },
];

export const MandiSection = ({ language }: MandiSectionProps) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const { toast } = useToast();

  const t = translationsData[language || 'en'];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      console.log('Fetching Mandi prices for:', selectedCommodity);
      const data = await apiClient.getMandiPrices(selectedCommodity);
      console.log('Mandi prices received:', data.length, 'records');
      setPrices(data);
      
      if (data.length === 0) {
        toast({
          title: t.noData,
          description: "Try selecting a different commodity",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching Mandi prices:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedCommodity]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>{t.title}</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select onValueChange={setSelectedCommodity} value={selectedCommodity}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t.commodity} />
            </SelectTrigger>
            <SelectContent>
              {commodities.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPrices}
            disabled={loading}
            title={t.refresh}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-y-auto max-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">{t.loading}</p>
          </div>
        ) : prices.length > 0 ? (
          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-3 text-sm font-semibold text-muted-foreground pb-2 border-b">
              <span>{t.market}</span>
              <span className="text-center">{t.min} / {t.max}</span>
              <span className="text-right">{t.modal}</span>
            </div>

            {/* Data Rows */}
            <div className="space-y-3">
              {prices.map((price) => (
                <div 
                  key={price.id} 
                  className="grid grid-cols-3 gap-3 text-sm items-center py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium truncate">{price.market}</span>
                    <span className="text-xs text-muted-foreground">{price.date}</span>
                  </div>
                  <span className="text-center text-xs text-muted-foreground">
                    ₹{price.min_price.toLocaleString('en-IN')} / ₹{price.max_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-right font-bold text-lg text-primary">
                    ₹{price.modal_price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center">{t.noData}</p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Try: Potato, Tomato, Onion
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};