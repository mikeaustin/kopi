import React, { useContext } from 'react';
import clsx from 'clsx';
import { createUseStyles } from 'react-jss';

// import useStyles from './styles.js';
import { useTextColorStyles } from '../../styles/textColorStyles.js';
import { useFontWeightStyles } from '../../styles/fontWeightStyles.js';

import TextContext from './TextContext.js';
import type Color from '../../types/Color.js';
import type Weight from '../../types/Weight.js';

const useStyles = createUseStyles({
  Text: {
    display: 'block',
    fontSize: 14,
    lineHeight: '20px',
  },
  textParent: {
    display: 'inline',
  }
});

type Child<TProps> = string | number | React.ReactElement<TProps>;

interface TextProps extends React.ComponentProps<'span'> {
  textColor?: Color,
  fontWeight?: Weight,
  children?: Child<TextProps> | Child<TextProps>[],
}

function Text({
  textColor,
  fontWeight,
  children,
  ...props
}: TextProps) {
  const isTextParent = useContext(TextContext);
  const styles = useStyles();
  const textColorStyles = useTextColorStyles();
  const fontWeightStyles = useFontWeightStyles();

  const textClassName = clsx(
    styles.Text,
    isTextParent && styles.textParent,
    (textColor && textColorStyles[textColor]) ?? (!isTextParent && textColorStyles.black),
    (fontWeight && fontWeightStyles[fontWeight]) ?? (!isTextParent && fontWeightStyles.normal),
  );
  console.log(textColor);
  return (
    <TextContext.Provider value={true}>
      <span className={textClassName} {...props}>
        {children}
      </span>
    </TextContext.Provider>
  );
}

export default Text;
