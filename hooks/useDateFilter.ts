import { useState } from "react";

export type FilterType = "today" | "7days" | "month" | "year" | "all" | "custom";


export const formatLocal = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useDateFilter = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("month");

  const getRange = (type: FilterType) => {
    const now = new Date();
    // Mengunci waktu akhir di hari ini secara lokal
    const today = formatLocal(now);

    if (type === "today") {
      return { startDate: today, endDate: today };
    }

    if (type === "7days") {
      const d = new Date();
      // Mengurangi 7 hari dari tanggal sekarang
      d.setDate(now.getDate() - 7);
      return {
        startDate: formatLocal(d),
        endDate: today,
      };
    }

    if (type === "month") {
      // Mengunci di tanggal 1 bulan ini
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        startDate: formatLocal(firstDay),
        endDate: today,
      };
    }

    if (type === "year") {
      // Mengunci di tanggal 1 Januari tahun ini
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      return {
        startDate: formatLocal(firstDayOfYear),
        endDate: today,
      };
    }

    if (type === "all") {
      // Mengembalikan string kosong agar Backend menarik semua data
      return { startDate: "", endDate: "" };
    }

    // Default untuk Custom atau lainnya
    return { startDate: "", endDate: "" };
  };

  return { activeFilter, setActiveFilter, getRange };
};
