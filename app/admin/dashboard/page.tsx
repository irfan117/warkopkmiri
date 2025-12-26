'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'

type Order = {
  id: string
  table_number: number
  customer_name: string
  status: 'menunggu_pembayaran' | 'dibayar' | 'selesai'
  total_amount: number
  created_at: string
}

type OrderWithItems = Order & {
  items: {
    menu: { name: string }
    quantity: number
    subtotal: number
  }[]
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()

    // Setup real-time subscription untuk orders
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order changed:', payload)
          // Refresh orders saat ada perubahan
          fetchOrders()
          
          // Show notification untuk pesanan baru
          if (payload.eventType === 'INSERT') {
            toast.success('Pesanan baru masuk!', {
              description: `Meja ${payload.new.table_number}`,
            })
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Status pesanan diperbarui', {
              description: `Meja ${payload.new.table_number}`,
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
        },
        () => {
          // Refresh orders saat order_items berubah
          fetchOrders()
        }
      )
      .subscribe()

    // Cleanup subscription saat component unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchOrders = async () => {
    // Dapatkan awal hari ini (00:00:00)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.toISOString()

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          subtotal,
          menu (name)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat pesanan')
      console.error(error)
    } else {
      // Filter: untuk pesanan selesai, hanya tampilkan yang dibuat hari ini
      const filteredData = data.filter((order: any) => {
        if (order.status === 'selesai') {
          const orderDate = new Date(order.created_at)
          return orderDate >= today
        }
        return true // Tampilkan semua pesanan dengan status selain 'selesai'
      })

      const formattedOrders = filteredData.map((order: any) => ({
        ...order,
        items: order.order_items.map((item: any) => ({
          menu: item.menu,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      }))
      setOrders(formattedOrders)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: 'dibayar' | 'selesai') => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      toast.error('Gagal memperbarui status')
      console.error(error)
    } else {
      toast.success('Status berhasil diperbarui')
      fetchOrders()
    }
  }

  const filterOrders = (status: string) => {
    return orders.filter((order) => order.status === status)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      menunggu_pembayaran: { variant: 'destructive', label: 'Menunggu Pembayaran' },
      dibayar: { variant: 'default', label: 'Dibayar' },
      selesai: { variant: 'secondary', label: 'Selesai' },
    }
    return variants[status] || { variant: 'default', label: status }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola pesanan dan pantau status pembayaran
            <span className="ml-2 text-xs text-green-600">● Real-time</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Menunggu Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600">
                {filterOrders('menunggu_pembayaran').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dibayar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">
                {filterOrders('dibayar').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Selesai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                {filterOrders('selesai').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="menunggu_pembayaran" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="menunggu_pembayaran" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              <span className="hidden sm:inline">Menunggu Pembayaran</span>
              <span className="sm:hidden">Menunggu</span>
            </TabsTrigger>
            <TabsTrigger value="dibayar" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Dibayar
            </TabsTrigger>
            <TabsTrigger value="selesai" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Selesai
            </TabsTrigger>
          </TabsList>

          {['menunggu_pembayaran', 'dibayar', 'selesai'].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="space-y-4">
                {filterOrders(status).map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg sm:text-xl">Meja {order.table_number}</CardTitle>
                          {order.customer_name && (
                            <p className="text-sm text-gray-600 mt-1">{order.customer_name}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <Badge {...getStatusBadge(order.status)} className="self-start sm:self-auto">
                          {getStatusBadge(order.status).label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.menu.name}
                            </span>
                            <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-blue-600">
                            Rp {order.total_amount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'menunggu_pembayaran' && (
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => updateOrderStatus(order.id, 'dibayar')}
                          >
                            Tandai Dibayar
                          </Button>
                        )}
                        {order.status === 'dibayar' && (
                          <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateOrderStatus(order.id, 'selesai')}
                          >
                            Tandai Selesai
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterOrders(status).length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      Tidak ada pesanan dengan status ini
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
    </div>
  )
}
