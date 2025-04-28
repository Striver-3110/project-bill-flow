import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useEmployees } from "@/hooks/use-employees";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTimeEntryMutations } from "@/hooks/use-time-entry-mutations";

interface FormData {
  project_id: string;
  employee_id: string;
  month: string;
  hours: number;
  description: string;
  billable: boolean;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function TimeEntryDialog({ editEntry = null, onClose = () => {} }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const { projects } = useProjects();
  const { employees } = useEmployees();
  const { updateTimeEntry, addTimeEntry } = useTimeEntryMutations();
  
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const form = useForm<FormData>({
    defaultValues: {
      project_id: "",
      employee_id: "",
      month: getCurrentMonth(),
      hours: 0,
      description: "",
      billable: true,
    }
  });

  useEffect(() => {
    const selectedProjectId = form.watch("project_id");
    if (selectedProjectId && projects) {
      const project = projects.find(p => p.project_id === selectedProjectId);
      if (project && project.assignments) {
        const assignedEmployeeIds = project.assignments.map(a => a.employee_id);
        const projectEmployees = employees?.filter(employee => 
          assignedEmployeeIds.includes(employee.employee_id)
        ) || [];
        setFilteredEmployees(projectEmployees);
      } else {
        setFilteredEmployees([]);
      }
    } else {
      setFilteredEmployees([]);
    }
  }, [form.watch("project_id"), projects, employees]);

  useEffect(() => {
    if (editEntry) {
      setOpen(true);
      const entryDate = new Date(editEntry.date);
      const monthValue = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      
      form.reset({
        project_id: editEntry.project_id,
        employee_id: editEntry.employee_id,
        month: monthValue,
        hours: editEntry.hours,
        description: editEntry.description || "",
        billable: editEntry.billable,
      });
    }
  }, [editEntry, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!data.project_id) {
        toast.error("Please select a project");
        return;
      }
      
      if (!data.employee_id) {
        toast.error("Please select an employee");
        return;
      }
      
      if (!data.month) {
        toast.error("Please select a month");
        return;
      }
      
      if (data.hours <= 0) {
        toast.error("Days must be greater than 0");
        return;
      }

      setIsSubmitting(true);

      const [year, month] = data.month.split('-');
      const date = new Date(Number(year), Number(month) - 1, 1);

      const timeEntryData = {
        project_id: data.project_id,
        employee_id: data.employee_id,
        date: date.toISOString().split('T')[0],
        hours: data.hours,
        description: data.description,
        billable: data.billable,
      };

      if (editEntry) {
        await updateTimeEntry.mutateAsync({
          id: editEntry.time_entry_id,
          data: timeEntryData,
        });
      } else {
        await addTimeEntry.mutateAsync(timeEntryData);
      }
      
      setOpen(false);
      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Time entry error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Time Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editEntry ? "Edit Time Entry" : "Add Time Entry"}</DialogTitle>
          <DialogDescription>
            Log your time spent on a project
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("employee_id", "");
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.project_id} value={project.project_id}>
                          {project.project_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="employee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredEmployees.map((employee) => (
                        <SelectItem key={employee.employee_id} value={employee.employee_id}>
                          {employee.first_name} {employee.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const date = new Date(2024, i, 1);
                        const value = `2024-${String(i + 1).padStart(2, '0')}`;
                        return (
                          <SelectItem key={value} value={value}>
                            {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.5"
                      placeholder="Enter days worked" 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what you worked on" 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Billable</FormLabel>
                    <FormDescription>
                      Is this time billable to the client?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Time Entry'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function FormDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className="text-[0.8rem] text-muted-foreground"
      {...props}
    />
  );
}
