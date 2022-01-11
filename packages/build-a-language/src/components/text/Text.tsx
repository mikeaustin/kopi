import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

import Color from '../color';

import styles from './Text.module.scss';

import fontSizeStyles from '../../styles/fontSize.module.scss';
import fontWeightStyles from '../../styles/fontWeight.module.scss';
import textColorStyles from '../../styles/textColor.module.scss';

const Text = React.forwardRef(({
  children,
  style,
  textParent,
  fitContent,
  fontSize,
  fontWeight,
  textColor,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  textParent?: boolean;
  fitContent?: boolean;
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  fontWeight?: 'bold';
  textColor?: Color | 'primary';
} & JSX.IntrinsicElements['div'], ref) => {
  const textRef = useRef<HTMLDivElement>(null);

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
    fitContent && styles.fitContent,
    (fontSize && fontSizeStyles[fontSize]) || (!textParent && fontSizeStyles.small),
    fontWeight && fontWeightStyles[fontWeight],
    (textColor && textColorStyles[textColor]) || (!textParent && textColorStyles['gray-7']),
  );

  const Component = textParent ? 'span' : 'div';

  return (
    <Component ref={textRef} className={containerClassName} style={style}>
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
