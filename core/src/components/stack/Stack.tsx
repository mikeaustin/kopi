import React from 'react';

import View from '../view/index.js';
import Divider from '../divider/index.js';
import Spacer from '../spacer/index.js';

import Color from '../../types/Color';

import Spacing from '../../types/Spacing.js';

interface StackProps extends React.ComponentProps<typeof View> {
  divider?: boolean,
  spacing?: Spacing,
  spacingColor?: Color,
}

const Stack = ({
  divider,
  spacing,
  spacingColor,
  children,
  ...props
}: StackProps) => {
  return (
    <View {...props}>
      {React.Children.map(children, (child, index) => (
        <>
          {divider && index > 0 && (
            <Divider spacing={spacing} />
          )}
          {spacing && !divider && index > 0 && (
            <Spacer size={spacing} color={spacingColor} />
          )}
          {child}
        </>
      ))}
    </View>
  );
};

export default Stack;
