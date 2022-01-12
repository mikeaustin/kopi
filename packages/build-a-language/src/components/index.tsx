import React from 'react';

import View from './view';
import Text from './text';
import Input from './input';
import Button from './button';
import Spacer from './spacer';
import Divider from './divider';
import List from './list';

type View2Props = {
  children?: React.ReactNode;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const View2 = React.forwardRef(({
  children,
  ...props
}: View2Props, ref) => {
  return (
    <div {...props} />
  );
});

const Input2 = ({
  ...props
}) => {
  return (
    <View2 tabIndex={0}>
      asdf
    </View2>
  );
};

<Input2 />;

export {
  View,
  Text,
  Input,
  Button,
  Spacer,
  Divider,
  List,
};
