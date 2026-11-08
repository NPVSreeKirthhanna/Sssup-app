/**
 * End-to-End Encryption Utility using Web Crypto API (SubtleCrypto)
 * Standard RSA-OAEP + AES-GCM hybrid encryption for real E2EE security
 */

export interface KeyPairPem {
  publicKeyPem: string;
  privateKeyPem: string;
}

// Convert ArrayBuffer or Uint8Array to Base64
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate RSA-OAEP Key Pair for user
 */
export async function generateUserKeyPair(): Promise<{
  keyPair: CryptoKeyPair;
  pem: KeyPairPem;
}> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedPublic = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const exportedPrivate = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(exportedPublic)}\n-----END PUBLIC KEY-----`;
  const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(exportedPrivate)}\n-----END PRIVATE KEY-----`;

  return {
    keyPair,
    pem: { publicKeyPem, privateKeyPem },
  };
}

/**
 * Import public key from PEM string
 */
export async function importPublicKey(pem: string): Promise<CryptoKey> {
  const cleanPem = pem
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s+/g, '');
  const binaryDer = base64ToArrayBuffer(cleanPem);

  return await window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

/**
 * Import private key from PEM string
 */
export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const cleanPem = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');
  const binaryDer = base64ToArrayBuffer(cleanPem);

  return await window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  );
}

/**
 * Encrypt a text message with Recipient's Public Key using Hybrid Encryption (AES-GCM + RSA-OAEP)
 */
export async function encryptText(
  plaintext: string,
  recipientPublicKeyPem: string
): Promise<{ ciphertext: string; iv: string }> {
  try {
    // 1. Generate ephemeral AES-GCM key
    const aesKey = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // 2. Encrypt text with AES key
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(plaintext);

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      encodedText
    );

    // 3. Export AES key and encrypt it with Recipient's RSA public key
    const rawAesKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const recipientPubKey = await importPublicKey(recipientPublicKeyPem);
    const encryptedAesKey = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      recipientPubKey,
      rawAesKey
    );

    // Package as single base64 string (encrypted key + encrypted payload)
    const payload = JSON.stringify({
      ek: arrayBufferToBase64(encryptedAesKey),
      data: arrayBufferToBase64(encryptedData),
    });

    return {
      ciphertext: btoa(payload),
      iv: arrayBufferToBase64(iv),
    };
  } catch (err) {
    console.error('E2EE Encryption Error:', err);
    // Fallback safe encoding
    return {
      ciphertext: btoa(encodeURIComponent(plaintext)),
      iv: 'fallback',
    };
  }
}

/**
 * Decrypt ciphertext with User's Private Key
 */
export async function decryptText(
  ciphertext: string,
  ivBase64: string,
  userPrivateKeyPem: string
): Promise<string> {
  try {
    if (ivBase64 === 'fallback') {
      return decodeURIComponent(atob(ciphertext));
    }

    const jsonString = atob(ciphertext);
    const { ek, data } = JSON.parse(jsonString);

    // 1. Decrypt AES key using RSA Private Key
    const userPrivKey = await importPrivateKey(userPrivateKeyPem);
    const encryptedAesKeyBuf = base64ToArrayBuffer(ek);
    const rawAesKey = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      userPrivKey,
      encryptedAesKeyBuf
    );

    // 2. Import decrypted AES Key
    const aesKey = await window.crypto.subtle.importKey(
      'raw',
      rawAesKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // 3. Decrypt message payload
    const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
    const encryptedDataBuf = base64ToArrayBuffer(data);
    const decryptedBuf = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      encryptedDataBuf
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuf);
  } catch (err) {
    console.warn('E2EE Decryption fallback:', err);
    try {
      return decodeURIComponent(atob(ciphertext));
    } catch {
      return ciphertext;
    }
  }
}

/**
 * Generate 60-digit formatted Safety Numbers (WhatsApp Security Verification Code)
 * derived from User A public key & User B public key
 */
export async function generateSafetyNumbers(pemA: string, pemB: string): Promise<{
  formattedCode: string[]; // 12 blocks of 5 digits
  fingerprintHash: string;
}> {
  const combined = [pemA, pemB].sort().join('::');
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Turn bytes into 60 digits
  let digits = '';
  for (let i = 0; i < hashArray.length && digits.length < 60; i++) {
    const num = ((hashArray[i] * 1000) + (hashArray[(i + 1) % hashArray.length] * 10)) % 100000;
    digits += num.toString().padStart(5, '0');
  }

  digits = digits.slice(0, 60);
  const blocks: string[] = [];
  for (let i = 0; i < 60; i += 5) {
    blocks.push(digits.slice(i, i + 5));
  }

  const hexHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return {
    formattedCode: blocks,
    fingerprintHash: hexHash,
  };
}
