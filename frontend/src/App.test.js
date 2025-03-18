import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Todo Microservice App header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Todo Microservice App/i);
  expect(headerElement).toBeInTheDocument();
});
