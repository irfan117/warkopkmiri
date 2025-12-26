'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Phone, MapPin, Mail, Clock, Edit, Save, X, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type ContactInfo = {
  id: string
  type: 'address' | 'phone' | 'email' | 'map_url' | 'whatsapp'
  value: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

type OperatingHour = {
  id: string
  day_name: string
  day_label: string
  open_time: string
  close_time: string
  is_closed: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([])
  const [loading, setLoading] = useState(true)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)
  const [editingHours, setEditingHours] = useState<OperatingHour | null>(null)
  const [contactForm, setContactForm] = useState({
    type: 'address' as 'address' | 'phone' | 'email' | 'map_url' | 'whatsapp',
    value: '',
    display_order: 0,
    is_active: true,
  })
  const [hoursForm, setHoursForm] = useState({
    day_name: 'monday',
    day_label: '',
    open_time: '',
    close_time: '',
    is_closed: false,
    display_order: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contactRes, hoursRes] = await Promise.all([
        supabase.from('contact_info').select('*').order('display_order', { ascending: true }),
        supabase.from('operating_hours').select('*').order('display_order', { ascending: true }),
      ])

      if (contactRes.error) throw contactRes.error
      if (hoursRes.error) throw hoursRes.error

      setContactInfo(contactRes.data || [])
      setOperatingHours(hoursRes.data || [])
    } catch (error: any) {
      toast.error('Gagal memuat data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingContact) {
        const { error } = await supabase
          .from('contact_info')
          .update(contactForm)
          .eq('id', editingContact.id)

        if (error) throw error
        toast.success('Kontak berhasil diperbarui')
      } else {
        const { error } = await supabase
          .from('contact_info')
          .insert([contactForm])

        if (error) throw error
        toast.success('Kontak berhasil ditambahkan')
      }

      setContactDialogOpen(false)
      resetContactForm()
      fetchData()
    } catch (error: any) {
      toast.error('Gagal menyimpan kontak: ' + error.message)
    }
  }

  const handleHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingHours) {
        const { error } = await supabase
          .from('operating_hours')
          .update(hoursForm)
          .eq('id', editingHours.id)

        if (error) throw error
        toast.success('Jam operasional berhasil diperbarui')
      } else {
        const { error } = await supabase
          .from('operating_hours')
          .insert([hoursForm])

        if (error) throw error
        toast.success('Jam operasional berhasil ditambahkan')
      }

      setHoursDialogOpen(false)
      resetHoursForm()
      fetchData()
    } catch (error: any) {
      toast.error('Gagal menyimpan jam operasional: ' + error.message)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kontak ini?')) return

    try {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Kontak berhasil dihapus')
      fetchData()
    } catch (error: any) {
      toast.error('Gagal menghapus kontak: ' + error.message)
    }
  }

  const handleDeleteHours = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jam operasional ini?')) return

    try {
      const { error } = await supabase
        .from('operating_hours')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Jam operasional berhasil dihapus')
      fetchData()
    } catch (error: any) {
      toast.error('Gagal menghapus jam operasional: ' + error.message)
    }
  }

  const handleEditContact = (contact: ContactInfo) => {
    setEditingContact(contact)
    setContactForm({
      type: contact.type,
      value: contact.value,
      display_order: contact.display_order,
      is_active: contact.is_active,
    })
    setContactDialogOpen(true)
  }

  const handleEditHours = (hours: OperatingHour) => {
    setEditingHours(hours)
    setHoursForm({
      day_name: hours.day_name,
      day_label: hours.day_label,
      open_time: hours.open_time,
      close_time: hours.close_time,
      is_closed: hours.is_closed,
      display_order: hours.display_order,
    })
    setHoursDialogOpen(true)
  }

  const resetContactForm = () => {
    setEditingContact(null)
    setContactForm({
      type: 'address',
      value: '',
      display_order: 0,
      is_active: true,
    })
  }

  const resetHoursForm = () => {
    setEditingHours(null)
    setHoursForm({
      day_name: 'monday',
      day_label: '',
      open_time: '',
      close_time: '',
      is_closed: false,
      display_order: 0,
    })
  }

  const toggleContactActive = async (contact: ContactInfo) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({ is_active: !contact.is_active })
        .eq('id', contact.id)

      if (error) throw error
      toast.success(`Kontak ${!contact.is_active ? 'diaktifkan' : 'dinonaktifkan'}`)
      fetchData()
    } catch (error: any) {
      toast.error('Gagal mengubah status: ' + error.message)
    }
  }

  const contactTypeLabels = {
    address: 'Alamat',
    phone: 'Telepon',
    email: 'Email',
    map_url: 'URL Peta',
    whatsapp: 'WhatsApp',
  }

  const contactIcons = {
    address: MapPin,
    phone: Phone,
    email: Mail,
    map_url: MapPin,
    whatsapp: MessageCircle,
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Kontak & Jam Operasional</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola informasi kontak dan jam operasional cafe</p>
      </div>

      {/* Contact Info Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>Kelola alamat, telepon, email, dan URL peta</CardDescription>
            </div>
            <Button onClick={() => {
              resetContactForm()
              setContactDialogOpen(true)
            }} className="w-full sm:w-auto">
              <Phone className="mr-2 h-4 w-4" />
              Tambah Kontak
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactInfo.map((contact) => {
              const Icon = contactIcons[contact.type]
              return (
                <div
                  key={contact.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800">
                        {contactTypeLabels[contact.type]}
                      </p>
                      <p className="text-sm text-gray-600 break-words">{contact.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch
                      checked={contact.is_active}
                      onCheckedChange={() => toggleContactActive(contact)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditContact(contact)}
                      className="flex-1 sm:flex-initial"
                    >
                      <Edit className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {contactInfo.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada kontak. Tambahkan kontak pertama Anda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Jam Operasional</CardTitle>
              <CardDescription>Kelola jam buka dan tutup untuk setiap hari</CardDescription>
            </div>
            <Button onClick={() => {
              resetHoursForm()
              setHoursDialogOpen(true)
            }} className="w-full sm:w-auto">
              <Clock className="mr-2 h-4 w-4" />
              Tambah Jam Operasional
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Jam Buka</TableHead>
                  <TableHead>Jam Tutup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatingHours.map((hours) => (
                  <TableRow key={hours.id}>
                    <TableCell className="font-medium">{hours.day_label}</TableCell>
                    <TableCell>
                      {hours.is_closed ? (
                        <span className="text-gray-400">Tutup</span>
                      ) : (
                        hours.open_time
                      )}
                    </TableCell>
                    <TableCell>
                      {hours.is_closed ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        hours.close_time
                      )}
                    </TableCell>
                    <TableCell>
                      {hours.is_closed ? (
                        <span className="text-red-600">Tutup</span>
                      ) : (
                        <span className="text-green-600">Buka</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditHours(hours)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteHours(hours.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {operatingHours.map((hours) => (
              <Card key={hours.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{hours.day_label}</h3>
                      {hours.is_closed ? (
                        <span className="text-red-600 text-sm font-medium">Tutup</span>
                      ) : (
                        <span className="text-green-600 text-sm font-medium">Buka</span>
                      )}
                    </div>
                    {!hours.is_closed && (
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-500">Jam Buka</p>
                          <p className="font-medium">{hours.open_time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Jam Tutup</p>
                          <p className="font-medium">{hours.close_time}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditHours(hours)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteHours(hours.id)}
                        className="flex-1"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {operatingHours.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada jam operasional. Tambahkan jam operasional pertama Anda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={(open) => {
        setContactDialogOpen(open)
        if (!open) resetContactForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Edit Kontak' : 'Tambah Kontak Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingContact ? 'Perbarui informasi kontak' : 'Tambahkan informasi kontak baru'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_type">Tipe Kontak</Label>
              <select
                id="contact_type"
                value={contactForm.type}
                onChange={(e) => setContactForm({ ...contactForm, type: e.target.value as any })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="address">Alamat</option>
                <option value="phone">Telepon</option>
                <option value="email">Email</option>
                <option value="map_url">URL Peta</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_value">Nilai</Label>
              <Input
                id="contact_value"
                value={contactForm.value}
                onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                placeholder="Masukkan nilai kontak"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_order">Urutan Tampil</Label>
              <Input
                id="contact_order"
                type="number"
                value={contactForm.display_order}
                onChange={(e) => setContactForm({ ...contactForm, display_order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="contact_active"
                checked={contactForm.is_active}
                onCheckedChange={(checked) => setContactForm({ ...contactForm, is_active: checked })}
              />
              <Label htmlFor="contact_active">Aktif</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setContactDialogOpen(false)
                resetContactForm()
              }}>
                Batal
              </Button>
              <Button type="submit">
                {editingContact ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Operating Hours Dialog */}
      <Dialog open={hoursDialogOpen} onOpenChange={(open) => {
        setHoursDialogOpen(open)
        if (!open) resetHoursForm()
      }}>
        <DialogContent className="w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHours ? 'Edit Jam Operasional' : 'Tambah Jam Operasional Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingHours ? 'Perbarui jam operasional' : 'Tambahkan jam operasional baru'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleHoursSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="day_name">Nama Hari</Label>
              <select
                id="day_name"
                value={hoursForm.day_name}
                onChange={(e) => setHoursForm({ ...hoursForm, day_name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="monday">Senin</option>
                <option value="tuesday">Selasa</option>
                <option value="wednesday">Rabu</option>
                <option value="thursday">Kamis</option>
                <option value="friday">Jumat</option>
                <option value="saturday">Sabtu</option>
                <option value="sunday">Minggu</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day_label">Label Hari</Label>
              <Input
                id="day_label"
                value={hoursForm.day_label}
                onChange={(e) => setHoursForm({ ...hoursForm, day_label: e.target.value })}
                placeholder="Contoh: Senin - Kamis"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_closed"
                checked={hoursForm.is_closed}
                onCheckedChange={(checked) => setHoursForm({ ...hoursForm, is_closed: checked })}
              />
              <Label htmlFor="is_closed">Tutup</Label>
            </div>

            {!hoursForm.is_closed && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="open_time">Jam Buka</Label>
                  <Input
                    id="open_time"
                    type="time"
                    value={hoursForm.open_time}
                    onChange={(e) => setHoursForm({ ...hoursForm, open_time: e.target.value })}
                    required={!hoursForm.is_closed}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="close_time">Jam Tutup</Label>
                  <Input
                    id="close_time"
                    type="time"
                    value={hoursForm.close_time}
                    onChange={(e) => setHoursForm({ ...hoursForm, close_time: e.target.value })}
                    required={!hoursForm.is_closed}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="hours_order">Urutan Tampil</Label>
              <Input
                id="hours_order"
                type="number"
                value={hoursForm.display_order}
                onChange={(e) => setHoursForm({ ...hoursForm, display_order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setHoursDialogOpen(false)
                resetHoursForm()
              }}>
                Batal
              </Button>
              <Button type="submit">
                {editingHours ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

