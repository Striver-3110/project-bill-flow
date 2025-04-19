
import React from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

interface TimeEntriesTableProps {
  timeEntries: any[];
  projects: any[];
  employees: any[];
  onDelete: (id: string) => void;
  onEdit: (entry: any) => void;
}

export const TimeEntriesTable = ({
  timeEntries,
  projects,
  employees,
  onDelete,
  onEdit,
}: TimeEntriesTableProps) => {
  const getProjectName = (projectId: string) => {
    return projects?.find(p => p.project_id === projectId)?.project_name || 'N/A';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find(e => e.employee_id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'N/A';
  };

  return (
    <div className="border rounded-md overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Billable</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No time entries found
              </TableCell>
            </TableRow>
          ) : (
            timeEntries.map((entry) => (
              <TableRow key={entry.time_entry_id}>
                <TableCell>{format(new Date(entry.date), 'PP')}</TableCell>
                <TableCell>{getProjectName(entry.project_id)}</TableCell>
                <TableCell>{getEmployeeName(entry.employee_id)}</TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>{entry.description || 'N/A'}</TableCell>
                <TableCell>
                  {entry.billable ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      No
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this time entry? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(entry.time_entry_id)}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
