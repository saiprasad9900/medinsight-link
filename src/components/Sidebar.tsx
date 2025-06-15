
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
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
  UserCog,
  Shield,
  Calendar,
  Clipboard,
  CalendarClock,
  Apple,
  Brain,
  Video, // Import Video icon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className, ...props }: SidebarProps) {
  const { pathname } = useLocation();
  const { userRole } = useAuth();
  const isDoctor = userRole === "doctor";
  const [openSection, setOpenSection] = useState<string | null>("dashboard");

  const mainRoutes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
      active: pathname === "/",
      section: "dashboard"
    }
  ];
  
  const patientRoutes = [
    {
      label: "Medical Records",
      icon: <FileText className="h-5 w-5" />,
      href: "/records",
      active: pathname === "/records",
      section: "patients"
    },
    {
      label: "Patients",
      icon: <Users className="h-5 w-5" />,
      href: "/patients",
      active: pathname === "/patients",
      section: "patients"
    }
  ];
  
  const healthRoutes = [
    {
      label: "AI Doctor",
      icon: <Bot className="h-5 w-5" />,
      href: "/ai-doctor",
      active: pathname === "/ai-doctor",
      section: "health"
    },
    {
      label: "AI Video Chat",
      icon: <Video className="h-5 w-5" />, // New Video Chat link
      href: "/ai-video-chat",
      active: pathname === "/ai-video-chat",
      section: "health"
    },
    {
      label: "Diet Planner",
      icon: <Apple className="h-5 w-5" />,
      href: "/diet-planner",
      active: pathname === "/diet-planner",
      section: "health"
    },
    {
      label: "Health Games",
      icon: <Brain className="h-5 w-5" />,
      href: "/health-games",
      active: pathname === "/health-games",
      section: "health"
    }
  ];
  
  const communicationRoutes = [
    {
      label: "Messages",
      icon: <MessagesSquare className="h-5 w-5" />,
      href: "/messages",
      active: pathname === "/messages",
      section: "communications"
    },
    {
      label: "Appointments",
      icon: <Calendar className="h-5 w-5" />,
      href: "/appointments",
      active: pathname === "/appointments",
      section: "communications"
    }
  ];
  
  const analyticsRoutes = [
    {
      label: "Analytics",
      icon: <LineChart className="h-5 w-5" />,
      href: "/analytics",
      active: pathname === "/analytics",
      section: "analytics"
    }
  ];
  
  const adminRoutes = [
    {
      label: "Medical Staff",
      icon: <UserCog className="h-5 w-5" />,
      href: "/doctor/medical-staff",
      active: pathname === "/doctor/medical-staff",
      section: "admin"
    },
    {
      label: "Staff Schedule",
      icon: <CalendarClock className="h-5 w-5" />,
      href: "/doctor/schedule",
      active: pathname === "/doctor/schedule",
      section: "admin"
    },
    {
      label: "Security",
      icon: <Shield className="h-5 w-5" />,
      href: "/doctor/security",
      active: pathname === "/doctor/security",
      section: "admin"
    }
  ];

  const sections = [
    {
      id: "dashboard",
      label: "Overview",
      routes: mainRoutes
    },
    {
      id: "patients",
      label: "Patient Management",
      routes: patientRoutes
    },
    {
      id: "health",
      label: "Health & Wellness",
      routes: healthRoutes
    },
    {
      id: "communications",
      label: "Communications",
      routes: communicationRoutes
    },
    {
      id: "analytics",
      label: "Analytics",
      routes: analyticsRoutes
    },
    ...(isDoctor ? [{
      id: "admin",
      label: "Administration",
      routes: adminRoutes
    }] : [])
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
        <nav className="grid items-start px-2 text-sm font-medium gap-2">
          {sections.map((section) => (
            <Collapsible 
              key={section.id} 
              open={openSection === section.id}
              onOpenChange={() => {
                setOpenSection(openSection === section.id ? null : section.id);
              }}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <div className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "justify-between w-full cursor-pointer h-8"
                )}>
                  <span>{section.label}</span>
                  <span className="text-xs">
                    {openSection === section.id ? "▼" : "►"}
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="grid gap-1">
                {section.routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      buttonVariants({
                        variant: route.active ? "default" : "ghost",
                        size: "sm",
                      }),
                      route.active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground",
                      "justify-start gap-3 pl-6"
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          <div className="mt-6 px-2">
            <div className="h-px bg-border my-2"></div>
          </div>
          
          <Link
            to="/settings"
            className={cn(
              buttonVariants({
                variant: pathname === "/settings" ? "default" : "ghost",
                size: "sm",
              }),
              pathname === "/settings"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted hover:text-foreground",
              "justify-start gap-3"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        
        <div className="mt-6 px-4 py-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clipboard className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium">On-Call Staff</h4>
            </div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Dr. Smith - Cardiology</p>
              <p>Dr. Johnson - Emergency</p>
              <p>Dr. Patel - Neurology</p>
            </div>
            <Button variant="link" className="w-full text-xs p-0 h-8 justify-start">View All</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

