export const newYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let financYear;

  if (currentMonth >= 4) {
    financYear = `${currentYear} - ${(currentYear + 1).toString()}`;
  } else {
    financYear = `${currentYear - 1}-${currentYear.toString()}`;
  }

  return financYear;
};
