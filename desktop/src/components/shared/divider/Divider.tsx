import React from 'react';

import Color from '../../../types/Color';

import View from '../view';

import styles from './Divider.module.scss';

interface DividerProps extends React.ComponentProps<typeof View> {
  color?: Color,
}

function Divider({
  color
}: DividerProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <View backgroundColor="gray-3" className={styles.Divider} />
  );
}

export default React.forwardRef(Divider);
