import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      menu: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price: number
          category: string
          image_url?: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          table_number: number
          customer_name: string
          status: 'menunggu_pembayaran' | 'dibayar' | 'selesai'
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          table_number: number
          customer_name?: string
          status?: 'menunggu_pembayaran' | 'dibayar' | 'selesai'
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          table_number?: number
          customer_name?: string
          status?: 'menunggu_pembayaran' | 'dibayar' | 'selesai'
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_id: string
          quantity: number
          price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_id: string
          quantity: number
          price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_id?: string
          quantity?: number
          price?: number
          subtotal?: number
          created_at?: string
        }
      }
    }
  }
}
