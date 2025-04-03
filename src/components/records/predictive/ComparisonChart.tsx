
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ComparisonChartProps {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
}

export const ComparisonChart = ({ riskScore, riskLevel }: ComparisonChartProps) => {
  const data = [
    { name: "Low Risk", value: 100 - riskScore },
    { name: "Risk Score", value: riskScore }
  ];

  const COLORS = ['#e6e6e6', riskLevel === 'Low' ? '#34d399' : riskLevel === 'Medium' ? '#fbbf24' : '#ef4444'];

  return (
    <>
      <div className="h-48 flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
    </>
  );
};
