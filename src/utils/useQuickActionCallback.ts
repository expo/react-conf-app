import React from "react";
import {
  Action as QuickAction,
  initial as INITIAL_QUICK_ACTION,
  addListener,
} from "expo-quick-actions";

let _initialAction: QuickAction | undefined = INITIAL_QUICK_ACTION;

function popInitialAction() {
  if (!_initialAction) {
    return;
  }

  let result = _initialAction;
  _initialAction = undefined;
  return result;
}

/**
 * Handle quick actions with a callback function. This prevents the entire
 * component from re-rendering when the action changes. Use `useQuickAction` if
 * you want to re-render the component.
 *
 * @param callback function that's called when a quick action launches the app.
 * Will be instantly called with the initial action if it exists.
 */
export function useQuickActionCallback(
  callback: (data: QuickAction) => void | Promise<void>,
) {
  React.useEffect(() => {
    let isMounted = true;

    // Only call the initial action once
    let initialAction = popInitialAction();
    if (initialAction) {
      callback(initialAction);
    }

    const sub = addListener((event) => {
      if (isMounted) {
        callback(event);
      }
    });
    return () => {
      isMounted = false;
      sub.remove();
    };
  }, [callback]);
}
