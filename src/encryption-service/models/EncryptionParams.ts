export enum EncodingType {
  UTF8 = 'utf8',
  UTF16LE = 'utf16le',
  BASE64 = 'base64',
  HEX = 'hex',
}

export enum CipherAlgorithm {
  CBC = 'aes-256-cbc',
  CTR = 'aes-256-ctr',
}

export interface EncryptionParams {
  value: string;
  inputCharEncoding: EncodingType;
  outputCharEncoding: EncodingType;
  cipherAlgorithm: CipherAlgorithm;
  cipherKey: string | Buffer;
  binaryIv: string | Buffer;
}
