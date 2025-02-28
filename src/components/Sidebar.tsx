
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  MessageCircle,
  Users,
  Settings,
  Menu,
  X
} from "lucide-react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Records",
      icon: <FileText className="h-5 w-5" />,
      path: "/records",
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/analytics",
    },
    {
      name: "Messages",
      icon: <MessageCircle className="h-5 w-5" />,
      path: "/messages",
    },
    {
      name: "Patients",
      icon: <Users className="h-5 w-5" />,
      path: "/patients",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out bg-sidebar border-r border-border h-screen flex flex-col z-30",
        expanded ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {expanded ? (
          <div className="font-semibold text-lg text-primary">MedInsight</div>
        ) : (
          <div className="w-full flex justify-center text-primary text-xl font-bold">M</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium",
                    location.pathname === item.path 
                      ? "bg-secondary text-secondary-foreground" 
                      : "hover:bg-secondary/50",
                    !expanded && "justify-center px-2"
                  )}
                >
                  {item.icon}
                  {expanded && <span>{item.name}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="font-medium text-sm">DR</span>
          </div>
          {expanded && (
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">Dr. Rebecca Lee</p>
              <p className="text-xs text-muted-foreground truncate">Cardiologist</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
