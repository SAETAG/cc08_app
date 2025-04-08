import { User, signInAnonymously, getAuth } from 'firebase/auth';
import { firebaseAuth, db } from './firebase';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';

const COOKIE_CUSTOM_ID = 'user_id';
const COOKIE_FIREBASE_UID = 'firebase_uid';
const COOKIE_PLAYFAB_ID = 'playfab_id';
const COOKIE_SESSION_TICKET = 'session_ticket';

// カスタムIDの生成（8文字のランダムな文字列）
export const generateCustomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// カスタムIDの取得または新規作成
export const getOrCreateCustomId = () => {
  let customId = Cookies.get(COOKIE_CUSTOM_ID);

  if (!customId) {
    customId = generateCustomId();
    Cookies.set(COOKIE_CUSTOM_ID, customId, {
      expires: 365,
      secure: true,
      sameSite: 'strict'
    });
  }

  return customId;
};

// Firebase匿名ログインを保証
export async function ensureFirebaseAuth(): Promise<User> {
  const auth = getAuth();
  if (!auth.currentUser) {
    const cred = await signInAnonymously(auth);
    return cred.user;
  }
  return auth.currentUser;
}

// PlayFabに Firebase IDトークンでログイン
export async function loginToPlayFabWithFirebase(firebaseIdToken: string) {
  const res = await fetch(`/api/playfab-login-with-firebase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firebaseToken: firebaseIdToken }),
  });
  const data = await res.json();
  return data;
}

// Firestoreにユーザー情報を保存
export async function saveUserToFirestore(firebaseUser: User, playfabId: string) {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  
  // 既存のドキュメントを確認
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    // 新規ユーザーの場合
    const userData = {
      firebaseUid: firebaseUser.uid,
      playfabId: playfabId,
      username: "冒険者",
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    };
    await setDoc(userDocRef, userData);
  } else {
    // 既存ユーザーの場合は lastLoginAt と playfabId のみ更新
    await setDoc(userDocRef, {
      lastLoginAt: Timestamp.now(),
      playfabId: playfabId,
    }, { merge: true });
  }
}

// PlayFabのセッション情報をCookieに保存
export function savePlayFabSession(playfabId: string, sessionTicket: string) {
  Cookies.set(COOKIE_PLAYFAB_ID, playfabId, {
    expires: 365,
    secure: true,
    sameSite: 'strict'
  });
  
  Cookies.set(COOKIE_SESSION_TICKET, sessionTicket, {
    expires: 1, // セッションチケットは1日で期限切れ
    secure: true,
    sameSite: 'strict'
  });
}

// PlayFabログイン
export const loginToPlayFab = async (customId: string) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "PlayFabログインに失敗しました");
  }

  return res.json();
};

// Firebase認証状態の確認と必要に応じて匿名ログイン
export const ensureFirebaseAuthOld = async () => {
  // 現在のユーザーを確認
  const currentUser = firebaseAuth.currentUser;
  
  if (currentUser) {
    console.log("✅ Already signed in to Firebase:", currentUser.uid);
    return currentUser;
  }

  // 保存されているUIDがあるか確認
  const savedUid = Cookies.get(COOKIE_FIREBASE_UID);
  if (savedUid) {
    try {
      // Firestoreでユーザーデータを確認
      const userDocRef = doc(db, "users", savedUid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // 匿名ログインを試みる
        const { user } = await signInAnonymously(firebaseAuth);
        
        if (user.uid === savedUid) {
          console.log("✅ Firebase session restored with same UID:", user.uid);
          return user;
        } else {
          // UIDが変わってしまった場合は、新しいUIDで情報を更新
          console.log("⚠️ Firebase UID changed:", savedUid, "->", user.uid);
          const oldData = userDoc.data();
          
          // 古いデータを新しいUIDで保存
          const newUserDocRef = doc(db, "users", user.uid);
          await setDoc(newUserDocRef, {
            ...oldData,
            firebaseUid: user.uid,
            lastLoginAt: Timestamp.now(),
          });
          
          // 古いドキュメントを削除（オプション）
          // await deleteDoc(userDocRef);
          
          // 新しいUIDをCookieに保存
          Cookies.set(COOKIE_FIREBASE_UID, user.uid, {
            expires: 365,
            secure: true,
            sameSite: 'strict'
          });
          
          return user;
        }
      }
    } catch (error) {
      console.error("Error restoring Firebase session:", error);
    }
  }

  // 新規匿名ログインが必要な場合
  const { user } = await signInAnonymously(firebaseAuth);
  console.log("✅ New Firebase anonymous login:", user.uid);
  
  // UIDをCookieに保存
  Cookies.set(COOKIE_FIREBASE_UID, user.uid, {
    expires: 365,
    secure: true,
    sameSite: 'strict'
  });

  return user;
}; 