import React, { useEffect, useRef, useState } from 'react';

import { View } from '../../components';

import { WindowProps } from '../window';

const Desktop = ({
  children
}: {
  children: React.ReactElement<WindowProps> | React.ReactElement<WindowProps>[];
}) => {
  const desktopElementRef = useRef<HTMLElement>();
  const windowElementRef = useRef<HTMLElement>();
  const firstMouseRef = useRef<{ clientX: number, clientY: number; }>();

  const [windows, setWindows] = useState(children);
  const [windowOrder, setWindowOrder] = useState<number[]>(React.Children.map(windows, (_, index) => index));

  useEffect(() => {
    document.addEventListener('pointerup', () => {
      windowElementRef.current = undefined;
    });
  }, []);

  const handlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (event.target === desktopElementRef.current) {
      event.preventDefault();
    }
  };

  const handleWindowFocus = (windowId: number) => {
    setWindowOrder((windowOrder) => [...windowOrder.filter((id) => id !== windowId), windowId]);
  };

  const handleWindowStartDrag = (windowElement: HTMLElement, firstMouse: { clientX: number, clientY: number; }) => {
    windowElementRef.current = windowElement;
    firstMouseRef.current = firstMouse;

    windowElement.style.willChange = 'left, top';
  };

  const handlePointerMove = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (desktopElementRef.current && windowElementRef.current && firstMouseRef.current) {
      event.preventDefault();

      const boundingClientRect = desktopElementRef.current.getBoundingClientRect();

      windowElementRef.current.style.left = `${event.nativeEvent.pageX - firstMouseRef.current.clientX - boundingClientRect.left}px`;
      windowElementRef.current.style.top = `${event.nativeEvent.pageY - firstMouseRef.current.clientY - boundingClientRect.top}px`;
    }
  };

  const handleWindowEndDrag = (windowElement: HTMLElement) => {
    if (windowElementRef.current) {
      windowElementRef.current.style.willChange = '';
    }

    windowElementRef.current = undefined;
  };

  return (
    <View
      ref={desktopElementRef}
      flex
      style={{ position: 'relative' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {React.Children.map(windows, (child, windowId) => (
        React.isValidElement(child) && React.cloneElement(child, {
          windowId: windowId,
          order: windowOrder.indexOf(windowId),
          onWindowFocus: handleWindowFocus,
          onWindowStartDrag: handleWindowStartDrag,
          onWindowEndDrag: handleWindowEndDrag,
        })
      ))}
    </View>
  );
};

export default Desktop;
