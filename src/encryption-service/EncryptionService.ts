import crypto from 'crypto';
import { EncryptionParams } from './models/EncryptionParams';

export class EncryptionService {
  constructor(private passwordKey: string) {}

  encrypt(value: string): string {
    const key = Buffer.from(this.passwordKey.substring(32), 'hex');
    const iv = Buffer.from(this.passwordKey.substring(0, 32), 'hex');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(value, 'utf16le' as any, 'base64' as any);
    encrypted += cipher.final('base64');

    return encrypted;
  }

  decrypt(value: string): string {
    const key = Buffer.from(this.passwordKey.substring(32), 'hex');
    const iv = Buffer.from(this.passwordKey.substring(0, 32), 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(value, 'base64' as any, 'utf16le' as any);
    decrypted += decipher.final('utf16le');

    return decrypted;
  }

  encryptPersonalized({
    value,
    inputCharEncoding,
    outputCharEncoding,
    cipherAlgorithm,
    cipherKey,
    binaryIv,
  }: EncryptionParams): string {
    const key = cipherKey ?? Buffer.from(this.passwordKey.substring(32), 'hex');
    const iv =
      binaryIv ?? Buffer.from(this.passwordKey.substring(0, 32), 'hex');

    const cipher = crypto.createCipheriv(cipherAlgorithm, key, iv);

    const inputEncoding = inputCharEncoding;
    const outputEncoding = outputCharEncoding;
    let encrypted = cipher.update(
      value,
      inputEncoding as any,
      outputEncoding as any,
    );
    encrypted += cipher.final(outputCharEncoding);

    return encrypted;
  }

  /** To decrypt successfully
   *  your inputCharEncoding must equal the value of outputCharEncoding you provided in the encryption
   *  your outputCharEncoding must equal the value of inputCharEncoding you provided in the encryption
   */
  decryptPersonalized({
    value,
    inputCharEncoding,
    outputCharEncoding,
    cipherAlgorithm,
    cipherKey,
    binaryIv,
  }: EncryptionParams): string {
    const key = cipherKey ?? Buffer.from(this.passwordKey.substring(32), 'hex');
    const iv =
      binaryIv ?? Buffer.from(this.passwordKey.substring(0, 32), 'hex');

    const decipher = crypto.createDecipheriv(cipherAlgorithm, key, iv);

    const inputEncoding = inputCharEncoding;
    const outputEncoding = outputCharEncoding;
    let decrypted = decipher.update(
      value,
      inputEncoding as any,
      outputEncoding as any,
    );
    decrypted += decipher.final(outputCharEncoding);

    return decrypted;
  }
}
