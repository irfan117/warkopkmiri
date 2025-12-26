export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-950 to-orange-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-amber-200 text-lg">Memuat Kemiri Cafe...</p>
      </div>
    </div>
  )
}

