let CryptoJS = require("crypto-js");

/** Функция для шифрования текста */
export const encrypt = (text, key) => {
    let encrypt_text = CryptoJS.AES.encrypt(JSON.stringify(text), key).toString()
    if(encrypt_text) {
        return encrypt_text
    } else {
        return ''
    }
}

/** Функция для расшифровки текста */
export const decrypt = (text, key) => {
    try {
        let bytes = CryptoJS.AES.decrypt(text, key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        localStorage.setItem('access', '')
        localStorage.setItem('refresh', '')
        document.location.href = '/'
    }
}

