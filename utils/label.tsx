export type FilterType = "7days" | "month" | "year" | "all";

export const getReportLabel = (id: string, filterType: FilterType) => {
  if (!id || id === "-") return "-";

  const parts = id.split("-");
  const year = parts[0];
  const monthIndex = parseInt(parts[1]) - 1;
  const day = parts[2];

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

  if (filterType === "7days") {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const date = new Date(`${id}T00:00:00`);
    return days[date.getDay()];
  }

  if (filterType === "year" || filterType === "all") {
    const monthName = months[monthIndex] || parts[1];

    if (parts.length === 2) {
      return filterType === "all" ? `${monthName} '${year.slice(2)}` : monthName;
    }

    return `${day} ${monthName}`;
  }

  return day || id;
};
