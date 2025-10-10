import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Home,
  User,
  MessageSquare,
  CloudRain,
  Tractor,
  FileText,
  Lightbulb,
  Sprout,
  Bell,
  X,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  language: "en" | "hi";
}

const menuItems = {
  en: [
    { icon: Home, label: "Home", active: true },
    { icon: User, label: "Profile", active: false },
    { icon: MessageSquare, label: "Chat", active: false },
    { icon: CloudRain, label: "Weather Alerts", active: false },
    { icon: Tractor, label: "Equipment Rentals", active: false },
    { icon: FileText, label: "Govt Schemes", active: false },
    { icon: Lightbulb, label: "Farming Tips", active: false },
    { icon: Sprout, label: "Crops Info", active: false },
    { icon: Bell, label: "Notifications", active: false },
  ],
  hi: [
    { icon: Home, label: "होम", active: true },
    { icon: User, label: "प्रोफाइल", active: false },
    { icon: MessageSquare, label: "चैट", active: false },
    { icon: CloudRain, label: "मौसम चेतावनी", active: false },
    { icon: Tractor, label: "उपकरण किराया", active: false },
    { icon: FileText, label: "सरकारी योजनाएं", active: false },
    { icon: Lightbulb, label: "खेती टिप्स", active: false },
    { icon: Sprout, label: "फसल जानकारी", active: false },
    { icon: Bell, label: "सूचनाएं", active: false },
  ],
};

const SidebarContent = ({ language }: { language: "en" | "hi" }) => {
  const items = menuItems[language];

  return (
    <nav className="space-y-2 p-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              item.active && "bg-primary text-primary-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};

export const Sidebar = ({ open, setOpen, language }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-card">
        <div className="h-full overflow-y-auto">
          <SidebarContent language={language} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">
              {language === "en" ? "Menu" : "मेनू"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent language={language} />
        </SheetContent>
      </Sheet>
    </>
  );
};
