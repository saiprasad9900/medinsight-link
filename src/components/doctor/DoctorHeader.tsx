
import { Stethoscope, Clipboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DoctorHeader = () => {
  const { userRole } = useAuth();
  const isDoctor = userRole === "doctor";

  return (
    <div className="flex items-center gap-4 slide-left">
      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center pulse-animation">
        <Stethoscope className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Get helpful health guidance and information from Dr. MediPredict
        </p>
      </div>
      
      {isDoctor && (
        <Button variant="outline" asChild className="gap-2">
          <Link to="/doctor/dashboard">
            <Clipboard className="h-4 w-4" />
            Doctor Dashboard
          </Link>
        </Button>
      )}
      
      {!isDoctor && (
        <Button variant="outline" asChild className="gap-2">
          <Link to="/auth?doctor=true">
            <User className="h-4 w-4" />
            Doctor Login
          </Link>
        </Button>
      )}
    </div>
  );
};

export default DoctorHeader;
