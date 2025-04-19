
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Invoice } from "@/types";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { mailInvoice } from "@/utils/invoiceActions";
import { AlertCircle } from "lucide-react";

interface MailInvoiceDialogProps {
  invoice: Invoice;
  trigger?: React.ReactNode;
}

const mailSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().optional(),
});

export function MailInvoiceDialog({ invoice, trigger }: MailInvoiceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSending, setIsSending] = useState(false);

  const form = useForm({
    resolver: zodResolver(mailSchema),
    defaultValues: {
      recipientEmail: "",
      subject: `Invoice ${invoice.invoice_number} from BillFlow`,
      message: `Please find attached invoice ${invoice.invoice_number} due on ${invoice.due_date}.`,
    },
  });

  const onSubmit = async (data: z.infer<typeof mailSchema>) => {
    setIsSending(true);
    try {
      // Use the updated mailInvoice function to send the email
      const success = await mailInvoice(
        invoice,
        data.recipientEmail,
        data.subject,
        data.message || ''
      );
      
      if (success) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error in sending email:", error);
      toast.error("Failed to send invoice");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        {trigger || <Button variant="ghost" size="sm">Mail</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] z-[100]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Send Invoice {invoice.invoice_number}</DialogTitle>
          <DialogDescription>
            Fill out the form below to email this invoice to your client.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="client@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mt-2 rounded-md bg-yellow-50 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You need to configure EmailJS with your own service ID, template ID, and public key in the invoiceActions.ts file.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={(e) => e.stopPropagation()}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSending} onClick={(e) => e.stopPropagation()}>
                {isSending ? "Sending..." : "Send Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
