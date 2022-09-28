import React, { useRef, useContext, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import { useStyles } from './styles.js';
import { useFontSizeStyles } from '../../styles/fontSizeStyles.js';
import { useFontWeightStyles } from '../../styles/fontWeightStyles.js';
import { useTextColorStyles } from '../../styles/textColorStyles.js';

import TextContext from './TextContext.js';

import Color from '../../types/Color.js';
import Weight from '../../types/Weight.js';

type Child<TProps> = string | number | React.ReactElement<TProps>;

type Size = 'xsmall' | 'small' | 'default' | 'medium' | 'large' | 'xlarge';

interface TextProps extends React.ComponentProps<'span'> {
  flex?: boolean,
  contain?: boolean,
  light?: boolean,
  fontSize?: Size,
  fontWeight?: Weight,
  textColor?: Color,
  textAlign?: 'center',
  children?: Child<TextProps> | Child<TextProps>[],
}

function Text({
  flex,
  contain,
  light,
  fontSize,
  fontWeight,
  textColor,
  textAlign,
  children,
  ...props
}: TextProps) {
  const isTextParent = useContext(TextContext);
  const [isHidden, setIsHidden] = useState(contain);
  const textElementRef = useRef<HTMLElement>(null);

  const styles = useStyles();
  const fontSizeStyles = useFontSizeStyles();
  const fontWeightStyles = useFontWeightStyles();
  const textColorStyles = useTextColorStyles();

  useLayoutEffect(() => {
    if (contain && textElementRef.current) {
      textElementRef.current.style.width = `${textElementRef.current.parentElement?.offsetWidth}px`;
    }

    setIsHidden(false);
  }, [contain]);

  const textClassName = clsx(
    styles.Text,
    isTextParent && styles.textParent,
    flex && styles.flex,
    light && styles.light,
    isHidden && styles.hidden,
    (fontSize && fontSizeStyles[fontSize]) ?? (!isTextParent && fontSizeStyles.default),
    (fontWeight && fontWeightStyles[fontWeight]) ?? (!isTextParent && fontWeightStyles.normal),
    (textColor && textColorStyles[textColor]) ?? (!isTextParent && textColorStyles['gray-8']),
    textAlign && styles[textAlign],
  );

  return (
    <TextContext.Provider value={true}>
      <span ref={textElementRef} className={textClassName} {...props}>
        {children}
      </span>
    </TextContext.Provider>
  );
}

export default Text;
