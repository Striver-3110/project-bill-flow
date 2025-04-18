
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/types";
import { formatDate } from "@/utils/invoiceUtils";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/invoiceUtils";

type EmployeeDetailsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
};

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View detailed information about {employee.first_name}{" "}
            {employee.last_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-sm text-gray-900">
                {employee.first_name} {employee.last_name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{employee.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Designation</h3>
              <p className="mt-1 text-sm text-gray-900">
                {employee.designation}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Department</h3>
              <p className="mt-1 text-sm text-gray-900">{employee.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Hire Date</h3>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(employee.hire_date)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cost Rate</h3>
              <p className="mt-1 text-sm text-gray-900">
                {formatCurrency(employee.cost_rate, "USD")} per hour
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1">
              <Badge
                variant={employee.status === "active" ? "success" : "destructive"}
              >
                {employee.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetails;
