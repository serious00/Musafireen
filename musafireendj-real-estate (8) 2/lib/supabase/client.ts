import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// التحقق من توفر متغيرات البيئة
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// إنشاء عميل Supabase للمكونات العميلة
export const supabase = createClientComponentClient()
