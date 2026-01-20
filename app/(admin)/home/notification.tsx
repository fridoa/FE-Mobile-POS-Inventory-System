import ScreenWrapper from "@/components/ScreenWrapper";
import PageHeader from "@/components/ui/PageHeader";
import notificationService from "@/services/notification.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AlertTriangle, CheckCircle2, Clock, Info } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

export default function NotificationScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => notificationService.findAll(1, 50),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.data || [];

  const getStyle = (type: string) => {
    switch (type) {
      case "WARNING":
        return { bg: "bg-amber-50", iconBg: "bg-amber-100", color: "#d97706", icon: AlertTriangle };
      case "ERROR":
        return { bg: "bg-red-50", iconBg: "bg-red-100", color: "#dc2626", icon: Clock };
      default:
        return { bg: "bg-emerald-50", iconBg: "bg-emerald-100", color: "#059669", icon: Info };
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-white">
        <PageHeader
          title="Pusat Notifikasi"
          rightElement={
            notifications.length > 0 && (
              <TouchableOpacity onPress={() => markAllReadMutation.mutate()}>
                <Text className="text-xs font-bold text-emerald-600">Baca Semua</Text>
              </TouchableOpacity>
            )
          }
        />

        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#059669" />}
            renderItem={({ item }) => {
              const style = getStyle(item.type);
              const Icon = style.icon;

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className={`flex-row p-4 mb-3 rounded-3xl border border-gray-100 ${item.isRead ? "bg-white" : style.bg}`}
                  onPress={async () => {
                    if (!item.isRead) await notificationService.markAsRead(item._id);
                    queryClient.invalidateQueries({ queryKey: ["notifications"] });

                    if (item.data?.type === "RESTOCK_SCREEN") {
                      router.push("/(admin)/home/restock");
                    }
                  }}
                >
                  <View className={`p-3 rounded-2xl ${style.iconBg} self-start`}>
                    <Icon size={20} color={style.color} />
                  </View>

                  <View className="flex-1 ml-4">
                    <View className="flex-row items-start justify-between">
                      <Text className={`font-bold text-sm flex-1 ${item.isRead ? "text-gray-500" : "text-gray-800"}`}>{item.title}</Text>
                      {!item.isRead && <View className="w-2 h-2 mt-1 ml-2 bg-red-500 rounded-full" />}
                    </View>
                    <Text className="mt-1 text-xs leading-4 text-gray-500">{item.message}</Text>
                    <Text className="text-[10px] text-gray-400 mt-2 font-medium">
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View className="items-center px-10 mt-32">
                <View className="p-6 mb-4 rounded-full bg-gray-50">
                  <CheckCircle2 size={48} color="#D1D5DB" />
                </View>
                <Text className="text-lg font-bold text-gray-800">Tidak ada kabar baru</Text>
                <Text className="mt-2 text-sm text-center text-gray-400">Semua stok dan tanggal kadaluwarsa terpantau aman terkendali.</Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
