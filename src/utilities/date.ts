const now = new Date();
const yyyy = now.getFullYear();
const mm = (now.getMonth() + 1).toString().padStart(2, "0");
const dd = now.getDate().toString().padStart(2, "0");

export const today = `${yyyy}-${mm}-${dd}`;
export const oneYearFromToday = `${yyyy + 1}-${mm}-${dd}`;
