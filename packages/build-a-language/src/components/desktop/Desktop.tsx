import React, { useEffect, useRef, useCallback, useState } from 'react';

import { View } from '../../components';

import { WindowProps } from '../window';

type WindowPosition = {
  windowId: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

const windowPositionEventTarget = new EventTarget();

const MiniMap = ({
  windowPositions,
}: {
  windowPositions: WindowPosition[];
}) => {
  return (
    <View style={{ position: 'absolute', top: 10, right: 10, width: window.innerWidth / 10 }}>
      {windowPositions.map(({ left, top, width, height }, index) => (
        <View
          key={index}
          borderRadius="xsmall"
          style={{
            position: 'absolute',
            left: left / 10,
            top: top / 10,
            width: width / 10,
            height: height / 10,
            background: 'white',
            opacity: 0.5
          }}
        />
      ))}
    </View>
  );
};

const Desktop = ({
  children
}: {
  children: React.ReactElement<WindowProps> | React.ReactElement<WindowProps>[];
}) => {
  const [windows, setWindows] = useState(React.Children.toArray(children));
  const [windowOrder, setWindowOrder] = useState<number[]>(React.Children.map(windows, (_, index) => index));

  const desktopElementRef = useRef<HTMLElement>();
  const [windowPositions, setWindowPositions] = useState<WindowPosition[]>(windows.map((child, index) => ({
    windowId: index,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })));

  const handlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (event.target === desktopElementRef.current) {
      event.preventDefault();
    }
  };

  const handleWindowFocus = (windowId: number) => {
    setWindowOrder((windowOrder) => [...windowOrder.filter((id) => id !== windowId), windowId]);
  };

  const handleWindowPositionChange = useCallback(({
    windowId, left, top, width, height,
  }: {
    windowId: number; left: number; top: number; width: number; height: number;
  }) => {
    console.log('here', left, top, width);

    setWindowPositions((windowPositions) => windowPositions.map((position, index) => (
      windowId === index ? { ...position, left, top, width, height } : position
    )));

    windowPositionEventTarget.dispatchEvent(new CustomEvent('windowpositionchange', {
      detail: {
        windowId,
        left,
        top,
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
      <MiniMap windowPositions={windowPositions} />
      {React.Children.map(windows, (child, windowId) => (
        React.isValidElement(child) && React.cloneElement(child, {
          windowId: windowId,
          order: windowOrder.indexOf(windowId),
          onWindowFocus: handleWindowFocus,
          onWindowPositionChange: handleWindowPositionChange,
        })
      ))}
    </View>
  );
};

export default Desktop;

export {
  type WindowPosition,
};
