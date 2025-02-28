
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Activity {
  id: number;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  action: string;
  time: string;
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
  },
];

const ActivityTimeline = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div className="relative flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activity.user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {index !== activities.length - 1 && (
                  <div className="absolute left-1/2 top-9 bottom-0 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                )}
              </div>
              <div className="pb-4">
                <div className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.action}
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
