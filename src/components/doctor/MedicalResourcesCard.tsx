
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "Article" | "Video" | "Guide" | "Research";
}

const medicalResources: Resource[] = [
  {
    id: "1",
    title: "COVID-19 Prevention Guidelines",
    description: "Latest guidelines on preventing COVID-19 infection from CDC",
    url: "https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html",
    type: "Guide"
  },
  {
    id: "2",
    title: "Understanding Diabetes",
    description: "Comprehensive guide on diabetes management and prevention",
    url: "https://www.diabetes.org/diabetes",
    type: "Article"
  },
  {
    id: "3",
    title: "Heart Health Essentials",
    description: "Key information about maintaining cardiovascular health",
    url: "https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease/coronary-artery-disease",
    type: "Guide"
  },
  {
    id: "4",
    title: "Mental Health First Aid",
    description: "Resources for identifying and responding to mental health concerns",
    url: "https://www.nimh.nih.gov/health",
    type: "Guide"
  }
];

const MedicalResourcesCard = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Trusted Medical Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {medicalResources.map(resource => (
            <div key={resource.id} className="border rounded-md p-3">
              <div className="flex justify-between">
                <div className="font-medium">{resource.title}</div>
                <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {resource.type}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
              <Button 
                variant="link" 
                className="text-sm p-0 h-auto mt-2 flex items-center gap-1"
                asChild
              >
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  View Resource <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalResourcesCard;
