import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import View, { type ViewProps } from '../view';
import Text from '../text';

import styles from './Input.module.scss';

const metaKeys = ['Shift', 'Control', 'Alt', 'Meta'];

type InputProps = {
};

const Input = ({
  ...props
}: {
} & InputProps) => {
  const textElementRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (textElementRef.current && value.length > 0 && textElementRef.current.firstChild) {
      let range = document.createRange();

      range.setStart(textElementRef.current.firstChild, 0);
      range.setEnd(textElementRef.current.firstChild, 0);

      var rects = range.getBoundingClientRect();
      console.log('rects', rects);
    }
  }, [value]);

  const handleKeyDown = (event: React.SyntheticEvent<any, KeyboardEvent>) => {
    console.log(event);

    if (metaKeys.includes(event.nativeEvent.key)) {
      return;
    }

    if (event.nativeEvent.metaKey) {
      return;
    }

    setValue(value => {
      if (event.nativeEvent.key === 'Enter') {
        return value + '\n';
      } else {
        return value + event.nativeEvent.key;
      }
    });
  };

  return (
    <View flex padding="medium" tabIndex={0} className={styles.container} onKeyDown={handleKeyDown}>
      <Text ref={textElementRef} flex>
        {value.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </Text>
    </View>
  );
};

export default Input;
