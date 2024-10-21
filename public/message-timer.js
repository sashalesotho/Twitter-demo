export default function messageTimer(date) {
  if (date) {
    const wholeDateArr = date.split(' ');
    const dateArr = wholeDateArr[0].split('.');
    const timeArr = wholeDateArr[1].split(':');
    const day = Number(dateArr[0]);
    const month = Number(dateArr[1]);
    const year = Number(dateArr[2]);
    const hours = Number(timeArr[0]);
    const minutes = Number(timeArr[1]);
    const resDate = Date.UTC(year, month - 1, day, hours, minutes, 0);
    return resDate;
  }
  return 0;
}
