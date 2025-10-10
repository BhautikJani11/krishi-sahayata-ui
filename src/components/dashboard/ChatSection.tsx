import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { apiClient, type ChatRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSectionProps {
  language: "en" | "hi" | "gu";
}

export const ChatSection = ({ language }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const translations = {
    en: {
      title: "AI Farming Assistant",
      placeholder: "Ask about crops, weather, schemes, pests...",
      send: "Send",
      welcome: "Hello! I'm your AI farming expert. Ask me anything about:",
      topics: "• Crop selection and planting times\n• Soil health and fertilizers\n• Irrigation and water management\n• Pest control and diseases\n• Government schemes and subsidies\n• Weather-based farming advice\n• Modern farming techniques",
      error: "Failed to get response",
      rateLimit: "Too many requests. Please wait a moment.",
      noCredits: "AI credits exhausted. Please add credits.",
    },
    hi: {
      title: "AI खेती सहायक",
      placeholder: "फसल, मौसम, योजनाओं, कीटों के बारे में पूछें...",
      send: "भेजें",
      welcome: "नमस्ते! मैं आपका AI खेती विशेषज्ञ हूं। मुझसे कुछ भी पूछें:",
      topics: "• फसल चयन और रोपण समय\n• मिट्टी स्वास्थ्य और उर्वरक\n• सिंचाई और जल प्रबंधन\n• कीट नियंत्रण और रोग\n• सरकारी योजनाएं और सब्सिडी\n• मौसम आधारित खेती सलाह\n• आधुनिक खेती तकनीक",
      error: "प्रतिक्रिया प्राप्त करने में विफल",
      rateLimit: "बहुत सारे अनुरोध। कृपया एक पल प्रतीक्षा करें।",
      noCredits: "AI क्रेडिट समाप्त। कृपया क्रेडिट जोड़ें।",
    },
    gu: {
      title: "AI ખેતી સહાયક",
      placeholder: "પાક, હવામાન, યોજનાઓ, જીવાતો વિશે પૂછો...",
      send: "મોકલો",
      welcome: "નમસ્તે! હું તમારો AI ખેતી નિષ્ણાત છું. મને કંઈપણ પૂછો:",
      topics: "• પાક પસંદગી અને વાવેતર સમય\n• જમીન સ્વાસ્થ્ય અને ખાતર\n• સિંચાઈ અને પાણી સંચાલન\n• જીવાત નિયંત્રણ અને રોગો\n• સરકારી યોજનાઓ અને સબસિડી\n• હવામાન આધારિત ખેતી સલાહ\n• આધુનિક ખેતી તકનીક",
      error: "પ્રતિસાદ મેળવવામાં નિષ્ફળ",
      rateLimit: "ઘણી બધી વિનંતીઓ. કૃપા કરીને થોડી રાહ જુઓ.",
      noCredits: "AI ક્રેડિટ સમાપ્ત. કૃપા કરીને ક્રેડિટ ઉમેરો.",
    },
  };

  const t = translations[language];

  useEffect(() => {
    // Initialize conversation
    initializeConversation();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeConversation = async () => {
    try {
      // Add welcome message
      const welcomeMessage: Message = {
        role: "assistant",
        content: `${t.welcome}\n\n${t.topics}`
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the FastAPI backend
      const request: ChatRequest = {
        message: userMessage.content,
        conversation_id: conversationId,
        user_id: 'demo-user',
        language: language
      };

      const response = await apiClient.sendChatMessage(request);

      // Update conversation ID if it's a new conversation
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      const aiMessage: Message = {
        role: "assistant",
        content: response.message
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });

      // Remove the user message if request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <span>{t.title}</span>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t.placeholder}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              size="icon"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
