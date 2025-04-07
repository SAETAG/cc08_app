import * as admin from 'firebase-admin';

// すでに初期化済みでなければ行う
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Admin権限を使った Firestore への参照
export const dbAdmin = admin.firestore();

// ユーザー認証トークンを検証する共通関数
export async function verifyTokenOrThrow(bearer: string): Promise<string> {
  if (!bearer) throw new Error('認証ヘッダーが見つかりません');
  const token = bearer.replace('Bearer ', '');
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded.uid; // UIDを返す
} 