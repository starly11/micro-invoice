import React from 'react'

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar placeholder */}
      <div className="h-16 border-b-5 border-zinc-800 flex items-center px-6">
        Navbar
      </div>

      {/* Hero section */}
      <section className="py-20 px-6">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
          Write better content, faster.
        </h1>
        <p className="text-zinc-400 max-w-xl">
          Lumina AI helps creators generate high-quality content
          in seconds using artificial intelligence.
        </p>
      </section>

    </div>
  )
}

export default App

