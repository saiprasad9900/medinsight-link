
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, AreaChart, Area } from "recharts";
import { useState } from "react";
import { Download, Calendar, TrendingUp, BarChart as BarChartIcon, LineChart as LineChartIcon } from "lucide-react";

const data = [
  { name: "Jan", records: 65, patients: 45, tests: 32 },
  { name: "Feb", records: 59, patients: 38, tests: 27 },
  { name: "Mar", records: 80, patients: 52, tests: 43 },
  { name: "Apr", records: 81, patients: 57, tests: 38 },
  { name: "May", records: 56, patients: 42, tests: 35 },
  { name: "Jun", records: 55, patients: 40, tests: 32 },
  { name: "Jul", records: 40, patients: 35, tests: 28 },
];

const AnalyticsSummary = () => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [timeFrame, setTimeFrame] = useState('monthly');

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          className="stagger-item slide-right"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.05)' }}
            animationDuration={300}
          />
          <Bar 
            dataKey="records" 
            name="Records Processed" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
            animationDuration={2000}
          />
          <Bar 
            dataKey="patients" 
            name="Patient Visits" 
            fill="rgba(148, 163, 184, 0.7)" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
            animationDuration={2000}
          />
          <Bar 
            dataKey="tests" 
            name="Tests Conducted" 
            fill="rgba(56, 189, 248, 0.7)" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
            animationDuration={2000}
          />
        </BarChart>
      );
    } else if (chartType === 'line') {
      return (
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          className="stagger-item slide-right"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.05)' }}
          />
          <Line 
            type="monotone" 
            dataKey="records" 
            name="Records Processed" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2} 
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={2000}
          />
          <Line 
            type="monotone" 
            dataKey="patients" 
            name="Patient Visits" 
            stroke="rgba(148, 163, 184, 0.7)" 
            strokeWidth={2} 
            dot={{ fill: 'rgba(148, 163, 184, 0.7)', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={2000}
          />
          <Line 
            type="monotone" 
            dataKey="tests" 
            name="Tests Conducted" 
            stroke="rgba(56, 189, 248, 0.7)" 
            strokeWidth={2} 
            dot={{ fill: 'rgba(56, 189, 248, 0.7)', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={2000}
          />
        </LineChart>
      );
    } else {
      return (
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          className="stagger-item slide-right"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.05)' }}
          />
          <Area
            type="monotone"
            dataKey="records"
            name="Records Processed"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            animationDuration={2000}
          />
          <Area
            type="monotone"
            dataKey="patients"
            name="Patient Visits"
            stroke="rgba(148, 163, 184, 0.7)"
            fill="rgba(148, 163, 184, 0.7)"
            fillOpacity={0.2}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            animationDuration={2000}
          />
          <Area
            type="monotone"
            dataKey="tests"
            name="Tests Conducted"
            stroke="rgba(56, 189, 248, 0.7)"
            fill="rgba(56, 189, 248, 0.7)"
            fillOpacity={0.2}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            animationDuration={2000}
          />
        </AreaChart>
      );
    }
  };

  return (
    <Card className="h-full scale-in">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
            Records Analysis
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Button 
              variant={timeFrame === 'weekly' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame('weekly')}
              className="text-xs h-7 px-2"
            >
              Weekly
            </Button>
            <Button 
              variant={timeFrame === 'monthly' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame('monthly')}
              className="text-xs h-7 px-2"
            >
              Monthly
            </Button>
            <Button 
              variant={timeFrame === 'yearly' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame('yearly')}
              className="text-xs h-7 px-2"
            >
              Yearly
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-accent rounded-md p-1 flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${chartType === 'bar' ? 'bg-background' : ''}`}
              onClick={() => setChartType('bar')}
            >
              <BarChartIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${chartType === 'line' ? 'bg-background' : ''}`}
              onClick={() => setChartType('line')}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${chartType === 'area' ? 'bg-background' : ''}`}
              onClick={() => setChartType('area')}
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummary;
