import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';

import { View, Text, Spacer } from '../../components';
import MiniMap from './MiniMap';

import Window, { WindowProps } from '../window';

import { MenuBar } from '../../components/menu';
import { DigitalClock } from '../../components/clock';

import animationStyles from './Animation.module.scss';

type WindowPosition = {
  windowId: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

const windowPositionEventTarget = new EventTarget();

const DesktopContext = React.createContext<{
  onAddWindow: (window: React.ReactElement) => void;
  onSetBackground: (url: string) => void;
} | null>(null);

const Desktop = ({
  children,
  className,
}: {
  children: React.ReactElement<WindowProps> | React.ReactElement<WindowProps>[];
  className?: string;
}) => {
  console.log('Desktop()');

  const background = localStorage.getItem('background');

  const [backgroundUrl, setBackgroundUrl] = useState(background ? JSON.parse(background) : './images/653931.jpg');
  const [windows, setWindows] = useState(React.Children.toArray(children));
  const [windowOrder, setWindowOrder] = useState<number[]>(React.Children.map(windows, (_, index) => index));
  const [windowPositions, setWindowPositions] = useState<WindowPosition[]>(windows.map((child, index) => ({
    windowId: index, left: 0, top: 0, width: 0, height: 0,
  })));

  const desktopElementRef = useRef<HTMLElement>();

  const handleSetBackground = (url: string) => {
    setBackgroundUrl(url);
  };

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
    setWindowPositions((windowPositions) => {
      const newWindowPositions = windowPositions.map((position, index) => (
        windowId === position.windowId ? { ...position, left, top, width, height } : position
      ));

      return newWindowPositions;
    });
  }, []);

  const handleWindowTransientChange = useCallback(({ windowId, left, top, width, height }: WindowPosition) => {
    windowPositionEventTarget.dispatchEvent(new CustomEvent('windowpositionchange', {
      detail: {
        windowId, left, top, width, height,
      }
    }));
  }, []);

  const handleAddWindow = useCallback((window) => {
    setWindowOrder((windowOrder) => [...windowOrder, windowOrder.length]);
    setWindowPositions((windowPositions) => [...windowPositions, {
      windowId: windowOrder.length,
      left: 0, top: 0, width: 100, height: 100,
    }]);

    setWindows((windows) => [
      ...windows,
      React.cloneElement(window, {
        className: `${animationStyles.slideIn}`,
      }),
    ]);
  }, [windowOrder.length]);

  const desktopContextValue = useMemo(() => ({
    onAddWindow: handleAddWindow,
    onSetBackground: handleSetBackground,
  }), [handleAddWindow]);

  return (
    <View flex className={className} style={{ background: `center / cover url(${backgroundUrl})` }}>
      <DesktopContext.Provider value={desktopContextValue}>
        <View horizontal background="theme-content" alignItems="center" dropShadow>
          <MenuBar />
          <Spacer flex />
          <DigitalClock horizontalPadding="medium" />
        </View>
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
      </DesktopContext.Provider>
    </View>
  );
};

export default Desktop;

export {
  type WindowPosition,
  DesktopContext,
};
