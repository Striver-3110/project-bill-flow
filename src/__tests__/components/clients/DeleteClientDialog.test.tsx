
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../utils/test-utils';
import { DeleteClientDialog } from '@/components/clients/DeleteClientDialog';
import { supabase } from '@/integrations/supabase/client';

const mockOnClientDeleted = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }
}));

describe('DeleteClientDialog', () => {
  it('renders delete button', () => {
    renderWithProviders(
      <DeleteClientDialog
        clientId="123"
        clientName="Test Client"
        onClientDeleted={mockOnClientDeleted}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete is clicked', async () => {
    renderWithProviders(
      <DeleteClientDialog
        clientId="123"
        clientName="Test Client"
        onClientDeleted={mockOnClientDeleted}
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
  });

  it('calls delete function when confirmed', async () => {
    renderWithProviders(
      <DeleteClientDialog
        clientId="123"
        clientName="Test Client"
        onClientDeleted={mockOnClientDeleted}
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(mockOnClientDeleted).toHaveBeenCalled();
    });
  });
});
