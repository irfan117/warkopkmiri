import { supabase } from './supabase'

const BUCKET_NAME = 'menu-images'

/**
 * Upload gambar menu ke Supabase Storage
 * @param file File gambar yang akan diupload
 * @param menuId ID menu (untuk naming file)
 * @returns Public URL dari gambar yang diupload
 */
export async function uploadMenuImage(
  file: File,
  menuId?: string
): Promise<string> {
  try {
    // Validasi file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar')
    }

    // Validasi file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Ukuran file maksimal 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = menuId
      ? `${menuId}-${Date.now()}.${fileExt}`
      : `menu-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw error
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return publicUrl
  } catch (error: any) {
    console.error('Error uploading image:', error)
    throw new Error(error.message || 'Gagal mengupload gambar')
  }
}

/**
 * Hapus gambar dari Supabase Storage
 * @param imageUrl URL gambar yang akan dihapus
 */
export async function deleteMenuImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path dari URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]

    // Hapus file dari storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName])

    if (error) {
      console.error('Error deleting image:', error)
      // Tidak throw error karena file mungkin sudah tidak ada
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    // Tidak throw error karena file mungkin sudah tidak ada
  }
}

