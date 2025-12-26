'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadHomepageImage, deleteHomepageImage } from '@/lib/homepage-storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ImageIcon, Plus, Trash2, Edit, X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

type HomepageImage = {
  id: string
  section: 'hero' | 'about' | 'facilities' | 'testimonial'
  image_url: string
  alt_text: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function HomepageImagesPage() {
  const [images, setImages] = useState<HomepageImage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<HomepageImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    section: 'hero' as 'hero' | 'about' | 'facilities' | 'testimonial',
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_images')
        .select('*')
        .order('section', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) throw error
      setImages(data || [])
    } catch (error: any) {
      toast.error('Gagal memuat gambar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    // Validasi file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB')
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      const imageUrl = await uploadHomepageImage(file, formData.section)
      setFormData({ ...formData, image_url: imageUrl })
      setPreviewUrl(null)
      toast.success('Gambar berhasil diupload')
    } catch (error: any) {
      toast.error('Gagal mengupload gambar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image_url && !editingImage) {
      toast.error('Silakan upload gambar terlebih dahulu')
      return
    }

    try {
      if (editingImage) {
        const { error } = await supabase
          .from('homepage_images')
          .update(formData)
          .eq('id', editingImage.id)

        if (error) throw error
        toast.success('Gambar berhasil diperbarui')
      } else {
        const { error } = await supabase
          .from('homepage_images')
          .insert([formData])

        if (error) throw error
        toast.success('Gambar berhasil ditambahkan')
      }

      setDialogOpen(false)
      resetForm()
      fetchImages()
    } catch (error: any) {
      toast.error('Gagal menyimpan gambar: ' + error.message)
    }
  }

  const handleDelete = async (image: HomepageImage) => {
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) return

    try {
      // Hapus dari database
      const { error } = await supabase
        .from('homepage_images')
        .delete()
        .eq('id', image.id)

      if (error) throw error

      // Hapus dari storage jika URL dari Supabase Storage
      if (image.image_url.includes('supabase.co/storage')) {
        try {
          await deleteHomepageImage(image.image_url)
        } catch (storageError) {
          console.warn('Gagal menghapus dari storage:', storageError)
          // Lanjutkan meskipun gagal hapus dari storage
        }
      }

      toast.success('Gambar berhasil dihapus')
      fetchImages()
    } catch (error: any) {
      toast.error('Gagal menghapus gambar: ' + error.message)
    }
  }

  const handleEdit = (image: HomepageImage) => {
    setEditingImage(image)
    setPreviewUrl(null)
    setFormData({
      section: image.section,
      image_url: image.image_url,
      alt_text: image.alt_text,
      display_order: image.display_order,
      is_active: image.is_active,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingImage(null)
    setPreviewUrl(null)
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setFormData({
      section: 'hero',
      image_url: '',
      alt_text: '',
      display_order: 0,
      is_active: true,
    })
  }

  const toggleActive = async (image: HomepageImage) => {
    try {
      const { error } = await supabase
        .from('homepage_images')
        .update({ is_active: !image.is_active })
        .eq('id', image.id)

      if (error) throw error
      toast.success(`Gambar ${!image.is_active ? 'diaktifkan' : 'dinonaktifkan'}`)
      fetchImages()
    } catch (error: any) {
      toast.error('Gagal mengubah status: ' + error.message)
    }
  }

  const sectionLabels = {
    hero: 'Hero Section',
    about: 'About Section',
    facilities: 'Facilities Section',
    testimonial: 'Testimonial Section',
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Gambar Homepage</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola gambar yang ditampilkan di halaman utama</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Gambar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Edit Gambar' : 'Tambah Gambar Baru'}</DialogTitle>
              <DialogDescription>
                {editingImage ? 'Perbarui informasi gambar' : 'Tambahkan gambar baru untuk homepage'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value: any) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="about">About Section</SelectItem>
                    <SelectItem value="facilities">Facilities Section</SelectItem>
                    <SelectItem value="testimonial">Testimonial Section</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_file">Upload Gambar</Label>
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileSelect(e)
                      const file = e.target.files?.[0]
                      if (file) {
                        handleUpload(file)
                      }
                    }}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengoptimasi dan mengupload gambar...
                    </div>
                  )}
                  {!editingImage && formData.image_url && (
                    <p className="text-xs text-green-600">✓ Gambar sudah diupload</p>
                  )}
                </div>
              </div>

              {(previewUrl || formData.image_url) && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={previewUrl || formData.image_url}
                    alt={formData.alt_text || 'Preview'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text</Label>
                <Textarea
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  placeholder="Deskripsi gambar untuk aksesibilitas"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Urutan Tampil</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>


              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingImage ? 'Perbarui' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {['hero', 'about', 'facilities', 'testimonial'].map((section) => {
          const sectionImages = images.filter((img) => img.section === section)
          if (sectionImages.length === 0) return null

          return (
            <Card key={section}>
              <CardHeader>
                <CardTitle>{sectionLabels[section as keyof typeof sectionLabels]}</CardTitle>
                <CardDescription>
                  {sectionImages.length} gambar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative w-full h-48">
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || 'Homepage image'}
                          fill
                          className="object-cover"
                        />
                        {!image.is_active && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold">Nonaktif</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 truncate">{image.alt_text || 'Tanpa deskripsi'}</p>
                          <p className="text-xs text-gray-500">Urutan: {image.display_order}</p>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={image.is_active}
                              onCheckedChange={() => toggleActive(image)}
                            />
                            <span className="text-xs text-gray-600">
                              {image.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(image)}
                              className="flex-1"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(image)}
                              className="flex-1"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {images.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Belum ada gambar. Tambahkan gambar pertama Anda.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

