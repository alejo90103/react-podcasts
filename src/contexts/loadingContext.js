import React, { createContext, useState, useMemo } from 'react';

export const LoadingContext = createContext();

export default function LoadingContextProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const value = useMemo(() => ({
    loading,
    setLoading
  }), [loading, setLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}