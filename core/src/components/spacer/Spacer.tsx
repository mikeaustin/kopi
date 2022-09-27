import { useContext } from 'react';

import View from '../view/index.js';
import clsx from 'clsx';

import { useSpacingStyles } from '../../styles/spacingStyles.js';

import ViewContext from '../view/ViewContext.js';

import Spacing from '../../types/Spacing';
import Color from '../../types/Color';

interface SpacerProps extends React.ComponentProps<typeof View> {
  size: Spacing,
  color?: Color,
}

const Spacer = ({
  size,
  color,
  ...props
}: SpacerProps) => {
  const { isHorizontal } = useContext(ViewContext);
  const spacingStyles = useSpacingStyles();

  const spacerClassName = clsx(
    spacingStyles[`${isHorizontal ? 'horizontal-' : ''}${size}`],
  );

  return (
    <View fillColor={color} className={spacerClassName} {...props} />
  );
};

export default Spacer;
