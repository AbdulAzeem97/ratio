// auth.ts
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'ups_optimizer_auth';
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'default-secret';

interface StoredUser {
  username: string;
  passwordHash: string;
  role: 'admin' | 'user';
  lastLogin: string;
}

const users: StoredUser[] = [
  {
    username: import.meta.env.VITE_ADMIN_USER || 'admin',
    passwordHash: bcrypt.hashSync(
      import.meta.env.VITE_ADMIN_PASS || 'admin123',
      10
    ),
    role: 'admin',
    lastLogin: new Date().toISOString()
  },
  {
    username: import.meta.env.VITE_USER || 'user',
    passwordHash: bcrypt.hashSync(
      import.meta.env.VITE_USER_PASS || 'user123',
      10
    ),
    role: 'user',
    lastLogin: new Date().toISOString()
  }
];

export const login = async (username: string, password: string) => {
  const user = users.find(u => u.username === username);

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid password');
  }

  user.lastLogin = new Date().toISOString();
  const token = generateToken(user);

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify({ user, token }),
    SECRET_KEY
  ).toString();

  localStorage.setItem(STORAGE_KEY, encrypted);

  return {
    username: user.username,
    role: user.role,
    lastLogin: user.lastLogin
  };
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const checkAuth = () => {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const { user, token } = JSON.parse(decrypted);

    const decoded: any = jwtDecode(token);
    if (!decoded || !decoded.exp || decoded.exp < Date.now() / 1000) {
      logout();
      return null;
    }

    return {
      username: user.username,
      role: user.role,
      lastLogin: user.lastLogin
    };
  } catch (err) {
    logout();
    return null;
  }
};

const generateToken = (user: StoredUser) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  const payload = {
    sub: user.username,
    role: user.role,
    iat: Date.now() / 1000,
    exp: (Date.now() / 1000) + (24 * 60 * 60)
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, SECRET_KEY).toString();

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
