import React from 'react';
import classNames from 'classnames';

import './App.css';
import viewStyles from './styles/View.module.scss';
import justifyContentStyles from './styles/justifyContent.module.scss';
import alignItemsStyles from './styles/alignItems.module.scss';

const View = ({
  tag = 'div',
  children,
  flex,
  horizontal,
  justifyContent,
  alignItems,
}: {
  tag?: string | React.ComponentType<any>;
  children: React.ReactNode;
  flex?: boolean;
  horizontal?: boolean;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
}) => {
  const Component = tag;

  const className = classNames(
    viewStyles.container,
    flex && viewStyles.flex,
    horizontal && viewStyles.horizontal,
    justifyContent && justifyContentStyles[justifyContent],
    alignItems && alignItemsStyles[alignItems],
  );

  return (
    <Component className={className}>
      {children}
    </Component>
  );
};

function App() {
  return (
    <div className="App">
      <View flex horizontal alignItems="center">
        <View flex>
          Hello
        </View>
        <View flex>
          World
        </View>
      </View>
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
