'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Download, Trash2, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { toast } from 'sonner'

type SalesData = {
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  paidRevenue: number
  completedOrders: number
  completedRevenue: number
  pendingOrders: number
  pendingRevenue: number
}

type RecentOrder = {
  id: string
  table_number: number
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminSalesPage() {
  const [salesData, setSalesData] = useState<SalesData>({
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    paidRevenue: 0,
    completedOrders: 0,
    completedRevenue: 0,
    pendingOrders: 0,
    pendingRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  useEffect(() => {
    fetchSalesData()
    // Auto-delete data > 1 bulan setiap kali halaman dimuat
    autoDeleteOldData()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchSalesData(selectedDate)
    }
  }, [selectedDate])

  const fetchSalesData = async (date?: Date) => {
    const targetDate = date || new Date()
    const startDate = new Date(targetDate)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(targetDate)
    endDate.setHours(23, 59, 59, 999)

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      toast.error('Gagal memuat data penjualan')
      setLoading(false)
      return
    }

    const data: SalesData = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
      paidOrders: orders.filter((o) => o.status === 'dibayar').length,
      paidRevenue: orders
        .filter((o) => o.status === 'dibayar')
        .reduce((sum, order) => sum + order.total_amount, 0),
      completedOrders: orders.filter((o) => o.status === 'selesai').length,
      completedRevenue: orders
        .filter((o) => o.status === 'selesai')
        .reduce((sum, order) => sum + order.total_amount, 0),
      pendingOrders: orders.filter((o) => o.status === 'menunggu_pembayaran').length,
      pendingRevenue: orders
        .filter((o) => o.status === 'menunggu_pembayaran')
        .reduce((sum, order) => sum + order.total_amount, 0),
    }

    setSalesData(data)
    setRecentOrders(orders)
    setLoading(false)
  }

  const autoDeleteOldData = async () => {
    try {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      // Hapus orders yang lebih dari 1 bulan (order_items akan otomatis terhapus karena CASCADE)
      const { error } = await supabase
        .from('orders')
        .delete()
        .lt('created_at', oneMonthAgo.toISOString())

      if (error) {
        console.error('Error deleting old data:', error)
        // Tidak show error ke user karena ini background task
      } else {
        console.log('Old data deleted successfully')
      }
    } catch (error) {
      console.error('Error in autoDeleteOldData:', error)
    }
  }

  const exportToCSV = () => {
    if (recentOrders.length === 0) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }

    const dateStr = selectedDate
      ? format(selectedDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd')

    // Header CSV
    const headers = ['No', 'Meja', 'Nama Pelanggan', 'Total', 'Status', 'Waktu']
    const rows = recentOrders.map((order, index) => [
      index + 1,
      order.table_number,
      order.customer_name || '-',
      order.total_amount,
      order.status,
      format(new Date(order.created_at), 'dd/MM/yyyy HH:mm'),
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // Add summary
    const summary = [
      '',
      'SUMMARY',
      `Total Pesanan,${salesData.totalOrders}`,
      `Total Revenue,${salesData.totalRevenue}`,
      `Dibayar,${salesData.paidOrders}`,
      `Selesai,${salesData.completedOrders}`,
      `Menunggu Pembayaran,${salesData.pendingOrders}`,
    ].join('\n')

    const fullCsv = [csvContent, summary].join('\n')

    // Create blob and download
    const blob = new Blob(['\ufeff' + fullCsv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `laporan-penjualan-${dateStr}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Laporan berhasil diekspor')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Laporan Penjualan</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Ringkasan penjualan dan pesanan per tanggal
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Hari Ini</span>
            <span className="sm:hidden">Hari Ini</span>
          </Button>
          <Button onClick={exportToCSV} disabled={loading || recentOrders.length === 0} className="flex-1 sm:flex-initial">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Tanggal</CardTitle>
          <CardDescription>Pilih tanggal untuk melihat laporan penjualan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'PPP', { locale: idLocale })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setDatePickerOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <div className="text-sm text-gray-600">
                Menampilkan data untuk: <strong className="block sm:inline">{format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: idLocale })}</strong>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{salesData.totalOrders}</p>
              <p className="text-sm text-gray-600 mt-2">
                Rp {salesData.totalRevenue.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Menunggu Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{salesData.pendingOrders}</p>
              <p className="text-sm text-gray-600 mt-2">
                Rp {salesData.pendingRevenue.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Dibayar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{salesData.paidOrders}</p>
              <p className="text-sm text-gray-600 mt-2">
                Rp {salesData.paidRevenue.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Selesai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{salesData.completedOrders}</p>
              <p className="text-sm text-gray-600 mt-2">
                Rp {salesData.completedRevenue.toLocaleString('id-ID')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pesanan</CardTitle>
            <CardDescription>
              {recentOrders.length} pesanan pada tanggal yang dipilih
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">Meja {order.table_number}</p>
                    {order.customer_name && (
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium mb-2">Tidak ada pesanan</p>
                  <p className="text-sm">
                    Belum ada pesanan pada tanggal yang dipilih
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
