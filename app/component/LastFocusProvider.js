/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";

export const LastFocusContext = React.createContext(null);

export const LastFocusProvider = function ({ children }) {
  const [lastFocus, setLastFocus] = useState(null);
  return (
    <LastFocusContext.Provider value={[lastFocus, setLastFocus]}>
      {children}
    </LastFocusContext.Provider>
  );
};

export const withLastFocus = (Component) => (props) => {
  return (
    <LastFocusContext.Consumer>
      {([lastFocus, setLastFocus]) => (
        <Component
          {...props}
          lastFocus={lastFocus}
          setLastFocus={setLastFocus}
        />
      )}
    </LastFocusContext.Consumer>
  );
};
