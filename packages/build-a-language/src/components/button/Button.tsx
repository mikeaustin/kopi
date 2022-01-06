import React from 'react';

import { View, Text } from '../index';

import buttonStyles from './Button.module.scss';

const Button = ({ title }: { title: string; }) => {
  return (
    <View tag="button" background="blue-6" className={buttonStyles.container}>
      <Text fontWeight="bold" textColor="blue-0">{title}</Text>
    </View>
  );
};

export default Button;
