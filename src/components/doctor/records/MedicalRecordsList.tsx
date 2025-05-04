
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MedicalRecord } from "@/types/records";

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  onRecordClick: (record: MedicalRecord) => void;
  selectedRecordId: string | null;
}

const MedicalRecordsList = ({ records, onRecordClick, selectedRecordId }: MedicalRecordsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Medical Records</CardTitle>
        <CardDescription>
          {records.length} records found for this patient
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">No records found for this patient</p>
              <Button size="sm" className="gap-1.5">
                <PlusCircle className="h-4 w-4" />
                Add First Record
              </Button>
            </div>
          ) : (
            records.map((record) => (
              <div 
                key={record.id}
                className={cn(
                  "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                  selectedRecordId === record.id && "bg-accent"
                )}
                onClick={() => onRecordClick(record)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium truncate">{record.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {record.date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {record.type}
                        </Badge>
                        {record.category && (
                          <Badge variant="outline" className="text-xs">
                            {record.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsList;
