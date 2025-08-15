"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Home } from "lucide-react"

interface User {
  id: number
  email: string
  password: string
  role: "admin" | "employee"
  name: string
  createdAt: string
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      const defaultUsers: User[] = [
        {
          id: 1,
          email: "admin@musafireendj.com",
          password: "Musafir2024!",
          role: "admin",
          name: "المدير العام",
          createdAt: new Date().toISOString(),
        },
      ]
      setUsers(defaultUsers)
      localStorage.setItem("users", JSON.stringify(defaultUsers))
    }

    const isLoggedIn = localStorage.getItem("isAdminLoggedIn")
    if (isLoggedIn) {
      router.push("/admin")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("isAdminLoggedIn", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/admin")
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
          <Home className="w-4 h-4" />
          الصفحة الرئيسية
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-black">تسجيل الدخول</CardTitle>
          <p className="text-muted-foreground">لوحة إدارة مسافرين</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@musafireendj.com"
                required
                className="text-right"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="text-right pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="mt-6 p-4 bg-muted/50 rounded-md border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">بيانات تسجيل الدخول الافتراضية:</h4>
              <p className="text-xs text-muted-foreground">
                البريد الإلكتروني: admin@musafireendj.com
                <br />
                كلمة المرور: Musafir2024!
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
