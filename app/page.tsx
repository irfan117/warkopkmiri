'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Menu Pesanan</h1>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {cart.length}
          </Badge>
        </div>

        <Tabs defaultValue="minuman" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize text-base">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      {item.image_url && (
                        <div className="relative w-full h-48">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-amber-600">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => addToCart(item)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah ke Keranjang
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {cart.length > 0 && (
          <Card className="mt-8 sticky bottom-4 bg-white shadow-lg border-2 border-amber-200">
            <CardHeader className="bg-amber-50 border-b">
              <CardTitle>Keranjang Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map((item) => (
                <div key={item.menu.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.menu.name}</p>
                    <p className="text-sm text-gray-600">
                      Rp {item.menu.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.menu.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.menu.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-24 text-right font-medium">
                    Rp {(item.menu.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">
                    Rp {getCartTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full h-11 sm:h-12 text-base sm:text-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-semibold shadow-xl shadow-amber-700/40 hover:shadow-amber-800/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses Pesanan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Kirim Pesanan
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPageContent />
    </Suspense>
  )
}