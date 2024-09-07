export default function highlightHashtags(text) {
  const arr = text.split(' ');
  const res = arr.map((el) => {
    if (el[0] === '#') {
      if (el[el.length - 1] === '.' || el[el.length - 1] === '!' || el[el.length - 1] === '?' || el[el.length - 1] === ',') return `<a href='/search?tag=${el.slice(1, -1)}' >${el.slice(0, -1)}</a>${el.slice(-1)}`;
      return `<a href='/search?tag=${el.slice(1)}' >${el}</a>`;
    }
    return el;
  });
  return res.join(' ');
}
