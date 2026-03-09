import NavigationBar, { NavItem } from "@/components/NavigationBar";
import { createMaterialTopTabNavigator, MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { usePathname, withLayoutContext } from "expo-router";
import { History, ScanLine, Store, User } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
const SwipeableTabs = withLayoutContext(Navigator);

const TAB_SCREENS = ["home/index", "inventory/index", "history/index", "profile/index"];

const ADMIN_MENUS: NavItem[] = [
  { id: "home", name: "home/index", Icon: Store },
  { id: "inventory", name: "inventory/index", Icon: ScanLine },
  { id: "history", name: "history/index", Icon: History },
  { id: "profile", name: "profile/index", Icon: User },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigationRef = useRef<MaterialTopTabNavigationProp<ParamListBase> | null>(null);

  const isRootTab = ["/home", "/inventory", "/history", "/profile"].includes(pathname);

  const handleTabPress = useCallback((index: number) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(TAB_SCREENS[index]);
    }
  }, []);

  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SwipeableTabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: { display: "none" },
          swipeEnabled: isRootTab,
          lazy: true,
          animationEnabled: false,
        }}
        screenListeners={({ navigation }) => {
          navigationRef.current = navigation;
          return {
            state: (e) => {
              const state = e.data.state as TabNavigationState<ParamListBase>;
              if (state?.index !== undefined) {
                handleIndexChange(state.index);
              }
            },
          };
        }}
      >
        <SwipeableTabs.Screen name="home/index" />
        <SwipeableTabs.Screen name="inventory/index" />
        <SwipeableTabs.Screen name="history/index" />
        <SwipeableTabs.Screen name="profile/index" />
      </SwipeableTabs>

      {isRootTab && <NavigationBar bottomInset={insets.bottom} items={ADMIN_MENUS} currentIndex={currentIndex} onTabPress={handleTabPress} />}
    </View>
  );
}
