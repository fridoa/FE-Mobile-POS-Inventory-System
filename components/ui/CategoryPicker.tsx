import { useDebounce } from "@/hooks/useDebounce";
import categoryService from "@/services/category.service";
import { FlashList } from "@shopify/flash-list";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronDown, Tag, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import SearchBar from "./SearchBar";

interface CategoryPickerProps {
  value?: string;
  onChange: (id: string) => void;
  error?: string;
  initialLabel?: string;
}

const CategoryPicker = ({ value, onChange, error, initialLabel }: CategoryPickerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(initialLabel || null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", debouncedSearch],
    queryFn: async () => {
      try {
        const response = await categoryService.getCategory(debouncedSearch);
        return response.data?.data || [];
      } catch (error) {
        console.error("Category API Error:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    placeholderData: keepPreviousData,
  });

  // Sync selected name when categories load or value changes
  React.useEffect(() => {
    if (value && categories) {
      const found = categories.find((c: any) => c._id === value);
      if (found) setSelectedName(found.name);
    } else if (!value) {
      setSelectedName(null);
    }
  }, [value, categories]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    return [...categories].sort((a, b) => 
      (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: 'base' })
    );
  }, [categories]);

  return (
    <>
      <TouchableOpacity 
        onPress={() => setIsVisible(true)} 
        className={`flex-row items-center justify-between p-3 rounded-xl bg-gray-50 border ${error ? "border-red-500" : "border-gray-100"}`}
      >
        <Text className={value ? "text-gray-800 font-medium" : "text-gray-400"}>
          {selectedName || "Pilih Kategori Produk"}
        </Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>
      {!!error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}

      <Modal visible={isVisible} animationType="fade" transparent onRequestClose={() => setIsVisible(false)}>
        <View className="items-center justify-center flex-1 p-6 bg-black/50">
          <View className="bg-white w-full max-h-[80%] rounded-[32px] overflow-hidden">
            <View className="flex-row items-center justify-between p-6 pb-4">
              <Text className="text-xl font-bold text-gray-800">Pilih Kategori</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <X color="#9ca3af" size={24} />
              </TouchableOpacity>
            </View>

            <View className="px-4 py-2">
              <SearchBar placeholder="Cari Kategori..." value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            {isLoading ? (
              <ActivityIndicator className="py-20" color="#059669" />
            ) : (
              <View style={{ height: 400, width: '100%' }}>
                <FlashList
                  data={filteredCategories}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={{ padding: 16 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item._id);
                        setSelectedName(item.name);
                        setIsVisible(false);
                        setSearchQuery("");
                      }}
                      className={`flex-row items-center p-4 mb-2 rounded-2xl ${value === item._id ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50 border border-transparent"}`}
                    >
                      <View className={`w-10 h-10 items-center justify-center rounded-xl mr-3 ${value === item._id ? "bg-emerald-100" : "bg-white shadow-sm"}`}>
                        <Tag size={18} color={value === item._id ? "#059669" : "#9CA3AF"} />
                      </View>
                      <Text className={`flex-1 font-semibold ${value === item._id ? "text-emerald-700" : "text-gray-700"}`}>{item.name}</Text>
                      {value === item._id && <View className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <View className="items-center justify-center py-10">
                      <Text className="text-gray-400">Kategori tidak ditemukan</Text>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CategoryPicker;
