import React from 'react';

interface OpenWindowArgs {
  title: string,
  src: string,
  width?: number,
  height?: number;
}

interface AppContext {
  onOpenWindow: (args: OpenWindowArgs) => void,
  onCloseWindow: (id: string) => void,
}

const AppContext = React.createContext<AppContext>({
  onOpenWindow: (args: OpenWindowArgs) => undefined,
  onCloseWindow: (id: string) => undefined,
});

export default AppContext;
