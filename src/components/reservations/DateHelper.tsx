export const createJakartaDate = (date: Date): Date => {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};
