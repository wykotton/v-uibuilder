export function getFormatTime() {
  const myDate = new Date();
  const year = myDate.getFullYear();
  let month = String(myDate.getMonth() + 1);
  let day = String(myDate.getDate());
  let hours = String(myDate.getHours());
  let min = String(myDate.getMinutes());
  let sec = String(myDate.getSeconds());
  month.length === 1 ? (month = `0${month}`) : void 0;
  day.length === 1 ? (day = `0${day}`) : void 0;
  hours.length === 1 ? (hours = `0${hours}`) : void 0;
  min.length === 1 ? (min = `0${min}`) : void 0;
  sec.length === 1 ? (sec = `0${sec}`) : void 0;
  const nowTime = `${year}-${month}-${day} ${hours}.${min}.${sec}`;
  return nowTime;
}
