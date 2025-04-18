
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";

export function CreateInvoiceSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-billflow-blue-600 hover:bg-billflow-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Create New Invoice</SheetTitle>
          <SheetDescription>
            Create a new invoice for your client. Fill in all the required information below.
          </SheetDescription>
        </SheetHeader>
        {/* Form will be implemented in the next iteration */}
      </SheetContent>
    </Sheet>
  );
}
