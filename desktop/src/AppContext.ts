import React from 'react';

interface AppContext {
  onOpenWindow: (src: string) => void,
}

const AppContext = React.createContext<AppContext>({ onOpenWindow: (src: string) => undefined });

export default AppContext;
