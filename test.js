const qrcode = require('qrcode')

const generateQR = async (text)=>{
    const qr = await qrcode.toDataURL(text);
    return qr;
}

let getQrcode = async()=>{
    const qrhmm = await generateQR("sdasdfd");
    console.log(qrhmm);
}

getQrcode();