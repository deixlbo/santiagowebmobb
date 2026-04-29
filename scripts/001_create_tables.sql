-- Barangay Management System Database Schema
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  purok TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  contact_number TEXT,
  address TEXT,
  document_type TEXT,
  document_url TEXT,
  role TEXT DEFAULT 'resident' CHECK (role IN ('resident', 'official', 'admin')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Officials can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can update profiles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Allow insert for authenticated users" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'important', 'normal')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category TEXT,
  publish_date DATE,
  expiry_date DATE,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published announcements" ON public.announcements FOR SELECT USING (status = 'published');
CREATE POLICY "Officials can view all announcements" ON public.announcements FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can insert announcements" ON public.announcements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can update announcements" ON public.announcements FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can delete announcements" ON public.announcements FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- ORDINANCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ordinances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ordinance_number TEXT NOT NULL,
  title TEXT NOT NULL,
  whereas_clauses TEXT[],
  sections JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  enacted_date DATE,
  effectivity_date DATE,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ordinances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published ordinances" ON public.ordinances FOR SELECT USING (status = 'published');
CREATE POLICY "Officials can view all ordinances" ON public.ordinances FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can manage ordinances" ON public.ordinances FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  location TEXT,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  total_budget DECIMAL(12,2),
  source_of_funds TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_head TEXT,
  beneficiaries TEXT,
  remarks TEXT,
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Officials can manage projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- ASSETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  brand_model TEXT,
  serial_number TEXT,
  quantity INTEGER DEFAULT 1,
  date_acquired DATE,
  source TEXT,
  cost DECIMAL(12,2),
  last_used_date DATE,
  assigned_to TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'damaged', 'lost')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Officials can manage assets" ON public.assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- DOCUMENT TYPES TABLE (configured by officials)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  fee DECIMAL(10,2) DEFAULT 0,
  processing_days INTEGER DEFAULT 1,
  template TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active document types" ON public.document_types FOR SELECT USING (is_active = true);
CREATE POLICY "Officials can manage document types" ON public.document_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- DOCUMENT REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.document_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number TEXT UNIQUE,
  resident_id UUID REFERENCES public.profiles(id),
  document_type_id UUID REFERENCES public.document_types(id),
  document_type_name TEXT,
  purpose TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'ready', 'released', 'archived')),
  uploaded_requirements JSONB,
  fee DECIMAL(10,2),
  pickup_date TIMESTAMP WITH TIME ZONE,
  pickup_time TEXT,
  remarks TEXT,
  processed_by UUID REFERENCES public.profiles(id),
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view own requests" ON public.document_requests FOR SELECT USING (resident_id = auth.uid());
CREATE POLICY "Residents can create requests" ON public.document_requests FOR INSERT WITH CHECK (resident_id = auth.uid());
CREATE POLICY "Officials can view all requests" ON public.document_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can update requests" ON public.document_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- BLOTTER REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blotter_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blotter_number TEXT UNIQUE,
  incident_type TEXT NOT NULL,
  incident_date DATE,
  incident_time TIME,
  location TEXT,
  location_coordinates JSONB,
  description TEXT NOT NULL,
  complainant_id UUID REFERENCES public.profiles(id),
  complainant_name TEXT,
  complainant_address TEXT,
  complainant_contact TEXT,
  respondent_name TEXT,
  respondent_address TEXT,
  status TEXT DEFAULT 'filed' CHECK (status IN ('filed', 'processing', 'mediation', 'resolved', 'escalated', 'dismissed')),
  action_taken TEXT,
  resolution TEXT,
  resolution_date DATE,
  handled_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.blotter_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view own blotters" ON public.blotter_reports FOR SELECT USING (complainant_id = auth.uid());
CREATE POLICY "Residents can create blotters" ON public.blotter_reports FOR INSERT WITH CHECK (complainant_id = auth.uid());
CREATE POLICY "Officials can view all blotters" ON public.blotter_reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can update blotters" ON public.blotter_reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- BUSINESS PERMITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.business_permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  permit_number TEXT UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT,
  owner_id UUID REFERENCES public.profiles(id),
  owner_name TEXT,
  business_address TEXT,
  contact_number TEXT,
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'renewed')),
  documents_complete BOOLEAN DEFAULT false,
  missing_documents TEXT[],
  fee DECIMAL(10,2),
  validity_start DATE,
  validity_end DATE,
  remarks TEXT,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.business_permits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view own permits" ON public.business_permits FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Residents can create permits" ON public.business_permits FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Officials can view all permits" ON public.business_permits FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can manage permits" ON public.business_permits FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- OFFICIALS TABLE (for landing page display)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.officials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  contact_number TEXT,
  email TEXT,
  term_start DATE,
  term_end DATE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active officials" ON public.officials FOR SELECT USING (is_active = true);
CREATE POLICY "Officials can manage officials table" ON public.officials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- DOCUMENT ARCHIVE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.document_archive (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_request_id UUID REFERENCES public.document_requests(id),
  document_type TEXT,
  resident_name TEXT,
  released_date TIMESTAMP WITH TIME ZONE,
  fee_collected DECIMAL(10,2),
  processed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.document_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Officials can view archive" ON public.document_archive FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);
CREATE POLICY "Officials can manage archive" ON public.document_archive FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin'))
);

-- =====================================================
-- TRIGGER FOR AUTO-CREATING PROFILE ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, purok, gender, document_type, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(new.raw_user_meta_data ->> 'purok', NULL),
    COALESCE(new.raw_user_meta_data ->> 'gender', NULL),
    COALESCE(new.raw_user_meta_data ->> 'document_type', NULL),
    COALESCE(new.raw_user_meta_data ->> 'role', 'resident')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION TO GENERATE REQUEST NUMBERS
-- =====================================================
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.request_number := 'DOC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('document_request_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS document_request_seq START 1;

CREATE TRIGGER set_request_number
  BEFORE INSERT ON public.document_requests
  FOR EACH ROW
  WHEN (NEW.request_number IS NULL)
  EXECUTE FUNCTION generate_request_number();

-- =====================================================
-- FUNCTION TO GENERATE BLOTTER NUMBERS
-- =====================================================
CREATE OR REPLACE FUNCTION generate_blotter_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.blotter_number := 'BLT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('blotter_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS blotter_seq START 1;

CREATE TRIGGER set_blotter_number
  BEFORE INSERT ON public.blotter_reports
  FOR EACH ROW
  WHEN (NEW.blotter_number IS NULL)
  EXECUTE FUNCTION generate_blotter_number();

-- =====================================================
-- FUNCTION TO GENERATE PERMIT NUMBERS
-- =====================================================
CREATE OR REPLACE FUNCTION generate_permit_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.permit_number := 'BUS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('permit_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS permit_seq START 1;

CREATE TRIGGER set_permit_number
  BEFORE INSERT ON public.business_permits
  FOR EACH ROW
  WHEN (NEW.permit_number IS NULL)
  EXECUTE FUNCTION generate_permit_number();

-- =====================================================
-- INSERT DEFAULT DOCUMENT TYPES
-- =====================================================
INSERT INTO public.document_types (name, description, requirements, fee, processing_days, template) VALUES
('Barangay Clearance', 'Certificate of good moral character and no pending cases', ARRAY['Valid ID', 'Proof of Residency'], 50.00, 1, 'clearance'),
('Certificate of Residency', 'Proof of residence in the barangay', ARRAY['Valid ID', 'Utility Bill'], 30.00, 1, 'residency'),
('Certificate of Indigency', 'Certificate for indigent residents', ARRAY['Valid ID', 'Barangay Certification'], 0.00, 1, 'indigency'),
('Business Clearance', 'Clearance for business operations', ARRAY['Valid ID', 'DTI Registration', 'Lease Contract'], 200.00, 3, 'business')
ON CONFLICT DO NOTHING;

-- =====================================================
-- INSERT DEFAULT OFFICIALS
-- =====================================================
INSERT INTO public.officials (name, position, display_order) VALUES
('Rolando C. Borja', 'Punong Barangay', 1),
('April Joy C. Cano', 'Barangay Secretary', 2)
ON CONFLICT DO NOTHING;
