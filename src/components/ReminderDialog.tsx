
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bell } from "lucide-react";
import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/utils/invoiceUtils";

interface ReminderDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  invoice: Invoice | null;
  clientName: string;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({ 
  open, 
  setOpen, 
  invoice, 
  clientName 
}) => {
  const [reminderMessage, setReminderMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  // Pre-populated reminder message based on invoice details
  React.useEffect(() => {
    if (invoice) {
      const invoiceNumber = invoice.invoice_number || 'N/A';
      const invoiceTotal = formatCurrency(invoice.total_amount, invoice.currency || 'USD');
      
      const defaultMessage = `Dear ${clientName},

We hope this message finds you well. This is a friendly reminder that invoice ${invoiceNumber}, issued on ${formatDate(invoice.invoice_date)} for ${invoiceTotal}, is currently past due.

The payment was due on ${formatDate(invoice.due_date)}. We would appreciate it if you could settle this invoice at your earliest convenience.

If you have any questions or need assistance, please don't hesitate to contact us.

Thank you for your prompt attention to this matter.

Best regards,
BillFlow Team`;

      setReminderMessage(defaultMessage);
    }
  }, [invoice, clientName]);

  const handleSendReminder = async () => {
    if (!invoice) return;
    
    setSending(true);
    
    // Simulate sending a reminder
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSending(false);
    setOpen(false);
    
    // Show success notification (would use a toast in real implementation)
    alert("Reminder sent successfully!");
  };

  if (!invoice) return null;

  const invoiceNumber = invoice.invoice_number || 'N/A';
  const invoiceCurrency = invoice.currency || 'USD';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-billflow-blue-600" />
            Send Payment Reminder
          </DialogTitle>
          <DialogDescription>
            Send a reminder email to {clientName} for invoice {invoiceNumber}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between py-2 px-3 bg-billflow-gray-50 rounded-md text-sm">
              <span className="text-billflow-gray-600">Invoice</span>
              <span className="font-medium">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-billflow-gray-50 rounded-md text-sm">
              <span className="text-billflow-gray-600">Due Date</span>
              <span className="font-medium">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-billflow-gray-50 rounded-md text-sm">
              <span className="text-billflow-gray-600">Amount</span>
              <span className="font-medium">{formatCurrency(invoice.total_amount, invoiceCurrency)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-billflow-gray-700 mb-1">
              Message
            </label>
            <Textarea 
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReminder}
            disabled={sending} 
            className="bg-billflow-blue-600 hover:bg-billflow-blue-700"
          >
            {sending ? "Sending..." : "Send Reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
