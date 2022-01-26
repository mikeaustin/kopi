import React, { useRef, useEffect, useImperativeHandle } from 'react';

import View, { ViewProps } from '../view';
import Text from '../text';
import Divider from '../divider';

import styles from './Window.module.scss';

const WindowContext = React.createContext<(() => void) | null>(null);

type WindowProps = {
  children?: Exclude<React.ReactNode, string>;
  title?: string;
  style?: React.CSSProperties;
  order?: number;
  windowId?: number;
  onWindowFocus?: any;
  onWindowStartDrag?: any;
  onWindowEndDrag?: any;
} & ViewProps;

const Window = React.forwardRef(({
  children,
  title,
  style,
  order,
  windowId,
  onWindowFocus,
  onWindowStartDrag,
  onWindowEndDrag,
  ...props
}: WindowProps, ref) => {
  const windowElementRef = useRef<HTMLElement>();
  const contentElementRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => windowElementRef.current);

  useEffect(() => {
    if (windowElementRef.current) {
      windowElementRef.current.style.width = `${windowElementRef.current.offsetWidth}px`;
      // windowElementRef.current.style.height = `${windowElementRef.current.offsetHeight}px`;
    }
  }, []);

  const handleWindowMouseDown = () => {
    onWindowFocus(windowId);
  };

  const handleTitlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (windowElementRef.current && contentElementRef.current) {
      contentElementRef.current.style.pointerEvents = 'none';

      const boundingClientRect = windowElementRef.current.getBoundingClientRect();

      onWindowStartDrag(windowElementRef.current, {
        clientX: event.nativeEvent.pageX - boundingClientRect.left,
        clientY: event.nativeEvent.pageY - boundingClientRect.top,
      });
    }
  };

  const handleTitlePointerUp = (event: React.SyntheticEvent<any, PointerEvent>) => {
    event.preventDefault();

    onWindowEndDrag(windowElementRef.current);

    if (contentElementRef.current) {
      contentElementRef.current.style.pointerEvents = '';
    }
  };

  return (
    <View
      ref={windowElementRef}
      borderRadius="small"
      dropShadow
      className={styles.container}
      style={{ ...style, zIndex: order }}
      onMouseDown={handleWindowMouseDown}
    >
      <View
        padding="small"
        alignItems="center"
        background="gray-3"
        style={{ marginBottom: -1 }}
        onPointerDown={handleTitlePointerDown}
        onPointerUp={handleTitlePointerUp}
      >
        <Text fontWeight="bold" noSelect>{title}</Text>
      </View>
      <Divider color="gray-4" />
      <View ref={contentElementRef} flex background="white" style={{ position: 'relative' }} {...props}>
        <WindowContext.Provider value={handleWindowMouseDown}>
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
