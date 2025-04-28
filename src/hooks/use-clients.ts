
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

type SupabaseClient = {
  id: string;
  client_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  payment_terms: string | null;
  contract_start_date: string;
  contract_end_date: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const mapSupabaseClientToClient = (client: SupabaseClient): Client => {
  return {
    id: client.id,
    client_id: client.id,
    name: client.client_name,
    client_name: client.client_name,
    email: client.contact_email,
    contact_email: client.contact_email,
    phone: client.contact_phone || "",
    contact_phone: client.contact_phone || "",
    address: client.address || "",
    city: "",
    state: "",
    zip: "",
    contact_person: client.contact_person,
    contract_start_date: client.contract_start_date,
    contract_end_date: client.contract_end_date || "",
    payment_terms: client.payment_terms || "",
    status: client.status || "active",
    created_at: client.created_at || "",
    updated_at: client.updated_at || ""
  };
};

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(mapSupabaseClientToClient);
    }
  });
}
