import React from 'react';

interface OpenWindowArgs {
  title: string,
  src: string,
  width?: number,
  height?: number;
}

interface AppContext {
  onOpenWindow: (src: string) => void,
  onOpenWindowEx: (args: OpenWindowArgs) => void,
}

const AppContext = React.createContext<AppContext>({
  onOpenWindow: (src: string) => undefined,
  onOpenWindowEx: (args: OpenWindowArgs) => undefined,
});

export default AppContext;
