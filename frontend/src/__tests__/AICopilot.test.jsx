import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AICopilot from '../components/AICopilot';

describe('AICopilot Component', () => {
  it('renders the floating action button initially', () => {
    render(<AICopilot contextData={{}} />);
    
    // Find the button
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument();
  });

  it('opens the chat panel when clicked', () => {
    render(<AICopilot contextData={{}} />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    
    // The panel should open and display the AI Copilot title
    expect(screen.getByText('AI Copilot')).toBeInTheDocument();
  });
});
