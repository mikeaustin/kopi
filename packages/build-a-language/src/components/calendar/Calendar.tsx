/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';

import { View, Text, Button, Spacer, Divider } from '../index';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const firstDayInMonth = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  return new Date(year, month, 1).getDay();
};

const daysInMonth = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  return new Date(year, month + 1, 0).getDate();
};

const Calendar = () => {
  const today = new Date();

  return (
    <View flex>
      <View background="gray-1">
        <Spacer size="medium" />
        <View horizontal horizontalPadding="medium" alignItems="center" background="gray-1">
          {/* <Button size="xsmall" title="Today" solid rounded /> */}
          <Text fontSize="large">{today.toLocaleDateString(undefined, { month: 'long' })}</Text>
          <Spacer flex />
          <Button size="xsmall" title="◀" solid rounded />
          <Spacer size="xsmall" />
          <Button size="xsmall" title="▶" solid rounded />
        </View>
        <Spacer size="medium" />
        <View horizontal horizontalPadding="small">
          {Array.from({ length: 7 }, (_, index) => (
            <Text key={index} flex fontSize="tiny" fontWeight="bold" textColor="gray-6" style={{ textAlign: 'right', paddingRight: 7 }}>
              {days[index].toUpperCase()}
            </Text>
          ))}
        </View>
        <Spacer size="xsmall" />
        <Divider />
      </View>
      <View flex padding="small" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {Array.from({ length: firstDayInMonth() }, (_, index) => (
          <View key={index} />
        ))}
        {Array.from({ length: daysInMonth() }, (_, index) => (
          <View
            key={index}
            borderRadius
            padding="small"
            background={index + 1 === today.getDate() ? 'primary' : undefined}
          >
            <Text
              style={{ textAlign: 'right' }}
              textColor={index + 1 === today.getDate() ? 'white' : undefined}
              fontWeight={index + 1 === today.getDate() ? 'bold' : undefined}
            >
              {index + 1}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Calendar;
