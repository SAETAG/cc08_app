import { NextResponse } from 'next/server'
import { dbAdmin, verifyTokenOrThrow } from '@/app/lib/firebaseAdmin'

export async function POST(
  req: Request
) {
  try {
    console.log('Username update request received');
    
    // トークン検証
    const authHeader = req.headers.get("Authorization")
    const uid = await verifyTokenOrThrow(authHeader ?? "")
    console.log('User ID:', uid);

    if (!uid) {
      console.error('Unauthorized: No user ID');
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { username } = await req.json()
    console.log('Request body:', { username });

    if (!username || typeof username !== 'string') {
      console.error('Bad Request: Invalid username');
      return new NextResponse('Bad Request: Invalid username', { status: 400 });
    }

    try {
      // ユーザー情報の更新
      const userRef = dbAdmin.collection('users').doc(uid)
      console.log('Updating user:', userRef.path);
      
      // 更新を実行
      await userRef.update({
        username: username,
        updatedAt: new Date()
      });
      console.log('Update successful');

      // 更新後のデータを取得して返す
      const updatedUser = await userRef.get()
      const userData = updatedUser.data()
      console.log('Updated user data:', userData);
      
      return NextResponse.json(userData)
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return new NextResponse('Database operation failed', { status: 500 })
    }
  } catch (error) {
    console.error('[USER_UPDATE] Unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 })
  }
} 