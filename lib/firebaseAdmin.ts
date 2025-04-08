import * as admin from 'firebase-admin'
import { getApps } from 'firebase-admin/app'

// サービスアカウントの初期化
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Firebase Adminの初期化
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

// Firestoreの初期化
export const dbAdmin = admin.firestore()

// トークン検証関数
export const verifyTokenOrThrow = async (token: string): Promise<string> => {
  if (!token || !token.startsWith('Bearer ')) {
    throw new Error('認証トークンが不正です')
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token.split('Bearer ')[1])
    return decodedToken.uid
  } catch (error) {
    console.error('Token verification failed:', error)
    throw new Error('認証に失敗しました')
  }
} 