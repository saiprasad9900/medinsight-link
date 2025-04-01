
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DoctorRouteProps {
  children?: React.ReactNode;
}

const DoctorRoute = ({ children }: DoctorRouteProps) => {
  const { user, loading, userRole } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth?redirect=doctor" replace />;
  }

  // Redirect to home if authenticated but not a doctor
  if (userRole !== "doctor") {
    return <Navigate to="/" replace />;
  }

  // Render the protected content for doctors
  return children ? children : <Outlet />;
};

export default DoctorRoute;
