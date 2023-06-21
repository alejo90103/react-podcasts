import React, { createContext, useState, useMemo, ReactNode } from 'react';

type LoadingContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

type LoadingContextProviderProps = {
  children: ReactNode;
};

const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({ children }) => {
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
};

export default LoadingContextProvider;