import { Search } from "lucide-react-native";
import React from "react";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder = "Cari produk..." }: SearchBarProps) => {
  return (
    <View className="px-6 py-2">
      <View
        className="flex-row items-center px-4 py-2 bg-white border border-gray-100 shadow-sm rounded-2xl"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Search size={18} color="#9CA3AF" strokeWidth={2} />
        <TextInput className="flex-1 ml-3 text-sm font-medium text-gray-800" placeholder={placeholder} placeholderTextColor="#9CA3AF" value={value} onChangeText={onChangeText} autoCorrect={false} selectionColor="#059669" />
      </View>
    </View>
  );
};

export default SearchBar;
