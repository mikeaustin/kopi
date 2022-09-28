import { useRef, useEffect } from 'react';
import OpenColor from 'open-color';

import useStyles from './styles.js';

import View from '../view/index.js';
import Text from '../text/index.js';

interface ButtonProps extends React.ComponentProps<typeof View> {
  title?: string,
  primary?: boolean,
  solid?: boolean,
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
  title,
  primary,
  solid,
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

  return (
    <View
      ref={buttonElementRef}
      as="button"
      border
      fillColor={fillColor}
      borderColor={borderColor}
      className={styles.Button}
      {...props}
    >
      <Text fontWeight="bold" textColor={textColor}>{title}</Text>
    </View>
  );
};

export default Button;
