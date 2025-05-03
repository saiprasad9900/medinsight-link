import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  X, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Bell as NotificationIcon 
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import UserMenu from "./UserMenu";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import HelpSection from "./auth/HelpSection";

const TopNav = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { userRole } = useAuth();
  const isDoctor = userRole === "doctor";

  const notifications = [
    { 
      id: 1,
      type: 'message',
      content: 'New message from Emma Thompson',
      time: '10 min ago',
      icon: <MessageSquare className="h-4 w-4" />,
      url: '/messages'
    },
    {
      id: 2,
      type: 'record',
      content: 'Michael Chen uploaded new records',
      time: '45 min ago',
      icon: <FileText className="h-4 w-4" />,
      url: '/records'
    },
    {
      id: 3,
      type: 'appointment',
      content: 'Upcoming appointment with Dr. Smith',
      time: '2 hours ago',
      icon: <Calendar className="h-4 w-4" />,
      url: '/appointments'
    }
  ];

  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: string; url: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Mock search results - in real app, this would be a backend call
    setTimeout(() => {
      const mockResults = [
        { id: '1', name: 'Emma Thompson', type: 'Patient', url: '/patients/1' },
        { id: '2', name: 'Blood Test Results', type: 'Record', url: '/records/2' },
        { id: '3', name: 'Dr. Jane Smith', type: 'Doctor', url: '/doctors/3' }
      ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  return (
    <header className="h-16 border-b border-border flex items-center px-6 gap-4">
      <div className={`flex-1 flex items-center ${searchOpen ? "flex" : "hidden md:flex"}`}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, records, staff..."
            className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1"
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
              <div className="p-2 border-b">
                <p className="text-xs text-muted-foreground">Search Results</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map(result => (
                  <Link
                    key={result.id}
                    to={result.url}
                    className="flex items-center gap-2 p-2 hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {result.type === 'Patient' && <Bell className="h-4 w-4 text-primary" />}
                      {result.type === 'Record' && <FileText className="h-4 w-4 text-primary" />}
                      {result.type === 'Doctor' && <Bell className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{result.name}</div>
                      <div className="text-xs text-muted-foreground">{result.type}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 p-4 text-center">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full inline-block mr-2"></div>
              <span className="text-sm">Searching...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {!searchOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
        
        {searchOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setSearchOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link to={notification.url} className="flex items-start gap-3 cursor-pointer py-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    {notification.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full flex justify-center">
              <Button variant="ghost" className="w-full text-xs" size="sm">
                View All Notifications
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isDoctor && (
          <Link to="/doctor/medical-staff">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <NotificationIcon className="h-4 w-4" />
              Medical Staff Portal
            </Button>
          </Link>
        )}
        
        <UserMenu />
      </div>
    </header>
  );
};

export default TopNav;
