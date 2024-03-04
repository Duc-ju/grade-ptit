export function convertTimeToString(seconds: number | undefined | null) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const now = new Date();
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  let localTime = date.toLocaleTimeString();
  let split = localTime.split(":");
  if (split.length >= 2) {
    localTime = split[0] + ":" + split[1];
    if (
      date.getDay() === now.getDay() &&
      now.getTime() - date.getTime() < 86400000
    )
      return localTime;
    if (
      (now.getDay() === 0 || date.getDay() <= now.getDay()) &&
      now.getTime() - date.getTime() < 604800000
    )
      return days[date.getDay()] + ", " + localTime;
    return (
      localTime +
      ", " +
      date.getDate() +
      " Tháng " +
      (date.getMonth() + 1) +
      ", " +
      date.getFullYear()
    );
  } else {
    return "";
  }
}
