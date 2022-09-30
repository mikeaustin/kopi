import { useRef, useEffect } from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, IconName } from '@fortawesome/free-solid-svg-icons';

import useStyles from './styles.js';

import View from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';
import { JsxEmit } from 'typescript';

library.add(fas);

interface ButtonProps extends React.ComponentProps<typeof View> {
  icon?: IconName,
  title?: string,
  primary?: boolean,
  solid?: boolean,
  size?: 'small',
}

function getFillColor({ primary, solid }: ButtonProps) {
  switch (true) {
    case primary && solid:
      return 'blue-5';
    case solid:
      return 'gray-3';
    default:
      return 'transparent';
  }
}

function getBorderColor({ primary, solid }: ButtonProps) {
  switch (true) {
    case primary:
      return 'blue-5';
    default:
      return 'gray-3';
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

const Button = ({
  icon,
  title,
  primary,
  solid,
  size,
  ...props
}: ButtonProps) => {
  const buttonElementRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();

  const fillColor = getFillColor({ primary, solid });
  const borderColor = getBorderColor({ primary, solid });
  const textColor = getTextColor({ primary, solid });

  useEffect(() => {
    if (buttonElementRef.current && borderColor) {
      const [color, level] = borderColor.split('-');

      buttonElementRef.current.style.setProperty('--border-color', (OpenColor as any)[color][level]);
    }
  }, [borderColor]);

  const buttonClassName = clsx(
    styles.Button,
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
      border
      align="center"
      fillColor={fillColor}
      borderColor={borderColor}
      className={buttonClassName}
      {...props}
    >
      {icon && (
        <>
          <FontAwesomeIcon icon={icon} color={iconColor} style={{ marginTop: -4, marginBottom: -4 }} />
        </>
      )}
      {icon && title && (
        <Spacer size="small" />
      )}
      <Text fontWeight="bold" textColor={textColor}>{titleElement ?? '​'}</Text>
    </View>
  );
};

export default Button;
