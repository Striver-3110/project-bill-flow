
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../utils/test-utils';
import { EditClientDialog } from '@/components/clients/EditClientDialog';
import { supabase } from '@/integrations/supabase/client';
import { mockClient } from '../../utils/test-utils';

const mockOnClientUpdated = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }
}));

describe('EditClientDialog', () => {
  it('renders edit button', () => {
    renderWithProviders(
      <EditClientDialog
        client={mockClient}
        onClientUpdated={mockOnClientUpdated}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows form with client data when edit is clicked', async () => {
    renderWithProviders(
      <EditClientDialog
        client={mockClient}
        onClientUpdated={mockOnClientUpdated}
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(screen.getByDisplayValue(mockClient.client_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockClient.contact_email)).toBeInTheDocument();
  });

  it('updates client when form is submitted', async () => {
    renderWithProviders(
      <EditClientDialog
        client={mockClient}
        onClientUpdated={mockOnClientUpdated}
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    const nameInput = screen.getByLabelText(/Client Name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Client Name');
    await userEvent.click(screen.getByText('Save Changes'));
    
    await waitFor(() => {
      expect(mockOnClientUpdated).toHaveBeenCalled();
    });
  });
});
