
import { Stethoscope } from "lucide-react";

const DoctorHeader = () => {
  return (
    <div className="flex items-center gap-4 slide-left">
      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center pulse-animation">
        <Stethoscope className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Get helpful health guidance and information from Dr. MediPredict
        </p>
      </div>
    </div>
  );
};

export default DoctorHeader;
