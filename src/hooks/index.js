import React from 'react';
import { AuthProvider } from './Auth';

const AppProvider = ({ children }) => (
  <>
    <AuthProvider>
      {children}
    </AuthProvider>
  </>
);

export default AppProvider;