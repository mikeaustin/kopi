import React from 'react';

interface ViewContext {
  isHorizontal: boolean,
}

const ViewContext = React.createContext<ViewContext>({ isHorizontal: false });

export default ViewContext;
