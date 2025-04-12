import Image from 'next/image'

export default function BasePage() {
  return (
    <div className="relative w-full h-screen">
      <Image
        src="/base.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-fuchsia-800/60" />
    </div>
  )
}
