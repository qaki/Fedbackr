import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

function getEncryptionKey(): Buffer {
  const key = process.env.APP_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('APP_ENCRYPTION_KEY environment variable is required');
  }
  
  // If key is hex string, convert to buffer
  if (key.length === 64) {
    return Buffer.from(key, 'hex');
  }
  
  // Otherwise, derive key from string using PBKDF2
  return crypto.pbkdf2Sync(key, 'reviewpilot-salt', 100000, KEY_LENGTH, 'sha256');
}

export function encrypt(text: string): string {
  if (!text) return '';
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('reviewpilot', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine iv + tag + encrypted data
    const combined = Buffer.concat([iv, tag, Buffer.from(encrypted, 'hex')]);
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(encryptedData: string): string {
  if (!encryptedData) return '';
  
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract iv, tag, and encrypted data
    const iv = combined.subarray(0, IV_LENGTH);
    const tag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from('reviewpilot', 'utf8'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Helper function to generate a secure encryption key
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

// Utility to encrypt/decrypt token fields transparently
export const TokenEncryption = {
  encrypt: (token: string | null | undefined): string | null => {
    if (!token) return null;
    return encrypt(token);
  },
  
  decrypt: (encryptedToken: string | null | undefined): string | null => {
    if (!encryptedToken) return null;
    try {
      return decrypt(encryptedToken);
    } catch (error) {
      console.error('Token decryption failed:', error);
      return null;
    }
  }
};
