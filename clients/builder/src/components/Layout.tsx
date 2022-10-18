import React, { useContext, useState } from 'react';

import { View, Text as OriginalText, Button, Stack, Spacer, Divider, Input } from 'core';
import Repeater from '../components/Repeater';

import LayoutContext from '../LayoutContext';

function Text({
  children,
  ...props
}: React.ComponentProps<typeof OriginalText>) {
  const env = useContext(LayoutContext);

  const childrenElement = typeof children === 'string'
    ? children.replace(/\{(\w*(\.\w*)?)\}/g, (_, p) => {
      const [a, b] = p.split('.');

      return b ? env[a][b] : env[a];
    })
    : children;

  return (
    <OriginalText {...props}>{childrenElement}</OriginalText>
  );
}

function getProps(node: any, index: number) {
  switch (node.type) {
    case 'View':
      return { key: index, ...node.props } as React.ComponentProps<typeof View>;
    case 'Text':
      return { key: index, ...node.props } as React.ComponentProps<typeof Text>;
    case 'Stack':
      return { key: index, ...node.props } as React.ComponentProps<typeof Stack>;
    case 'Repeater':
      return { key: index, ...node.props } as React.ComponentProps<typeof Repeater>;
    case 'Input':
      return { key: index, ...node.props } as React.ComponentProps<typeof Input>;
    case 'Divider':
      return { key: index, ...node.props } as React.ComponentProps<typeof Divider>;
  }
}

function buildLayout(components: { [type: string]: React.ComponentType<any>; }, node: any, index: number) {
  return React.createElement(
    components[node.type],
    getProps(node, index),
    typeof node.children === 'string'
      ? node.children
      : node.children.map(
        (child: React.ComponentProps<any>, index: number) => buildLayout(components, child, index)
      )
  );
}

//

interface LayoutProps {
  components: { [type: string]: React.ComponentType<any>; },
  template: {},
  bindings: {};
}

function Layout({
  components,
  template,
  bindings,
}: LayoutProps
) {
  const layout = buildLayout(components, template, 0);

  return (
    <LayoutContext.Provider value={bindings}>
      <View>
        {layout}
      </View>
    </LayoutContext.Provider>
  );
}

export default Layout;
