
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: "Critical" | "Stable" | "Improved";
  lastVisit: string;
  doctor: string;
}
