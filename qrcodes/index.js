var qrCode = require('qrcode-npm')

var qr = qrCode.qrcode(4, 'M');
qr.addData("text");
qr.make();
console.log(qr.createImgTag(4));    // creates an <img> tag as text