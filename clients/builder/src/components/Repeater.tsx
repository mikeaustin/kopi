import React, { useContext, useState } from 'react';

import LayoutContext from '../LayoutContext';

interface RepeaterProps {
  for: string;
  in: string,
  children: React.ReactNode;
}

function Repeater({ 'for': _for, 'in': _in, children }: RepeaterProps) {
  const env = useContext(LayoutContext);

  return (
    <>
      {env[_in].map((item: any, index: number) => (
        <LayoutContext.Provider key={index} value={{ ...env, [_for]: item }}>
          {children}
        </LayoutContext.Provider>
      ))}
    </>
  );
}

export default Repeater;
