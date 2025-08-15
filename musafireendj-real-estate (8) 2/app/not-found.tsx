import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 - الصفحة غير موجودة | مسافرين",
  description: "الصفحة المطلوبة غير موجودة",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6">الصفحة غير موجودة</p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  )
}
