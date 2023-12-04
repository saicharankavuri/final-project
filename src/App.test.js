// App.test.js
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders App component with a sign-in link when the user is not authenticated', async () => {
  render(<App />);

  // Check if the sign-in link is rendered
  expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
});

test('renders Home component when the user is authenticated', async () => {
  // Mock user data
  const mockUser = { id: 1, username: 'testuser' };
  localStorage.setItem('user', JSON.stringify(mockUser));

  render(<App />);

  // Check if the Home component is rendered
  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
