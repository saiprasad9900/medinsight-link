
import { useState } from "react";
import { ChevronLeft, ChevronRight, Stethoscope, BarChart3, FileText, MessageSquare, ShieldCheck } from "lucide-react";

// Import screenshots - these files need to be added to the project
// The paths are relative to the public folder
const SCREENSHOTS = [
  {
    title: "AI-Powered Dashboard",
    description: "Comprehensive overview of patient data with intelligent insights and analytics",
    image: "/screenshots/dashboard.png",
  },
  {
    title: "Medical Records Analysis",
    description: "Automatic analysis of medical documents with key information extraction",
    image: "/screenshots/records.png",
  },
  {
    title: "Predictive Health Insights",
    description: "Advanced AI predictions for potential health conditions and outcomes",
    image: "/screenshots/analytics.png",
  },
  {
    title: "Doctor-Patient Communication",
    description: "Secure messaging platform for healthcare providers and patients",
    image: "/screenshots/messages.png",
  }
];

const FeatureList = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {[
        {
          icon: <Stethoscope className="h-6 w-6 text-primary" />,
          title: "AI Doctor",
          description: "Get instant medical guidance from our advanced AI assistant"
        },
        {
          icon: <FileText className="h-6 w-6 text-primary" />,
          title: "Record Management",
          description: "Upload and organize all your medical documents in one secure place"
        },
        {
          icon: <BarChart3 className="h-6 w-6 text-primary" />,
          title: "Health Analytics",
          description: "Visualize your health trends with advanced analytics"
        },
        {
          icon: <MessageSquare className="h-6 w-6 text-primary" />,
          title: "Secure Messaging",
          description: "Communicate directly with your healthcare providers"
        },
        {
          icon: <ShieldCheck className="h-6 w-6 text-primary" />,
          title: "HIPAA Compliant",
          description: "Your data is protected with enterprise-grade security"
        },
        {
          icon: <FileText className="h-6 w-6 text-primary" />,
          title: "Smart Summaries",
          description: "Get concise summaries of complex medical documents"
        }
      ].map((feature, index) => (
        <div key={index} className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-2">
            {feature.icon}
            <h3 className="font-medium">{feature.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

const ProjectShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SCREENSHOTS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome to MediPredict</h2>
        <p className="text-muted-foreground">
          The future of healthcare analytics powered by artificial intelligence
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-primary/5 to-accent/5 p-1">
        <div className="relative aspect-video rounded-lg overflow-hidden border shadow-md">
          <img 
            src={SCREENSHOTS[currentIndex].image} 
            alt={SCREENSHOTS[currentIndex].title} 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <h3 className="font-bold">{SCREENSHOTS[currentIndex].title}</h3>
            <p className="text-sm opacity-90">{SCREENSHOTS[currentIndex].description}</p>
          </div>
          
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 gap-1">
            {SCREENSHOTS.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-3">Key Features</h2>
        <FeatureList />
      </div>

      <div className="bg-primary/5 border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Ready to transform healthcare analytics?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Sign in or create an account to experience the power of AI-driven medical insights.
        </p>
      </div>
    </div>
  );
};

export default ProjectShowcase;
