import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class EncryptDecryptService {

    public secretKey = "o9szYIOq1rRMiouNhNvaq96lqUvCekxR";

    constructor() {
    }

    encrypt(value: string): string {
        let key = CryptoJS.enc.Base64.parse(this.secretKey);
        let srcs = CryptoJS.enc.Utf8.parse(value);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
    }

    // decrypt(textToDecrypt: string) {
    //     let key = CryptoJS.enc.Base64.parse(this.secretKey).toString();
    //     let srcs = CryptoJS.enc.Utf8.parse(textToDecrypt);
    //     let encrypted = CryptoJS.AES.decrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    //     return encrypted.toString();
    // }
}
