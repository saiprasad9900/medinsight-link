import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Phone, Mail, Calendar, FileText, Activity, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import RecordCard from "@/components/records/RecordCard";
import { MedicalRecord } from "@/types/records";
import EnhancedRecordInsight from "@/components/records/EnhancedRecordInsight";

// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    phone: "+1 (555) 123-4567",
    age: 42,
    dob: "1981-05-15",
    gender: "Female",
    bloodType: "A+",
    height: "5'6\"",
    weight: "145 lbs",
    address: "123 Oak Street, Boston, MA 02108",
    occupation: "Teacher",
    emergencyContact: "David Thompson (Husband) - +1 (555) 987-6543",
    lastVisit: "2023-08-15",
    nextAppointment: "2023-09-10",
    conditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Shellfish"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" }
    ],
    vitalSigns: [
      { date: "2023-08-15", bp: "138/85", hr: "72", temp: "98.6°F", weight: "145 lbs" },
      { date: "2023-07-10", bp: "142/88", hr: "75", temp: "98.4°F", weight: "147 lbs" },
      { date: "2023-06-05", bp: "145/90", hr: "78", temp: "98.7°F", weight: "148 lbs" }
    ]
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    age: 35,
    dob: "1988-11-23",
    gender: "Male",
    bloodType: "O+",
    height: "5'10\"",
    weight: "170 lbs",
    address: "456 Pine Avenue, Cambridge, MA 02139",
    occupation: "Software Engineer",
    emergencyContact: "Linda Chen (Wife) - +1 (555) 876-5432",
    lastVisit: "2023-08-10",
    nextAppointment: "2023-09-05",
    conditions: ["Asthma"],
    allergies: ["Dust mites", "Pollen"],
    medications: [
      { name: "Albuterol", dosage: "2 puffs", frequency: "As needed" },
      { name: "Fluticasone", dosage: "1 spray per nostril", frequency: "Once daily" }
    ],
    vitalSigns: [
      { date: "2023-08-10", bp: "120/80", hr: "68", temp: "98.5°F", weight: "170 lbs" },
      { date: "2023-07-05", bp: "118/78", hr: "70", temp: "98.6°F", weight: "172 lbs" },
      { date: "2023-06-01", bp: "122/82", hr: "72", temp: "98.4°F", weight: "173 lbs" }
    ]
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@example.com",
    phone: "+1 (555) 345-6789",
    age: 28,
    dob: "1995-03-08",
    gender: "Female",
    bloodType: "B-",
    height: "5'4\"",
    weight: "130 lbs",
    address: "789 Maple Drive, Somerville, MA 02143",
    occupation: "Graphic Designer",
    emergencyContact: "Maria Rodriguez (Mother) - +1 (555) 765-4321",
    lastVisit: "2023-08-05",
    nextAppointment: "2023-09-15",
    conditions: ["Anxiety", "Migraines"],
    allergies: ["Latex"],
    medications: [
      { name: "Sertraline", dosage: "50mg", frequency: "Once daily" },
      { name: "Sumatriptan", dosage: "50mg", frequency: "As needed for migraines" }
    ],
    vitalSigns: [
      { date: "2023-08-05", bp: "115/75", hr: "80", temp: "98.5°F", weight: "130 lbs" },
      { date: "2023-07-15", bp: "118/76", hr: "82", temp: "98.7°F", weight: "131 lbs" },
      { date: "2023-06-10", bp: "116/74", hr: "81", temp: "98.4°F", weight: "130 lbs" }
    ]
  }
];

// Mock records
const mockRecords: MedicalRecord[] = [
  {
    id: "1",
    title: "Complete Blood Count Results",
    type: "Lab Result",
    date: "Aug 15, 2023",
    patientName: "Emma Thompson",
    insights: 5,
    status: "Analyzed",
    category: "Laboratory",
    analysis: {
      summary: "Complete blood count shows normal red and white blood cell counts. Hemoglobin and hematocrit values are within normal ranges. No significant abnormalities detected.",
      insights: [
        {
          type: "info",
          title: "Normal Blood Cell Counts",
          description: "Red and white blood cell counts are within normal ranges, indicating proper bone marrow function."
        },
        {
          type: "info",
          title: "Healthy Hemoglobin Levels",
          description: "Hemoglobin level of 13.8 g/dL is within the normal range for adult females."
        }
      ],
      extractedData: {
        testResults: [
          { name: "WBC", value: "7.2", unit: "10³/µL", referenceRange: "4.5-11.0" },
          { name: "RBC", value: "4.8", unit: "10⁶/µL", referenceRange: "4.0-5.2" },
          { name: "Hemoglobin", value: "13.8", unit: "g/dL", referenceRange: "12.0-16.0" },
          { name: "Hematocrit", value: "42", unit: "%", referenceRange: "36-46" },
          { name: "Platelets", value: "250", unit: "10³/µL", referenceRange: "150-450" }
        ]
      }
    }
  },
  {
    id: "2",
    title: "Cardiac Assessment Report",
    type: "Clinical Note",
    date: "Aug 14, 2023",
    patientName: "Emma Thompson",
    insights: 3,
    status: "Analyzed",
    category: "Cardiology"
  },
  {
    id: "3",
    title: "Glucose Monitoring Log",
    type: "Lab Result",
    date: "Aug 12, 2023",
    patientName: "Emma Thompson",
    insights: 4,
    status: "Analyzed",
    category: "Endocrinology"
  }
];

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    // In a real app, fetch patient details from database
    const fetchPatient = async () => {
      try {
        setLoading(true);
        // Simulating API call with setTimeout
        setTimeout(() => {
          const foundPatient = mockPatients.find(p => p.id === id);
          
          if (foundPatient) {
            setPatient(foundPatient);
            
            // Filter records for this patient
            const records = mockRecords.filter(
              record => record.patientName === foundPatient.name
            );
            setPatientRecords(records);
            
            if (records.length > 0) {
              setSelectedRecord(records[0]);
            }
          } else {
            toast.error("Patient not found");
          }
          
          setLoading(false);
        }, 500);
      } catch (error: any) {
        console.error("Error fetching patient details:", error);
        toast.error(`Failed to load patient: ${error.message}`);
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Patient Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested patient could not be found</p>
        <Button asChild className="mt-4">
          <Link to="/doctor/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/doctor/dashboard">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Patient ID: {patient.id} • Last visit: {patient.lastVisit}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <Button size="sm" className="gap-2" asChild>
            <Link to={`/doctor/messages/${id}`}>
              <MessageSquare className="h-4 w-4" />
              Message
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link to={`/doctor/appointments/new?patient=${id}`}>
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary border-t-transparent">
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {patient.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-xl">{patient.name}</h3>
                  <div className="text-muted-foreground">{patient.age} years old • {patient.gender}</div>
                  <div className="flex gap-2 mt-2">
                    {patient.conditions.map((condition: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-primary/10">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{patient.dob}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="font-medium">{patient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium">{patient.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{patient.weight}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{patient.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Appointments</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Visit</p>
                      <p className="font-medium">{patient.lastVisit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Appointment</p>
                      <p className="font-medium">{patient.nextAppointment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Current Medications</h4>
                <div className="space-y-2">
                  {patient.medications.map((med: any, i: number) => (
                    <div key={i} className="bg-muted p-2 rounded-md">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Vital Signs History</h4>
                <div className="space-y-2">
                  {patient.vitalSigns.map((vital: any, i: number) => (
                    <div key={i} className="bg-muted p-2 rounded-md">
                      <p className="text-sm font-medium">{vital.date}</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">BP: </span>
                          {vital.bp}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">HR: </span>
                          {vital.hr} bpm
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Temp: </span>
                          {vital.temp}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Weight: </span>
                          {vital.weight}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="records">
            <TabsList>
              <TabsTrigger value="records" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Health History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="records" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="space-y-4">
                    {patientRecords.map((record) => (
                      <div 
                        key={record.id} 
                        className="cursor-pointer"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <RecordCard 
                          record={record} 
                          isSelected={selectedRecord?.id === record.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedRecord && selectedRecord.analysis ? (
                    <EnhancedRecordInsight 
                      title={`${selectedRecord.type} Analysis`}
                      analysis={selectedRecord.analysis}
                    />
                  ) : selectedRecord ? (
                    <Card className="h-full flex items-center justify-center p-6">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Record Preview Not Available</h3>
                        <p className="text-muted-foreground mt-2">
                          This record has not been analyzed yet. Please run analysis to see insights.
                        </p>
                        <Button className="mt-4">
                          Analyze Record
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="h-full flex items-center justify-center p-6">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Record Selected</h3>
                        <p className="text-muted-foreground mt-2">
                          Select a record from the list to view its details
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health History</CardTitle>
                  <CardDescription>
                    Patient's medical history and progression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium">Diagnoses</h3>
                      <div className="mt-4 space-y-4">
                        <div className="border-l-2 border-primary pl-4 pb-6 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                          <h4 className="font-medium">Hypertension</h4>
                          <p className="text-sm text-muted-foreground">Diagnosed: Jan 15, 2022</p>
                          <p className="mt-2">Primary hypertension with consistent readings above 140/90. Patient started on lisinopril 10mg daily with dietary sodium restrictions.</p>
                        </div>
                        <div className="border-l-2 border-primary pl-4 pb-6 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                          <h4 className="font-medium">Type 2 Diabetes</h4>
                          <p className="text-sm text-muted-foreground">Diagnosed: Mar 10, 2022</p>
                          <p className="mt-2">Diagnosed following HbA1c of 7.2%. Patient started on metformin 500mg twice daily with lifestyle modifications including diet changes and increased physical activity.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Procedures & Surgeries</h3>
                      <div className="mt-4 space-y-4">
                        <div className="border-l-2 border-muted pl-4 pb-6 relative">
                          <div className="absolute w-3 h-3 bg-muted rounded-full -left-[7px] top-1"></div>
                          <h4 className="font-medium">Appendectomy</h4>
                          <p className="text-sm text-muted-foreground">Performed: May 5, 2015</p>
                          <p className="mt-2">Laparoscopic appendectomy performed for acute appendicitis. No complications. Full recovery after 2 weeks.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Family History</h3>
                      <div className="mt-4 space-y-2">
                        <p><span className="font-medium">Father:</span> Hypertension, Type 2 Diabetes</p>
                        <p><span className="font-medium">Mother:</span> Breast cancer (diagnosed at age 65)</p>
                        <p><span className="font-medium">Paternal Grandfather:</span> Coronary artery disease, died at age 68</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
