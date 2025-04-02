
import { useAuth } from "@/contexts/AuthContext";
import RecordFilters from "./RecordFilters";
import PatientDisclaimer from "./PatientDisclaimer";
import { useRecordContext } from "./RecordContextProvider";

const RecordsHeader = () => {
  const { userRole } = useAuth();
  const { setActiveTab, setCategoryFilter, activeTab } = useRecordContext();
  const isDoctor = userRole === "doctor";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">
            {isDoctor 
              ? "Upload, analyze, and manage all patient medical records" 
              : "Upload, analyze, and manage your medical records"}
          </p>
        </div>
        <RecordFilters 
          onFilterChange={setCategoryFilter} 
          onUploadClick={() => setActiveTab("upload")} 
          activeTab={activeTab}
        />
      </div>
      
      <PatientDisclaimer isDoctor={isDoctor} />
    </div>
  );
};

export default RecordsHeader;
