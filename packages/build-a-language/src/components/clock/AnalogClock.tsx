import React, { useRef, useState, useEffect, useCallback } from 'react';

import { View, Text } from '../index';

console.log(window.fetch);

const calculateHands = (date: Date) => {
  const hourAngle = ((date.getHours() + date.getMinutes() / 60) * 30 + 180) * (Math.PI / 180);
  const minuteAngle = ((date.getMinutes() + date.getSeconds() / 60) * 6 + 180) * (Math.PI / 180);
  const secondAngle = (date.getSeconds() * 6 + 180) * (Math.PI / 180);

  return ({
    hour: {
      x: Math.cos(hourAngle) * 0 - Math.sin(hourAngle) * 50,
      y: Math.cos(hourAngle) * 50 + Math.sin(hourAngle) * 0,
    },
    minute: {
      x: Math.cos(minuteAngle) * 0 - Math.sin(minuteAngle) * 85,
      y: Math.cos(minuteAngle) * 85 + Math.sin(minuteAngle) * 0,

    },
    second: {
      x: Math.cos(secondAngle) * 0 - Math.sin(secondAngle) * 85,
      y: Math.cos(secondAngle) * 85 + Math.sin(secondAngle) * 0,
    },
  });
};

const AnalogClock = ({ ...props }) => {
  const [date, setDate] = useState(new Date());
  const timerRef = useRef<number>();

  const updateDate = useCallback(() => {
    const now = new Date();

    setDate(now);

    timerRef.current = window.setTimeout(() => {
      updateDate();
    }, 1000 - now.getMilliseconds());
  }, []);

  useEffect(() => {
    updateDate();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [updateDate]);

  const hands = calculateHands(date);

  return (
    <View tag="svg" viewBox="0 0 200 200" flex>
      {Array.from({ length: 12 }, (_, index, angle = (index * 30 + 180) * (Math.PI / 180)) => (
        <circle
          key={index}
          cx={Math.cos(angle) * 0 - Math.sin(angle) * 85 + 100}
          cy={Math.cos(angle) * 85 + Math.sin(angle) * 0 + 100}
          r={index % 3 === 0 ? 3 : 1}
          fill="#343a40"
        />
      ))}
      <line
        x1={100}
        y1={100}
        x2={hands.hour.x + 100}
        y2={hands.hour.y + 100}
        stroke="#343a40"
        strokeWidth={12}
        strokeLinecap="round"
      />
      <line
        x1={100}
        y1={100}
        x2={hands.minute.x + 100}
        y2={hands.minute.y + 100}
        stroke="#343a40"
        strokeWidth={12}
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 2px hsla(0, 0%, 0%, 0.1))' }}
      />
      <line
        x1={-(hands.second.x / 5) + 100}
        y1={-(hands.second.y / 5) + 100}
        x2={hands.second.x + 100}
        y2={hands.second.y + 100}
        stroke="#adb5bd"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="2" fill="white" />
    </View>
  );
};

export default AnalogClock;
