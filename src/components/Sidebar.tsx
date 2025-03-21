
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FileMedical, 
  LineChart, 
  MessagesSquare, 
  Users, 
  Settings,
  Bot
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className, ...props }: SidebarProps) {
  const { pathname } = useLocation();

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Medical Records",
      icon: <FileMedical className="h-5 w-5" />,
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 .5 1h6.28" />
          </svg>
          <span className="text-xl font-bold tracking-tight">MediPredict</span>
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
