import React, { useRef, useEffect } from 'react';

import View, { ViewProps } from '../view';
import Text from '../text';
import Divider from '../divider';

import styles from './Window.module.scss';

const Window = ({
  children,
  title,
  style,
  onWindowStartDrag,
  onWindowEndDrag,
  ...props
}: {
  // children?: undefined | false | React.ReactElement | (undefined | false | React.ReactElement)[];
  children?: Exclude<React.ReactNode, string>;
  title?: string;
  style?: React.CSSProperties;
  onWindowStartDrag?: any;
  onWindowEndDrag?: any;
} & ViewProps) => {
  const windowElementRef = useRef<HTMLElement>();

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
    event.preventDefault();

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
      className={styles.container}
      style={{ ...style, zIndex: 1 }}
      onMouseDown={handleWindowMouseDown}
    >
      <View
        padding="small"
        alignItems="center"
        background="gray-3"
        style={{ cursor: 'default' }}
        onPointerDown={handleTitlePointerDown}
        onPointerUp={handleTitlePointerUp}
      >
        <Text fontWeight="bold">{title}</Text>
      </View>
      <Divider color="gray-4" />
      <View flex background="white" style={{ position: 'relative' }} {...props}>
        {children}
      </View>
    </View>
  );
};

export default Window;
