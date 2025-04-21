import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  const Problem = () => {
    throw new Error('Test error');
  };

  it('renders child when no error', () => {
    render(
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI on error', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Problem />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We're having trouble displaying this content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
