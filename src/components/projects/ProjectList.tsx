
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProjectAssignmentDialog } from "./ProjectAssignmentDialog";
import { EditProjectDialog } from "./EditProjectDialog";
import type { Project } from "@/types";

// Define a local Project type for backward compatibility if needed
interface ProjectItem {
  project_id: string;
  project_name: string;
  client?: { client_name: string };
  start_date: string;
  end_date: string;
  status: string;
  assignments?: any[];
  budget: number;
}

export const ProjectList = ({ 
  projects,
  projectStats,
  handleDeleteProject,
  handleProjectUpdated
}: { 
  projects: ProjectItem[];
  projectStats: any[];
  handleDeleteProject: (id: string) => Promise<void>;
  handleProjectUpdated: (project: Project) => void;
}) => {
  if (!projects.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No projects found. Get started by creating your first project.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Team Size</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const stats = projectStats?.find(s => s.project_id === project.project_id);
          const teamSize = stats?.team_size || project.assignments?.length || 0;

          return (
            <TableRow key={project.project_id}>
              <TableCell className="font-medium">
                {project.project_name}
              </TableCell>
              <TableCell>{project.client?.client_name || "N/A"}</TableCell>
              <TableCell>
                {new Date(project.start_date).toLocaleDateString()} to {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell>
                <StatusBadge status={project.status.toLowerCase() as any} />
              </TableCell>
              <TableCell>{teamSize}</TableCell>
              <TableCell>${project.budget.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ProjectAssignmentDialog 
                    projectId={project.project_id} 
                    projectName={project.project_name}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      title="Assign Employee"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </ProjectAssignmentDialog>
                  <Link to={`/projects/${project.project_id}`} title="View Project Details">
                    <Button
                      variant="outline"
                      size="icon"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <EditProjectDialog
                    project={project as unknown as Project}
                    onProjectUpdated={handleProjectUpdated}
                    trigger={
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this project? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project.project_id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
