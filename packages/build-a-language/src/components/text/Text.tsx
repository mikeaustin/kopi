import React, { useRef, useEffect, useImperativeHandle } from 'react';
import classNames from 'classnames';

import Color from '../color';

import styles from './Text.module.scss';

import fontSizeStyles from '../../styles/fontSize.module.scss';
import fontWeightStyles from '../../styles/fontWeight.module.scss';
import textColorStyles from '../../styles/textColor.module.scss';

type TextProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  textParent?: boolean;
  flex?: boolean,
  noSelect?: boolean;
  fitContent?: boolean;
  fontSize?: 'tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  fontWeight?: 'thing' | 'extra-light' | 'light' | 'medium' | 'semi-bold' | 'bold';
  textColor?: Color | 'primary';
} & React.HTMLProps<HTMLDivElement>;

const Text = React.forwardRef<HTMLDivElement, TextProps>(({
  children,
  style,
  className,
  textParent,
  flex,
  noSelect,
  fitContent,
  fontSize,
  fontWeight,
  textColor,
  ...props
}: TextProps, ref) => {
  const textRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => textRef.current as HTMLDivElement);

  useEffect(() => {
    if (textRef.current && fitContent) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (textRef.current) {
            textRef.current.style.width = `${entry.contentRect.width}px`;
            textRef.current.classList.remove(styles.fitContent);
          }
        }
      });

      if (textRef.current.parentElement) {
        resizeObserver.observe(textRef.current.parentElement);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [fitContent]);

  const containerClassName = classNames(
    styles.container,
    flex && styles.flex,
    textParent && styles.textParent,
    noSelect && styles.noSelect,
    fitContent && styles.fitContent,
    (fontSize && fontSizeStyles[fontSize]) || (!textParent && fontSizeStyles.small),
    fontWeight && fontWeightStyles[fontWeight],
    (textColor && textColorStyles[textColor]) || (!textParent && textColorStyles['theme-text']),
    className,
  );

  const Component = textParent ? 'span' : 'div';

  return (
    <Component ref={textRef} className={containerClassName} style={style} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            textParent: true,
          });
        } else if (typeof child === 'string') {
          return child.split('\\n').map((value, index) => (
            <>{index > 0 && <br />}{value}</>
          ));
        } else {
          return child;
        }
      })}
    </Component>
  );
});

export default Text;
