
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, User, ShieldAlert, FileText, BarChart3 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProjectShowcase from "@/components/auth/ProjectShowcase";
import HelpSection from "@/components/auth/HelpSection";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, loading, user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const isDoctor = searchParams.get("redirect") === "doctor";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [asDoctor, setAsDoctor] = useState(isDoctor);

  useEffect(() => {
    setAsDoctor(isDoctor);
  }, [isDoctor]);

  if (user && !loading) {
    navigate("/");
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      if (asDoctor) {
        navigate("/doctor/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const role: UserRole = asDoctor ? "doctor" : "patient";
      await signUp(email, password, firstName, lastName, role);
      setActiveTab("login");
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background overflow-auto">
      <div className="hidden lg:block lg:w-1/2 xl:w-3/5 p-8 overflow-y-auto">
        <ProjectShowcase />
      </div>
      
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {/* Add HelpSection component */}
          <HelpSection />
          
          <CardHeader className="text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative flex items-center gap-2">
                {asDoctor ? (
                  <Stethoscope className="h-8 w-8 text-primary" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse-slow">
                  Medi Predict
                </CardTitle>
                <div className="absolute -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer"></div>
              </div>
              <CardDescription className="animate-fade-in opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
                {asDoctor ? "Doctor Portal Access" : "Patient Health Management"}
              </CardDescription>
              
              <CardDescription 
                className="text-sm text-muted-foreground mt-2 text-center"
                style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
              >
                Created by Saiprasad | AI-Powered Healthcare Platform
              </CardDescription>
            </div>
          </CardHeader>
          
          {asDoctor && (
            <div className="px-6 mb-4">
              <Alert className="bg-amber-50 border-amber-200">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Doctor Access</AlertTitle>
                <AlertDescription className="text-amber-700">
                  You are accessing the doctor portal. Only authorized medical practitioners should proceed.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info("Please contact your administrator to reset your password");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="doctor-login" 
                      checked={asDoctor} 
                      onCheckedChange={(checked) => setAsDoctor(checked === true)}
                    />
                    <label
                      htmlFor="doctor-login"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Login as Doctor
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className={`w-full bg-gradient-to-r ${asDoctor ? 'from-blue-600 to-primary' : 'from-medinsight-600 to-primary'} hover:opacity-90 transition-all`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="doctor-signup" 
                      checked={asDoctor} 
                      onCheckedChange={(checked) => setAsDoctor(checked === true)}
                    />
                    <label
                      htmlFor="doctor-signup"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Register as Doctor
                    </label>
                  </div>
                  {asDoctor && (
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                      <p className="text-sm">
                        Note: Doctor accounts require verification. 
                        Your account will have limited access until verification is complete.
                      </p>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className={`w-full bg-gradient-to-r ${asDoctor ? 'from-blue-600 to-primary' : 'from-medinsight-600 to-primary'} hover:opacity-90 transition-all`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 p-4 lg:hidden">
            <h3 className="font-bold text-center mb-4">Why Choose MediPredict?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Stethoscope className="h-5 w-5" />, title: "AI Doctor" },
                { icon: <FileText className="h-5 w-5" />, title: "Smart Records" },
                { icon: <BarChart3 className="h-5 w-5" />, title: "Analytics" },
                { icon: <ShieldAlert className="h-5 w-5" />, title: "Secure" }
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg text-center">
                  {feature.icon}
                  <span className="text-xs font-medium mt-1">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
