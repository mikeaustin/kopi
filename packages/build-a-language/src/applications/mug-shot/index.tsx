import React, { useEffect, useRef, useState, useCallback } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from '../../components';

const MugShot = () => {
  return (
    <View flex padding="large" alignItems="center" background="gray-1">
      <View border borderRadius="small" style={{ width: '100%', maxWidth: 800 }}>
        <View padding="medium" background="white">
          <Text fontWeight="bold">Weyland-Yutani Corporation</Text>
          <Spacer size="small" />
          <Text fontSize="xsmall" textColor="gray-6">
            <Text fontWeight="medium">Magnus C. Christian</Text> – 23h
          </Text>
        </View>
        <Divider />
        <View style={{ height: 100 }} />
        <Divider />
        <View padding="medium" background="white">
          <View horizontal>
            <Text>591 Reactions</Text>
            <Spacer flex />
            <Text>87 Comments</Text>
          </View>
          <Spacer size="medium" />
          <Divider />
          <Spacer size="xsmall" />
          <View horizontal>
            <Button flex hover title="Like" />
            <Spacer size="small" />
            <Button flex hover title="Comment" />
            <Spacer size="small" />
            <Button flex hover title="Share" />
          </View>
          <Spacer size="xsmall" />
          <Divider />
          <Spacer size="medium" />
          <View>
            <View padding="medium" background="gray-1" borderRadius="max">
              <Text textColor="gray-6">Add a comment...</Text>
            </View>
            <Spacer size="small" />
            <View padding="medium" background="gray-1" borderRadius="max" style={{ borderRadius: 20 }}>
              <Text fontWeight="bold">Machieste Davis</Text>
              <Spacer size="small" />
              <Text>My dad loved this film.he was a Vietnam veteran hero</Text>
            </View>
            <View horizontal>
              <Button link size="xsmall" title="Like" />
              <Button link size="xsmall" title="Reply" />
            </View>
            <Spacer size="tiny" />
            <View padding="medium" background="gray-1" borderRadius="max" style={{ borderRadius: 20 }}>
              <Text fontWeight="bold">Machieste Davis</Text>
              <Spacer size="small" />
              <Text>My dad loved this film.he was a Vietnam veteran hero</Text>
            </View>
            <View horizontal>
              <Button link size="xsmall" title="Like" />
              <Button link size="xsmall" title="Reply" />
            </View>
          </View>
        </View>
      </View>
    </View>

  );
};

export default MugShot;
