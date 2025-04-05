// lib/firebase.ts

// Firebase App (the core Firebase SDK)
import { initializeApp, getApps, getApp } from "firebase/app"

// Firebase Services
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

// ✅ Firebase config from .env.local
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: "closetchronicle-dev.firebasestorage.app",  // バケット名を修正
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// ✅ Firebase App 初期化（再初期化を防ぐ）
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// ✅ Firestore と Storage と Auth をエクスポート
export const firebaseApp = app
export const db = getFirestore(app)
export const storage = getStorage(app, "gs://closetchronicle-dev.firebasestorage.app")  // ストレージのURLを指定
export const firebaseAuth = getAuth(app)
