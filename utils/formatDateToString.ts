export const formatDateToString = (
  date: string | Date | null | undefined,
  format: "date" | "datetime" = "date"
): string => {
  if (!date) return "";

  let dateObj: Date;

  // Convert string to Date object
  if (typeof date === "string") {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "";
    }
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return "";
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  // Return date only format (YYYY-MM-DD)
  if (format === "date") {
    return `${year}-${month}-${day}`;
  }

  // Return datetime format (DD-MM-YYYY HH:MM AM/PM)
  if (format === "datetime") {
    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${day}-${month}-${year} ${displayHours}:${minutes} ${ampm}`;
  }

  return "";
};

