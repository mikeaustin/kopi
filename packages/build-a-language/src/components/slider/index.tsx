import React, { useRef, useImperativeHandle } from 'react';

import { View } from '..';

import styles from './styles.module.scss';

type SliderProps = {
  flex?: boolean;
  value?: number;
} & React.HtmlHTMLAttributes<HTMLInputElement>;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({
  flex,
  value,
  ...props
}: SliderProps, ref) => {
  const sliderElementRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => sliderElementRef.current as HTMLInputElement);

  if (sliderElementRef.current) {
    const value = Number(sliderElementRef.current.value);
    const max = Number(sliderElementRef.current.max);

    sliderElementRef.current.style.setProperty(
      '--width',
      (value / max) * 100 + '%'
    );
  }

  return (
    <input
      ref={sliderElementRef}
      type="range"
      step="0.1"
      min={0}
      max={100}
      style={{ flex: flex ? 1 : undefined }}
      className={styles.container}
      value={value}
      {...props}
    />
  );
});

export default Slider;
