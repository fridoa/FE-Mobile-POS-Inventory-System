import { LucideIcon } from "lucide-react-native";
import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";

export interface NavItem {
  id: string;
  name: string;
  Icon: LucideIcon;
}

interface NavigationBarProps {
  bottomInset: number;
  items: NavItem[];
  currentIndex: number;
  onTabPress: (index: number) => void;
}

const TIMING_CONFIG = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

const NavigationBar = ({ bottomInset, items, currentIndex, onTabPress }: NavigationBarProps) => {
  const ACTIVE_COLOR = "#059669";
  const INACTIVE_COLOR = "#ffffff";

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomInset > 0 ? bottomInset : 5,
        zIndex: 50,
        alignItems: "center",
        backgroundColor: "transparent",
        height: 60,
      }}
      pointerEvents="box-none"
    >
      <View className="w-[80%] max-w-[450px] h-16 bg-emerald-600 rounded-full flex-row items-center justify-around px-2 shadow-2xl border border-emerald-500/20 mx-auto">
        {items.map((item, index) => {
          const isActive = currentIndex === index;
          const { Icon } = item;

          return <NavButton key={item.id} Icon={Icon} isActive={isActive} activeColor={ACTIVE_COLOR} inactiveColor={INACTIVE_COLOR} onPress={() => onTabPress(index)} />;
        })}
      </View>
    </View>
  );
};

const NavButton = memo(({ Icon, isActive, activeColor, inactiveColor, onPress }: { Icon: LucideIcon; isActive: boolean; activeColor: string; inactiveColor: string; onPress: () => void }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(isActive ? 1.1 : 1, TIMING_CONFIG) }],
      backgroundColor: withTiming(isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)", TIMING_CONFIG),
    };
  }, [isActive]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className="items-center justify-center flex-1 h-full">
      <Animated.View style={animatedStyle} className="items-center justify-center rounded-full w-14 h-11">
        <Icon size={22} color={isActive ? activeColor : inactiveColor} strokeWidth={isActive ? 2.5 : 2} />
      </Animated.View>
    </TouchableOpacity>
  );
});

NavButton.displayName = "NavButton";

export default memo(NavigationBar);
