
import { MedicalRecord } from "@/types/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Activity, Clock, TrendingUp } from "lucide-react";

interface PrecautionsTabProps {
  record: MedicalRecord;
}

const PrecautionsTab = ({ record }: PrecautionsTabProps) => {
  if (!record.prediction) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">No prediction data available</p>
        <p className="text-sm text-muted-foreground">
          Generate predictions to see risk assessment and recommendations
        </p>
      </div>
    );
  }
  
  const { riskScore, riskLevel, predictedOutcomes, recommendations } = record.prediction;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return { bg: "bg-green-50 border-green-200", text: "text-green-700", bar: "bg-green-500" };
      case "Medium":
        return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", bar: "bg-amber-500" };
      case "High":
        return { bg: "bg-red-50 border-red-200", text: "text-red-700", bar: "bg-red-500" };
      default:
        return { bg: "bg-gray-50 border-gray-200", text: "text-gray-700", bar: "bg-gray-500" };
    }
  };

  const riskColors = getRiskColor(riskLevel);
  
  return (
    <div className="space-y-6 pt-4">
      {/* Risk Assessment Card */}
      <Card className={`${riskColors.bg} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${riskColors.text}`} />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${riskColors.text}`}>
                {riskLevel} Risk
              </div>
              <div className="text-sm text-muted-foreground">
                Risk Score: {riskScore}/100
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${riskColors.bg} ${riskColors.text} border-current text-lg px-3 py-1`}
            >
              {riskScore}%
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Level Indicator</span>
              <span>{riskScore}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${riskColors.bar}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low Risk (0-35)</span>
              <span>Medium Risk (35-65)</span>
              <span>High Risk (65-100)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predicted Outcomes */}
      {predictedOutcomes && predictedOutcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Predicted Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictedOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{outcome.outcome}</div>
                      <div className="text-sm text-muted-foreground">
                        Timeframe: {outcome.timeframe}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {Math.round(outcome.probability * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations && recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <Alert key={index} className="border-l-4 border-l-blue-500">
                  <AlertDescription className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{rec}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No specific recommendations available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Follow general health guidelines and consult your healthcare provider
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> These predictions are AI-generated estimates based on available data. 
          Always consult with qualified healthcare professionals for medical decisions and treatment plans.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PrecautionsTab;
