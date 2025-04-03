
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Prediction } from "@/types/records";
import { RiskBadge } from "./predictive/RiskBadge";
import { RiskScoreIndicator } from "./predictive/RiskScoreIndicator";
import { TimelineChart } from "./predictive/TimelineChart";
import { OutcomesList } from "./predictive/OutcomesList";
import { ComparisonChart } from "./predictive/ComparisonChart";
import { RecommendationList } from "./predictive/RecommendationList";

interface PredictiveInsightsProps {
  patientName: string;
  prediction: Prediction;
}

const PredictiveInsights = ({ patientName, prediction }: PredictiveInsightsProps) => {
  const { riskScore, riskLevel, predictedOutcomes, recommendations } = prediction;

  const predictionTimelineData = predictedOutcomes.map(outcome => ({
    name: outcome.timeframe,
    probability: Math.round(outcome.probability * 100)
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Predictive Insights</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">AI-powered health prediction</p>
          </div>
          <RiskBadge level={riskLevel} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <RiskScoreIndicator score={riskScore} level={riskLevel} />

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="pt-4">
            <TimelineChart data={predictionTimelineData} />
          </TabsContent>
          <TabsContent value="outcomes" className="pt-4">
            <OutcomesList outcomes={predictedOutcomes} />
          </TabsContent>
          <TabsContent value="comparison" className="pt-4">
            <ComparisonChart riskScore={riskScore} riskLevel={riskLevel} />
          </TabsContent>
        </Tabs>

        <Separator />
        
        <RecommendationList recommendations={recommendations} patientName={patientName} />
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights;
