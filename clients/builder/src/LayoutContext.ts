import React from 'react';

const LayoutContext = React.createContext<{ [binding: string]: any; }>({});

export default LayoutContext;
