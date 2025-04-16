import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PatientService } from "@/services/PatientService";

const patientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.coerce.number().int().min(0, { message: "Age must be a positive number" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  condition: z.string().min(2, { message: "Medical condition is required" }),
  doctor: z.string().optional(),
  status: z.string().default("Stable"),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface AddPatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddPatientForm({ open, onOpenChange, onSuccess }: AddPatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: "",
      condition: "",
      doctor: "",
      status: "Stable",
    },
  });

  async function onSubmit(data: PatientFormValues) {
    try {
      setIsSubmitting(true);
      
      const success = await PatientService.addPatient({
        name: data.name,
        age: data.age,
        gender: data.gender,
        condition: data.condition,
        doctor: data.doctor,
        status: data.status,
      });

      if (success) {
        form.reset();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(`Error adding patient: ${error.message}`);
      console.error("Error adding patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient details below to create a new patient record.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Age" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Condition</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the medical condition"
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Doctor</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Name (Optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Stable">Stable</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="Improved">Improved</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Patient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
