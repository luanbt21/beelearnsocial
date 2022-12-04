import QRCode from 'easyqrcodejs-nodejs'

const qrcode = new QRCode({
	text: 'https://beelearn.social/',
	logo: 'static/logo.png',
	width: 500,
	height: 500,
	dotScale: 0.9,
	quietZone: 20,
	title: 'BeeLearnSocial',
	titleTop: -5,
})

qrcode.saveImage({
	path: 'qrcode.png',
})
