import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ScannerOverlay from "./ScannerOverlay";

interface BarcodeScannerProps {
  onScanned: (data: string, type: string) => void;
  onClose?: () => void;
  isEnabled?: boolean;
  cooldown?: number;
}

export default function BarcodeScanner({ onScanned, onClose, isEnabled = true, cooldown = 2000 }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [localPaused, setLocalPaused] = useState(false);

  useEffect(() => {
    if (isEnabled) setLocalPaused(false);
  }, [isEnabled]);

  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <View className="items-center justify-center flex-1 p-5 bg-black">
        <Text className="mb-4 text-lg text-center text-white">Izinkan kamera untuk memindai kode batang.</Text>
        <TouchableOpacity onPress={requestPermission} className="px-4 py-2 bg-blue-600 rounded-full">
          <Text className="text-white">Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (!isEnabled || localPaused) return;

    setLocalPaused(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    onScanned(result.data, result.type);

    if (cooldown > 0) {
      setTimeout(() => setLocalPaused(false), cooldown);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "code128"],
        }}
      />
      <ScannerOverlay />

      {onClose && (
        <View className="absolute left-0 right-0 items-center bottom-12">
          <TouchableOpacity onPress={onClose} className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md">
            <Text className="font-bold text-white">Batal Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
