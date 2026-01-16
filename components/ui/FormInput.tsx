import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, secureTextEntry, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-semibold text-gray-700">{label}</Text>
      <View className="relative justify-center">
        <TextInput {...props} secureTextEntry={secureTextEntry && !isPasswordVisible} className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-800 ${error ? "border-red-500" : "border-gray-200"}`} />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-4" activeOpacity={0.7}>
            {isPasswordVisible ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default FormInput;
