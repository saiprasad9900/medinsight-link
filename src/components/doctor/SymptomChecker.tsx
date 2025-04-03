
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon, AlertCircle, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MedicalSymptom } from "@/types/patients";

// Sample symptoms data - in a real app, this would come from an API
const sampleSymptoms: MedicalSymptom[] = [
  { 
    id: "1", 
    name: "Headache", 
    description: "Pain in the head or upper neck", 
    bodyArea: "Head", 
    severity: "Moderate" 
  },
  { 
    id: "2", 
    name: "Cough", 
    description: "Sudden expulsion of air from the lungs", 
    bodyArea: "Chest", 
    severity: "Mild" 
  },
  { 
    id: "3", 
    name: "Fever", 
    description: "Elevated body temperature", 
    bodyArea: "Whole Body", 
    severity: "Moderate" 
  },
  { 
    id: "4", 
    name: "Fatigue", 
    description: "Extreme tiredness resulting from mental or physical exertion", 
    bodyArea: "Whole Body", 
    severity: "Moderate" 
  },
  { 
    id: "5", 
    name: "Shortness of Breath", 
    description: "Difficult or labored breathing", 
    bodyArea: "Chest", 
    severity: "Severe" 
  }
];

const SymptomChecker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<MedicalSymptom[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const filteredSymptoms = sampleSymptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.some(s => s.id === symptom.id)
  );

  const handleSelectSymptom = (symptom: MedicalSymptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setSearchTerm("");
  };

  const handleRemoveSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const handleAnalyzeSymptoms = () => {
    // In a real app, this would call an AI service to analyze symptoms
    // For now, we're using a simple rule-based approach
    
    if (selectedSymptoms.length === 0) {
      setAnalysisResult("Please select at least one symptom to analyze.");
      return;
    }
    
    const hasHighSeverity = selectedSymptoms.some(s => s.severity === "Severe");
    const hasRespiratorySymptoms = selectedSymptoms.some(s => s.bodyArea === "Chest");
    const hasFever = selectedSymptoms.some(s => s.name === "Fever");
    
    if (hasHighSeverity) {
      setAnalysisResult("Your symptoms include one or more severe conditions. We recommend seeking immediate medical attention.");
    } else if (hasRespiratorySymptoms && hasFever) {
      setAnalysisResult("Your combination of respiratory symptoms and fever could indicate an infection. Please consult with a healthcare provider within the next 24 hours.");
    } else {
      setAnalysisResult("Based on the symptoms you've selected, you may have a mild condition. Rest, stay hydrated, and monitor your symptoms. If they worsen, please consult a healthcare provider.");
    }
  };

  const clearAnalysis = () => {
    setSelectedSymptoms([]);
    setAnalysisResult(null);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Symptom Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for symptoms..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {searchTerm && filteredSymptoms.length > 0 && (
          <div className="border rounded-md max-h-48 overflow-y-auto">
            {filteredSymptoms.map(symptom => (
              <div 
                key={symptom.id} 
                className="p-2 hover:bg-accent cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                onClick={() => handleSelectSymptom(symptom)}
              >
                <div>
                  <div className="font-medium">{symptom.name}</div>
                  <div className="text-sm text-muted-foreground">{symptom.description}</div>
                </div>
                <Badge 
                  variant={symptom.severity === "Severe" ? "destructive" : symptom.severity === "Moderate" ? "default" : "outline"}
                >
                  {symptom.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredSymptoms.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            No matching symptoms found. Try a different search term.
          </div>
        )}

        {selectedSymptoms.length > 0 && (
          <div className="space-y-3">
            <div className="font-medium">Selected Symptoms:</div>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptom => (
                <Badge 
                  key={symptom.id} 
                  variant="secondary"
                  className="px-3 py-1.5 flex items-center gap-1"
                >
                  {symptom.name}
                  <button 
                    className="ml-1 rounded-full hover:bg-muted" 
                    onClick={() => handleRemoveSymptom(symptom.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <Button 
                onClick={handleAnalyzeSymptoms} 
                className="flex-1"
                disabled={selectedSymptoms.length === 0}
              >
                Analyze Symptoms
              </Button>
              <Button 
                variant="outline" 
                onClick={clearAnalysis}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className={`mt-4 p-4 rounded-md border ${
            analysisResult.includes("immediate") 
              ? "bg-red-50 border-red-200 text-red-700" 
              : analysisResult.includes("consult") 
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-green-50 border-green-200 text-green-700"
          }`}>
            <div className="flex items-start gap-2">
              {analysisResult.includes("immediate") 
                ? <AlertCircle className="h-5 w-5 mt-0.5" />
                : <Check className="h-5 w-5 mt-0.5" />
              }
              <div>
                <p className="font-medium">Preliminary Assessment</p>
                <p className="mt-1">{analysisResult}</p>
                <p className="mt-3 text-sm font-medium">Remember: This is not a medical diagnosis. When in doubt, always consult a healthcare professional.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomChecker;
