
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: number;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  action: string;
  time: string;
  category?: "upload" | "update" | "schedule" | "message";
}

const activities: Activity[] = [
  {
    id: 1,
    user: {
      name: "Dr. Rebecca Lee",
      role: "Cardiologist",
      avatar: "",
    },
    action: "uploaded new test results for Emma Thompson",
    time: "Just now",
    category: "upload",
  },
  {
    id: 2,
    user: {
      name: "Dr. James Wilson",
      role: "Neurologist",
      avatar: "",
    },
    action: "updated diagnosis for Robert Johnson",
    time: "2 hours ago",
    category: "update",
  },
  {
    id: 3,
    user: {
      name: "Nurse Sarah Kim",
      role: "Head Nurse",
      avatar: "",
    },
    action: "scheduled follow-up for Michael Chen",
    time: "5 hours ago",
    category: "schedule",
  },
  {
    id: 4,
    user: {
      name: "Dr. Maria Garcia",
      role: "Pediatrician",
      avatar: "",
    },
    action: "added new medication notes for Sophia Rodriguez",
    time: "Yesterday",
    category: "message",
  },
];

const ActivityTimeline = () => {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "upload": return "bg-blue-500";
      case "update": return "bg-purple-500";
      case "schedule": return "bg-green-500";
      case "message": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case "upload": return "Upload";
      case "update": return "Update";
      case "schedule": return "Schedule";
      case "message": return "Message";
      default: return "Activity";
    }
  };

  return (
    <Card className="h-full scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent">Recent Activity</span>
          <span className="notification-badge relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className={`flex gap-4 hover-card stagger-item fade-in`}>
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className={`text-white ${getCategoryColor(activity.category)}`}>
                    {activity.user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {index !== activities.length - 1 && (
                  <div className="absolute left-1/2 top-10 bottom-0 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                )}
              </div>
              <div className="pb-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    {activity.action}
                  </div>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(activity.category)} bg-opacity-10 text-opacity-90`}>
                    {getCategoryBadge(activity.category)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <span>{activity.time}</span>
                  <span className="bg-border w-1 h-1 rounded-full"></span>
                  <span>{activity.user.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
