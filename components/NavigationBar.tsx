import { usePathname, useRouter } from "expo-router";
import { PackagePlus, Store, User } from "lucide-react-native";
import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const ACTIVE_COLOR = "#059669";
  const INACTIVE_COLOR = "#ffffff";

  const navItems = [
    {
      id: "home",
      path: "/home",
      Icon: Store,
      size: 22,
    },
    {
      id: "inventory",
      path: "/inventory",
      Icon: PackagePlus,
      size: 24,
    },
    {
      id: "profile",
      path: "/profile",
      Icon: User,
      size: 24,
    },
  ];

  return (
    <View className="absolute z-10 flex-row items-center justify-around h-16 px-2 border rounded-full shadow-xl bottom-6 misal w-[70%] self-center bg-emerald-600 shadow-emerald-200 border-emerald-500/20">
      {navItems.map((item) => {
        const isActive = pathname.includes(item.path);
        const { Icon } = item;

        return (
          <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => router.push(`/(admin)${item.path}` as any)} className={`items-center justify-center w-20 h-12 rounded-full ${isActive ? "bg-white shadow-md" : ""}`}>
            <Icon size={item.size} color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(NavigationBar);
