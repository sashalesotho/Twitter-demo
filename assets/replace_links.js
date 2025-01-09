export default function replaceLinks(text) {
  const res = text.split(' ').map((el) => {
    if (el.includes('.com') || el.includes('.ru') || el.includes('.org') || el.includes('.рф') || el.includes('.info') || el.includes('.net') || el.includes('.xyz')) {
      if (el[el.length - 1] === '.' || el[el.length - 1] === '!' || el[el.length - 1] === '?' || el[el.length - 1] === ',') {
        return `<a href='${el.slice(0, -1)}'>${el.slice(0, -1)}</a>${el.slice(-1)}`;
      }
      return `<a href='${el}'>${el}</a>`;
    }
    return el;
  });
  return res.join(' ');
}
