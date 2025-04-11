import { NextRequest, NextResponse } from "next/server"
import { dbAdmin } from "@/lib/firebaseAdmin"
import { getAuth } from "firebase-admin/auth"
import { getStorage } from "firebase-admin/storage"

export async function POST(
  request: NextRequest,
  { params }: { params: { rackId: string } }
) {
  try {
    // 認証トークンの検証
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: "認証トークンがありません" },
        { status: 401 }
      )
    }
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getAuth().verifyIdToken(token)
    const uid = decodedToken.uid

    // フォームデータの取得
    const formData = await request.formData()
    const image = formData.get('image') as File
    const rackId = params.rackId

    if (!image) {
      return NextResponse.json(
        { error: "画像がアップロードされていません" },
        { status: 400 }
      )
    }

    // 画像のバリデーション
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "画像ファイルのみアップロード可能です" },
        { status: 400 }
      )
    }

    // 画像をアップロード
    const storage = getStorage()
    const bucket = storage.bucket('closetchronicle-dev.firebasestorage.app')
    const filePath = `users/${uid}/racks/${rackId}/after_image.jpg`
    const file = bucket.file(filePath)
    
    // 既存の画像を削除
    try {
      await file.delete()
    } catch (error) {
      // 既存の画像が存在しない場合は無視
      if (error.code !== 404) {
        throw error
      }
    }

    // 新しい画像をアップロード
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await file.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    })

    // アップロードした画像のダウンロードURLを取得
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // 長期間有効なURLを生成
    })

    // Firestoreに画像URLを保存
    await dbAdmin.collection('users').doc(uid).collection('racks').doc(rackId).update({
      afterimageUrl: url,
      updatedAt: new Date()
    })

    return NextResponse.json(
      { message: "画像のアップロードに成功しました", imageUrl: url },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error in updateafterimage:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    )
  }
} 