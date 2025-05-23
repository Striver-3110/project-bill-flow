
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Employee } from "@/types";
import { CreateEmployeeInput, UpdateEmployeeInput } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .optional()
    .refine(
      (val) => val === undefined || val === "" || /^\+?[1-9]\d{1,14}$/.test(val), 
      "Please enter a valid phone number"
    ),
  hire_date: z.string().min(1, "Please select a hire date"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
  cost_rate: z.coerce.number().min(0, "Cost rate must be a positive number"),
});

type EmployeeFormProps = {
  employee?: Employee;
  onSubmit: (data: CreateEmployeeInput | UpdateEmployeeInput) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  isSubmitting,
  mode,
  onCancel,
}) => {
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  const [openDepartmentCombobox, setOpenDepartmentCombobox] = useState(false);
  const [departmentInputValue, setDepartmentInputValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: employee?.first_name || "",
      last_name: employee?.last_name || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      hire_date: employee?.hire_date
        ? employee.hire_date.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      designation: employee?.designation || "",
      department: employee?.department || "",
      status: employee?.status || "active",
      cost_rate: employee?.cost_rate || 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (mode === "edit" && employee) {
      onSubmit({
        employee_id: employee.employee_id,
        ...values,
      } as UpdateEmployeeInput);
    } else {
      onSubmit(values as CreateEmployeeInput);
    }
  };

  // Create a list of all departments - existing ones plus the current input value
  const departmentOptions = departmentInputValue 
    ? [...departments, departmentInputValue]
    : departments;

  // Remove duplicates
  const uniqueDepartmentOptions = [...new Set(departmentOptions)].sort();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="employee@example.com" 
                      {...field} 
                      disabled={mode === "edit"} 
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hire_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hire Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Popover open={openDepartmentCombobox} onOpenChange={setOpenDepartmentCombobox}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDepartmentCombobox}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value || "Select department..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search or add department..." 
                          value={departmentInputValue}
                          onValueChange={setDepartmentInputValue}
                        />
                        {isLoadingDepartments ? (
                          <div className="py-6 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="text-sm text-muted-foreground mt-2">Loading departments...</p>
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>
                              {departmentInputValue ? (
                                <div className="py-3 px-2">
                                  <p>Department not found.</p>
                                  <Button 
                                    variant="outline" 
                                    className="mt-2 w-full"
                                    onClick={() => {
                                      field.onChange(departmentInputValue);
                                      setOpenDepartmentCombobox(false);
                                    }}
                                  >
                                    Create "{departmentInputValue}"
                                  </Button>
                                </div>
                              ) : (
                                "No departments found."
                              )}
                            </CommandEmpty>
                            <CommandGroup>
                              {uniqueDepartmentOptions.map((dept) => (
                                <CommandItem
                                  key={dept}
                                  value={dept}
                                  onSelect={() => {
                                    field.onChange(dept);
                                    setOpenDepartmentCombobox(false);
                                    setDepartmentInputValue("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === dept ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {dept}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700">Financial Information</h3>
          <FormField
            control={form.control}
            name="cost_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Rate (hourly)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              mode === "create" ? "Create Employee" : "Update Employee"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
