// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders inventory heading', () => {
//   render(<App />);
//   const heading = screen.getByText(/inventory/i);
//   expect(heading).toBeInTheDocument();
// });
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  expect(screen.getByText(/learn react/i)).toBeInTheDocument();
});

