
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FileText,
  LineChart, 
  MessagesSquare, 
  Users, 
  Settings,
  Bot,
  Stethoscope,
  UserCog
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className, ...props }: SidebarProps) {
  const { pathname } = useLocation();
  const { userRole } = useAuth();
  const isDoctor = userRole === "doctor";

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Medical Records",
      icon: <FileText className="h-5 w-5" />,
      href: "/records",
      active: pathname === "/records",
    },
    {
      label: "Analytics",
      icon: <LineChart className="h-5 w-5" />,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Messages",
      icon: <MessagesSquare className="h-5 w-5" />,
      href: "/messages",
      active: pathname === "/messages",
    },
    ...(isDoctor ? [
      {
        label: "Medical Staff",
        icon: <UserCog className="h-5 w-5" />,
        href: "/doctor/medical-staff",
        active: pathname === "/doctor/medical-staff",
      }
    ] : []),
    {
      label: "Patients",
      icon: <Users className="h-5 w-5" />,
      href: "/patients",
      active: pathname === "/patients",
    },
    {
      label: "AI Doctor",
      icon: <Bot className="h-5 w-5" />,
      href: "/ai-doctor",
      active: pathname === "/ai-doctor",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
      active: pathname === "/settings",
    }
  ];

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" fill="currentColor" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Medi Predict
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route, index) => (
            <Link
              key={index}
              to={route.href}
              className={cn(
                buttonVariants({
                  variant: route.active ? "default" : "ghost",
                  size: "lg",
                }),
                route.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground",
                "justify-start gap-3",
                "h-12 px-4"
              )}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
