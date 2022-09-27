import React from 'react';
import View from '../view/index.js';

interface StackProps extends React.ComponentProps<typeof View> {

}

const Stack = ({
  children,
  ...props
}: StackProps) => {
  return (
    <View {...props}>
      {React.Children.map(children, child => (
        <>
          {child}
        </>
      ))}
    </View>
  );
};

export default Stack;
