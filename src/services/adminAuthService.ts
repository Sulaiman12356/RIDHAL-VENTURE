import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'ridhal_admin_session_v1';

// Strictly authorized administrator emails
export const AUTHORIZED_ADMIN_EMAILS = [
  'alhajabizventure@gmail.com',
  'ipesolasulaiman@gmail.com',
  'admin@ridhalventures.com'
];

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();

  // Strict check: only verified authorized admin emails can attempt login
  const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail);
  if (!isAuthorized) {
    throw new Error('Access Denied: Only authenticated, authorized administrators (e.g. alhajabizventure@gmail.com) can access admin management functions.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  // Attempt sign-in with Firebase Auth
  try {
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const adminUser: AdminUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || normalizedEmail,
      displayName: userCredential.user.displayName || normalizedEmail.split('@')[0].toUpperCase(),
      role: 'super_admin'
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
    return adminUser;
  } catch (error: any) {
    // If account doesn't exist yet in Firebase Auth project, provision it for the authorized admin
    if (
      error.code === 'auth/user-not-found' || 
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/invalid-login-credentials'
    ) {
      try {
        const createCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        const adminUser: AdminUser = {
          uid: createCred.user.uid,
          email: createCred.user.email || normalizedEmail,
          displayName: normalizedEmail.split('@')[0].toUpperCase() + ' (Administrator)',
          role: 'super_admin'
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        return adminUser;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          throw new Error('Incorrect administrator password. Please check your credentials.');
        }
        throw new Error(createErr.message || 'Authentication error.');
      }
    }
    throw new Error(error.message || 'Authentication failed. Please verify your credentials.');
  }
}

export function isAuthorizedAdminEmail(email: string): boolean {
  return AUTHORIZED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch {
    // ignore
  }
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

