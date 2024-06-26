import { createCipheriv, createDecipheriv, scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'
import { EncryptionParams } from './models/EncryptionParams'

export class EncryptionService {
  constructor(private passwordKey: string) {}

  async encrypt(value: string): Promise<string> {
    const key = await this.generateKey()
    const iv = randomBytes(16) // CBC mode requires a 16-byte IV

    const cipher = createCipheriv('aes-256-cbc', key, iv)
    const valueEncrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])

    // Store the IV along with the encrypted value
    return `${iv.toString('hex')}:${valueEncrypted.toString('base64')}`
  }

  async decrypt(encryptedValue: string): Promise<string> {
    const [ivHex, valueEncrypted] = encryptedValue.split(':')
    const key = await this.generateKey()
    const iv = Buffer.from(ivHex, 'hex')

    const decipher = createDecipheriv('aes-256-cbc', key, iv)
    const decryptedValue = Buffer.concat([decipher.update(Buffer.from(valueEncrypted, 'base64')), decipher.final()]).toString('utf8')

    return decryptedValue
  }

  private async generateKey(): Promise<Buffer> {
    return (await promisify(scrypt)(this.passwordKey, 'salt', 32)) as Buffer
  }

  encryptPersonalized(params: EncryptionParams): string {
    const key = params.cipherKey ?? Buffer.from(this.passwordKey.substring(32), 'hex')
    const iv = params.binaryIv ?? Buffer.from(this.passwordKey.substring(0, 32), 'hex')

    const cipher = createCipheriv(params.cipherAlgorithm, key, iv)

    const encrypted = Buffer.concat([cipher.update(params.value, params.inputCharEncoding), cipher.final()]).toString(params.outputCharEncoding)

    return encrypted
  }

  /** To decrypt successfully
   *  your inputCharEncoding must equal the value of outputCharEncoding you provided in the encryption
   *  your outputCharEncoding must equal the value of inputCharEncoding you provided in the encryption
   */
  decryptPersonalized(params: EncryptionParams): string {
    const key = params.cipherKey ?? Buffer.from(this.passwordKey.substring(32), 'hex')
    const iv = params.binaryIv ?? Buffer.from(this.passwordKey.substring(0, 32), 'hex')

    const decipher = createDecipheriv(params.cipherAlgorithm, key, iv)

    const decrypted = Buffer.concat([decipher.update(Buffer.from(params.value, params.inputCharEncoding)), decipher.final()]).toString(
      params.outputCharEncoding,
    )

    return decrypted
  }
}
