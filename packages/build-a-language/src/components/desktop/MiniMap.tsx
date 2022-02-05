import React, { useEffect, useRef, useCallback, useState } from 'react';

import { View } from '../../components';

import { type WindowPosition } from './Desktop';

const scaleFactor = window.innerWidth / 10 + 200;

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
      (containerRef.current.children[windowId] as HTMLElement).style.left = left / window.innerWidth * 200 + 'px';
      (containerRef.current.children[windowId] as HTMLElement).style.top = top / window.innerWidth * 200 + 'px';
    }
  };

  useEffect(() => {
    windowPositionEventTarget.addEventListener('windowpositionchange', handleWindowChange);
  }, [windowPositionEventTarget]);

  return (
    <View ref={containerRef} style={{ position: 'absolute', top: 15, right: 15, width: 200, height: window.innerHeight / window.innerWidth * 200, overflow: 'hidden' }}>
      {windowPositions.map(({ left, top, width, height }, index) => (
        <View
          key={index}
          borderRadius="tiny"
          style={{
            position: 'absolute',
            left: left / window.innerWidth * 200,
            top: top / window.innerWidth * 200,
            width: width / window.innerWidth * 200,
            height: height / window.innerWidth * 200,
            background: 'white',
            opacity: 0.5
          }}
        />
      ))}
    </View>
  );
};

export default MiniMap;
