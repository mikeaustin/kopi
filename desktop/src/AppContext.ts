import React from 'react';

interface OpenWindowArgs {
  title: string,
  src: string,
  width?: number,
  height?: number;
}

interface AppContext {
  onOpenWindow: (args: OpenWindowArgs) => void,
}

const AppContext = React.createContext<AppContext>({
  onOpenWindow: (args: OpenWindowArgs) => undefined,
});

export default AppContext;
