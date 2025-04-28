
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = "https://rmrxuhdaoichbxuqgmvw.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function generateInvoicesForAllClients() {
  const { data: settings } = await supabase
    .from('invoice_automation_settings')
    .select('*')
    .single();

  if (!settings?.enabled) {
    console.log('Automated invoice generation is disabled');
    return;
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('*');

  if (!clients) return;

  for (const client of clients) {
    try {
      // Generate invoice PDF using existing utility
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      
      const { data: invoice } = await supabase
        .from('invoices')
        .insert({
          client_id: client.id,
          invoice_number: invoiceNumber,
          invoice_date: now.toISOString(),
          due_date: new Date(now.setDate(now.getDate() + 30)).toISOString(),
          status: 'pending',
          total_amount: 0, // This will be updated based on actual calculations
          billing_period_start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          billing_period_end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
        })
        .select()
        .single();

      if (invoice) {
        await supabase
          .from('invoice_approvals')
          .insert({
            invoice_id: invoice.invoice_id,
            status: 'pending'
          });

        // Send notification email to admin
        await resend.emails.send({
          from: "Invoicing System <onboarding@resend.dev>",
          to: settings.admin_email,
          subject: `New Invoice Generated - ${invoiceNumber}`,
          html: `
            <h1>New Invoice Generated</h1>
            <p>A new invoice has been generated for ${client.client_name}.</p>
            <p>Invoice Number: ${invoiceNumber}</p>
            <p>Please review and approve the invoice in the admin dashboard.</p>
          `,
        });
      }
    } catch (error) {
      console.error(`Error generating invoice for client ${client.client_name}:`, error);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await generateInvoicesForAllClients();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in generate-monthly-invoices:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
