export default function postSize() {
	text = text.split(' ')
	let res = []
	for (let i = 0; i < text.length; i++) {
		if (!text[i].startsWith('http:') && !text[i].startsWith('https:') && !text[i].startsWith('www.') && !text[i].includes('.com') && !text[i].includes('.ru') && !text[i].includes('.org') && !text[i].includes('.net')) {
			res.push(text[i])
		}
	}
	return res.join(' ').length;
}