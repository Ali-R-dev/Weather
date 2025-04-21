import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Disable all console output and alerts
console.log = () => {};
console.warn = () => {};
console.error = () => {};
window.alert = () => {};

// Make sure the root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure there is an element with id 'root' in your HTML."
  );
}

const queryClient = new QueryClient();
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
