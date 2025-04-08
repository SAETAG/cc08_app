import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

export async function POST(
  req: Request,
  { params }: { params: { rackId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { stepsGenerated } = await req.json()

    // ハンガーラックの更新
    const rackRef = doc(db, 'racks', params.rackId)
    await updateDoc(rackRef, {
      stepsGenerated,
      updatedAt: new Date(),
    })

    const rack = await getDoc(rackRef)
    return NextResponse.json(rack.data())
  } catch (error) {
    console.error('[RACK_UPDATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 