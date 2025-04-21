import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Disable all console output and alerts
console.log = () => {};
console.warn = () => {};
console.error = () => {};
window.alert = () => {};

// Removed Sentry integration; will use alternate monitoring service later

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
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>
);
