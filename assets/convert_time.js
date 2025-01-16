export default function convertTime(posted, now) {
  const seconds = (now - posted) / 1000;
  const minutes = Math.floor(seconds / 60);
  const endingOfMinutesString = String(minutes).slice(-1);
  const hours = Math.floor(seconds / 3600);
  const endingOfHoursString = String(hours).slice(-1);
  const days = Math.floor(seconds / 86400);
  const endingOfDaysString = String(days).slice(-1);
  const years = Math.floor(seconds / 31536000);
  const endingOfYearsString = String(years).slice(-1);
  if (years > 0) {
    if (Number(endingOfYearsString) === 1) {
      return `${years} год назад`;
    }
    if (Number(endingOfYearsString) > 1 && Number(endingOfYearsString) < 5) {
      return `${years} года назад`;
    }
    if (Number(endingOfYearsString) >= 5 || Number(endingOfYearsString) === 0) {
      return `${years} лет назад`;
    }
  }

  if (days > 0) {
    if (Number(endingOfDaysString) === 1) {
      return `${days} день назад`;
    }
    if (Number(endingOfDaysString) > 1 && Number(endingOfDaysString) < 5) {
      return `${days} дня назад`;
    }
    if (Number(endingOfDaysString) >= 5 || Number(endingOfDaysString) === 0) {
      return `${days} дней назад`;
    }
  }

  if (hours > 0) {
    if (Number(endingOfHoursString) === 1) {
      return `${hours} час назад`;
    }
    if (Number(endingOfHoursString) > 1 && Number(endingOfHoursString) < 5) {
      return `${hours} часа назад`;
    }
    if (Number(endingOfHoursString) >= 5 || Number(endingOfHoursString) === 0) {
      return `${hours} часов назад`;
    }
  }

  if (minutes > 0) {
    if (Number(endingOfMinutesString) === 1) {
      return `${minutes} минуту назад`;
    }
    if (Number(endingOfMinutesString) > 1 && Number(endingOfMinutesString) < 5) {
      return `${minutes} минуты назад`;
    }
    if (Number(endingOfMinutesString) > 5 || Number(endingOfMinutesString) === 0) {
      return `${minutes} минут назад`;
    }
  }

  return 'только что';
}
