import React from 'react';

import { View } from '../../components';

import { type ViewProps } from '../../components/view';

import styles from './Image.module.scss';

type ImageProps = {
  src: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
} & ViewProps;

const Image = ({
  src,
  width,
  height,
  style,
  ...props
}: ImageProps) => {
  const imageStyle = {
    width,
    height,
    ...style,
  };

  return (
    <View tag="img" src={src} className={styles.container} style={imageStyle} {...props} />
  );
};

export default Image;

export type {
  ImageProps
};
