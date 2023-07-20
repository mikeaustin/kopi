import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

import { View } from '..';
import { ViewProps } from '../view';

import styles from './Scroller.module.scss';

const Scroller = ({
  children,
  className,
  scrollX,
  scrollY,
  scrollSnapX,
  scrollSnapY,
  ...props
}: {
  children?: React.ReactElement | React.ReactElement[];
  scrollX?: boolean;
  scrollY?: boolean;
  scrollSnapX?: boolean;
  scrollSnapY?: boolean;
} & ViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.SyntheticEvent<any, UIEvent>) => {
    if (containerRef.current) {
      const ratio = event.currentTarget.clientHeight / event.currentTarget.scrollHeight;

      containerRef.current.style.setProperty('--top', event.currentTarget.scrollTop * ratio + 'px');
      containerRef.current.style.setProperty('--height', event.currentTarget.clientHeight * ratio + 'px');
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const ratio = containerRef.current.children[0].clientHeight / containerRef.current.children[0].scrollHeight;

      containerRef.current.style.setProperty('--top', containerRef.current.children[0].scrollTop * ratio + 'px');
      containerRef.current.style.setProperty('--height', containerRef.current.children[0].clientHeight * ratio + 'px');
    }
  }, []);

  const innerClassName = classNames(
    styles.inner,
    scrollX && styles.scrollX,
    scrollY && styles.scrollY,
    scrollSnapX && styles.scrollSnapX,
    scrollSnapY && styles.scrollSnapY,
    className,
  );

  return (
    <View ref={containerRef} className={styles.container}>
      <View className={innerClassName} onScroll={handleScroll} {...props}>
        {children}
      </View>
    </View>
  );
};

export default Scroller;
