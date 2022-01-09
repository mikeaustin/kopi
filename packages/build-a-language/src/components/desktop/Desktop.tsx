import React, { useEffect, useRef } from 'react';

import { View } from '../../components';

const Desktop = ({
  children
}: {
  children?: React.ReactElement | (React.ReactElement)[];
}) => {
  const desktopElementRef = useRef<HTMLElement>();
  const windowElementRef = useRef<HTMLElement>();
  const firstMouseRef = useRef<{ clientX: number, clientY: number; }>();

  useEffect(() => {
    document.addEventListener('pointerup', () => {
      windowElementRef.current = undefined;
    });
  }, []);

  const handleWindowStartDrag = (windowElement: HTMLElement, firstMouse: { clientX: number, clientY: number; }) => {
    windowElementRef.current = windowElement;
    firstMouseRef.current = firstMouse;

    windowElement.style.willChange = 'left, top';
  };

  const handlePointerMove = (event: React.SyntheticEvent<any, PointerEvent>) => {
    if (desktopElementRef.current && windowElementRef.current && firstMouseRef.current) {
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
      style={{ position: 'relative', overflow: 'hidden' }}
      onPointerMove={handlePointerMove}
    >
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
