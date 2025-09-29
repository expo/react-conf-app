import { useEffect, useState } from "react";
import * as Device from "expo-device";

export function useDeviceType() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    Device.getDeviceTypeAsync().then((type) => {
      setIsTablet(type === Device.DeviceType.TABLET);
    });
  }, []);

  return { isTablet };
}
