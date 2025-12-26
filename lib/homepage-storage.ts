import { supabase } from './supabase'

const BUCKET_NAME = 'homepage-images'

/**
 * Resize dan compress gambar di client-side sebelum upload
 * Menggunakan Canvas API untuk optimasi
 */
async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Hitung dimensi baru dengan menjaga aspect ratio
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        // Buat canvas untuk resize
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Gagal membuat canvas context'))
          return
        }

        // Draw dan compress
        ctx.drawImage(img, 0, 0, width, height)

        // Convert ke blob dengan quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengoptimasi gambar'))
              return
            }

            // Buat File baru dari blob
            const optimizedFile = new File([blob], file.name, {
              type: file.type || 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(optimizedFile)
          },
          file.type || 'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Gagal memuat gambar'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Upload gambar homepage ke Supabase Storage dengan optimasi
 * @param file File gambar yang akan diupload
 * @param section Section dimana gambar akan digunakan (hero, about, facilities, testimonial)
 * @returns Public URL dari gambar yang diupload
 */
export async function uploadHomepageImage(
  file: File,
  section: 'hero' | 'about' | 'facilities' | 'testimonial'
): Promise<string> {
  try {
    // Validasi file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar')
    }

    // Validasi file size (max 10MB sebelum optimasi)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran file maksimal 10MB')
    }

    // Optimasi gambar berdasarkan section
    let maxWidth = 1920
    let maxHeight = 1920
    let quality = 0.85

    switch (section) {
      case 'hero':
        maxWidth = 1920
        maxHeight = 1080
        quality = 0.9 // Hero perlu kualitas lebih tinggi
        break
      case 'about':
        maxWidth = 1200
        maxHeight = 1200
        quality = 0.85
        break
      case 'facilities':
        maxWidth = 800
        maxHeight = 800
        quality = 0.8
        break
      case 'testimonial':
        maxWidth = 600
        maxHeight = 600
        quality = 0.8
        break
    }

    // Optimasi gambar
    const optimizedFile = await optimizeImage(file, maxWidth, maxHeight, quality)

    // Generate unique filename dengan format: section-timestamp-random.webp
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const fileExt = 'webp' // Gunakan webp untuk ukuran lebih kecil
    const fileName = `${section}-${timestamp}-${random}.${fileExt}`
    const filePath = `${section}/${fileName}`

    // Convert ke WebP jika belum
    let finalFile = optimizedFile
    if (!file.name.toLowerCase().endsWith('.webp')) {
      // File sudah dioptimasi, gunakan langsung
      finalFile = optimizedFile
    }

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, finalFile, {
        cacheControl: '31536000', // Cache 1 tahun
        upsert: false,
        contentType: 'image/webp',
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
    console.error('Error uploading homepage image:', error)
    throw new Error(error.message || 'Gagal mengupload gambar')
  }
}

/**
 * Hapus gambar dari Supabase Storage
 * @param imageUrl URL gambar yang akan dihapus
 */
export async function deleteHomepageImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path dari URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex((part) => part === BUCKET_NAME)
    
    if (bucketIndex === -1) {
      throw new Error('URL gambar tidak valid')
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error('Error deleting homepage image:', error)
    throw new Error(error.message || 'Gagal menghapus gambar')
  }
}

/**
 * Extract file path dari URL untuk digunakan saat delete
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.findIndex((part) => part === BUCKET_NAME)
    
    if (bucketIndex === -1) return null
    
    return pathParts.slice(bucketIndex + 1).join('/')
  } catch {
    return null
  }
}

