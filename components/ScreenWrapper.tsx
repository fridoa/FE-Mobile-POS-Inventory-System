import React from "react";
import { Platform, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  bg?: string;
}

export default function ScreenWrapper({ children, style, bg = "#FFFFFF", ...props }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: bg,

          paddingTop: insets.top,

          paddingBottom: insets.bottom + (Platform.OS === "android" ? 10 : 0),

          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
