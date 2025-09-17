import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppStateEffect(callback: (state: AppStateStatus) => void) {
  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      callback(newState);
    }

    const subscription = AppState.addEventListener("change", onChange);

    // Fire initial state
    onChange(AppState.currentState);

    return () => {
      subscription.remove();
    };
  }, [callback]);
}
