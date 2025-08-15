-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول العقارات
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(8,2),
  location TEXT,
  images TEXT[], -- مصفوفة من روابط الصور
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الفيديوهات
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  property_id UUID REFERENCES properties(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الاستفسارات
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_type TEXT,
  duration INTEGER, -- عدد الأيام
  guests INTEGER, -- عدد الأشخاص
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج المستخدم الإداري الافتراضي
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@musafireendj.com', '$2a$10$example_hash', 'admin')
ON CONFLICT (email) DO NOTHING;

-- إدراج إعدادات الموقع الافتراضية
INSERT INTO site_settings (key, value) VALUES
('hero_title', 'اكتشف وجهتك المثالية في جيبوتي'),
('hero_subtitle', 'شقق مفروشة فاخرة مع إطلالات خلابة على البحر الأحمر'),
('contact_phone', '+253 77 123 456'),
('contact_email', 'info@musafireendj.com'),
('whatsapp_number', '+25377123456'),
('hero_image', '')
ON CONFLICT (key) DO NOTHING;
