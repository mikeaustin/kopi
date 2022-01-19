import React, { useRef, useEffect, useImperativeHandle } from 'react';

import View, { ViewProps } from '../view';
import Text from '../text';
import Divider from '../divider';

import styles from './Window.module.scss';

const Window = React.forwardRef(({
  children,
  title,
  style,
  onWindowStartDrag,
  onWindowEndDrag,
  ...props
}: {
  children?: Exclude<React.ReactNode, string>;
  title?: string;
  style?: React.CSSProperties;
  onWindowStartDrag?: any;
  onWindowEndDrag?: any;
} & ViewProps, ref) => {
  const windowElementRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => windowElementRef.current);

  useEffect(() => {
    if (windowElementRef.current) {
      windowElementRef.current.style.width = `${windowElementRef.current.offsetWidth}px`;
    }
  }, []);

  const handleWindowMouseDown = () => {
    if (windowElementRef.current) {
      const parentElement = windowElementRef.current?.parentElement;

      if (windowElementRef.current !== parentElement?.lastChild) {
        const windowElement = windowElementRef.current;

        setTimeout(() => {
          windowElementRef.current?.remove();
          parentElement?.appendChild(windowElement);
        });
      }
    }
  };

  const handleTitlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (windowElementRef.current) {
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
  };

  return (
    <View
      ref={windowElementRef}
      borderRadius="small"
      dropShadow
      className={styles.container}
      style={{ ...style, zIndex: 1 }}
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
      <View flex background="white" style={{ position: 'relative' }} {...props}>
        {children}
      </View>
    </View>
  );
});

export default Window;
