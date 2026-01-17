import { Search } from "lucide-react-native";
import React from "react";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder = "Cari..." }: SearchBarProps) => {
  return (
    <View className="px-6 py-4">
      <View className="flex-row items-center px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl">
        <Search size={20} color="#9CA3AF" />
        <TextInput className="flex-1 ml-3 text-base text-gray-800" placeholder={placeholder} value={value} onChangeText={onChangeText} autoCorrect={false} />
      </View>
    </View>
  );
};

export default SearchBar;
