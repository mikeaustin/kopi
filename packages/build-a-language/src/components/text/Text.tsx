import React from 'react';
import classNames from 'classnames';

import Color from '../color';

import styles from './Text.module.scss';

import fontSizeStyles from '../../styles/fontSize.module.scss';
import fontWeightStyles from '../../styles/fontWeight.module.scss';
import textColorStyles from '../../styles/textColor.module.scss';

const Text = ({
  children,
  textParent,
  fontSize,
  fontWeight,
  textColor,
}: {
  children: React.ReactNode;
  textParent?: boolean;
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  fontWeight?: 'bold';
  textColor?: Color | 'primary';
}) => {
  const containerClassName = classNames(
    styles.container,
    (fontSize && fontSizeStyles[fontSize]) || (!textParent && fontSizeStyles.small),
    fontWeight && fontWeightStyles[fontWeight],
    (textColor && textColorStyles[textColor]) || (!textParent && textColorStyles['gray-7']),
  );

  const Component = textParent ? 'span' : 'div';

  return (
    <Component className={containerClassName}>
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
};

export default Text;
