export function toLocalDate(input: string | Date) {
  const utcDate = typeof input === "string" ? new Date(input) : input;
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
}
