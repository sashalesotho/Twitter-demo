export default function postSize(text) {
  const textArr = text.split(' ');
  const res = [];
  for (let i = 0; i < textArr.length; i += 1) {
    if (!textArr[i].startsWith('http:') && !textArr[i].startsWith('https:') && !textArr[i].startsWith('www.') && !textArr[i].includes('.com') && !textArr[i].includes('.ru') && !textArr[i].includes('.org') && !textArr[i].includes('.net')) {
      res.push(textArr[i]);
    }
  }
  return res.join(' ').length;
}
