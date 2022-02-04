import React, { useEffect, useRef, useCallback, useState } from 'react';

import { View } from '../../components';

import { type WindowPosition } from './Desktop';

const MiniMap = ({
  windowPositions,
  windowPositionEventTarget,
}: {
  windowPositions: WindowPosition[];
  windowPositionEventTarget: any;
}) => {
  console.log('MiniMap()');

  const containerRef = useRef<HTMLElement>();

  const handleWindowChange = ({ detail: { windowId, left, top } }: { detail: WindowPosition; }) => {
    if (containerRef.current) {
      (containerRef.current.children[windowId] as HTMLElement).style.left = left / 10 + 'px';
      (containerRef.current.children[windowId] as HTMLElement).style.top = top / 10 + 'px';
    }
  };

  useEffect(() => {
    windowPositionEventTarget.addEventListener('windowpositionchange', handleWindowChange);
  }, [windowPositionEventTarget]);

  return (
    <View ref={containerRef} style={{ position: 'absolute', top: 15, right: 15, width: window.innerWidth / 10, height: window.innerHeight / 10, overflow: 'hidden' }}>
      {windowPositions.map(({ left, top, width, height }, index) => (
        <View
          key={index}
          borderRadius="tiny"
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

export default MiniMap;
