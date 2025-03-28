import { createContext, useContext, useState } from 'react';

export interface SidebarContextProps {
  state: boolean;
  setState: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  state: false,
  setState: () => {}
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(false);

  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};