import React, { useContext } from 'react';

import { View, Text as OriginalText, Stack } from 'core';

import './App.css';

const LayoutContext = React.createContext<{ [binding: string]: any; }>({});

function Text({
  children,
  ...props
}: React.ComponentProps<typeof OriginalText>) {
  const env = useContext(LayoutContext);

  const childrenElement = typeof children === 'string'
    ? children.replace(/\{(\w*)\}/g, (match, p) => env[p])
    : children;

  return (
    <OriginalText {...props}>{childrenElement}</OriginalText>
  );
}

//

interface RepeaterProps {
  for: string;
  in: string,
  children: React.ReactNode;
}

function Repeater({ 'for': _for, 'in': _in, children }: RepeaterProps) {
  const env = useContext(LayoutContext);

  return (
    <>
      {env[_in].map((item: any, index: number) => (
        <LayoutContext.Provider key={index} value={{ ...env, [_for]: item }}>
          {children}
        </LayoutContext.Provider>
      ))}
    </>
  );
}

//

const components: { [type: string]: React.ComponentType<any>; } = {
  View,
  Text,
  Stack,
  Repeater,
};

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
  }
}

function buildLayout(node: any, index: number) {
  return React.createElement(
    components[node.type],
    getProps(node, index),
    typeof node.children === 'string'
      ? node.children
      : node.children.map((child: React.ComponentProps<any>, index: number) => buildLayout(child, index))
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
  const layout = buildLayout(template, 0);

  return (
    <LayoutContext.Provider value={bindings}>
      <View>
        {layout}
      </View>
    </LayoutContext.Provider>
  );
}

//

const template = {
  type: 'Stack', props: { spacing: 'small' }, children: [
    { type: 'Text', props: { fontWeight: 'bold', textColor: 'blue-5' }, children: 'Hello, world.' },
    { type: 'Text', props: {}, children: '{name}: {age}' },
    {
      type: 'Repeater', props: { for: 'item', in: 'contacts' }, children: [
        { type: 'Text', props: { fontWeight: 'bold', textColor: 'blue-5' }, children: '{item}' },
      ]
    },
  ]
};

const bindings = {
  contacts: [1, 2, 3],
  name: 'Joe',
  age: 30,
};

function App() {
  return (
    <View className="App">
      <Layout components={components} template={template} bindings={bindings} />
    </View>
  );
}

export default App;
