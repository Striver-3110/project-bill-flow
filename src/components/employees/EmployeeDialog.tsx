
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import { Employee } from "@/types";
import { CreateEmployeeInput, UpdateEmployeeInput } from "@/hooks/use-employees";

type EmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onSubmit: (data: CreateEmployeeInput | UpdateEmployeeInput) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
};

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Employee" : "Edit Employee"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the form below to add a new employee."
              : "Update the employee information."}
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm
          employee={employee}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          mode={mode}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
