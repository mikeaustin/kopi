import React, { useRef } from 'react';

import View, { ViewProps } from '../view';
import Text from '../text';
import Divider from '../divider';

import styles from './Window.module.scss';

const Window = ({
  children,
  style,
  onWindowStartDrag,
  onWindowEndDrag,
  ...props
}: {
  children?: undefined | false | React.ReactElement | (undefined | false | React.ReactElement)[];
  style?: React.CSSProperties;
  onWindowStartDrag?: any;
  onWindowEndDrag?: any;
} & ViewProps) => {
  const windowRef = useRef<HTMLElement>();

  const handleTitlePointerDown = (event: React.SyntheticEvent<any, PointerEvent>) => {
    event.preventDefault();

    if (windowRef.current) {
      const boundingClientRect = windowRef.current.getBoundingClientRect();

      onWindowStartDrag(windowRef.current, {
        clientX: event.nativeEvent.clientX - boundingClientRect.left,
        clientY: event.nativeEvent.clientY - boundingClientRect.top,
      });
    }
  };

  const handleTitlePointerUp = (event: React.SyntheticEvent<any, PointerEvent>) => {
    event.preventDefault();

    onWindowEndDrag(windowRef.current);
  };

  return (
    <View ref={windowRef} borderRadius="small" className={styles.container} style={style}>
      <View
        padding="small"
        alignItems="center"
        background="gray-2"
        style={{ cursor: 'default' }}
        onPointerDown={handleTitlePointerDown}
        onPointerUp={handleTitlePointerUp}
      >
        <Text fontWeight="bold">Examples</Text>
      </View>
      <Divider />
      <View background="white" {...props}>
        {children}
      </View>
    </View>
  );
};

export default Window;
