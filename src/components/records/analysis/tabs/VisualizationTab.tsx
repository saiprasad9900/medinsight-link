
import { MedicalRecord } from "@/types/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface VisualizationTabProps {
  record: MedicalRecord;
}

const VisualizationTab = ({ record }: VisualizationTabProps) => {
  if (!record.analysis?.extractedData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available for visualization</p>
      </div>
    );
  }

  const { extractedData } = record.analysis;

  // Generate sample data for visualization based on record type
  const generateVisualizationData = () => {
    if (extractedData.testResults && extractedData.testResults.length > 0) {
      return extractedData.testResults.map(test => ({
        name: test.name,
        value: parseFloat(test.value) || 0,
        unit: test.unit
      }));
    }

    if (extractedData.vitalSigns && extractedData.vitalSigns.length > 0) {
      return extractedData.vitalSigns.map(vital => ({
        name: vital.name,
        value: parseFloat(vital.value) || 0,
        unit: vital.unit
      }));
    }

    return [];
  };

  const chartData = generateVisualizationData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const conditionsData = extractedData.conditions 
    ? extractedData.conditions.map((condition, index) => ({
        name: condition,
        value: Math.floor(Math.random() * 100) + 20,
        color: COLORS[index % COLORS.length]
      }))
    : [];

  return (
    <div className="space-y-6 pt-4">
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Results Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name]} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {conditionsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conditions Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conditionsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {extractedData.findings && extractedData.findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Findings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {extractedData.findings.map((finding, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{finding}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {chartData.length === 0 && conditionsData.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No numerical data available for visualization</p>
            <p className="text-sm text-muted-foreground mt-2">
              Upload lab results or records with test values to see charts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualizationTab;
