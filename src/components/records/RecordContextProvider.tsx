
import { createContext, useContext, useState, ReactNode } from "react";
import { Record } from "@/types/records";

interface RecordContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRecord: Record | null;
  setSelectedRecord: (record: Record | null) => void;
  userRecords: Record[];
  setUserRecords: (records: Record[]) => void;
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
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [userRecords, setUserRecords] = useState<Record[]>([]);
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
