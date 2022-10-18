import React from 'react';

const AppContext = React.createContext<{
  onDrop: (data: string, index: number) => void,
}>({ onDrop: () => undefined });

export default AppContext;
