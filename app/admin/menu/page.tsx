'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react'
import { uploadMenuImage, deleteMenuImage } from '@/lib/storage'
import Image from 'next/image'

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
  created_at: string
}

export default function MenuManagementPage() {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'minuman',
    image_url: '',
    available: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat menu')
      console.error(error)
    } else {
      setMenus(data || [])
    }
    setLoading(false)
  }

  const handleOpenDialog = (menu?: MenuItem) => {
    if (menu) {
      setEditingMenu(menu)
      setFormData({
        name: menu.name,
        description: menu.description || '',
        price: menu.price.toString(),
        category: menu.category,
        image_url: menu.image_url || '',
        available: menu.available,
      })
      setImagePreview(menu.image_url || null)
      setImageFile(null)
    } else {
      setEditingMenu(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'minuman',
        image_url: '',
        available: true,
      })
      setImagePreview(null)
      setImageFile(null)
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingMenu(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'minuman',
      image_url: '',
      available: true,
    })
    setImagePreview(null)
    setImageFile(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi file type
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar')
        return
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB')
        return
      }

      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (editingMenu && editingMenu.image_url) {
      // Keep existing image URL if editing
      setFormData({ ...formData, image_url: editingMenu.image_url })
    } else {
      setFormData({ ...formData, image_url: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      toast.error('Nama dan harga wajib diisi')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price < 0) {
      toast.error('Harga harus berupa angka valid')
      return
    }

    setUploading(true)

    try {
      let imageUrl = formData.image_url

      // Upload gambar jika ada file baru
      if (imageFile) {
        try {
          // Jika edit dan ada gambar lama, hapus dulu
          if (editingMenu && editingMenu.image_url) {
            await deleteMenuImage(editingMenu.image_url)
          }
          imageUrl = await uploadMenuImage(imageFile, editingMenu?.id)
        } catch (uploadError: any) {
          toast.error(uploadError.message || 'Gagal mengupload gambar')
          setUploading(false)
          return
        }
      }

      if (editingMenu) {
        // Update menu
        const { error } = await supabase
          .from('menu')
          .update({
            name: formData.name,
            description: formData.description,
            price: price,
            category: formData.category,
            image_url: imageUrl,
            available: formData.available,
          })
          .eq('id', editingMenu.id)

        if (error) throw error
        toast.success('Menu berhasil diupdate')
      } else {
        // Create menu - perlu insert dulu untuk dapat ID
        const { data: newMenu, error: insertError } = await supabase
          .from('menu')
          .insert([
            {
              name: formData.name,
              description: formData.description,
              price: price,
              category: formData.category,
              image_url: imageUrl,
              available: formData.available,
            },
          ])
          .select()
          .single()

        if (insertError) throw insertError

        // Jika ada file gambar dan menu baru berhasil dibuat, upload dengan ID menu
        if (imageFile && newMenu) {
          try {
            // Hapus file temporary yang sudah diupload
            if (imageUrl) {
              await deleteMenuImage(imageUrl)
            }
            // Upload ulang dengan ID menu yang benar
            const finalImageUrl = await uploadMenuImage(imageFile, newMenu.id)
            // Update menu dengan URL final
            await supabase
              .from('menu')
              .update({ image_url: finalImageUrl })
              .eq('id', newMenu.id)
          } catch (uploadError: any) {
            console.error('Error re-uploading image:', uploadError)
            // Tidak throw error karena menu sudah dibuat
          }
        }

        toast.success('Menu berhasil ditambahkan')
      }

      handleCloseDialog()
      fetchMenus()
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      return
    }

    // Hapus gambar dari storage jika ada
    if (imageUrl) {
      await deleteMenuImage(imageUrl)
    }

    const { error } = await supabase.from('menu').delete().eq('id', id)

    if (error) {
      toast.error('Gagal menghapus menu')
      console.error(error)
    } else {
      toast.success('Menu berhasil dihapus')
      fetchMenus()
    }
  }

  const handleToggleAvailable = async (menu: MenuItem) => {
    const { error } = await supabase
      .from('menu')
      .update({ available: !menu.available })
      .eq('id', menu.id)

    if (error) {
      toast.error('Gagal mengupdate status')
      console.error(error)
    } else {
      toast.success(
        `Menu ${!menu.available ? 'diaktifkan' : 'dinonaktifkan'}`
      )
      fetchMenus()
    }
  }

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, any> = {
      minuman: { variant: 'default', label: 'Minuman' },
      makanan: { variant: 'secondary', label: 'Makanan' },
      snack: { variant: 'outline', label: 'Snack' },
    }
    return variants[category] || { variant: 'default', label: category }
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
          <h1 className="text-2xl sm:text-3xl font-bold">Manajemen Menu</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola menu makanan dan minuman cafe
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) handleCloseDialog()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingMenu
                  ? 'Update informasi menu'
                  : 'Tambahkan menu baru ke dalam daftar'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Menu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Espresso"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi menu..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Harga <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minuman">Minuman</SelectItem>
                      <SelectItem value="makanan">Makanan</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Gambar Menu</Label>
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hapus Gambar
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <Label
                        htmlFor="image"
                        className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                      >
                        Klik untuk upload gambar
                      </Label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, atau WEBP (max 5MB)
                      </p>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="available">Status Ketersediaan</Label>
                  <p className="text-sm text-gray-500">
                    Menu akan ditampilkan di halaman pemesanan jika aktif
                  </p>
                </div>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, available: checked })
                  }
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading
                    ? 'Menyimpan...'
                    : editingMenu
                    ? 'Update Menu'
                    : 'Tambah Menu'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Menu ({menus.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {menus.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada menu. Klik tombol &quot;Tambah Menu&quot; untuk menambahkan menu baru.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Menu</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menus.map((menu) => {
                      const categoryBadge = getCategoryBadge(menu.category)
                      return (
                        <TableRow key={menu.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{menu.name}</div>
                              {menu.description && (
                                <div className="text-sm text-gray-500">
                                  {menu.description.length > 50
                                    ? `${menu.description.substring(0, 50)}...`
                                    : menu.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge {...categoryBadge}>
                              {categoryBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            Rp {menu.price.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={menu.available ? 'default' : 'secondary'}
                            >
                              {menu.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleAvailable(menu)}
                                title={
                                  menu.available
                                    ? 'Nonaktifkan'
                                    : 'Aktifkan'
                                }
                              >
                                {menu.available ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(menu)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(menu.id, menu.image_url)}
                                title="Hapus"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {menus.map((menu) => {
                  const categoryBadge = getCategoryBadge(menu.category)
                  return (
                    <Card key={menu.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{menu.name}</h3>
                              {menu.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {menu.description.length > 80
                                    ? `${menu.description.substring(0, 80)}...`
                                    : menu.description}
                                </p>
                              )}
                            </div>
                            <Badge {...categoryBadge} className="ml-2">
                              {categoryBadge.label}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Harga</p>
                              <p className="font-semibold text-lg">
                                Rp {menu.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Badge
                              variant={menu.available ? 'default' : 'secondary'}
                            >
                              {menu.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </Badge>
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailable(menu)}
                              className="flex-1"
                            >
                              {menu.available ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Aktifkan
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(menu)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(menu.id, menu.image_url)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
