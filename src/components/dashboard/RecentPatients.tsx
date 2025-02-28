
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const patients = [
  {
    id: 1,
    name: "Emma Thompson",
    status: "Critical",
    lastVisit: "Today, 10:30 AM",
    diagnosis: "Cardiac Arrhythmia",
    image: "",
  },
  {
    id: 2,
    name: "Michael Chen",
    status: "Stable",
    lastVisit: "Yesterday, 3:15 PM",
    diagnosis: "Type 2 Diabetes",
    image: "",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    status: "Improved",
    lastVisit: "Aug 12, 2023",
    diagnosis: "Post-surgery Recovery",
    image: "",
  },
  {
    id: 4,
    name: "Robert Johnson",
    status: "Stable",
    lastVisit: "Aug 10, 2023",
    diagnosis: "Hypertension",
    image: "",
  },
];

const RecentPatients = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Monitor patient status and activities
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="stable">Stable</TabsTrigger>
            <TabsTrigger value="improved">Improved</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {patients
                .filter(p => activeTab === "all" || p.status.toLowerCase() === activeTab)
                .map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={patient.image} />
                        <AvatarFallback>
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.diagnosis}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          patient.status === "Critical" && "border-red-500 text-red-500 bg-red-500/10",
                          patient.status === "Stable" && "border-blue-500 text-blue-500 bg-blue-500/10",
                          patient.status === "Improved" && "border-green-500 text-green-500 bg-green-500/10"
                        )}
                      >
                        {patient.status}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/patients/${patient.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function for className conditionals
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default RecentPatients;
