import { createCipheriv, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
//import { Injectable } from '@nestjs/common';

//@Injectable()
export class Encryptor {
  private iv: Buffer;
  private passwordKey: string;
  private key: Buffer;
  constructor(iv: Buffer, passwordKey: string) {
    this.iv = iv;
    this.passwordKey = passwordKey;
  }

  async encryptText(text: string): Promise<string> {
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(
      this.passwordKey,
      'salt',
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, this.iv);

    const textEncrypted = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]).toString('base64');

    return textEncrypted;
  }

  async decryptText(encryptedText: string): Promise<string> {
    const key = (await promisify(scrypt)(
      this.passwordKey,
      'salt',
      32,
    )) as Buffer;

    const decipher = createDecipheriv('aes-256-ctr', key, this.iv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'base64')),
      decipher.final(),
    ]).toString();

    return decryptedText;
  }
}
