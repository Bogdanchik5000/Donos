export default function calcRating(reportMessage: string) {
  const count = reportMessage.replace(/\s+/g, "").length;
  return count * 0.1;
}
