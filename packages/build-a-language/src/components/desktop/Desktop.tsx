import React, { useEffect, useRef, useState } from 'react';

import { View } from '../../components';

import { WindowProps } from '../window';

const Desktop = ({
  children
}: {
  children: React.ReactElement<WindowProps> | React.ReactElement<WindowProps>[];
}) => {
  const desktopElementRef = useRef<HTMLElement>();

  const [windows, setWindows] = useState(children);
  const [windowOrder, setWindowOrder] = useState<number[]>(React.Children.map(windows, (_, index) => index));

  const handlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (event.target === desktopElementRef.current) {
      event.preventDefault();
    }
  };

  const handleWindowFocus = (windowId: number) => {
    setWindowOrder((windowOrder) => [...windowOrder.filter((id) => id !== windowId), windowId]);
  };

  return (
    <View
      ref={desktopElementRef}
      flex
      style={{ position: 'relative' }}
      onPointerDown={handlePointerDown}
    >
      {React.Children.map(windows, (child, windowId) => (
        React.isValidElement(child) && React.cloneElement(child, {
          windowId: windowId,
          order: windowOrder.indexOf(windowId),
          onWindowFocus: handleWindowFocus,
        })
      ))}
    </View>
  );
};

export default Desktop;
