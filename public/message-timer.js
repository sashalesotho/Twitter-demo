export default function messageTimer(date) {
  if (!date || typeof date !== 'string') {
    return 0;
  }

  const wholeDateArr = date.split(' ');
  if (wholeDateArr.length !== 2) return 0;
  const dateArr = wholeDateArr[0].split('.');
  const timeArr = wholeDateArr[1].split(':');

  if (dateArr.length !== 3 || timeArr.length !== 2) return 0;

  const day = Number(dateArr[0]);
  const month = Number(dateArr[1]);
  const year = Number(dateArr[2]);
  const hours = Number(timeArr[0]);
  const minutes = Number(timeArr[1]);

  if (
    Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)
    || Number.isNaN(hours) || Number.isNaN(minutes)
  ) {
    return 0;
  }
  const resDate = Date.UTC(year, month - 1, day, hours, minutes, 0);
  return resDate;
}
