import { render, screen } from '@testing-library/react';
import Hello from './Hello';

test('renders greeting with name', () => {
  render(<Hello name="Gaurav" />);
  const greetingElement = screen.getByText(/Hello, Gaurav!/i);
  expect(greetingElement).toBeInTheDocument();
});
