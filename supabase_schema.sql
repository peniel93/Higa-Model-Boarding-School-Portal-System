-- Supabase SQL Schema for Higa Model Boarding School Portal System
-- Paste this script into the Supabase SQL Editor to set up all tables and seed default data.

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. USERS TABLE
-- =========================================================================
-- Stores profiles for all roles (Students, Teachers, Principals, Managers, Guardians, Staff)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Custom ID format: HIGA/[Role]/[4-Digit]/[Year]
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    default_password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female')),
    photo TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Teacher specific columns
    assigned_subject TEXT,
    assigned_sections TEXT[], -- Array of strings (e.g., {'Grade 9-A', 'Grade 9-B'})

    -- Student specific columns
    class_section TEXT,
    batch TEXT,
    nationality TEXT,
    telephone TEXT,
    email TEXT,
    dob_gc DATE,
    dob_ec TEXT,
    mother_name TEXT,
    high_school TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    placed_semester INT,
    placed_year INT,
    placement_section TEXT,
    placement_average NUMERIC(5,2),
    placement_rank INT,

    -- Guardian specific columns
    student_id TEXT REFERENCES public.users(id) ON DELETE SET NULL, -- Links to their ward
    address TEXT,
    shift_schedule TEXT, -- Shift timings for guardians/librarians/dorm managers

    -- Academic/Main Registrar privilege settings
    privileges TEXT DEFAULT 'partial' CHECK (privileges IN ('full', 'partial')),

    -- Cafeteria specific columns
    cafeteria_role TEXT CHECK (cafeteria_role IN ('cafeteria manager', 'ticker', 'cook')),

    -- Dormitory specific columns
    dorm_number TEXT,
    location TEXT,
    dorm_type TEXT CHECK (dorm_type IN ('male', 'female')),
    bed_number TEXT,
    has_pillow BOOLEAN DEFAULT false,
    has_blanket BOOLEAN DEFAULT false,
    
    -- Managed rights & status columns
    is_active BOOLEAN DEFAULT TRUE,
    rights TEXT[] DEFAULT '{}',
    registered_courses TEXT[] DEFAULT '{}',
    password_reset_requested BOOLEAN DEFAULT FALSE,
    reset_request_date TIMESTAMPTZ,
    reset_request_notes TEXT
);

-- Indexes for fast query operations
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);


-- =========================================================================
-- 2. COURSES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.courses (
    code TEXT PRIMARY KEY, -- e.g., 'MATH-09'
    name TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade BETWEEN 9 AND 12),
    credits INT NOT NULL DEFAULT 3
);


-- =========================================================================
-- 3. GRADES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES public.courses(code) ON DELETE CASCADE,
    semester INT NOT NULL CHECK (semester IN (1, 2)),
    assessment_score NUMERIC(5,2) CHECK (assessment_score BETWEEN 0 AND 30),
    exam_score NUMERIC(5,2) CHECK (exam_score BETWEEN 0 AND 70),
    total NUMERIC(5,2) GENERATED ALWAYS AS (assessment_score + exam_score) STORED,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_course_semester UNIQUE(student_id, course_code, semester)
);


-- =========================================================================
-- 4. PROPERTIES TABLE
-- =========================================================================
-- Manages school properties (chairs, tables, beds, foams, blankets, keyboards, PCs)
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY, -- e.g., PROP-001
    name TEXT NOT NULL,
    type TEXT, -- e.g., plastic, wooden, metal, foam, cotton
    category TEXT NOT NULL CHECK (
        category IN ('chairs', 'tables', 'desks', 'beds', 'foams', 'blankets', 'it_equipment')
    ),
    quantity INT NOT NULL DEFAULT 0,
    working INT NOT NULL DEFAULT 0,
    to_maintain INT NOT NULL DEFAULT 0,
    maintained INT NOT NULL DEFAULT 0,
    
    -- IT equipment specific columns
    name_brand TEXT, -- brand name e.g. Dell, HP
    computer_no INT,
    keyboards INT,
    mouse INT,
    cases INT
);


-- =========================================================================
-- 5. BOOKS TABLE
-- =========================================================================
-- Libraries and Bookstore cataloging
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY, -- BK-XXXX
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    publisher TEXT,
    year INT,
    category TEXT NOT NULL, -- e.g. science, mathematics, fiction
    type TEXT NOT NULL CHECK (type IN ('textbook', 'guide book', 'exam book')),
    grade INT CHECK (grade BETWEEN 9 AND 12),
    copies INT NOT NULL DEFAULT 1,
    donor TEXT -- Donation source or donor details
);


-- =========================================================================
-- 6. CHEMICALS TABLE
-- =========================================================================
-- Science laboratory materials (Chemistry, Physics, Technical Drawing)
CREATE TABLE IF NOT EXISTS public.chemicals (
    id TEXT PRIMARY KEY, -- CHEM-LAB-XXXX
    name TEXT NOT NULL,
    dose TEXT NOT NULL, -- e.g., 500ml, 1kg
    category TEXT NOT NULL, -- e.g., Acid, Base, Salt, Indicator
    type TEXT NOT NULL, -- e.g., Liquid, Powder, Crystals
    stock INT NOT NULL DEFAULT 0,
    required INT NOT NULL DEFAULT 0
);


-- =========================================================================
-- 7. SETTINGS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);


-- =========================================================================
-- 8. MEAL MENUS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.meal_menus (
    day TEXT PRIMARY KEY CHECK (
        day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    ),
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    dinner TEXT NOT NULL
);


-- =========================================================================
-- 9. CALENDAR EVENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id TEXT PRIMARY KEY, -- cal-XXXX
    date DATE NOT NULL,
    event TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('academic', 'exam', 'holiday'))
);


-- =========================================================================
-- 10. ANNOUNCEMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY, -- ann-XXXX
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target TEXT NOT NULL, -- Can be a role like 'Guardian', 'all', or 'USER:123'
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    post_type TEXT DEFAULT 'announcement', -- 'announcement' or 'meeting'
    urgency TEXT DEFAULT 'normal', -- 'normal', 'high', 'urgent'
    meeting_time TIMESTAMP,
    author TEXT -- ID or role of the creator
);


-- =========================================================================
-- 10.5 MESSAGES & INBOX TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_role TEXT NOT NULL, -- e.g. 'Manager', 'Principal'
    title TEXT NOT NULL,
    content TEXT,
    attachment_type TEXT, -- e.g. 'text/csv'
    attachment_data TEXT, -- Base64 or plain string
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================================================
-- 11. CLASSES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.classes (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    grade INT NOT NULL CHECK (grade BETWEEN 9 AND 12),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 12. CLASS COURSES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.class_courses (
    id SERIAL PRIMARY KEY,
    class_name TEXT NOT NULL REFERENCES public.classes(name) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES public.courses(code) ON DELETE CASCADE,
    semester INT NOT NULL CHECK (semester IN (1, 2)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_class_course_semester UNIQUE(class_name, course_code, semester)
);

-- =========================================================================
-- 12.5. GRADING SCHEMES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.grading_schemes (
    id TEXT PRIMARY KEY, -- e.g., 'MATH-09_Grade 9-A'
    course_code TEXT NOT NULL REFERENCES public.courses(code) ON DELETE CASCADE,
    class_section TEXT NOT NULL,
    components JSONB NOT NULL,
    teacher_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_course_section UNIQUE(course_code, class_section)
);

-- =========================================================================
-- 13. COURSE MATERIALS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.course_materials (
    id TEXT PRIMARY KEY, -- mat-XXXX
    name TEXT NOT NULL,
    teacher_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_data TEXT NOT NULL, -- Base64 data url
    file_type TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================================================
-- 14. STUDENT RANKS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.student_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    year INT NOT NULL,
    semester_1_average NUMERIC(5,2),
    semester_1_rank INT,
    semester_2_average NUMERIC(5,2),
    semester_2_rank INT,
    yearly_average NUMERIC(5,2),
    yearly_rank INT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_rank_year UNIQUE(student_id, year)
);
-- =========================================================================
-- 15. DORM ASSETS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.dorm_assets (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    totalCount INTEGER NOT NULL DEFAULT 0,
    goodCondition INTEGER NOT NULL DEFAULT 0,
    requiresMaintenance INTEGER NOT NULL DEFAULT 0,
    lastUpdated TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 16. CAFETERIA SHIFTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.cafe_shifts (
    id TEXT PRIMARY KEY,
    worker_ids JSONB NOT NULL,
    week_start DATE NOT NULL,
    days JSONB,
    time TEXT NOT NULL,
    duty TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 17. CAFETERIA ATTENDANCE TABLE
-- =========================================================================
-- Table: cafe_attendances
-- Purpose: Records daily attendance for cafeteria staff.
-- Relationships: None directly enforced at DB level (matches app logic).
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.cafe_attendances (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    remarks TEXT,
    review_status TEXT DEFAULT 'Pending',
    is_forwarded BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 18. PROPERTIES (SCHOOL STORE) TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    category TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    working INT NOT NULL DEFAULT 0,
    to_maintain INT NOT NULL DEFAULT 0,
    maintained INT NOT NULL DEFAULT 0,
    name_brand TEXT,
    computer_no INT,
    keyboards INT,
    mouse INT,
    cases INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 19. GALLERY MOMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.gallery_moments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g., 'Moments', 'Graduates', 'Event', 'Training'
    batch TEXT,
    class_section TEXT,
    media_urls JSONB, -- Array of strings (Base64 images or external video URLs)
    expiry_date DATE,
    author_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 20. ALUMNI RECORDS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.alumni_records (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    entrance_score NUMERIC(5,2),
    university_joined TEXT,
    department TEXT,
    graduation_year INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Ensure new columns exist on pre-existing tables from previous runs
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS rights TEXT[] DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS registered_courses TEXT[] DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS academic_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS dorm_block TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS dorm_room TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_reset_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS reset_request_date TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS reset_request_notes TEXT;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS expiry_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days');
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS written_exam_time TEXT;
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS written_exam_venue TEXT;
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS interview_time TEXT;
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS interview_venue TEXT;
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS exam_call_notes TEXT;

-- Ensure grades check constraints support 'released' status and flexible assessment limits
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_status_check;
ALTER TABLE public.grades ADD CONSTRAINT grades_status_check CHECK (status IN ('pending', 'submitted', 'approved', 'released'));
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_assessment_score_check;
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_exam_score_check;
ALTER TABLE public.grades ADD CONSTRAINT grades_assessment_score_check CHECK (assessment_score BETWEEN 0 AND 100);
ALTER TABLE public.grades ADD CONSTRAINT grades_exam_score_check CHECK (exam_score BETWEEN 0 AND 100);
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS breakdown JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS teacher_id TEXT;
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS teacher_name TEXT;
ALTER TABLE public.student_ranks ADD COLUMN IF NOT EXISTS class_section TEXT;
ALTER TABLE public.grading_schemes DISABLE ROW LEVEL SECURITY;


-- ====================================================================================
-- SEED DATA SETUP
-- ====================================================================================

-- 1. Insert Portal Settings
INSERT INTO public.settings (key, value) VALUES
('copyright', '© 2026 Higa Model Boarding School. All Rights Reserved.'),
('year', '2026'),
('academicYear', '2018 E.C. / 2026 G.C.'),
('schoolName', 'Higa Model Boarding School'),
('logo', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120'),
('churchLocation', 'Higa Town, Kambaata Zone, Southern Nations, Ethiopia'),
('contactEmail', 'info@higaportal.edu.et | registrar@higaportal.edu.et'),
('contactPhone', '+251-46-211-1234 / +251-911-99-88-77'),
('googleMapEmbedUrl', 'https://maps.google.com/maps?q=Higa+Town,+Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Insert Meal Menu Seeds
INSERT INTO public.meal_menus (day, breakfast, lunch, dinner) VALUES
('Monday', 'Furr / Bread & Tea', 'Shira wot with Injera', 'Kolo / Rice with Veggies'),
('Tuesday', 'Porridge (Genfo)', 'Misir wot with Injera', 'Macaroni with tomato sauce'),
('Wednesday', 'Bread & Jam with Tea', 'Gomen & Kik wot', 'Potato soup & Bread'),
('Thursday', 'Kinche', 'Soya chunks wot', 'Rice with Lentils'),
('Friday', 'Firfir with Bread', 'Fasting buffet wot', 'Pasta with sauce'),
('Saturday', 'Porridge', 'Egg firfir (Non-fasting) / Shiro', 'Soup & Bread'),
('Sunday', 'Special Bread & Tea', 'Meat wot (Key wot)', 'Veggies fried rice')
ON CONFLICT (day) DO UPDATE SET 
    breakfast = EXCLUDED.breakfast,
    lunch = EXCLUDED.lunch,
    dinner = EXCLUDED.dinner;

-- 3. Insert Calendar Events Seeds
INSERT INTO public.calendar_events (id, date, event, type) VALUES
('cal-1', '2026-09-10', 'Registration for Semester 1 Begins', 'academic'),
('cal-2', '2026-09-15', 'First Day of Classes', 'academic'),
('cal-3', '2026-11-20', 'Midterm Exams Week', 'exam'),
('cal-4', '2026-12-25', 'Christmas Break (Boarding Students Stay/Leave)', 'holiday'),
('cal-5', '2027-01-20', 'Semester 1 Final Exams', 'exam')
ON CONFLICT (id) DO UPDATE SET 
    date = EXCLUDED.date,
    event = EXCLUDED.event,
    type = EXCLUDED.type;

-- 4. Insert School announcements seeds
INSERT INTO public.announcements (id, title, content, target, date, expiry_date) VALUES
('ann-1', 'Welcome to Higa Model Portal', 'We are excited to launch our new fully digitised portal system for teachers, students and staff. Registration is now online.', 'all', '2026-07-15', '2026-08-15'),
('ann-2', 'Academic Council Meeting', 'All teachers and academic coordinators must attend the Semester 1 syllabus review meeting this Friday at 2:00 PM.', 'teachers', '2026-07-16', '2026-08-16'),
('ann-3', 'Extracurricular Sports Registration', 'Boarding students can register for basketball, football, and table tennis tournaments starting Monday.', 'students', '2026-07-17', '2026-08-17')
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    target = EXCLUDED.target,
    date = EXCLUDED.date,
    expiry_date = EXCLUDED.expiry_date;

-- 5. Insert Core courses seeds
INSERT INTO public.courses (code, name, grade, credits) VALUES
('MATH-09', 'Mathematics Grade 9', 9, 4),
('PHYS-09', 'Physics Grade 9', 9, 3),
('CHEM-09', 'Chemistry Grade 9', 9, 3),
('BIOL-09', 'Biology Grade 9', 9, 3),
('ENGL-09', 'English Grade 9', 9, 4),
('AMHA-09', 'Amharic Grade 9', 9, 2),
('IT-09', 'Information Technology Grade 9', 9, 2),
('DRAW-09', 'Technical Drawing Grade 9', 9, 2)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    grade = EXCLUDED.grade,
    credits = EXCLUDED.credits;

-- 6. Insert Users Seed
INSERT INTO public.users (
    id, username, password, default_password, name, role, gender, photo, created_at, privileges,
    assigned_subject, assigned_sections, class_section, batch, nationality, telephone, email,
    dob_gc, dob_ec, mother_name, high_school, guardian_name, guardian_phone, placed_semester,
    placed_year, placement_section, placement_average, placement_rank, cafeteria_role, dorm_number,
    location, dorm_type, shift_schedule, is_active, rights
) VALUES
-- Main Registrar Admin
('HIGA/MRA/1234/2018', 'HIGA/MRA/1234/2018', '1234', '1234', 'Main Registrar Admin', 'MainRegistrar', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', '2018-09-10T00:00:00Z', 'full', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{"users", "courses", "settings", "announcements"}'),
-- Academic Registrar Admin
('HIGA/ARA/5678/2020', 'HIGA/ARA/5678/2020', '5678', '5678', 'Academic Registrar Admin', 'AcademicRegistrar', 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', '2020-10-15T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{"users", "courses"}'),
-- Principal
('HIGA/Principal/1001/2019', 'HIGA/Principal/1001/2019', 'password1001', 'password1001', 'Dr. Abraham Kebede', 'Principal', 'Male', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120', '2019-01-15T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- Vice Principal
('HIGA/ViceP/1002/2021', 'HIGA/ViceP/1002/2021', 'password1002', 'password1002', 'W/ro Selamawit Alene', 'VicePrincipal', 'Female', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120', '2021-03-22T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- School Manager
('HIGA/Manager/2001/2017', 'HIGA/Manager/2001/2017', 'password2001', 'password2001', 'Ato Belayneh Gidey', 'Manager', 'Male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120', '2017-05-18T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- Teacher
('HIGA/Teacher/3001/2020', 'HIGA/Teacher/3001/2020', 'password3001', 'password3001', 'Ato Kassa Tekle', 'Teacher', 'Male', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120', '2020-09-01T00:00:00Z', 'partial', 'Mathematics', '{"Grade 9-A", "Grade 9-B"}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- Student
('HIGA/Student/4001/2024', 'HIGA/Student/4001/2024', 'password4001', 'password4001', 'Biruk Hailu', 'Student', 'Male', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=120', '2024-09-05T00:00:00Z', 'partial', NULL, NULL, 'Grade 9-A', '2024', 'Ethiopian', '+251911223344', 'biruk.hailu@higa.edu.et', '2009-05-12', '2001-09-02', 'Tigist Demeke', 'Higa Junior School', 'Ato Hailu Assefa', '+251911998877', 1, 2024, 'Grade 9-A', 88.50, 3, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- Guardian
('HIGA/Guardian/5001/2023', 'HIGA/Guardian/5001/2023', 'password5001', 'password5001', 'Ato Hailu Assefa', 'Guardian', 'Male', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', '2023-09-01T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Hawassa, Ethiopia', NULL, 'Night Shift', TRUE, '{}'),
-- Librarian
('HIGA/Librarian/6001/2021', 'HIGA/Librarian/6001/2021', 'password6001', 'password6001', 'Marta Negash', 'Librarian', 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', '2021-11-10T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Day Shift (8:00 AM - 5:00 PM)', TRUE, '{}'),
-- Dormitory Manager
('HIGA/Dormitory/7001/2022', 'HIGA/Dormitory/7001/2022', 'password7001', 'password7001', 'Tewodros Kassaye', 'Dormitory', 'Male', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120', '2022-01-20T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Block A - Room 102', 'Male Campus North', 'male', NULL, TRUE, '{}'),
-- Bookstore Manager
('HIGA/Book Store/8001/2020', 'HIGA/Book Store/8001/2020', 'password8001', 'password8001', 'Daniel Yohannes', 'BookStore', 'Male', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120', '2020-04-12T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- IT Technician
('HIGA/IT/9001/2022', 'HIGA/IT/9001/2022', 'password9001', 'password9001', 'Estifanos Alula', 'IT_Technician', 'Male', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120', '2022-09-15T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, '{}'),
-- Cafeteria Manager
('HIGA/Cafeteria/9101/2021', 'HIGA/Cafeteria/9101/2021', 'password9101', 'password9101', 'Chala Tolosa', 'Cafeteria', 'Male', 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=120', '2021-08-11T00:00:00Z', 'partial', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cafeteria manager', NULL, NULL, NULL, NULL, TRUE, '{}')
ON CONFLICT (id) DO UPDATE SET 
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    photo = EXCLUDED.photo;

-- Setup initial relationship between guardian and student
UPDATE public.users SET student_id = 'HIGA/Student/4001/2024' WHERE id = 'HIGA/Guardian/5001/2023';

-- 7. Insert Initial Grades
INSERT INTO public.grades (student_id, course_code, semester, assessment_score, exam_score, status) VALUES
('HIGA/Student/4001/2024', 'MATH-09', 1, 26.00, 62.00, 'approved'),
('HIGA/Student/4001/2024', 'PHYS-09', 1, 28.00, 58.00, 'approved'),
('HIGA/Student/4001/2024', 'CHEM-09', 1, 25.00, 60.00, 'approved'),
('HIGA/Student/4001/2024', 'BIOL-09', 1, 29.00, 61.00, 'approved')
ON CONFLICT (student_id, course_code, semester) DO UPDATE SET 
    assessment_score = EXCLUDED.assessment_score,
    exam_score = EXCLUDED.exam_score,
    status = EXCLUDED.status;

-- 8. Insert School Properties Seeds
INSERT INTO public.properties (
    id, name, type, category, quantity, working, to_maintain, maintained, name_brand, computer_no, keyboards, mouse, cases
) VALUES
('PROP-001', 'Student Chairs', 'wooden', 'chairs', 320, 300, 20, 0, NULL, NULL, NULL, NULL, NULL),
('PROP-002', 'Student Tables', 'plastic', 'tables', 160, 155, 5, 0, NULL, NULL, NULL, NULL, NULL),
('PROP-003', 'Student Desks', 'wooden', 'desks', 150, 140, 10, 0, NULL, NULL, NULL, NULL, NULL),
('PROP-004', 'Dormitory Beds', 'metal', 'beds', 240, 236, 4, 0, NULL, NULL, NULL, NULL, NULL),
('PROP-005', 'Foam Mattresses', 'foam', 'foams', 240, 238, 2, 0, NULL, NULL, NULL, NULL, NULL),
('PROP-006', 'Blankets', 'cotton', 'blankets', 480, 475, 5, 0, NULL, NULL, NULL, NULL, NULL),
('PROP-007', 'IT Lab Computer Set', 'electronic', 'it_equipment', 50, 48, 2, 0, 'Dell OptiPlex', 50, 50, 50, 50)
ON CONFLICT (id) DO UPDATE SET 
    quantity = EXCLUDED.quantity,
    working = EXCLUDED.working,
    to_maintain = EXCLUDED.to_maintain;

-- 9. Insert Books catalog seeds
INSERT INTO public.books (id, title, author, publisher, year, category, type, grade, copies, donor) VALUES
('BK-001', 'General Mathematics Grade 9', 'Dr. Tesfaye B.', 'MoE Ethiopia', 2021, 'mathematics', 'textbook', 9, 120, 'MoE'),
('BK-002', 'Extreme Physics Grade 9-10', 'Ato Negash G.', 'Aster Nega Pub', 2019, 'physics', 'guide book', 9, 60, 'Rotary Club'),
('BK-003', 'Comprehensive Chemistry', 'Marta H.', 'Farren Books', 2020, 'chemistry', 'exam book', 10, 45, 'Alumni Donation'),
('BK-004', 'Fikr Eske Mekabir', 'Hadis Alemayehu', 'Kuraz Pub', 1968, 'fiction', 'textbook', 9, 30, 'Personal Donation')
ON CONFLICT (id) DO UPDATE SET 
    copies = EXCLUDED.copies,
    donor = EXCLUDED.donor;

-- 10. Insert Laboratory chemical seeds
INSERT INTO public.chemicals (id, name, dose, category, type, stock, required) VALUES
('CHEM-LAB-001', 'Hydrochloric Acid (HCl)', '500ml', 'Acid', 'Liquid', 12, 5),
('CHEM-LAB-002', 'Sodium Hydroxide (NaOH)', '1kg', 'Base', 'Powder', 8, 2),
('CHEM-LAB-003', 'Copper Sulfate (CuSO4)', '500g', 'Salt', 'Crystals', 4, 4)
ON CONFLICT (id) DO UPDATE SET 
    stock = EXCLUDED.stock,
    required = EXCLUDED.required;

-- 11. Insert Classes Seeds
INSERT INTO public.classes (name, grade) VALUES
('Grade 9-A', 9),
('Grade 9-B', 9),
('Grade 10-A', 10),
('Grade 10-B', 10),
('Grade 11-A', 11),
('Grade 11-B', 11),
('Grade 12-A', 12),
('Grade 12-B', 12)
ON CONFLICT (name) DO NOTHING;

-- 12. Insert Dorm Assets Seeds
INSERT INTO public.dorm_assets (id, category, totalCount, goodCondition, requiresMaintenance) VALUES
('ast-1', 'Beds (Metal Frames)', 50, 48, 2),
('ast-2', 'Foam Mattresses', 50, 50, 0),
('ast-3', 'Cotton Blankets', 100, 98, 2),
('ast-4', 'Pillows', 50, 49, 1)
ON CONFLICT (id) DO UPDATE SET 
    category = EXCLUDED.category,
    totalCount = EXCLUDED.totalCount,
    goodCondition = EXCLUDED.goodCondition,
    requiresMaintenance = EXCLUDED.requiresMaintenance;
-- 13. Academic Programs
CREATE TABLE IF NOT EXISTS public.academic_programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14. Vacancies & News
CREATE TABLE IF NOT EXISTS public.vacancies (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    application_days TEXT,
    application_type TEXT,
    written_exam_date TEXT,
    interview_date TEXT,
    expiry_date DATE,
    interview_venue TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 15. Vacancy Results
CREATE TABLE IF NOT EXISTS public.vacancy_results (
    id TEXT PRIMARY KEY,
    vacancy_id TEXT REFERENCES public.vacancies(id) ON DELETE CASCADE,
    examinee_name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    address TEXT,
    id_document_url TEXT,
    cv_document_url TEXT,
    temp_document_url TEXT,
    written_score NUMERIC,
    interview_score NUMERIC,
    final_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disable Row Level Security (RLS) on all tables to allow public anonymous API access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_schemes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chemicals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dorm_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_attendances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_moments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_results DISABLE ROW LEVEL SECURITY;

-- 16. Gallery Moments
CREATE TABLE IF NOT EXISTS public.gallery_moments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    batch TEXT,
    description TEXT,
    media_urls JSONB,
    expiry_date DATE,
    author_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 17. Alumni Records
CREATE TABLE IF NOT EXISTS public.alumni_records (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    entrance_score NUMERIC,
    university_joined TEXT,
    department TEXT,
    graduation_year INTEGER,
    media_urls JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- DISABLE ROW LEVEL SECURITY (RLS) FOR FULL CROSS-DEVICE PUBLIC ACCESS
-- =========================================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chemicals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dorm_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_attendances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_moments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_results DISABLE ROW LEVEL SECURITY;

-- Enable Realtime Broadcast safely (skips tables already in publication)
DO $$ 
DECLARE
    tbl TEXT;
    tables TEXT[] := ARRAY['users', 'settings', 'grades', 'announcements', 'course_materials', 'dorm_assets', 'cafe_shifts', 'cafe_attendances'];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        BEGIN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
        EXCEPTION
            WHEN duplicate_object THEN
                -- Already added to publication, skip without error
                NULL;
        END;
    END LOOP;
END $$;

-- Seed Default Settings
INSERT INTO public.settings (key, value) VALUES
    ('schoolName', 'HIGA Model Boarding School Portal'),
    ('copyright', '© 2026 HIGA Model Boarding School. All Rights Reserved.'),
    ('academicYear', '2026/2027 Academic Year'),
    ('logo', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120'),
    ('higaCompoundImage', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'),
    ('backgroundImage', ''),
    ('bank_1_name', 'Commercial Bank of Ethiopia (CBE)'),
    ('bank_1_account', '1000123456789'),
    ('bank_2_name', 'Dashen Bank'),
    ('bank_2_account', '5289123456001'),
    ('bank_3_name', 'Awash Bank'),
    ('bank_3_account', '01320987654300'),
    ('bank_4_name', 'Bank of Abyssinia'),
    ('bank_4_account', '8923104561'),
    ('bank_5_name', 'CBE Birr'),
    ('bank_5_account', '0911000001'),
    ('bank_6_name', 'Telebirr'),
    ('bank_6_account', '0911000001'),
    ('bank_7_name', 'Hibret Bank'),
    ('bank_7_account', '182390124567'),
    ('bank_8_name', 'Nib International Bank'),
    ('bank_8_account', '70000123456'),
    ('facebookUrl', 'https://facebook.com'),
    ('telegramUrl', 'https://t.me'),
    ('linkedinUrl', 'https://linkedin.com'),
    ('youtubeUrl', 'https://youtube.com'),
    ('instagramUrl', 'https://instagram.com'),
    ('whatsappUrl', 'https://whatsapp.com'),
    ('tiktokUrl', 'https://tiktok.com'),
    ('twitterUrl', 'https://twitter.com')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public access to settings" ON public.settings;
CREATE POLICY "Allow all for settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.settings TO anon, authenticated, service_role;



