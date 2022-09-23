import React, { useContext } from 'react';
import clsx from 'clsx';

import TextContext from './TextContext';
import type Color from '../../../types/Color';

import styles from './Text.module.scss';

type Child<TProps> = string | number | React.ReactElement<TProps>;

interface TextProps extends React.ComponentProps<'span'> {
  textColor?: Color,
  fontWeight?: 'bold',
  children?: Child<TextProps> | Child<TextProps>[],
}

function Text({
  textColor,
  fontWeight,
  children,
  ...props
}: TextProps) {
  const isTextParent = useContext(TextContext);

  const textClassName = clsx(
    styles.Text,
    isTextParent && styles.textParent,
    (textColor && styles[textColor]) ?? (!isTextParent && styles.black),
    (fontWeight && styles[fontWeight]) ?? (!isTextParent && styles.normal),
  );

  return (
    <TextContext.Provider value={true}>
      <span className={textClassName} {...props}>
        {children}
      </span>
    </TextContext.Provider>
  );
}

export default Text;
