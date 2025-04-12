import Image from 'next/image'

export default function CavePage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <Image
          src="/cave.png"
          alt="Cave background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-amber-800/60" />
      </div>
      <div className="relative z-10">
        {/* ここにコンテンツを追加できます */}
      </div>
    </div>
  )
}
