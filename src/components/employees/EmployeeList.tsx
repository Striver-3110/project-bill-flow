
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import { formatDate, formatCurrency } from "@/utils/invoiceUtils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeDialog from "./EmployeeDialog";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";
import { CreateEmployeeInput, UpdateEmployeeInput } from "@/hooks/use-employees";

type EmployeeListProps = {
  employees: Employee[];
  onUpdateEmployee: (data: UpdateEmployeeInput) => void;
  onDeleteEmployee: (employeeId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
};

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onUpdateEmployee,
  onDeleteEmployee,
  isUpdating,
  isDeleting,
}) => {
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleDeleteConfirm = () => {
    if (deletingEmployee) {
      onDeleteEmployee(deletingEmployee.employee_id);
      setDeletingEmployee(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Cost Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell className="font-medium">
                    {employee.first_name} {employee.last_name}
                  </TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{formatDate(employee.hire_date)}</TableCell>
                  <TableCell>{formatCurrency(employee.cost_rate, "USD")}/hr</TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingEmployee(employee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingEmployee(employee)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {viewingEmployee && (
        <EmployeeDetails
          open={!!viewingEmployee}
          onOpenChange={(open) => !open && setViewingEmployee(null)}
          employee={viewingEmployee}
        />
      )}

      {editingEmployee && (
        <EmployeeDialog
          open={!!editingEmployee}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
          employee={editingEmployee}
          onSubmit={onUpdateEmployee}
          isSubmitting={isUpdating}
          mode="edit"
        />
      )}

      {deletingEmployee && (
        <DeleteEmployeeDialog
          open={!!deletingEmployee}
          onOpenChange={(open) => !open && setDeletingEmployee(null)}
          employee={deletingEmployee}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default EmployeeList;
