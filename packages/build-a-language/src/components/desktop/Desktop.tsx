import React, { useEffect, useRef, useCallback, useState } from 'react';

import { View } from '../../components';
import MiniMap from './MiniMap';

import { WindowProps } from '../window';

type WindowPosition = {
  windowId: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

const windowPositionEventTarget = new EventTarget();

const Desktop = ({
  children
}: {
  children: React.ReactElement<WindowProps> | React.ReactElement<WindowProps>[];
}) => {
  console.log('Desktop()');

  const [windows, setWindows] = useState(React.Children.toArray(children));
  const [windowOrder, setWindowOrder] = useState<number[]>(React.Children.map(windows, (_, index) => index));

  const desktopElementRef = useRef<HTMLElement>();
  const [windowPositions, setWindowPositions] = useState<WindowPosition[]>(windows.map((child, index) => ({
    windowId: index, left: 0, top: 0, width: 0, height: 0,
  })));

  const handlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (event.target === desktopElementRef.current) {
      event.preventDefault();
    }
  };

  const handleWindowFocus = (windowId: number) => {
    setWindowOrder((windowOrder) => windowOrder[windowOrder.length - 1] !== windowId
      ? [...windowOrder.filter((id) => id !== windowId), windowId]
      : windowOrder);
  };

  const handleWindowChange = useCallback(({
    windowId, left, top, width, height,
  }: WindowPosition) => {
    console.log(windowId, left);
    setWindowPositions((windowPositions) => {
      const newWindowPositions = windowPositions.map((position, index) => (
        windowId === position.windowId ? { ...position, left, top, width, height } : position
      ));

      console.log(newWindowPositions);

      return newWindowPositions;
    });

    // windowPositionEventTarget.dispatchEvent(new CustomEvent('windowpositionchange', {
    //   detail: {
    //     windowId, left, top, width, height,
    //   }
    // }));
  }, []);

  const handleWindowTransientChange = useCallback(({ windowId, left, top, width, height }: WindowPosition) => {
    windowPositionEventTarget.dispatchEvent(new CustomEvent('windowpositionchange', {
      detail: {
        windowId, left, top, width, height,
      }
    }));
  }, []);

  return (
    <View
      ref={desktopElementRef}
      flex
      style={{ position: 'relative' }}
      onPointerDown={handlePointerDown}
    >
      <MiniMap windowPositions={windowPositions} windowPositionEventTarget={windowPositionEventTarget} />
      {React.Children.map(windows, (child, windowId) => (
        React.isValidElement(child) && React.cloneElement(child, {
          windowId: windowId,
          order: windowOrder.indexOf(windowId),
          onWindowFocus: handleWindowFocus,
          onWindowChange: handleWindowChange,
          onWindowTransientChange: handleWindowTransientChange,
        })
      ))}
    </View>
  );
};

export default Desktop;

export {
  type WindowPosition,
};
