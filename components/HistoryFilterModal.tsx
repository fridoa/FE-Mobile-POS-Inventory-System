import { FilterType } from "@/stores/history.store";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Calendar, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  currentType: FilterType;
  onApply: (type: FilterType, start: Date, end: Date) => void;
}

export default function HistoryFilterModal({ visible, onClose, currentType, onApply }: Props) {
  const insets = useSafeAreaInsets();
  const [tempType, setTempType] = useState<FilterType>(currentType);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<"start" | "end" | "month" | null>(null);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      if (showPicker === "start" || showPicker === "month") setTempStartDate(selectedDate);
      if (showPicker === "end") setTempEndDate(selectedDate);
    }
    if (Platform.OS === "android") setShowPicker(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "white", paddingTop: Platform.OS === "android" ? insets.top : 0 }}>
        {/* Header */}
        <View className="flex-row items-center p-5 border-b border-emerald-50 bg-emerald-600">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 mr-6 text-lg font-bold text-center text-white">Rentang Waktu</Text>
        </View>

        <ScrollView className="flex-1 p-6">
          <FilterRadio label="Hari ini" active={tempType === "today"} onPress={() => setTempType("today")} />
          <FilterRadio label="7 Hari Terakhir" active={tempType === "7days"} onPress={() => setTempType("7days")} />

          <FilterRadio label="Pilih Bulan" active={tempType === "month"} onPress={() => setTempType("month")} />
          {tempType === "month" && (
            <TouchableOpacity onPress={() => setShowPicker("month")} className="flex-row items-center justify-between p-4 mb-4 ml-8 border bg-slate-50 rounded-xl border-emerald-100">
              <Text className="font-bold text-slate-700">{tempStartDate.toLocaleString("id-ID", { month: "long", year: "numeric" })}</Text>
              <Calendar size={18} color="#059669" />
            </TouchableOpacity>
          )}

          <FilterRadio label="Pilih Tanggal" active={tempType === "custom"} onPress={() => setTempType("custom")} />
          {tempType === "custom" && (
            <View className="flex-row mb-4 ml-8 space-x-3">
              <TouchableOpacity onPress={() => setShowPicker("start")} className="flex-1 p-3 border bg-slate-50 rounded-xl border-emerald-100">
                <Text className="text-[10px] font-bold text-slate-400 uppercase">Mulai</Text>
                <Text className="font-bold text-slate-700">{tempStartDate.toLocaleDateString("id-ID")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPicker("end")} className="flex-1 p-3 border bg-slate-50 rounded-xl border-emerald-100">
                <Text className="text-[10px] font-bold text-slate-400 uppercase">Akhir</Text>
                <Text className="font-bold text-slate-700">{tempEndDate.toLocaleDateString("id-ID")}</Text>
              </TouchableOpacity>
            </View>
          )}
          <FilterRadio label="Tampilkan Semua" active={tempType === "all"} onPress={() => setTempType("all")} />
        </ScrollView>

        {/* Footer Button - Anti Overlap Navbar */}
        <View style={{ paddingBottom: insets.bottom + 20 }} className="p-6 bg-white border-t border-slate-100">
          <TouchableOpacity onPress={() => onApply(tempType, tempStartDate, tempEndDate)} className="items-center p-4 shadow-sm bg-emerald-600 rounded-xl">
            <Text className="text-lg font-bold text-white">Terapkan</Text>
          </TouchableOpacity>
        </View>

        {showPicker && <DateTimePicker value={showPicker === "end" ? tempEndDate : tempStartDate} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} />}
      </View>
    </Modal>
  );
}

const FilterRadio = ({ label, active, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-4 mb-2">
    <Text className={`text-base ${active ? "text-emerald-700 font-bold" : "text-slate-500"}`}>{label}</Text>
    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${active ? "border-emerald-600" : "border-slate-300"}`}>{active && <View className="w-3 h-3 rounded-full bg-emerald-600" />}</View>
  </TouchableOpacity>
);
