import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from "next/server"

// التحقق من توفر متغيرات البيئة
const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function middleware(request: NextRequest) {
  // إذا لم يكن Supabase مكوناً، تابع بدون مصادقة
  if (!isSupabaseConfigured) {
    return NextResponse.next({
      request,
    })
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // التحقق من callback المصادقة
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // تحديث الجلسة إذا انتهت صلاحيتها
  await supabase.auth.getSession()

  // المسارات المحمية
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login")
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute && !isAuthRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      const redirectUrl = new URL("/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
