import { createCipheriv, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import { randomBytes } from 'crypto';

const RANDOM_BYTES = [
  0x43, 0x02, 0xbb, 0xc1, 0xac, 0xf7, 0xb5, 0x8f, 0x8c, 0x83, 0x55, 0x5a, 0x98,
  0x23, 0x82, 0x8f,
];

export class Encryptor {
  private static readonly staticIv: Buffer = Buffer.from(RANDOM_BYTES);
  private iv?: Buffer;
  private key: Buffer;

  constructor(private passwordKey: string, randomIv: boolean = false) {
    if (randomIv) {
      this.iv = randomBytes(16);
    }
  }

  async encryptText(text: string): Promise<string> {
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    await this.generateKey();
    const currentIv = this.iv ? this.iv : Encryptor.staticIv;
    const cipher = createCipheriv('aes-256-ctr', this.key, currentIv);
    const textEncrypted = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]).toString('base64');
    return textEncrypted;
  }

  async decryptText(encryptedText: string): Promise<string> {
    await this.generateKey();
    const currentIv = this.iv ? this.iv : Encryptor.staticIv;
    const decipher = createDecipheriv('aes-256-ctr', this.key, currentIv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'base64')),
      decipher.final(),
    ]).toString();

    return decryptedText;
  }

  private async generateKey(): Promise<Buffer> {
    this.key = (await promisify(scrypt)(
      this.passwordKey,
      'salt',
      32,
    )) as Buffer;
    return this.key;
  }
}
