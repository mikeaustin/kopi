import React, { useContext } from 'react';
import clsx from 'clsx';

import OpenColor from 'open-color';

import { StyleSheet } from '../../utils/StyleUtils.js';

import TextContext from './TextContext.js';
import type Color from '../../types/Color.js';

const styles = StyleSheet.create({
  Text: {
    display: 'block',
    fontSize: 14,
    lineheight: 20,
  }
});

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
