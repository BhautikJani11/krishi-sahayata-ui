import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Mic, Volume2, StopCircle } from "lucide-react"; // <-- Using StopCircle
import { apiClient, type ChatRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// --- Browser Speech API Types ---
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}
// --- End of Types ---

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSectionProps {
  language: "en" | "hi" | "gu";
}

const translationsData = {
  en: {
    title: "AI Farming Assistant",
    placeholder: "Ask or press the mic...",
    send: "Send",
    welcome: "Hello! I'm your AI farming expert. Ask me anything about:",
    topics: "• Crop selection and planting times\n• Soil health and fertilizers\n• Irrigation and water management\n• Pest control and diseases\n• Government schemes and subsidies\n• Weather-based farming advice\n• Modern farming techniques",
    error: "Failed to get response",
    thinking: "Thinking...",
    micError: "Mic error or permission denied",
    micNotSupported: "Voice input is not supported in this browser.",
  },
  hi: {
    title: "AI खेती सहायक",
    placeholder: "पूछें या माइक दबाएं...",
    send: "भेजें",
    welcome: "नमस्ते! मैं आपका AI खेती विशेषज्ञ हूं। मुझसे कुछ भी पूछें:",
    topics: "• फसल चयन और रोपण समय\n• मिट्टी स्वास्थ्य और उर्वरक\n• सिंचाई और जल प्रबंधन\n• कीट नियंत्रण और रोग\n• सरकारी योजनाएं और सब्सिडी\n• मौसम आधारित खेती सलाह\n• आधुनिक खेती तकनीक",
    error: "प्रतिक्रिया प्राप्त करने में विफल",
    thinking: "सोच रहा हूँ...",
    micError: "माइक त्रुटि या अनुमति नहीं मिली",
    micNotSupported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।",
  },
  gu: {
    title: "AI ખેતી સહાયક",
    placeholder: "પૂછો અથવા માઇક દબાવો...",
    send: "મોકલો",
    welcome: "નમસ્તે! હું તમારો AI ખેતી નિષ્ણાત છું. મને કંઈપણ પૂછો:",
    topics: "• પાક પસંદગી અને વાવેતર સમય\n• જમીન સ્વાસ્થ્ય અને ખાતર\n• સિંચાઈ અને પાણી સંચાલન\n• જીવાત નિયંત્રણ અને રોગો\n• સરકારી યોજનાઓ અને સબસિડી\n• હવામાન આધારિત ખેતી સલાહ\n• આધુનિક ખેતી તકનીક",
    error: "પ્રતિસાદ મેળવવામાં નિષ્ફળ",
    thinking: "વિચાર ચાલી રહ્યો છે...",
    micError: "માઇક ભૂલ અથવા પરવાનગી નકારી",
    micNotSupported: "આ બ્રાઉઝરમાં વૉઇસ ઇનપુટ સપોર્ટેડ નથી.",
  },
};

const speechLangMap: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  gu: 'gu-IN',
};

export const ChatSection = ({ language }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedHistory = localStorage.getItem("chatHistory");
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.warn("Could not parse chat history from localStorage", error);
      return [];
    }
  });
  
  const [conversationId, setConversationId] = useState<string | undefined>(
    () => localStorage.getItem("chatConversationId") || undefined
  );
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // This state now tracks the index of the message that is *actively speaking*
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const t = translationsData[language || 'en'];

  useEffect(() => {
    if (conversationId) localStorage.setItem("chatConversationId", conversationId);
    if (messages.length > 1) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    } else if (messages.length === 0) {
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("chatConversationId");
    }
  }, [conversationId, messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      role: "assistant",
      content: `${t.welcome}\n\n${t.topics}`
    };
    
    setMessages(currentMessages => {
      if (currentMessages.length === 0) {
        return [welcomeMessage];
      }
      if (currentMessages.length > 0 && currentMessages[0].role === 'assistant' && currentMessages[0].content.includes("AI farming expert")) {
        const newMessages = [...currentMessages];
        newMessages[0] = welcomeMessage;
        return newMessages;
      }
      return currentMessages;
    });
  }, [language, t.welcome, t.topics]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- SIMPLIFIED Text-to-Speech Function (Stop/Replay) ---
  const speakText = (text: string, index: number) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) {
        console.warn("Browser does not support speech synthesis.");
        return;
      }

      const isCurrentlySpeakingThis = speakingMessageIndex === index;

      // Stop any and all speech
      synth.cancel();

      // Case 1: User clicked the 'Stop' button (on the message that was playing)
      if (isCurrentlySpeakingThis) {
        setSpeakingMessageIndex(null);
        return;
      } 
      
      // Case 2: User clicked the 'Play' button
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.lang = speechLangMap[language || 'en'];
      
      // This is the KEY: This automatically resets the state when speech finishes
      newUtterance.onend = () => {
        setSpeakingMessageIndex(null);
      };
      newUtterance.onerror = (e) => {
        console.error("Error during speech synthesis:", e);
        setSpeakingMessageIndex(null);
      };
      
      // Start speaking
      synth.speak(newUtterance);
      setSpeakingMessageIndex(index);
      
    } catch (e) {
      console.error("Error speaking text:", e);
      setSpeakingMessageIndex(null);
    }
  };
  // --- END OF UPDATE ---

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast({ title: t.micError, description: event.error, variant: "destructive" });
        setIsListening(false);
      };
      
      recognitionRef.current = recognitionInstance;
    } else {
      console.warn("Browser does not support speech recognition.");
    }
  }, [language, t.micError, toast]);

  const handleMicClick = () => {
    if (isLoading || isListening) return;

    if (!recognitionRef.current) {
      toast({ title: t.micNotSupported, variant: "destructive" });
      return;
    }
    
    try {
      // Stop any speech before listening
      window.speechSynthesis.cancel();
      setSpeakingMessageIndex(null);
      
      recognitionRef.current.lang = speechLangMap[language || 'en'];
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error("Error starting mic:", e);
      toast({ title: t.micError, variant: "destructive" });
    }
  };
  
  const handleSend = async (textOverride?: string) => {
    const messageContent = textOverride || input.trim();
    
    if (!messageContent || isLoading) return;

    // Stop any speech before sending
    window.speechSynthesis.cancel();
    setSpeakingMessageIndex(null);

    setInput("");
    setIsLoading(true);

    const userMessage: Message = { role: "user", content: messageContent };
    setMessages(prev => [...prev, userMessage]);

    try {
      const request: ChatRequest = {
        message: messageContent,
        conversation_id: conversationId,
        user_id: 'demo-user',
        language: language
      };

      const response = await apiClient.sendChatMessage(request);

      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      const aiMessage: Message = {
        role: "assistant",
        content: response.message
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response *after* it's in the state
      const newIndex = messages.length + 1; // The index it *will* have
      speakText(response.message, newIndex);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
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
            {messages.map((message, index) => {
              // --- UPDATED: Smart icon logic ---
              const isThisMessageSpeaking = speakingMessageIndex === index;
              
              return (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative group max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    {/* --- UPDATED: Replay/Stop Audio Button --- */}
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => speakText(message.content, index)}
                      >
                        {isThisMessageSpeaking ? (
                          <StopCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{t.thinking}</span>
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
              disabled={isLoading || isListening}
              className="flex-1"
            />
            <Button
              onClick={handleMicClick}
              size="icon"
              disabled={isLoading}
              variant={isListening ? "destructive" : "outline"}
            >
              {isListening ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button 
              onClick={() => handleSend()}
              size="icon"
              disabled={isLoading || isListening || !input.trim()}
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

