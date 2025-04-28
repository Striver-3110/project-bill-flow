
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../utils/test-utils';
import Clients from '@/pages/Clients';
import { supabase } from '@/integrations/supabase/client';
import { mockClient } from '../utils/test-utils';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [mockClient],
          error: null
        }))
      }))
    }))
  }
}));

describe('Clients Page', () => {
  it('renders the clients page title', () => {
    renderWithProviders(<Clients />);
    expect(screen.getByText('Clients')).toBeInTheDocument();
  });

  it('displays client data when loaded', async () => {
    renderWithProviders(<Clients />);
    await waitFor(() => {
      expect(screen.getByText(mockClient.name)).toBeInTheDocument();
    });
  });

  it('filters clients based on search input', async () => {
    renderWithProviders(<Clients />);
    const searchInput = screen.getByPlaceholderText('Search clients...');
    await userEvent.type(searchInput, 'Test Client');
    
    await waitFor(() => {
      expect(screen.getByText(mockClient.name)).toBeInTheDocument();
    });
  });
});
