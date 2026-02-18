import * as Network from "expo-network";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: Network.NetworkStateType | null;
  isOffline: boolean;
  isChecking: boolean;
}

const defaultNetworkStatus: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
  type: null,
  isOffline: false,
  isChecking: true,
};

// Context untuk share network status ke seluruh app (singleton pattern)
const NetworkStatusContext = createContext<NetworkStatus>(defaultNetworkStatus);

// Provider component - hanya jalankan 1x di root layout
export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: null as Network.NetworkStateType | null,
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (isMounted) {
          setNetworkStatus({
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable ?? false,
            type: state.type ?? null,
          });
          setIsChecking(false);
        }
      } catch (error) {
        console.warn("Network check failed:", error);
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    // Check immediately
    checkNetwork();

    // Poll every 10 seconds (increased from 5s for better performance)
    intervalId = setInterval(checkNetwork, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const value = useMemo<NetworkStatus>(
    () => ({
      ...networkStatus,
      isOffline: !networkStatus.isConnected || !networkStatus.isInternetReachable,
      isChecking,
    }),
    [networkStatus, isChecking],
  );

  return React.createElement(NetworkStatusContext.Provider, { value }, children);
};

// Hook untuk consume network status - tidak ada polling di sini, hanya baca dari context
export const useNetworkStatus = (): NetworkStatus => {
  return useContext(NetworkStatusContext);
};
