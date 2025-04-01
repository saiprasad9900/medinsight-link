
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon, VideoIcon, InfoIcon } from "lucide-react";
import { Patient } from "./PatientList";

interface MessageHeaderProps {
  patient: Patient;
}

export const MessageHeader = ({ patient }: MessageHeaderProps) => {
  return (
    <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {patient.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">{patient.name}</CardTitle>
          <CardDescription>Patient</CardDescription>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <PhoneIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <VideoIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};
