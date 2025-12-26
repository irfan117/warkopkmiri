'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  TrendingUp, 
  LogOut, 
  Coffee,
  X,
  AlignJustify,
  Image as ImageIcon,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Manajemen Menu',
    href: '/admin/menu',
    icon: MenuIcon,
  },
  {
    name: 'Gambar Homepage',
    href: '/admin/homepage-images',
    icon: ImageIcon,
  },
  {
    name: 'Kontak & Jam Operasional',
    href: '/admin/contact',
    icon: Phone,
  },
  {
    name: 'Laporan Penjualan',
    href: '/admin/sales',
    icon: TrendingUp,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [pathname, isLoginPage])

  const checkAuth = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        router.push('/admin/login')
        return
      }

      if (!session) {
        router.push('/admin/login')
        return
      }

      // Enforce admin access based on profiles.is_admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        await supabase.auth.signOut()
        toast.error('Terjadi kesalahan saat memverifikasi akses admin.')
        router.push('/admin/login')
        return
      }

      if (!profile?.is_admin) {
        await supabase.auth.signOut()
        toast.error('Akses ditolak. Akun ini bukan admin.')
        router.push('/admin/login')
        return
      }

      setLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      toast.error('Terjadi kesalahan saat memeriksa autentikasi.')
      router.push('/admin/login')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logout berhasil')
    router.push('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Cafe Admin</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <AlignJustify className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">Cafe Admin</h1>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
