import { useRef, useEffect, CSSProperties } from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, IconName } from '@fortawesome/free-solid-svg-icons';

// import useStyles from './styles.js';

import View from '../view/index.js';

library.add(fas);

interface IconProps extends React.ComponentProps<typeof FontAwesomeIcon> {
  icon: IconName,
  style?: CSSProperties,
}

function Icon({
  icon,
  style,
  ...props
}: IconProps) {
  const iconStyle = {
    marginTop: -4,
    marginBottom: -4,
    ...style,
  };
  return (
    <FontAwesomeIcon icon={icon} fixedWidth style={iconStyle} {...props} />
  );
}

export default Icon;
