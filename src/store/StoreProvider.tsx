import React, { createContext, useContext } from 'react';
import { rootStore } from './rootStore';

const StoreContext = createContext(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
