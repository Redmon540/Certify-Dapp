import React from 'react';
import { Layout } from './ui/layout/layout';
import AppContextProvider from './context_providers/app_context';
import AlertsListProvider from './context_providers/alert_context';

function App() {
  return (
    <AppContextProvider>
      <AlertsListProvider>
        <Layout />
      </AlertsListProvider>
    </AppContextProvider>

  );
}

export default App;
