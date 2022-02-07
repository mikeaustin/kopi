import React, { useRef, useState, useEffect } from 'react';

import { View, Text, Button, Spacer, Divider, List, Clickable } from '..';

import { ViewProps } from '../view';

import styles from './Scroller.module.scss';

const Scroller = ({
  children,
  ...props
}: {
  children?: React.ReactElement | React.ReactElement[];
} & ViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.SyntheticEvent<any, UIEvent>) => {
    if (containerRef.current) {
      const ratio = event.currentTarget.clientHeight / event.currentTarget.scrollHeight;

      containerRef.current.style.setProperty('--top', event.currentTarget.scrollTop * ratio + 'px');
      containerRef.current.style.setProperty('--height', event.currentTarget.clientHeight * ratio + 'px');
    }
  };

  return (
    <View ref={containerRef} className={styles.container}>
      <View className={styles.inner} onScroll={handleScroll} {...props}>
        {children}
      </View>
    </View>
  );
};

export default Scroller;
