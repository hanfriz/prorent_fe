import moment from "moment-timezone";

export const addOneMinute = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + 1);
  return newDate;
};

export const formatDateToJakartaYYYYMMDD = (date: Date): string => {
  return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD");
};

export const validateDateRange = (
  from: Date,
  to: Date,
  unavailableDateSet: Set<string>
): string[] => {
  const invalidDates: string[] = [];
  const currentDate = addOneMinute(from); // ✅ Start 1 minute after check-in

  while (currentDate < to) {
    const dateKey = formatDateToJakartaYYYYMMDD(currentDate);
    console.log(dateKey);
    if (unavailableDateSet.has(dateKey)) {
      invalidDates.push(dateKey);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return invalidDates;
};
