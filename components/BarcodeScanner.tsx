import { Audio } from "expo-av";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import ScannerOverlay from "./ScannerOverlay";

interface BarcodeScannerProps {
  onScanned: (data: string, type: string) => void;
  onClose?: () => void;
}

export default function BarcodeScanner({ onScanned, onClose }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanned, setIsScanned] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    setIsScanned(false);

    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/beep.mp3"));
        soundRef.current = sound;
      } catch (error) {
        console.log("Gagal memuat suara", error);
      }
    }

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="items-center justify-center flex-1 p-5 bg-black">
        <Text className="mb-4 text-lg text-center text-white">Izinkan kamera untuk memindai kode batang.</Text>
        <Button onPress={requestPermission} title="Izinkan Kamera" />
        {onClose && (
          <TouchableOpacity onPress={onClose} className="mt-8">
            <Text className="font-bold text-red-400">Kembali</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const playBeep = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.log("Gagal memutar suara", error);
    }
  };

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (isScanned) return;
    setIsScanned(true);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playBeep();

    onScanned(result.data, result.type);

    setTimeout(() => setIsScanned(false), 2000);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ position: "absolute", inset: 0 }}
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
