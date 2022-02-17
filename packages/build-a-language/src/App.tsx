/* eslint-disable @typescript-eslint/no-unused-vars */

import './sandbox';

import React, { useEffect, useRef, useState, useCallback, useReducer, useMemo, useContext } from 'react';

import { View, Text, Input, Button, Spacer, Divider, List, Clickable } from './components';

import Desktop from './components/desktop';
import Window from './components/window';

import styles from './App.module.scss';

type State = {
  [id: string]: any;
};

type Action = {
  type: 'setState',
  payload: {
    namespace: string;
    reducer: React.Reducer<any, any>;
    action: React.ReducerAction<React.Reducer<any, any>>;
  },
};

const AppContext = React.createContext<{
  state: State,
  dispatch: React.Dispatch<Action>;
} | null>(null);

const useNamespacedReducer = <TState, TAction extends React.ReducerAction<React.Reducer<TState, any>>>(
  namespace: string,
  reducer: React.Reducer<TState, TAction>,
  initialState: TState
) => {
  const { state, dispatch } = useContext(AppContext) || {};

  const hookDspatch = useCallback((action: TAction) => {
    if (dispatch) {
      dispatch({
        type: 'setState',
        payload: {
          namespace,
          reducer,
          action,
        }
      });
    }
  }, [dispatch, namespace, reducer]);

  const result = useMemo(() => {
    if (state) {
      return [
        state[namespace] || initialState,
        hookDspatch,
      ];
    }

    return [];
  }, [hookDspatch, initialState, namespace, state]);

  return result;
};

const reducer = (state: State, action: Action) => {
  if (action.type === 'setState') {
    return {
      ...state,
      [action.payload.namespace]: action.payload.reducer(state[action.payload.namespace], action.payload.action)
    };
  }

  return state;
};

function App() {
  const [state, dispatch] = useReducer(reducer, {});

  const contextValue = useMemo(() => ({
    state,
    dispatch,
  }), [state]);

  return (
    <View horizontal className={styles.App}>
      <AppContext.Provider value={contextValue}>
        <Desktop id="light">
          <Window title="About" padding="large" style={{ left: 15, top: 15 }}>
            <Text style={{ whiteSpace: 'nowrap' }}>React Desktop — 2022 Mike Austin</Text>
          </Window>
        </Desktop>
        <Desktop id="dark" className={styles.dark}>
        </Desktop>
      </AppContext.Provider>
    </View>
  );
}

export default App;

export {
  type State as AppState,
  AppContext,
  useNamespacedReducer,
};
