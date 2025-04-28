
import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(ui: ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export const mockClient = {
  id: "123",
  client_id: "123",
  name: "Test Client",
  client_name: "Test Client",
  email: "test@example.com",
  contact_email: "test@example.com",
  phone: "1234567890",
  contact_phone: "1234567890",
  address: "123 Test St",
  city: "Test City",
  state: "TS",
  zip: "12345",
  contact_person: "John Doe",
  contract_start_date: "2024-01-01",
  contract_end_date: "2024-12-31",
  payment_terms: "Net 30",
  status: "active",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z"
};
