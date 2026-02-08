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

    const today = formatLocal(now);

    if (type === "today") {
      return { startDate: today, endDate: today };
    }

    if (type === "7days") {
      const d = new Date();

      d.setDate(now.getDate() - 7);
      return {
        startDate: formatLocal(d),
        endDate: today,
      };
    }

    if (type === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        startDate: formatLocal(firstDay),
        endDate: today,
      };
    }

    if (type === "year") {
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      return {
        startDate: formatLocal(firstDayOfYear),
        endDate: today,
      };
    }

    if (type === "all") {
      return { startDate: "", endDate: "" };
    }

    return { startDate: "", endDate: "" };
  };

  return { activeFilter, setActiveFilter, getRange };
};
