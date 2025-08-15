"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Home, Save, Users, Building, Settings, VideoIcon, Plus, Trash2 } from "lucide-react"

interface Property {
  id: number
  title: string
  description: string
  price: string
  location: string
  bedrooms: number
  bathrooms: number
  area: string
  images: string[]
  featured: boolean
  createdAt: string
}

interface User {
  id: number
  email: string
  password: string
  role: "admin" | "employee"
  name: string
  createdAt: string
}

interface Video {
  id: number
  title: string
  url: string
  thumbnail: string
  description: string
  createdAt: string
}

interface HomePageContent {
  heroTitle: string
  heroSubtitle: string
  whatsappNumber: string
  email: string
  aboutTitle: string
  aboutDescription: string
  featuresTitle: string
  heroImage: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [homeContent, setHomeContent] = useState<HomePageContent>({
    heroTitle: "اكتشف وجهتك المثالية في جيبوتي",
    heroSubtitle: "شقق فاخرة ومريحة في أفضل المواقع",
    whatsappNumber: "+253123456789",
    email: "info@musafireendj.com",
    aboutTitle: "عن مسافرين",
    aboutDescription: "نحن متخصصون في تقديم أفضل العقارات في جيبوتي مع خدمة عملاء متميزة",
    featuresTitle: "لماذا تختار مسافرين؟",
    heroImage: "/placeholder.svg?height=600&width=800&text=صورة+البيت+الرئيسية",
  })

  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    images: [],
    featured: false,
  })

  const [newUser, setNewUser] = useState<Partial<User>>({
    email: "",
    password: "",
    name: "",
    role: "employee",
  })

  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: "",
    url: "",
    thumbnail: "",
    description: "",
  })

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        setIsLoading(true)
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn")
        const userData = localStorage.getItem("currentUser")

        console.log("[v0] Checking authentication:", { isLoggedIn, userData })

        if (isLoggedIn === "true" && userData && userData !== "null") {
          try {
            const user = JSON.parse(userData)
            if (user && user.id && user.email) {
              setCurrentUser(user)
              setIsAuthenticated(true)
              loadData()
              setIsLoading(false)
              return
            }
          } catch (parseError) {
            console.error("[v0] Error parsing user data:", parseError)
          }
        }

        // إذا لم تنجح المصادقة، توجه لصفحة تسجيل الدخول
        console.log("[v0] Authentication failed, redirecting to login")
        localStorage.removeItem("isAdminLoggedIn")
        localStorage.removeItem("currentUser")
        router.push("/login")
      } catch (error) {
        console.error("[v0] Authentication error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadData = () => {
    try {
      // تحميل العقارات
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        setProperties(JSON.parse(savedProperties))
      }

      // تحميل المستخدمين
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

      // تحميل الفيديوهات
      const savedVideos = localStorage.getItem("videos")
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos))
      }

      // تحميل محتوى الصفحة الرئيسية
      const savedHomeContent = localStorage.getItem("homeContent")
      if (savedHomeContent) {
        setHomeContent(JSON.parse(savedHomeContent))
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const saveHomeContent = () => {
    try {
      localStorage.setItem("homeContent", JSON.stringify(homeContent))
      alert("تم حفظ محتوى الصفحة الرئيسية بنجاح!")
    } catch (error) {
      console.error("[v0] Error saving home content:", error)
      alert("حدث خطأ أثناء الحفظ")
    }
  }

  const addProperty = () => {
    if (!newProperty.title || !newProperty.price || !newProperty.location) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const property: Property = {
      id: Date.now(),
      title: newProperty.title!,
      description: newProperty.description || "",
      price: newProperty.price!,
      location: newProperty.location!,
      bedrooms: newProperty.bedrooms || 1,
      bathrooms: newProperty.bathrooms || 1,
      area: newProperty.area || "",
      images: newProperty.images || [],
      featured: newProperty.featured || false,
      createdAt: new Date().toISOString(),
    }

    const updatedProperties = [...properties, property]
    setProperties(updatedProperties)
    localStorage.setItem("properties", JSON.stringify(updatedProperties))

    // إعادة تعيين النموذج
    setNewProperty({
      title: "",
      description: "",
      price: "",
      location: "",
      bedrooms: 1,
      bathrooms: 1,
      area: "",
      images: [],
      featured: false,
    })

    alert("تم إضافة العقار بنجاح!")
  }

  const deleteProperty = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العقار؟")) {
      const updatedProperties = properties.filter((p) => p.id !== id)
      setProperties(updatedProperties)
      localStorage.setItem("properties", JSON.stringify(updatedProperties))
      alert("تم حذف العقار بنجاح!")
    }
  }

  const addUser = () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    if (users.some((u) => u.email === newUser.email)) {
      alert("هذا البريد الإلكتروني مستخدم بالفعل")
      return
    }

    const user: User = {
      id: Date.now(),
      email: newUser.email!,
      password: newUser.password!,
      name: newUser.name!,
      role: newUser.role as "admin" | "employee",
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, user]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    setNewUser({
      email: "",
      password: "",
      name: "",
      role: "employee",
    })

    alert("تم إضافة المستخدم بنجاح!")
  }

  const deleteUser = (id: number) => {
    if (id === currentUser?.id) {
      alert("لا يمكنك حذف حسابك الخاص")
      return
    }

    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      const updatedUsers = users.filter((u) => u.id !== id)
      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
      alert("تم حذف المستخدم بنجاح!")
    }
  }

  const addVideo = () => {
    if (!newVideo.title || !newVideo.url) {
      alert("يرجى ملء العنوان والرابط على الأقل")
      return
    }

    const video: Video = {
      id: Date.now(),
      title: newVideo.title!,
      url: newVideo.url!,
      thumbnail: newVideo.thumbnail || "",
      description: newVideo.description || "",
      createdAt: new Date().toISOString(),
    }

    const updatedVideos = [...videos, video]
    setVideos(updatedVideos)
    localStorage.setItem("videos", JSON.stringify(updatedVideos))

    setNewVideo({
      title: "",
      url: "",
      thumbnail: "",
      description: "",
    })

    alert("تم إضافة الفيديو بنجاح!")
  }

  const deleteVideo = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      const updatedVideos = videos.filter((v) => v.id !== id)
      setVideos(updatedVideos)
      localStorage.setItem("videos", JSON.stringify(updatedVideos))
      alert("تم حذف الفيديو بنجاح!")
    }
  }

  const changePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("يرجى ملء جميع الحقول")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("كلمات المرور غير متطابقة")
      return
    }

    if (newPassword.length < 8) {
      alert("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      return
    }

    const updatedUser = { ...currentUser!, password: newPassword }
    const updatedUsers = users.map((u) => (u.id === currentUser!.id ? updatedUser : u))

    setUsers(updatedUsers)
    setCurrentUser(updatedUser)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    setNewPassword("")
    setConfirmPassword("")
    alert("تم تغيير كلمة المرور بنجاح!")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <div className="text-slate-300 text-lg font-medium">جاري تحميل لوحة الإدارة...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-slate-300 text-lg">جاري إعادة التوجيه...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-primary">لوحة إدارة مسافرين</h1>
            <span className="text-sm text-muted-foreground">مرحباً، {currentUser?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="properties" className="gap-2">
              <Building className="w-4 h-4" />
              العقارات
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <VideoIcon className="w-4 h-4" />
              الفيديوهات
            </TabsTrigger>
            <TabsTrigger value="homepage" className="gap-2">
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </TabsTrigger>
            {currentUser?.role === "admin" && (
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                المستخدمين
              </TabsTrigger>
            )}
            {currentUser?.role === "admin" && (
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                الإعدادات
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة عقار جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyTitle">عنوان العقار *</Label>
                    <Input
                      id="propertyTitle"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                      className="text-right"
                      placeholder="شقة فاخرة في وسط المدينة"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyPrice">السعر *</Label>
                    <Input
                      id="propertyPrice"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                      className="text-right"
                      placeholder="1000 دولار/شهر"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyLocation">الموقع *</Label>
                    <Input
                      id="propertyLocation"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                      className="text-right"
                      placeholder="جيبوتي، الحي الأوروبي"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyArea">المساحة</Label>
                    <Input
                      id="propertyArea"
                      value={newProperty.area}
                      onChange={(e) => setNewProperty({ ...newProperty, area: e.target.value })}
                      className="text-right"
                      placeholder="120 متر مربع"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyBedrooms">عدد غرف النوم</Label>
                    <Input
                      id="propertyBedrooms"
                      type="number"
                      min="1"
                      value={newProperty.bedrooms}
                      onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyBathrooms">عدد الحمامات</Label>
                    <Input
                      id="propertyBathrooms"
                      type="number"
                      min="1"
                      value={newProperty.bathrooms}
                      onChange={(e) => setNewProperty({ ...newProperty, bathrooms: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="propertyDescription">الوصف</Label>
                  <Textarea
                    id="propertyDescription"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    className="text-right min-h-[100px]"
                    placeholder="وصف تفصيلي للعقار..."
                  />
                </div>
                <Button onClick={addProperty} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة العقار
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>العقارات الحالية ({properties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">لا توجد عقارات مضافة بعد</p>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-right">{property.title}</h3>
                          <p className="text-sm text-muted-foreground text-right">{property.location}</p>
                          <p className="text-sm font-medium text-primary text-right">{property.price}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProperty(property.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة فيديو جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="videoTitle">عنوان الفيديو *</Label>
                    <Input
                      id="videoTitle"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="text-right"
                      placeholder="جولة في الشقة الفاخرة"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl">رابط الفيديو *</Label>
                    <Input
                      id="videoUrl"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoThumbnail">رابط الصورة المصغرة</Label>
                    <Input
                      id="videoThumbnail"
                      value={newVideo.thumbnail}
                      onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="videoDescription">وصف الفيديو</Label>
                  <Textarea
                    id="videoDescription"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    className="text-right min-h-[100px]"
                    placeholder="وصف الفيديو..."
                  />
                </div>
                <Button onClick={addVideo} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة الفيديو
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الفيديوهات الحالية ({videos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {videos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">لا توجد فيديوهات مضافة بعد</p>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div key={video.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-right">{video.title}</h3>
                          <p className="text-sm text-muted-foreground text-right">{video.description}</p>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            مشاهدة الفيديو
                          </a>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => deleteVideo(video.id)} className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  تعديل محتوى الصفحة الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle">العنوان الرئيسي</Label>
                      <Input
                        id="heroTitle"
                        value={homeContent.heroTitle}
                        onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })}
                        className="text-right"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heroSubtitle">العنوان الفرعي</Label>
                      <Input
                        id="heroSubtitle"
                        value={homeContent.heroSubtitle}
                        onChange={(e) => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })}
                        className="text-right"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsappNumber">رقم الواتساب</Label>
                      <Input
                        id="whatsappNumber"
                        value={homeContent.whatsappNumber}
                        onChange={(e) => setHomeContent({ ...homeContent, whatsappNumber: e.target.value })}
                        className="text-right"
                        placeholder="+253123456789"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={homeContent.email}
                        onChange={(e) => setHomeContent({ ...homeContent, email: e.target.value })}
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aboutTitle">عنوان قسم "عنا"</Label>
                      <Input
                        id="aboutTitle"
                        value={homeContent.aboutTitle}
                        onChange={(e) => setHomeContent({ ...homeContent, aboutTitle: e.target.value })}
                        className="text-right"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutDescription">وصف قسم "عنا"</Label>
                      <Textarea
                        id="aboutDescription"
                        value={homeContent.aboutDescription}
                        onChange={(e) => setHomeContent({ ...homeContent, aboutDescription: e.target.value })}
                        className="text-right min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="featuresTitle">عنوان قسم المميزات</Label>
                      <Input
                        id="featuresTitle"
                        value={homeContent.featuresTitle}
                        onChange={(e) => setHomeContent({ ...homeContent, featuresTitle: e.target.value })}
                        className="text-right"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heroImage">رابط صورة البيت الرئيسية</Label>
                      <Input
                        id="heroImage"
                        value={homeContent.heroImage}
                        onChange={(e) => setHomeContent({ ...homeContent, heroImage: e.target.value })}
                        className="text-right"
                        placeholder="/path/to/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={saveHomeContent} className="w-full gap-2">
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {currentUser?.role === "admin" && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة مستخدم جديد
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userName">الاسم *</Label>
                      <Input
                        id="userName"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="text-right"
                        placeholder="أحمد محمد"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userEmail">البريد الإلكتروني *</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="user@musafireendj.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userPassword">كلمة المرور *</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userRole">الصلاحية</Label>
                      <select
                        id="userRole"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "employee" })}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="employee">موظف</option>
                        <option value="admin">مدير</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={addUser} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة المستخدم
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المستخدمين الحاليين ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex-1 text-right">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.role === "admin"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {user.role === "admin" ? "مدير" : "موظف"}
                          </span>
                        </div>
                        {user.id !== currentUser?.id && (
                          <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {currentUser?.role === "admin" && (
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    تغيير كلمة المرور
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button onClick={changePassword} className="w-full gap-2">
                    <Save className="w-4 h-4" />
                    تغيير كلمة المرور
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
