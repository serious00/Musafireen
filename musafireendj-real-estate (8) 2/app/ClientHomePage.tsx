"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, Phone, Mail, MapPin, Star, Bed, Bath, Square, Lock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ClientHomePage() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "شقة فاخرة في وسط المدينة",
      price: "1,200",
      currency: "USD",
      period: "شهرياً",
      location: "جيبوتي سيتي",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      rating: 4.8,
      image: "/modern-apartment-djibouti.png",
      features: ["مفروشة", "مكيفة", "موقف سيارة"],
    },
    {
      id: 2,
      title: "شقة عائلية مع إطلالة بحرية",
      price: "950",
      currency: "USD",
      period: "شهرياً",
      location: "الحي الدبلوماسي",
      bedrooms: 2,
      bathrooms: 1,
      area: 85,
      rating: 4.6,
      image: "/djibouti-apartment-balcony.png",
      features: ["إطلالة بحرية", "شرفة", "أمان 24/7"],
    },
    {
      id: 3,
      title: "استوديو حديث للمهنيين",
      price: "650",
      currency: "USD",
      period: "شهرياً",
      location: "المنطقة التجارية",
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      rating: 4.4,
      image: "/modern-studio-apartment-djibouti-minimalist.png",
      features: ["حديث", "قريب من المكاتب", "إنترنت سريع"],
    },
  ])

  const [heroImage, setHeroImage] = useState("/placeholder-8n0xs.png")
  const [featuredVideos, setFeaturedVideos] = useState([
    {
      id: 1,
      title: "جولة في أفضل شققنا الفاخرة",
      thumbnail: "/luxury-apartment-thumbnail.png",
      videoUrl: "#",
      description: "استكشف أروع الشقق الفاخرة المتاحة",
    },
    {
      id: 2,
      title: "إطلالات بحرية خلابة من شققنا",
      thumbnail: "/ocean-view-balcony-thumbnail.png",
      videoUrl: "#",
      description: "شاهد الإطلالات البحرية الساحرة",
    },
  ])

  const [pageContent, setPageContent] = useState({
    mainTitle: "اكتشف مسكنك المثالي في جيبوتي",
    subtitle: "شقق فاخرة ومريحة في أجمل مواقع جيبوتي مع خدمات متميزة وأسعار تنافسية",
    whatsappNumber: "+253123456789",
    contactEmail: "info@musafireendj.com",
    ctaButtonText: "تواصل معنا عبر الواتساب",
    propertiesTitle: "شققنا المميزة",
    videosTitle: "جولات افتراضية في شققنا",
  })

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    apartmentType: "",
    duration: "",
    guests: "",
    message: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        setProperties(JSON.parse(savedProperties))
      }

      const savedHeroImage = localStorage.getItem("heroImage")
      if (savedHeroImage) {
        setHeroImage(savedHeroImage)
      }

      const savedVideos = localStorage.getItem("videos")
      if (savedVideos) {
        setFeaturedVideos(JSON.parse(savedVideos))
      }

      setPageContent({
        mainTitle: localStorage.getItem("mainTitle") || "اكتشف مسكنك المثالي في جيبوتي",
        subtitle:
          localStorage.getItem("subtitle") || "شقق فاخرة ومريحة في أجمل مواقع جيبوتي مع خدمات متميزة وأسعار تنافسية",
        whatsappNumber: localStorage.getItem("whatsappNumber") || "+253123456789",
        contactEmail: localStorage.getItem("contactEmail") || "info@musafireendj.com",
        ctaButtonText: localStorage.getItem("ctaButtonText") || "تواصل معنا عبر الواتساب",
        propertiesTitle: localStorage.getItem("propertiesTitle") || "شققنا المميزة",
        videosTitle: localStorage.getItem("videosTitle") || "جولات افتراضية في شققنا",
      })
    }
  }, [])

  const handleWhatsAppContact = (propertyTitle: string) => {
    const message = `مرحباً، أنا مهتم بـ ${propertyTitle} من موقع مسافرين`
    const whatsappUrl = `https://wa.me/${pageContent.whatsappNumber.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(message)}`
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank")
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailBody = `
الاسم: ${contactForm.name}
البريد الإلكتروني: ${contactForm.email}
رقم الهاتف: ${contactForm.phone}
نوع الشقة المطلوبة: ${contactForm.apartmentType}
مدة الإقامة: ${contactForm.duration}
عدد الأشخاص: ${contactForm.guests}
الرسالة: ${contactForm.message}
    `

    const mailtoLink = `mailto:${pageContent.contactEmail}?subject=استفسار عن الشقق&body=${encodeURIComponent(emailBody)}`
    if (typeof window !== "undefined") {
      window.location.href = mailtoLink
    }

    setContactForm({
      name: "",
      email: "",
      phone: "",
      apartmentType: "",
      duration: "",
      guests: "",
      message: "",
    })
  }

  const handleVideoClick = (videoUrl: string, title: string) => {
    if (typeof window !== "undefined") {
      if (videoUrl && videoUrl !== "#") {
        window.open(videoUrl, "_blank")
      } else {
        const message = `مرحباً، أريد مشاهدة فيديو: ${title}`
        const whatsappUrl = `https://wa.me/${pageContent.whatsappNumber.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, "_blank")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">م</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground">مسافرين</h1>
                <p className="text-sm text-muted-foreground">عقارات جيبوتي</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/login"
                  }
                }}
                className="gap-2"
              >
                <Lock className="w-4 h-4" />
                إدارة
              </Button>
              <Button
                onClick={() => handleWhatsAppContact("الاستفسار العام")}
                className="bg-green-500 hover:bg-green-600 text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                واتساب
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 to-secondary/20 py-20">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage || "/placeholder.svg"}
            alt="مسافرين - عقارات جيبوتي"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{pageContent.mainTitle}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pageContent.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => handleWhatsAppContact("الاستفسار عن العقارات المتاحة")}
              className="gap-2 bg-secondary hover:bg-secondary/90"
            >
              <MessageCircle className="w-5 h-5" />
              {pageContent.ctaButtonText}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent border-foreground/20 hover:bg-foreground/10"
            >
              <Phone className="w-5 h-5" />
              اتصل بنا
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-foreground mb-4">{pageContent.videosTitle}</h3>
            <p className="text-muted-foreground">شاهد فيديوهات حصرية لأروع العقارات المتاحة</p>
          </div>

          {featuredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2"
                  onClick={() => handleVideoClick(video.videoUrl, video.title)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg?height=250&width=400&query=video thumbnail"}
                      alt={video.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-secondary/90 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary transition-all duration-300 shadow-lg">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="font-bold text-lg text-white mb-1 group-hover:text-secondary transition-colors">
                          {video.title}
                        </h4>
                        {video.description && <p className="text-white/80 text-sm line-clamp-2">{video.description}</p>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-12 h-12 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">لا توجد فيديوهات متاحة حالياً</h4>
              <p className="text-muted-foreground mb-6">سيتم إضافة فيديوهات جديدة قريباً</p>
              <Button
                onClick={() => handleWhatsAppContact("طلب مشاهدة فيديوهات العقارات")}
                className="gap-2 bg-secondary hover:bg-secondary/90"
              >
                <MessageCircle className="w-4 h-4" />
                اطلب فيديوهات العقارات
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-foreground mb-4">{pageContent.propertiesTitle}</h3>
            <p className="text-muted-foreground">اختر من مجموعة متنوعة من الشقق المميزة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary text-secondary-foreground">
                      {property.price} {property.currency} {property.period}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-900">{property.rating}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">{property.title}</h4>
                  <div className="flex items-center gap-1 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.area}م²</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full gap-2 bg-green-500 hover:bg-green-600"
                    onClick={() => handleWhatsAppContact(property.title)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    استفسر عبر واتساب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-foreground mb-4">أرسل لنا استفسارك</h3>
            <p className="text-muted-foreground">املأ النموذج وسنتواصل معك في أقرب وقت</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      required
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+253 XX XX XX XX"
                      required
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartmentType">نوع الشقة المطلوبة</Label>
                    <Input
                      id="apartmentType"
                      value={contactForm.apartmentType}
                      onChange={(e) => setContactForm({ ...contactForm, apartmentType: e.target.value })}
                      placeholder="استوديو، غرفة واحدة، غرفتين..."
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">مدة الإقامة</Label>
                    <Input
                      id="duration"
                      value={contactForm.duration}
                      onChange={(e) => setContactForm({ ...contactForm, duration: e.target.value })}
                      placeholder="شهر، 3 أشهر، سنة..."
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">عدد الأشخاص</Label>
                    <Input
                      id="guests"
                      value={contactForm.guests}
                      onChange={(e) => setContactForm({ ...contactForm, guests: e.target.value })}
                      placeholder="1، 2، 3..."
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">رسالة إضافية</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="أي متطلبات خاصة أو استفسارات إضافية..."
                    rows={4}
                    className="text-right"
                  />
                </div>

                <Button type="submit" className="w-full gap-2 bg-secondary hover:bg-secondary/90">
                  <Mail className="w-4 h-4" />
                  إرسال الاستفسار
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-foreground mb-4">تواصل معنا</h3>
            <p className="text-muted-foreground">نحن هنا لمساعدتك في العثور على المنزل المثالي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">واتساب</h4>
              <p className="text-muted-foreground mb-4">تواصل معنا فوراً</p>
              <Button
                onClick={() => handleWhatsAppContact("الاستفسار العام")}
                className="bg-green-500 hover:bg-green-600"
              >
                {pageContent.whatsappNumber}
              </Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">الهاتف</h4>
              <p className="text-muted-foreground mb-4">اتصل بنا مباشرة</p>
              <Button variant="outline">+253 21 35 67 89</Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-accent-foreground" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">البريد الإلكتروني</h4>
              <p className="text-muted-foreground mb-4">راسلنا في أي وقت</p>
              <Button variant="outline">
                {/* استخدام البريد الإلكتروني الديناميكي */}
                {pageContent.contactEmail}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">م</span>
              </div>
              <div>
                <h5 className="font-bold">مسافرين</h5>
                <p className="text-sm opacity-80">musafireendj.com</p>
              </div>
            </div>
            <p className="text-sm opacity-80">© 2024 مسافرين. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
