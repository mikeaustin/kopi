import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import View, { type ViewProps } from '../view';
import Text from '../text';

import styles from './Input.module.scss';

const metaKeys = ['Shift', 'Control', 'Alt', 'Meta'];

type InputProps = {
  initialValue?: string;
};

const Input = ({
  initialValue,
  ...props
}: {
} & InputProps) => {
  const textElementRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>(initialValue ?? '');
  const [lineNo, setLineNo] = useState<number>(0);

  useEffect(() => {
    if (textElementRef.current && value.length > 0 && textElementRef.current.firstChild) {
      let range = document.createRange();

      range.setStart(textElementRef.current.firstChild, 0);
      range.setEnd(textElementRef.current.firstChild, 0);

      var rects = range.getBoundingClientRect();
      console.log('rects', rects);

      // element.style.setProperty("--my-var", jsVar + 4);
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
    <View flex tabIndex={0} className={styles.container} onKeyDown={handleKeyDown}>
      <View tag="code" flex padding="medium" className={styles.content}>
        <Text ref={textElementRef} flex style={{ whiteSpace: 'pre' }}>
          {value}
          {/* {value.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))} */}
        </Text>
      </View>
    </View>
  );
};

export default Input;
