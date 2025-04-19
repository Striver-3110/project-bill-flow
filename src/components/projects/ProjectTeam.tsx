import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, UserMinus, UserPlus } from "lucide-react";
import { ProjectAssignmentDialog } from "./ProjectAssignmentDialog";
import { useProjectAssignments } from "@/hooks/use-project-assignments";
import { format } from "date-fns";

interface ProjectTeamProps {
  projectId: string;
  projectName: string;
}

export function ProjectTeam({
  projectId,
  projectName
}: ProjectTeamProps) {
  const {
    projectAssignments,
    isLoading,
    removeAssignment
  } = useProjectAssignments(projectId);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      setRemovingId(assignmentId);
      await removeAssignment.mutateAsync(assignmentId);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>;
  }

  const activeAssignments = projectAssignments?.filter(a => a.status === "ACTIVE") || [];

  return <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="px-0 my-0 py-0 mx-0">Project Team</CardTitle>
          <CardDescription>
            Team members assigned to this project
          </CardDescription>
        </div>
        <ProjectAssignmentDialog projectId={projectId} projectName={projectName}>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Employee
          </Button>
        </ProjectAssignmentDialog>
      </CardHeader>
      <CardContent>
        {activeAssignments.length === 0 ? <div className="text-center py-8 text-muted-foreground">
            <p>No team members assigned to this project yet.</p>
            <p className="text-sm mt-2">Use the "Assign Employee" button to add team members.</p>
          </div> : <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAssignments.map(assignment => <TableRow key={assignment.assignment_id}>
                    <TableCell className="font-medium">
                      {assignment.employee?.first_name} {assignment.employee?.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignment.role}</Badge>
                    </TableCell>
                    <TableCell>{assignment.employee?.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {format(new Date(assignment.start_date), "dd MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.end_date ? <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {format(new Date(assignment.end_date), "dd MMM yyyy")}
                        </div> : <span className="text-muted-foreground">No end date</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {assignment.employee?.first_name} {assignment.employee?.last_name} from this project? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveAssignment(assignment.assignment_id!)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={removingId === assignment.assignment_id}>
                              {removingId === assignment.assignment_id ? <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                                  Removing...
                                </> : "Remove"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>}
      </CardContent>
    </Card>;
}
