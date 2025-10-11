import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-accent/10">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Sprout className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Educating Farmer
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Empowering Indian farmers with AI-powered tools and practical guidance
        </p>
        <Button 
          size="lg" 
          className="mt-4"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
