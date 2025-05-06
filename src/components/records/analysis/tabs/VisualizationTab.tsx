
import { MedicalRecord } from "@/types/records";
import { PieChart, Pie, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface VisualizationTabProps {
  record: MedicalRecord;
}

// Chart colors for visualizations
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const VisualizationTab = ({ record }: VisualizationTabProps) => {
  // Generate data for visualization if we have analysis results
  const generateVisualizationData = () => {
    if (!record.analysis || !record.analysis.extractedData) return null;
    
    // Chart data for conditions
    const conditionData = record.analysis.extractedData.conditions?.map(condition => ({
      name: condition,
      value: Math.floor(Math.random() * 40) + 10 // In a real app, this would be actual relevance data
    })) || [];
    
    // Chart data for trends (simulated)
    const trendData = [
      { name: 'Jan', value: 30 },
      { name: 'Feb', value: 25 },
      { name: 'Mar', value: 35 },
      { name: 'Apr', value: 40 },
      { name: 'May', value: 28 }
    ];
    
    return { conditionData, trendData };
  };
  
  const visualizationData = generateVisualizationData();
  
  if (!visualizationData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No visualization data available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 pt-4">
      <div className="p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-4">Condition Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visualizationData.conditionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {visualizationData.conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-4">Historical Trend Analysis</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visualizationData.trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
                name="Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VisualizationTab;
