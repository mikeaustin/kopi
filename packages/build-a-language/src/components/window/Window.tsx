import React, { useRef, useMemo, useEffect, useCallback, useImperativeHandle } from 'react';

import View, { ViewProps } from '../view';
import Text from '../text';
import Divider from '../divider';

import { type WindowPosition } from '../desktop';

import styles from './Window.module.scss';
import textStyles from '../text/Text.module.scss';

const WindowContext = React.createContext<{ onWindowFocus: (() => void); } | null>(null);

type WindowProps = {
  children?: Exclude<React.ReactNode, string>;
  title?: string;
  style?: React.CSSProperties;
  order?: number;
  windowId?: number;
  onWindowFocus?: any;
  onWindowPositionChange?: ({ windowId, left, top, width, height }: WindowPosition) => void;
} & ViewProps;

const Window = React.forwardRef(({
  children,
  title,
  style,
  order,
  windowId,
  onWindowFocus,
  onWindowPositionChange,
  ...props
}: WindowProps, ref) => {
  const windowElementRef = useRef<HTMLElement>();
  const contentElementRef = useRef<HTMLElement>();
  const firstMouseRef = useRef<{ clientX: number, clientY: number; }>();

  useImperativeHandle(ref, () => windowElementRef.current);

  const handleWindowPointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    handleWindowFocus();
  };

  const handleWindowFocus = useCallback(() => {
    onWindowFocus(windowId);
  }, [windowId, onWindowFocus]);

  const handleTitlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (windowElementRef.current && windowElementRef.current.parentElement && contentElementRef.current) {
      windowElementRef.current.style.willChange = 'left, top';
      contentElementRef.current.style.pointerEvents = 'none';

      event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);

      const boundingClientRect = windowElementRef.current.getBoundingClientRect();
      const desktopBoundingClientRect = windowElementRef.current.parentElement.getBoundingClientRect();

      firstMouseRef.current = {
        clientX: event.nativeEvent.clientX - boundingClientRect.left,
        clientY: event.nativeEvent.clientY - boundingClientRect.top + desktopBoundingClientRect.top,
      };
    }
  };

  const handleTitlePointerMove = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (windowElementRef.current && firstMouseRef.current) {
      windowElementRef.current.style.left = `${event.nativeEvent.clientX - firstMouseRef.current.clientX}px`;
      windowElementRef.current.style.top = `${event.nativeEvent.clientY - firstMouseRef.current.clientY}px`;
    }
  };

  const handleTitlePointerUp = (event: React.SyntheticEvent<any, PointerEvent>) => {
    event.preventDefault();

    if (windowElementRef.current) {
      windowElementRef.current.style.willChange = '';
    }

    firstMouseRef.current = undefined;

    if (contentElementRef.current) {
      contentElementRef.current.style.pointerEvents = '';
    }

    if (windowId !== undefined && windowElementRef.current && onWindowPositionChange) {
      onWindowPositionChange({
        windowId,
        left: windowElementRef.current.offsetLeft,
        top: windowElementRef.current.offsetTop,
        width: windowElementRef.current.offsetWidth,
        height: windowElementRef.current.offsetHeight,
      });
    }
  };

  const handleContentPointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if ((event.target as HTMLElement).classList.contains(textStyles.container)) {
      event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    }
  };

  const windowContextValue = useMemo(() => ({
    onWindowFocus: handleWindowFocus,
  }), [handleWindowFocus]);

  useEffect(() => {
    if (windowElementRef.current) {
      windowElementRef.current.style.width = `${windowElementRef.current.offsetWidth}px`;
      // windowElementRef.current.style.height = `${windowElementRef.current.offsetHeight}px`;

      if (windowId !== undefined && onWindowPositionChange) {
        onWindowPositionChange({
          windowId,
          left: windowElementRef.current.offsetLeft,
          top: windowElementRef.current.offsetTop,
          width: windowElementRef.current.offsetWidth,
          height: windowElementRef.current.offsetHeight,
        });
      }
    }
  }, [windowId, onWindowPositionChange]);

  return (
    <View
      ref={windowElementRef}
      borderRadius="small"
      dropShadow
      className={styles.container}
      style={{ ...style, zIndex: order }}
      onPointerDown={handleWindowPointerDown}
    >
      <View
        padding="small"
        alignItems="center"
        background="gray-3"
        style={{ marginBottom: -1, touchAction: 'none' }}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
      >
        <Text fontWeight="bold" noSelect style={{ pointerEvents: 'none' }}>{title}</Text>
      </View>
      <Divider color="gray-4" />
      <View
        ref={contentElementRef}
        flex
        background="white"
        style={{ position: 'relative', minHeight: 0 }}
        onPointerDown={handleContentPointerDown}
        {...props}
      >
        <WindowContext.Provider value={windowContextValue}>
          {children}
        </WindowContext.Provider>
      </View>
    </View>
  );
});

export default Window;

export {
  type WindowProps,
  WindowContext,
};
