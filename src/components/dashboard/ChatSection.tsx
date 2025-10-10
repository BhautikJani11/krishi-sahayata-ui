import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSectionProps {
  language: "en" | "hi";
}

export const ChatSection = ({ language }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: language === "en" 
        ? "Hello! I'm your AI farming assistant. Ask me anything about crops, weather, or farming practices."
        : "नमस्ते! मैं आपका AI खेती सहायक हूं। फसल, मौसम या खेती के बारे में कुछ भी पूछें।"
    }
  ]);
  const [input, setInput] = useState("");

  const translations = {
    en: {
      title: "AI Chat Assistant",
      placeholder: "Ask about farming...",
      send: "Send",
    },
    hi: {
      title: "AI चैट सहायक",
      placeholder: "खेती के बारे में पूछें...",
      send: "भेजें",
    },
  };

  const t = translations[language];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: language === "en"
          ? "Thank you for your question. I'm here to help with farming advice."
          : "आपके प्रश्न के लिए धन्यवाद। मैं खेती सलाह के साथ यहां हूं।"
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.placeholder}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
