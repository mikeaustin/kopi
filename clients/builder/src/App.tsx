import React, { useContext, useState } from 'react';
import { insert } from 'ramda';

import { View, Text as OriginalText, Button, Stack, Spacer, Divider, Input } from 'core';

import './App.css';

const LayoutContext = React.createContext<{ [binding: string]: any; }>({});

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
  Text: ({ children, ...props }) => <Text {...props} children={React.Children.count(children) > 0 ? children : 'Text'} />,
  Button: ({ title, ...props }) => <Button {...props} title={title ?? 'Button'} />,
  Stack,
  Repeater,
  Input,
  Divider: ({ ...props }) => <Divider {...props} spacing="medium" />,
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

//

const template = {
  type: 'Stack', props: { spacing: 'small' }, children: [
    { type: 'Text', props: { fontWeight: 'bold', textColor: 'blue-5' }, children: 'Hello, world. {name}: {age}' },
    {
      type: 'Repeater', props: { for: 'item', in: 'contacts' }, children: [
        { type: 'Text', props: { fontWeight: 'bold', textColor: 'blue-5' }, children: 'id: {item.id}' },
      ]
    },
  ]
};

const bindings = {
  contacts: [{ id: 1 }, { id: 2 }, { id: 3 }],
  name: 'Joe',
  age: 30,
};

const AppContext = React.createContext<{ onDrop: (data: string, index: number) => void; }>({ onDrop: () => undefined });

function Component({ label, type, props = {} }: { label: string, type: string, props?: React.ComponentProps<any>; }) {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({
      type,
      props,
    }));
  };

  return (
    <View draggable onDragStart={handleDragStart}>
      <Text style={{ textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

function Placeholder({ index }: { index: number; }) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.background = 'linear-gradient(0deg, #00000000, #00000000 calc(50% - 2px), #000000 calc(50% - 2px), #000000 calc(50% + 2px), #00000000 calc(50% + 2px), #00000000)';
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.background = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain");

    onDrop(data, index);

    event.currentTarget.style.background = '';
  };

  const { onDrop } = useContext(AppContext);

  return (
    <View
      style={{ zIndex: 1, height: 16, marginTop: -8, marginBottom: -8 }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  );
}

function App() {
  const [elements, setElements] = useState<{ type: string, element: JSX.Element; }[]>([]);

  const appContextValue = {
    onDrop: (json: string, index: number) => {
      const data = JSON.parse(json);

      setElements(elements => insert(
        index,
        { type: data.type, element: React.createElement(components[data.type], data.props, []) },
        elements),
      );
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <View fillColor="white" className="App">
        <Layout components={components} template={template} bindings={bindings} />
        <Spacer size="medium" />
        <View>
          <Stack horizontal spacing="medium" align="left">
            <Component label="Default\nButton" type="Button" />
            <Component label="Default Solid\nButton" type="Button" props={{ solid: true }} />
            <Component label="Primary\nButton" type="Button" props={{ primary: true }} />
            <Component label="Primary Solid\nButton" type="Button" props={{ primary: true, solid: true }} />
            <Component label="Text" type="Text" props={{ style: { textAlign: 'center' } }} />
            <Component label="Input" type="Input" />
            <Component label="Divider" type="Divider" />
          </Stack>
          <Spacer size="medium" />
          <Stack padding="medium" fillColor="gray-1">
            <Placeholder index={0} />
            {elements.map(({ element }, index) => (
              [element, <Placeholder index={index + 1} />]
            ))}
          </Stack>
        </View>
      </View>
    </AppContext.Provider>
  );
}

export default App;
