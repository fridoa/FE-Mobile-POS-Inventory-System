import React, { memo, useMemo } from "react";
import { Platform, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  bg?: string;
}

const ScreenWrapper = memo(({ children, style, bg = "#FFFFFF", ...props }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  const containerStyle = useMemo(() => {
    return [
      {
        flex: 1,
        backgroundColor: bg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + (Platform.OS === "android" ? 10 : 0),
        paddingLeft: insets.left,
        paddingRight: insets.right,
      },
      style,
    ];
  }, [insets, bg, style]);

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
});

ScreenWrapper.displayName = "ScreenWrapper";

export default ScreenWrapper;
