'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, MessageCircle, ShoppingCart } from 'lucide-react'

type CartItem = {
    menu: {
        id: string
        name: string
        price: number
    }
    quantity: number
}

type CheckoutModalProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    cart: CartItem[]
    total: number
}

export function CheckoutModal({ isOpen, onClose, onSuccess, cart, total }: CheckoutModalProps) {
    const [name, setName] = useState('')
    const [orderType, setOrderType] = useState<'dine_in' | 'delivery'>('dine_in')
    const [address, setAddress] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && orderType === 'delivery') {
            fetchWhatsappNumber()
        }
    }, [isOpen, orderType])

    const fetchWhatsappNumber = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('contact_info')
                .select('value')
                .eq('type', 'whatsapp')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .limit(1)
                .single()

            if (error) {
                console.error('Error fetching WhatsApp number:', error)
            } else if (data) {
                setWhatsappNumber(data.value)
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatWhatsAppMessage = () => {
        let message = `🛒 *PESANAN BARU (DELIVERY)*\n\n`
        message += `👤 *Nama:* ${name}\n`
        message += `🏠 *Alamat:* ${address}\n`
        message += `\n📋 *Detail Pesanan:*\n`
        message += `─────────────────\n`

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.menu.name}\n`
            message += `   ${item.quantity}x @ Rp ${item.menu.price.toLocaleString('id-ID')}\n`
            message += `   = Rp ${(item.menu.price * item.quantity).toLocaleString('id-ID')}\n`
        })

        message += `─────────────────\n`
        message += `💰 *TOTAL: Rp ${total.toLocaleString('id-ID')}*\n`
        message += `\nTerima kasih! 🙏`

        return encodeURIComponent(message)
    }

    const handleDineInSubmit = async () => {
        setSubmitting(true)

        try {
            // Create order in database
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: name,
                    total_amount: total,
                    status: 'menunggu_pembayaran',
                    order_type: 'dine_in',
                })
                .select()
                .single()

            if (orderError) throw orderError

            // Create order items
            const orderItems = cart.map((item) => ({
                order_id: order.id,
                menu_id: item.menu.id,
                quantity: item.quantity,
                price: item.menu.price,
                subtotal: item.menu.price * item.quantity,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            toast.success('Pesanan berhasil dibuat! Silakan tunggu pesanan Anda.')

            // Reset form and close modal
            resetForm()
            onSuccess()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Gagal membuat pesanan')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeliverySubmit = async () => {
        if (!whatsappNumber) {
            toast.error('Nomor WhatsApp admin belum dikonfigurasi')
            return
        }

        setSubmitting(true)

        try {
            // Save delivery order to database first
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: name,
                    total_amount: total,
                    status: 'menunggu_pembayaran',
                    order_type: 'delivery',
                    delivery_address: address,
                })
                .select()
                .single()

            if (orderError) throw orderError

            // Create order items
            const orderItems = cart.map((item) => ({
                order_id: order.id,
                menu_id: item.menu.id,
                quantity: item.quantity,
                price: item.menu.price,
                subtotal: item.menu.price * item.quantity,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // Format WhatsApp number (remove non-digits and ensure it starts with country code)
            let formattedNumber = whatsappNumber.replace(/\D/g, '')
            if (formattedNumber.startsWith('0')) {
                formattedNumber = '62' + formattedNumber.substring(1)
            }

            const message = formatWhatsAppMessage()
            const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank')

            toast.success('Pesanan tersimpan! Mengarahkan ke WhatsApp...')

            // Reset form and close modal
            resetForm()
            onSuccess()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Gagal memproses pesanan')
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Nama wajib diisi')
            return
        }

        if (orderType === 'delivery' && !address.trim()) {
            toast.error('Alamat wajib diisi untuk pesanan delivery')
            return
        }

        if (orderType === 'dine_in') {
            await handleDineInSubmit()
        } else {
            await handleDeliverySubmit()
        }
    }

    const resetForm = () => {
        setName('')
        setAddress('')
        setOrderType('dine_in')
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="w-[95vw] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-amber-600" />
                        Konfirmasi Pesanan
                    </DialogTitle>
                    <DialogDescription>
                        Lengkapi data berikut untuk melanjutkan pesanan
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="customer_name">Nama *</Label>
                        <Input
                            id="customer_name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan nama Anda"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Tipe Pesanan *</Label>
                        <RadioGroup
                            value={orderType}
                            onValueChange={(value) => setOrderType(value as 'dine_in' | 'delivery')}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-amber-50 transition-colors cursor-pointer">
                                <RadioGroupItem value="dine_in" id="dine_in" />
                                <Label htmlFor="dine_in" className="flex-1 cursor-pointer">
                                    <span className="font-medium">🍽️ Pesan di Tempat</span>
                                    <p className="text-sm text-gray-500">Makan langsung di cafe</p>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-amber-50 transition-colors cursor-pointer">
                                <RadioGroupItem value="delivery" id="delivery" />
                                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                                    <span className="font-medium">🏠 Pesan dari Rumah</span>
                                    <p className="text-sm text-gray-500">Diantar ke alamat Anda via WhatsApp</p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {orderType === 'delivery' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <Label htmlFor="address">Alamat Pengiriman *</Label>
                            <Textarea
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Masukkan alamat lengkap Anda"
                                rows={3}
                                required
                            />
                        </div>
                    )}

                    <div className="pt-2 border-t">
                        <div className="flex justify-between text-lg font-bold mb-4">
                            <span>Total Pesanan</span>
                            <span className="text-amber-600">Rp {total.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1"
                                disabled={submitting}
                            >
                                Batal
                            </Button>

                            {orderType === 'dine_in' ? (
                                <Button
                                    type="submit"
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Memproses...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            Pesan
                                        </span>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={submitting || (!whatsappNumber && !loading)}
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Memproses...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <MessageCircle className="h-4 w-4" />
                                            Kirim via WhatsApp
                                        </span>
                                    )}
                                </Button>
                            )}
                        </div>

                        {orderType === 'delivery' && !whatsappNumber && !loading && (
                            <p className="text-sm text-red-500 mt-2 text-center">
                                ⚠️ Nomor WhatsApp admin belum dikonfigurasi
                            </p>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
