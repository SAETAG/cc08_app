"use client"

import { FallingLeaves } from "@/components/falling-leaves"

export default function ForestChallenge() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 to-orange-800 text-white relative overflow-hidden">
      {/* Forest background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/forest.png')] bg-cover bg-center" />
        <div className="absolute top-0 left-0 w-full h-full bg-cyan-800 opacity-60" />
      </div>
      <FallingLeaves />

      {/* Gold decorative elements */}
      <div className="absolute left-0 right-0 top-16 h-40 overflow-hidden opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-yellow-400 blur-xl" />
        <div className="absolute top-10 right-1/3 w-40 h-40 rounded-full bg-amber-500 blur-xl" />
        <div className="absolute top-5 left-2/3 w-24 h-24 rounded-full bg-yellow-500 blur-xl" />
      </div>
    </div>
  )
}

