
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";

const clientSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  contract_start_date: z.string().min(1, "Start date is required"),
  contract_end_date: z.string().optional(),
  payment_terms: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_name: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      contract_start_date: new Date().toISOString().split('T')[0],
      payment_terms: "",
    },
  });

  const onSubmit = async (data: ClientFormValues) => {
    try {
      // Create a new object with required fields to satisfy TypeScript
      const clientData = {
        client_name: data.client_name,
        contact_person: data.contact_person,
        contact_email: data.contact_email,
        contract_start_date: data.contract_start_date,
        // Optional fields
        contact_phone: data.contact_phone || null,
        address: data.address || null,
        contract_end_date: data.contract_end_date || null,
        payment_terms: data.payment_terms || null,
        status: 'active'
      };

      const { error } = await supabase
        .from('clients')
        .insert(clientData);

      if (error) throw error;

      toast.success("Client added successfully");
      setOpen(false);
      form.reset();
      
      // Invalidate and refetch clients query to update the list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch (error) {
      toast.error("Failed to add client");
      console.error("Error adding client:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-billflow-blue-600 hover:bg-billflow-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contract_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contract_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Client</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
