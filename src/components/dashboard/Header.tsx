import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  setSidebarOpen: (open: boolean) => void;
}

export const Header = ({ language, setLanguage, setSidebarOpen }: HeaderProps) => {
  const translations = {
    en: {
      welcome: "Welcome back, Farmer!",
      logout: "Logout",
    },
    hi: {
      welcome: "स्वागत है, किसान!",
      logout: "लॉग आउट",
    },
  };

  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">
            {t.welcome}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="font-medium"
          >
            {language === "en" ? "हिं" : "EN"}
          </Button>

          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">{t.logout}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
