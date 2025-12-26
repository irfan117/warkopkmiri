'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type Order = {
  id: string
  table_number: number
  customer_name: string
  total_amount: number
  created_at: string
}

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!error && data) {
      setOrder(data)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-600" />
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl">Pesanan Berhasil Dibuat!</CardTitle>
          <CardDescription className="text-base mt-2">
            Pesanan Anda telah direkam dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {order && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Nomor Meja:</span>
                <span className="font-bold text-lg">{order.table_number}</span>
              </div>
              {order.customer_name && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Nama:</span>
                  <span className="font-bold text-lg">{order.customer_name}</span>
                </div>
              )}
              <div className="border-t border-amber-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold text-lg">Total:</span>
                  <span className="font-bold text-2xl text-amber-600">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-1">Silakan Bayar untuk Memproses Pesanan</h3>
                <p className="text-sm text-blue-700">
                  Lakukan pembayaran di kasir untuk memproses pesanan Anda. Setelah pembayaran, pesanan akan segera diproses dan disiapkan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> Pesanan dapat dikelompokkan dengan pesanan lain dari meja yang sama. Semua pesanan yang sudah dibayar akan diproses bersamaan.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/order/select-table" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                Pesan Lagi
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full h-12 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-medium shadow-lg shadow-amber-700/30 hover:shadow-amber-800/50 transition-all duration-300">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
