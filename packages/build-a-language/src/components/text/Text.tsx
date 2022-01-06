import React from 'react';
import classNames from 'classnames';

import Color from '../color';

import textStyles from './Text.module.scss';

import textColorStyles from '../../styles/textColor.module.scss';
import fontWeightStyles from '../../styles/fontWeight.module.scss';

const Text = ({
  children,
  textParent,
  fontWeight,
  textColor,
}: {
  children: React.ReactNode;
  textParent?: boolean;
  fontWeight?: 'bold';
  textColor?: Color;
}) => {
  const containerClassName = classNames(
    textStyles.container,
    fontWeight && fontWeightStyles[fontWeight],
    textColor && textColorStyles[textColor],
  );

  const Component = textParent ? 'span' : 'div';

  return (
    <Component className={containerClassName}>
      {React.Children.map(children, child => {
        return React.isValidElement(child) ? React.cloneElement(child, {
          textParent: true,
        }) : child;
      })}
    </Component>
  );
};

export default Text;
