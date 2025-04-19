
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Project } from "@/types";

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  budget: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().nonnegative("Budget must be a positive number")
  ),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"])
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface EditProjectDialogProps {
  project: Project;
  onProjectUpdated: (project: Project) => void;
  trigger?: React.ReactNode;
}

export function EditProjectDialog({ project, onProjectUpdated, trigger }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: project.project_name || project.name,
      description: project.description || "",
      start_date: project.start_date.split('T')[0],
      end_date: project.end_date?.split('T')[0] || "",
      budget: Number(project.budget), // Convert to number here
      status: project.status as "ACTIVE" | "COMPLETED" | "ON_HOLD"
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update({
          project_name: data.project_name,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          budget: data.budget,
          status: data.status
        })
        .eq('project_id', project.project_id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Project updated successfully");
      setOpen(false);
      
      // Convert to the expected Project type
      const convertedProject: Project = {
        ...updatedProject,
        name: updatedProject.project_name, // Ensure the name is set for backward compatibility
      } as Project;
      
      onProjectUpdated(convertedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
