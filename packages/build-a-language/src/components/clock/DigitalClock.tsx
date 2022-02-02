import React, { useRef, useState, useEffect, useCallback } from 'react';

import { View, Text } from '../index';

const DigitalClock = ({ ...props }) => {
  const [date, setDate] = useState(new Date());
  const timerRef = useRef<number>();

  const updateDate = useCallback(() => {
    const now = new Date();

    setDate(now);

    timerRef.current = window.setTimeout(() => {
      updateDate();
    }, ((60 - now.getSeconds()) * 1000) + (1000 - now.getMilliseconds()));
  }, []);

  useEffect(() => {
    updateDate();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [updateDate]);

  return (
    <View alignItems="center" {...props}>
      <Text fontWeight="medium">
        {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
      </Text>
    </View>
  );
};

export default DigitalClock;
