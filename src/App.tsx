
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Dashboard from "./pages/Index";
import Records from "./pages/Records";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Patients from "./pages/Patients";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AiDoctor from "./pages/AiDoctor";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDetails from "./pages/doctor/PatientDetails";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorRoute from "./components/DoctorRoute";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with Layout */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="/records" element={<Layout><Records /></Layout>} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/messages" element={<Layout><Messages /></Layout>} />
                <Route path="/patients" element={<Layout><Patients /></Layout>} />
                <Route path="/ai-doctor" element={<Layout><AiDoctor /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
              </Route>
              
              {/* Doctor routes */}
              <Route element={<DoctorRoute />}>
                <Route path="/doctor/dashboard" element={<Layout><DoctorDashboard /></Layout>} />
                <Route path="/doctor/patients/:id" element={<Layout><PatientDetails /></Layout>} />
                {/* Add more doctor routes as needed */}
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
