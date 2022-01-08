import React, { useRef } from 'react';

import { View } from '../../components';

const Desktop = ({
  children
}: {
  children?: React.ReactElement | (React.ReactElement)[];
}) => {
  const windowElementRef = useRef<HTMLElement>();
  const firstMouseRef = useRef<{ clientX: number, clientY: number; }>();

  const handleWindowStartDrag = (windowElement: HTMLElement, firstMouse: { clientX: number, clientY: number; }) => {
    windowElementRef.current = windowElement;
    firstMouseRef.current = firstMouse;

    windowElement.style.willChange = 'left, top';
  };

  const handlePointerMove = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (windowElementRef.current && firstMouseRef.current) {
      // windowElementRef.current.style.left = `${event.nativeEvent.clientX - firstMouseRef.current.clientX}px`;
      // windowElementRef.current.style.top = `${event.nativeEvent.clientY - firstMouseRef.current.clientY}px`;
      windowElementRef.current.style.left = windowElementRef.current.offsetLeft + event.nativeEvent.movementX + 'px';
      windowElementRef.current.style.top = windowElementRef.current.offsetTop + event.nativeEvent.movementY + 'px';
    }
  };

  const handleWindowEndDrag = (windowElement: HTMLElement) => {
    if (windowElementRef.current) {
      windowElementRef.current.style.willChange = '';
    }

    windowElementRef.current = undefined;
  };

  return (
    <View flex style={{ position: 'relative', overflow: 'hidden' }} onPointerMove={handlePointerMove}>
      <View style={{ position: 'absolute', top: 0, right: -10000, bottom: -10000, left: 0 }}>
        {React.Children.map(children, (child) => (
          React.isValidElement(child) && React.cloneElement(child, {
            onWindowStartDrag: handleWindowStartDrag,
            onWindowEndDrag: handleWindowEndDrag,
          })
        ))}
      </View>
    </View>
  );
};

export default Desktop;
