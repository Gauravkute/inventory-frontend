// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders inventory heading', () => {
//   render(<App />);
//   const heading = screen.getByText(/inventory/i);
//   expect(heading).toBeInTheDocument();
// });
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react text', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


