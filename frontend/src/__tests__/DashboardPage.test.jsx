import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

import { vi } from 'vitest';

// Mock the Recharts components to prevent SVG errors in jsdom
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container">{children}</div>,
    AreaChart: () => <div data-testid="area-chart" />,
    PieChart: () => <div data-testid="pie-chart" />
  };
});

describe('DashboardPage Component', () => {
  it('renders loading state initially', () => {
    // We mock localStorage since the component reads from it
    Storage.prototype.getItem = vi.fn(() => null);
    
    render(
      <BrowserRouter>
        <DashboardPage user={{ id: '123' }} accessToken="mock_token" onSessionExpired={vi.fn()} onLogout={vi.fn()} />
      </BrowserRouter>
    );
    
    // Check if some text indicative of the dashboard is present
    expect(screen.getAllByText(/DevPulse/i)[0]).toBeInTheDocument();
  });
});
