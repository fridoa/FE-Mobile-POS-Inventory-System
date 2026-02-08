import * as Network from "expo-network";
import { useEffect, useState } from "react";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: Network.NetworkStateType | null;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
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

    // Poll every 5 seconds for network changes
    intervalId = setInterval(checkNetwork, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const isOffline = !networkStatus.isConnected || !networkStatus.isInternetReachable;

  return {
    ...networkStatus,
    isOffline,
    isChecking,
  };
};
