
import { 
  FileText, 
  Users, 
  Calendar, 
  BarChart3 
} from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/dashboard/StatCard";
import RecentPatients from "@/components/dashboard/RecentPatients";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import AnalyticsSummary from "@/components/dashboard/AnalyticsSummary";

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Dr. Lee. Here's an overview of your activity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Records"
            value="1,248"
            icon={<FileText className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Patients"
            value="358"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Appointments"
            value="24"
            icon={<Calendar className="h-5 w-5" />}
            trend={{ value: 2, isPositive: false }}
          />
          <StatCard
            title="Insights Generated"
            value="842"
            icon={<BarChart3 className="h-5 w-5" />}
            trend={{ value: 16, isPositive: true }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsSummary />
          </div>
          <div className="lg:col-span-1">
            <ActivityTimeline />
          </div>
        </div>
        
        <div>
          <RecentPatients />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
