import React, { useContext, useState } from 'react';

import { View, Text, Button, Stack, Spacer, Divider, Input } from 'core';

interface ComponentProps {
  index?: number,
  type: string,
  label?: string,
  props?: React.ComponentProps<any>,
  children?: React.ReactNode,
}

function Component({
  index,
  type,
  label,
  props = {},
  children,
}: ComponentProps) {
  const handleDragStart = (event: React.DragEvent<HTMLElement>) => {
    setTimeout(() => {
      document.body.classList.add('dragging');
    });

    event.dataTransfer.setData("text/plain", JSON.stringify({
      index,
      type,
      props,
    }));

    const element = document.createElement('div');
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.background = 'white';
    element.style.borderRadius = '2px';
    element.style.border = '1px solid rgba(0, 0, 0, 0.4)';
    element.style.width = '100px';
    element.style.height = '25px';
    element.style.opacity = '1';
    element.appendChild(document.createTextNode(type));
    document.body.appendChild(element);
    event.dataTransfer.setDragImage(element, 50, 12);
  };

  // document.elementFromPoint(clientX, clientY)

  const handleDragEnd = () => {
    document.body.classList.remove('dragging');
  };

  return (
    <View
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {label && (
        <View
          flex
          padding="small"
          fillColor="gray-3"
          align="center"
          style={{ minWidth: 100, borderRadius: 2 }}
        >
          <Text fontSize="small" fontWeight="semi-bold" style={{ textAlign: 'center', lineHeight: '16px', margin: '-2px 0 -2px 0' }}>
            {label}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
}

export default Component;
