import React from 'react';

import { View } from '../../components';

import styles from './Image.module.scss';

type ImageProps = {
  src: string;
  width: number | string;
  height: number | string;
  style?: React.CSSProperties;
};

const Image = ({
  src,
  width,
  height,
  style,
}: ImageProps) => {
  const imageStyle = {
    width,
    height,
    ...style,
  };

  return (
    <View tag="img" src={src} className={styles.container} style={imageStyle} />
  );
};

export default Image;

export type {
  ImageProps
};
