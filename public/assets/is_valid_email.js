export default function validateEmail(email) {
	if (!email.includes('@')) return false;
	if (!email.includes('.')) return false;
	if (email.split('@').length !== 2) return false;
	if (email.split('.').length < 2) return false;

	const userName = email.split('@')[0];
	const domainName = email.split('@')[1];
	const mailDomain = domainName.split('.')[0];
	const domain = domainName.split('.')[1];

	if (userName.length > 0 && mailDomain.length > 0 && domain.length > 0) return true;

	return false;
}
