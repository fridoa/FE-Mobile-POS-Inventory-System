import NavigationBar, { NavItem } from "@/components/NavigationBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { usePathname, withLayoutContext } from "expo-router";
import { History, ScanLine, Store, User } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
const SwipeableTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isRootTab = ["/home", "/inventory", "/history", "/profile"].includes(pathname);

  const adminMenus: NavItem[] = [
    { id: "home", path: "/home", Icon: Store },
    { id: "inventory", path: "/inventory", Icon: ScanLine },
    { id: "history", path: "/history", Icon: History },
    { id: "profile", path: "/profile", Icon: User },
  ];

  return (
    <View style={{ flex: 1 }}>
      <SwipeableTabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: { display: "none" },
          swipeEnabled: isRootTab,
          lazy: true,
        }}
      >
        <SwipeableTabs.Screen name="home/index" />
        <SwipeableTabs.Screen name="inventory/index" />
        <SwipeableTabs.Screen name="history/index" />
        <SwipeableTabs.Screen name="profile/index" />
      </SwipeableTabs>

      {isRootTab && <NavigationBar bottomInset={insets.bottom} items={adminMenus} />}
    </View>
  );
}
