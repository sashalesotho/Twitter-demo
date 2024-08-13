export default function convertTime(posted, now) {
  const seconds = (now - posted) / 1000;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const years = Math.floor(seconds / 31536000);

  if (years === 1) {
    return '1 год назад';
  }
  if (years > 1 && years < 5) {
    return `${years} года назад`;
  }
  if (years >= 5) {
    return `${years} лет назад`;
  }
  if (days === 1) {
    return '1 день назад';
  }
  if (days > 1) {
    return `${days} дней назад`;
  }
  if (hours === 1) {
    return '1 час назад';
  }
  if (hours > 1) {
    return `${hours} часов назад`;
  }
  if (minutes === 1) {
    return '1 минуту назад';
  }
  if (minutes > 1) {
    return `${minutes} минут назад`;
  }
  return 'только что';
}
