'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminNotFound() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/admin/login')
        return
      }

      // Check if user is admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (error || !profile?.is_admin) {
        router.replace('/admin/login')
        return
      }

      // If authenticated and admin, redirect to dashboard
      router.replace('/admin/dashboard')
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat halaman admin...</p>
      </div>
    </div>
  )
}