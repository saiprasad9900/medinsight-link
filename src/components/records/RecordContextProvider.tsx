
import { createContext, useContext, useState, ReactNode } from "react";
import { MedicalRecord } from "@/types/records";

interface RecordContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRecord: MedicalRecord | null;
  setSelectedRecord: (record: MedicalRecord | null) => void;
  userRecords: MedicalRecord[];
  setUserRecords: (records: MedicalRecord[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  analyzing: boolean;
  setAnalyzing: (analyzing: boolean) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

const RecordContext = createContext<RecordContextType | undefined>(undefined);

export const useRecordContext = () => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error("useRecordContext must be used within a RecordContextProvider");
  }
  return context;
};

interface RecordContextProviderProps {
  children: ReactNode;
}

export const RecordContextProvider = ({ children }: RecordContextProviderProps) => {
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [userRecords, setUserRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  return (
    <RecordContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRecord,
        setSelectedRecord,
        userRecords,
        setUserRecords,
        loading,
        setLoading,
        analyzing,
        setAnalyzing,
        categoryFilter,
        setCategoryFilter,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};
