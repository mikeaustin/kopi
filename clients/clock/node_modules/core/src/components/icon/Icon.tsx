import { useRef, useEffect, CSSProperties } from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, IconName } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';

// import useStyles from './styles.js';

import Color from '../../types/Color.js';

import View from '../view/index.js';

// library.add(fas);
// library.add(far);

interface IconProps extends React.ComponentProps<typeof FontAwesomeIcon> {
  icon: IconName,
  color?: Color,
  style?: CSSProperties,
}

function Icon({
  icon,
  color = 'gray-8',
  style,
  ...props
}: IconProps) {
  const [xcolor, level] = color?.split('-') ?? [];
  const iconColor = level ? (OpenColor as any)[xcolor][level] : (OpenColor as any)[xcolor];

  const iconStyle = {
    marginTop: -4,
    marginBottom: -4,
    ...style,
  };

  return (
    <FontAwesomeIcon fixedWidth icon={icon} color={iconColor} style={iconStyle} {...props} />
  );
}

export default Icon;
