'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutModal } from '@/components/ui/checkout-modal'

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
}

type CartItem = {
  menu: MenuItem
  quantity: number
}

function MenuPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('table')
  const customerName = searchParams.get('name') || ''

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('available', true)
      .order('category', { ascending: true })

    if (error) {
      toast.error('Gagal memuat menu')
      console.error(error)
    } else {
      setMenuItems(data || [])
    }
    setLoading(false)
  }

  const addToCart = (menu: MenuItem) => {
    const existingItem = cart.find((item) => item.menu.id === menu.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { menu, quantity: 1 }])
    }
    toast.success(`${menu.name} ditambahkan ke keranjang`)
  }

  const updateQuantity = (menuId: string, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.menu.id === menuId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.menu.price * item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      toast.error('Keranjang masih kosong')
      return
    }
    setCheckoutModalOpen(true)
  }

  const handleCheckoutClose = () => {
    setCheckoutModalOpen(false)
  }

  const handleCheckoutSuccess = () => {
    setCheckoutModalOpen(false)
    // Clear cart after successful checkout
    setCart([])
  }

  const categories = ['minuman', 'makanan', 'snack']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-xl">Memuat menu...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans selection:bg-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Menu Pesanan</h1>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {cart.length}
          </Badge>
        </div>

        <Tabs defaultValue="minuman" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-16 p-2 bg-white rounded-full border-4 border-[#E2F0CB] shadow-sm">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="capitalize text-lg font-bold rounded-full data-[state=active]:bg-[#B5EAD7] data-[state=active]:text-[#2C1810] transition-all duration-300 hover:bg-[#E2F0CB]"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item.id} className="card-cute overflow-hidden group flex flex-row md:flex-col h-28 md:h-auto transition-all duration-300">
                      {item.image_url && (
                        <div className="relative w-28 md:w-full h-full md:h-56 shrink-0 md:rounded-t-[1.8rem] overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 120px, (max-width: 1200px) 50vw, 33vw"
                          />
                          {!item.available && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                              <span className="text-white font-black text-xs md:text-xl px-2 md:px-6 py-1 md:py-2 bg-[#FF9AA2] rounded-full transform -rotate-12 border-2 md:border-4 border-white shadow-lg">
                                Habis!
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 p-3 md:p-5 flex flex-col justify-between">
                        <div className="mb-1 md:mb-4">
                          <h3 className="text-base md:text-xl font-black text-[#4A2C1A] mb-1 line-clamp-1 md:line-clamp-2">{item.name}</h3>
                          <p className="text-gray-500 text-xs md:text-sm line-clamp-2 leading-tight font-medium hidden md:block">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-0 md:pt-4 md:border-t md:border-dashed md:border-gray-200">
                          <p className="text-lg md:text-2xl font-black text-[#FFB7B2]">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                          <Button
                            size="icon"
                            disabled={!item.available}
                            className="h-8 w-8 md:h-12 md:w-12 rounded-full btn-primary bg-[#B5EAD7] hover:bg-[#A3D9C6] text-[#2C1810]"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-5 w-5 md:h-7 md:w-7" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {cart.length > 0 && (
          <div className="mt-8 sticky bottom-4 card-cute !border-4 !border-[#FFDAC1] shadow-2xl bg-white/95 backdrop-blur-md">
            <div className="p-4 bg-[#FFDAC1] border-b-2 border-[#FFE8D6] rounded-t-[1.8rem] flex items-center gap-3">
              <div className="p-2 bg-white rounded-full">
                <ShoppingCart className="h-5 w-5 text-[#4A2C1A]" />
              </div>
              <h2 className="text-xl font-black text-[#4A2C1A]">Keranjang Jajan</h2>
            </div>
            <div className="p-5 space-y-4">
              {cart.map((item) => (
                <div key={item.menu.id} className="flex items-center justify-between p-3 bg-[#FDF6F0] rounded-xl border-2 border-[#FFF0E0]">
                  <div className="flex-1">
                    <p className="font-bold text-[#4A2C1A]">{item.menu.name}</p>
                    <p className="text-sm text-[#FF9AA2] font-black">
                      Rp {item.menu.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1 rounded-full shadow-sm">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-[#FF9AA2] hover:text-white text-[#FF9AA2]"
                      onClick={() => updateQuantity(item.menu.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-black text-[#4A2C1A]">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-[#B5EAD7] hover:text-[#2C1810] text-[#B5EAD7]"
                      onClick={() => updateQuantity(item.menu.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="hidden md:block w-24 text-right font-black text-[#4A2C1A]">
                    Rp {(item.menu.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-dashed border-[#FFDAC1] pt-4 mt-2">
                <div className="flex justify-between text-2xl font-black text-[#4A2C1A]">
                  <span>Total</span>
                  <span className="text-[#FF9AA2]">
                    Rp {getCartTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Button
                className="w-full h-14 text-xl rounded-full btn-primary bg-[#FF9AA2] hover:bg-[#FF8096] text-white shadow-lg shadow-[#FF9AA2]/30"
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Bentar ya...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 font-black">
                    <ShoppingCart className="w-6 h-6" />
                    Kirim Pesanan! 🚀
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        <CheckoutModal
          isOpen={checkoutModalOpen}
          onClose={handleCheckoutClose}
          onSuccess={handleCheckoutSuccess}
          cart={cart}
          total={getCartTotal()}
        />
      </div>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPageContent />
    </Suspense>
  )
}
