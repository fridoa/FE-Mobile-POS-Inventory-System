import { usePathname, useRouter } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import React, { memo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export interface NavItem {
  id: string;
  path: string;
  Icon: LucideIcon;
}

interface NavigationBarProps {
  bottomInset: number;
  items: NavItem[];
}

const NavigationBar = ({ bottomInset, items }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const ACTIVE_COLOR = "#059669";
  const INACTIVE_COLOR = "#ffffff";

  return (
    <View style={{ bottom: bottomInset + 15 }} className="absolute self-center w-[80%] max-w-[450px] h-16 bg-emerald-600 rounded-full flex-row items-center justify-around px-2 shadow-2xl z-50 border border-emerald-500/20">
      {items.map((item) => {
        const isActive = pathname === item.path || pendingTab === item.id;
        const { Icon } = item;

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={async () => {
              setPendingTab(item.id);
              router.replace(item.path as any);
              setTimeout(() => setPendingTab(null), 300); 
            }}
            className="items-center justify-center flex-1 h-full"
          >
            <View className={`items-center justify-center w-14 h-11 rounded-full transition-all duration-300 ${isActive ? "bg-white scale-110 shadow-sm" : "bg-transparent scale-100"}`}>
              <Icon size={22} color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} strokeWidth={isActive ? 2.5 : 2} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(NavigationBar);
