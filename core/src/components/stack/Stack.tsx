import React from 'react';

import View from '../view/index.js';
import Divider from '../divider/index.js';
import Spacer from '../spacer/index.js';

interface StackProps extends React.ComponentProps<typeof View> {
  divider?: boolean,
  spacing?: 'small',
}

const Stack = ({
  divider,
  spacing,
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
            <Spacer size={spacing} />
          )}
          {child}
        </>
      ))}
    </View>
  );
};

export default Stack;
