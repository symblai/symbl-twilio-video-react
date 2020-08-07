import React, { createContext, useContext, useReducer, useState } from 'react';
import { settingsReducer, initialSettings } from './settings/settingsReducer';

export const StateContext = createContext(null);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks fron being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props) {
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useState('default');
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
  };

    contextValue = {
      ...contextValue,
      getToken: async (identity, roomName) => {
        const headers = new window.Headers();
        const endpoint = process.env.REACT_APP_TWILIO_TOKEN_ENDPOINT || '/twilio-token';
        const params = new window.URLSearchParams({ identity, roomName });

        return fetch(`${endpoint}?${params}`, { headers, mode: 'cors'}).then(res => res.text());
      },
    };

  const getToken = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  return <StateContext.Provider value={{ ...contextValue, getToken }}>{props.children}</StateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
