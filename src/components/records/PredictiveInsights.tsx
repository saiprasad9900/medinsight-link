
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChevronRight, AlertTriangle, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Prediction } from "@/types/records";

interface PredictiveInsightsProps {
  patientName: string;
  prediction: Prediction;
}

const PredictiveInsights = ({ patientName, prediction }: PredictiveInsightsProps) => {
  const { riskScore, riskLevel, predictedOutcomes, recommendations } = prediction;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  const getRiskGradient = (score: number) => {
    if (score < 30) return "bg-gradient-to-r from-green-500 to-green-300";
    if (score < 70) return "bg-gradient-to-r from-amber-500 to-amber-300";
    return "bg-gradient-to-r from-red-500 to-red-300";
  };

  const getTrendIcon = (value: number) => {
    if (value > 0.7) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value > 0.3) return <TrendingUp className="h-4 w-4 text-amber-500" />;
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const predictionTimelineData = predictedOutcomes.map(outcome => ({
    name: outcome.timeframe,
    probability: Math.round(outcome.probability * 100)
  }));

  const handleCopyRecommendations = () => {
    const text = `Recommendations for ${patientName}:\n\n${recommendations.map(rec => `- ${rec}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success("Recommendations copied to clipboard");
  };

  const riskDistributionData = [
    { name: "Low Risk", value: 100 - riskScore },
    { name: "Risk Score", value: riskScore }
  ];

  const COLORS = ['#e6e6e6', riskLevel === 'Low' ? '#34d399' : riskLevel === 'Medium' ? '#fbbf24' : '#ef4444'];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Predictive Insights</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">AI-powered health prediction</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("font-normal", getRiskColor(riskLevel))}
          >
            {riskLevel} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Risk Score</h4>
            <span className="text-xl font-bold">{riskScore}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-gray-200">
            <div 
              className={cn("h-full", getRiskGradient(riskScore))} 
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="pt-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={predictionTimelineData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="probability" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="outcomes" className="pt-4">
            <div className="space-y-2">
              {predictedOutcomes.map((outcome, index) => (
                <div key={index} className="bg-accent/30 p-3 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(outcome.probability)}
                    <div>
                      <p className="font-medium">{outcome.outcome}</p>
                      <p className="text-xs text-muted-foreground">{outcome.timeframe}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {Math.round(outcome.probability * 100)}% 
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="comparison" className="pt-4">
            <div className="h-48 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Compared to population average
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Recommendations</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleCopyRecommendations}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center mt-0.5",
                  index % 3 === 0 ? "bg-red-100" : index % 3 === 1 ? "bg-amber-100" : "bg-green-100"
                )}>
                  {index % 3 === 0 ? (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  ) : index % 3 === 1 ? (
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights;
