
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
import { Phone, Mail, User, Calendar, DollarSign, Building, Briefcase } from "lucide-react";

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
          {/* Personal Information */}
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <User className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p className="text-sm text-gray-900">{employee.first_name} {employee.last_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-sm text-gray-900">{employee.email}</p>
                </div>
              </div>
              
              {employee.phone && (
                <div className="flex items-start">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="text-sm text-gray-900">{employee.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employment Information */}
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <Briefcase className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Designation</h4>
                  <p className="text-sm text-gray-900">{employee.designation}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Department</h4>
                  <p className="text-sm text-gray-900">{employee.department}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Hire Date</h4>
                  <p className="text-sm text-gray-900">{formatDate(employee.hire_date)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-4 w-4 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <Badge
                    variant={employee.status === "active" ? "success" : "destructive"}
                    className="mt-1"
                  >
                    {employee.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information - For Finance Department */}
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Information</h3>
            <div className="flex items-start">
              <DollarSign className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cost Rate</h4>
                <p className="text-sm text-gray-900">
                  {formatCurrency(employee.cost_rate, "USD")} per hour
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetails;
