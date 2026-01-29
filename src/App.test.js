import { render, screen } from '@testing-library/react';
import App from './App';

test('renders inventory heading', () => {
  render(<App />);
  const heading = screen.getByText(/inventory/i);
  expect(heading).toBeInTheDocument();
});
