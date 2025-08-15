"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// تسجيل الدخول
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "بيانات النموذج مفقودة" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "الإيميل وكلمة المرور مطلوبان" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error)
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." }
  }
}

// تسجيل حساب جديد
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "بيانات النموذج مفقودة" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "الإيميل وكلمة المرور مطلوبان" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "تحقق من إيميلك لتأكيد حسابك." }
  } catch (error) {
    console.error("خطأ في التسجيل:", error)
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." }
  }
}

// تسجيل الخروج
export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/login")
}
