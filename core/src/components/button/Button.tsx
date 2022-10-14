import React, { useRef, useEffect } from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, IconName } from '@fortawesome/free-solid-svg-icons';

import useStyles from './styles.js';

import View from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';

import Weight from '../../types/Weight.js';
import { ShorthandAlign } from '../../types/Align.js';

library.add(fas);

interface ButtonProps<TData = unknown> extends React.ComponentProps<typeof View> {
  icon?: IconName,
  title?: string,
  primary?: boolean,
  solid?: boolean,
  hover?: boolean,
  size?: 'small',
  data?: TData,
  disabled?: boolean,
  titleFontWeight?: Weight,
  titleAlign?: ShorthandAlign,
  onClick?: (event: React.PointerEvent<HTMLDivElement>, data?: TData) => void;
}

function getFillColor({ primary, solid }: ButtonProps) {
  switch (true) {
    case primary && solid:
      return 'blue-5';
    case solid:
      return 'theme-button';
    default:
      return 'transparent';
  }
}

function getBorderColor({ primary, solid, hover }: ButtonProps) {
  switch (true) {
    case hover:
      return undefined;
    case !primary && solid:
      return undefined;
    case !primary && !solid:
      return 'gray-3';
    case primary && !solid:
      return 'blue-5';
    case primary && solid:
      return undefined;
    default:
      return undefined;
  }
}

function getTextColor({ primary, solid }: ButtonProps) {
  switch (true) {
    case primary && solid:
      return 'white';
    case primary:
      return 'blue-5';
    default:
      return undefined;
  }
}

function Button<TData>({
  icon,
  title,
  primary,
  solid,
  hover,
  size,
  data,
  disabled,
  titleFontWeight = 'bold',
  titleAlign = 'center',
  onClick,
  ...props
}: ButtonProps<TData>) {
  const buttonElementRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();

  const fillColor = getFillColor({ primary, solid });
  const borderColor = getBorderColor({ primary, solid, hover });
  const textColor = getTextColor({ primary, solid });

  const handleClick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(event, data);
    }
  };

  useEffect(() => {
    if (buttonElementRef.current && borderColor) {
      const [color, level] = borderColor.split('-');

      buttonElementRef.current.style.setProperty('--border-color', (OpenColor as any)[color][level]);
    }
  }, [borderColor]);

  const buttonClassName = clsx(
    styles.Button,
    solid && !primary && styles.solid,
    hover && styles.hover,
    size && styles[size],
  );

  const [color, level] = textColor?.split('-') ?? [];
  const iconColor = level ? (OpenColor as any)[color][level] : (OpenColor as any)[color];

  const titleElement = title?.split('\\n').reduce((title: (string | React.ReactElement<HTMLBRElement>)[], word, index) => (
    index > 0 ? [...title, <br />, word] : [...title, word]
  ), []);

  return (
    <View
      ref={buttonElementRef}
      as="button"
      horizontal
      border={borderColor !== undefined}
      align={titleAlign}
      fillColor={fillColor}
      borderColor={borderColor}
      disabled={disabled}
      className={buttonClassName}
      onClick={handleClick}
      {...props}
    >
      {icon && (
        <FontAwesomeIcon fixedWidth icon={icon} color={iconColor} style={{ marginTop: -4, marginBottom: -4 }} />
      )}
      {icon && title && (
        <Spacer size="small" />
      )}
      <Text fontWeight={titleFontWeight} textColor={textColor}>{titleElement ?? '​'}</Text>
    </View>
  );
};

export default Button;
