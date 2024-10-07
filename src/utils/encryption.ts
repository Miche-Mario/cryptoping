import CryptoJS from 'crypto-js';

export const encryptSensitiveData = (data: any) => {
  const sensitiveData = JSON.stringify({
    accountNumber: data.accountNumber,
    routingNumber: data.routingNumber,
    cardNumber: data.cardNumber,
    expirationDate: data.expirationDate,
    cvv: data.cvv,
    accountName: data.accountName,

    bankAddress: data.bankAddress,
    swiftCode: data.swiftCode,
    bankName: data.bankName,

    pin: data.pin, // Include PIN for credit card withdrawals
  });

  const iv = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.lib.WordArray.random(32);
  const encrypted = CryptoJS.AES.encrypt(sensitiveData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return `${iv.toString()}.${encrypted.toString()}.${key.toString()}`;
};
