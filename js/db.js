// js/db.js
// Database Layer connecting to Supabase with LocalStorage caching/offline fallback

import { createClient } from '@supabase/supabase-js';

const DB_PREFIX = "higa_portal_";

// Initialize Supabase Client with fallback credentials so deployed builds ALWAYS connect to DB
const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};
const supabaseUrl = env.VITE_SUPABASE_URL || "https://ipqwsiwwlexcsqpjdhgk.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwcXdzaXd3bGV4Y3NxcGpkaGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDYyNTgsImV4cCI6MjA5OTg4MjI1OH0.bRlqBxMn1gai0pwXuAACfxeyC9S4jGyrFMMy2N7NJas";

const isSupabaseConfigured = 
  supabaseUrl && 
  !supabaseUrl.includes("your-supabase-url") && 
  supabaseAnonKey && 
  !supabaseAnonKey.includes("your-anon-key");

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Primary key mappings for differential sync
const primaryKeys = {
  users: "id",
  courses: "code",
  grades: "unique_composite", // student_id, course_code, semester
  properties: "id",
  books: "id",
  chemicals: "id",
  meal_menu: "day",
  calendar: "id",
  announcements: "id",
  classes: "id",
  class_courses: "id",
  gallery_moments: "id",
  alumni_records: "id",
  grading_schemes: "id"
};

// Database table name mapping (Local -> Supabase)
const dbTables = {
  users: "users",
  courses: "courses",
  grades: "grades",
  properties: "properties",
  books: "books",
  chemicals: "chemicals",
  meal_menu: "meal_menus",
  calendar: "calendar_events",
  announcements: "announcements",
  classes: "classes",
  class_courses: "class_courses",
  gallery_moments: "gallery_moments",
  alumni_records: "alumni_records",
  grading_schemes: "grading_schemes"
};

// --- Mappings & Converters for users ---
const userFieldMapping = {
  defaultPassword: "default_password",
  assignedSubject: "assigned_subject",
  assignedSections: "assigned_sections",
  classSection: "class_section",
  dobGC: "dob_gc",
  dobEC: "dob_ec",
  motherName: "mother_name",
  highSchool: "high_school",
  guardianName: "guardian_name",
  guardianPhone: "guardian_phone",
  placedSemester: "placed_semester",
  placedYear: "placed_year",
  placementSection: "placement_section",
  placementAverage: "placement_average",
  placementRank: "placement_rank",
  cafeteriaRole: "cafeteria_role",
  dormNumber: "dorm_number",
  dormType: "dorm_type",
  shiftSchedule: "shift_schedule",
  studentId: "student_id",
  isActive: "is_active",
  rights: "rights",
  registeredCourses: "registered_courses",
  dormBlock: "dorm_block",
  dormRoom: "dorm_room",
  bedNumber: "bed_number",
  passwordResetRequested: "password_reset_requested",
  resetRequestDate: "reset_request_date",
  resetRequestNotes: "reset_request_notes"
};

const validUserDbColumns = new Set([
  "id", "username", "password", "default_password", "name", "role", "gender", "photo", "created_at",
  "assigned_subject", "assigned_sections", "class_section", "batch", "nationality", "telephone", "email",
  "dob_gc", "dob_ec", "mother_name", "high_school", "guardian_name", "guardian_phone",
  "placed_semester", "placed_year", "placement_section", "placement_average", "placement_rank",
  "student_id", "address", "shift_schedule", "privileges", "cafeteria_role", "dorm_number", "location",
  "dorm_type", "bed_number", "has_pillow", "has_blanket", "is_active", "rights", "registered_courses",
  "academic_history", "dorm_block", "dorm_room", "password_reset_requested", "reset_request_date", "reset_request_notes"
]);

function convertUserToDb(user) {
  const dbUser = {};
  for (const [key, val] of Object.entries(user)) {
    const dbKey = userFieldMapping[key] || key;
    if (!validUserDbColumns.has(dbKey)) continue;

    if (dbKey === "dob_gc") {
      dbUser[dbKey] = val ? val : null;
    } else if (dbKey === "placed_semester" || dbKey === "placed_year" || dbKey === "placement_rank") {
      dbUser[dbKey] = (val !== null && val !== undefined && val !== "") ? parseInt(val) : null;
    } else if (dbKey === "placement_average") {
      dbUser[dbKey] = (val !== null && val !== undefined && val !== "") ? parseFloat(val) : null;
    } else {
      dbUser[dbKey] = val;
    }
  }
  return dbUser;
}

function convertUserFromDb(dbUser) {
  const user = {};
  const revMapping = Object.fromEntries(
    Object.entries(userFieldMapping).map(([k, v]) => [v, k])
  );
  for (const [key, val] of Object.entries(dbUser)) {
    const jsKey = revMapping[key] || key;
    user[jsKey] = val;
  }
  return user;
}

// --- Mappings & Converters for grades ---
function convertGradeToDb(grade) {
  const ass = grade.assessment_score ? parseFloat(grade.assessment_score) : 0;
  const exam = grade.exam_score ? parseFloat(grade.exam_score) : 0;
  return {
    student_id: grade.student_id,
    course_code: grade.course_id || grade.course_code,
    semester: parseInt(grade.semester),
    assessment_score: ass,
    exam_score: exam,
    breakdown: grade.breakdown || {},
    status: grade.status || "pending",
    teacher_id: grade.teacher_id || null,
    teacher_name: grade.teacher_name || null
  };
}

function convertGradeFromDb(dbGrade) {
  const ass = parseFloat(dbGrade.assessment_score) || 0;
  const exam = parseFloat(dbGrade.exam_score) || 0;
  return {
    student_id: dbGrade.student_id,
    course_id: dbGrade.course_code,
    course_code: dbGrade.course_code,
    semester: dbGrade.semester,
    assessment_score: ass,
    exam_score: exam,
    total: dbGrade.total !== undefined ? dbGrade.total : (ass + exam),
    breakdown: dbGrade.breakdown || {},
    status: dbGrade.status || "pending",
    teacher_id: dbGrade.teacher_id,
    teacher_name: dbGrade.teacher_name
  };
}

// --- Mappings & Converters for announcements ---
function convertAnnouncementToDb(ann) {
  return {
    id: ann.id,
    title: ann.title,
    content: ann.content,
    target: ann.target,
    date: ann.date,
    expiry_date: ann.expiryDate || ann.expiry_date
  };
}

function convertAnnouncementFromDb(dbAnn) {
  return {
    id: dbAnn.id,
    title: dbAnn.title,
    content: dbAnn.content,
    target: dbAnn.target,
    date: dbAnn.date,
    expiryDate: dbAnn.expiry_date || dbAnn.expiryDate
  };
}

export const defaultPortalSettings = {
  schoolName: "Higa Model Boarding School",
  copyright: "© 2026 Higa Model Boarding School. All Rights Reserved.",
  academicYear: "2018 E.C. / 2026 G.C.",
  year: "2026",
  logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120",
  higaCompoundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
  backgroundImage: "",
  churchLocation: "Higa Town, Kambaata Zone, Southern Nations, Ethiopia",
  contactEmail: "info@higaportal.edu.et | registrar@higaportal.edu.et",
  contactPhone: "+251-46-211-1234 / +251-911-99-88-77",
  googleMapEmbedUrl: "https://maps.google.com/maps?q=Higa+Town,+Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed",
  // 8 School Bank Accounts (Name, Account Number & Purpose)
  bank_1_name: "Commercial Bank of Ethiopia (CBE)",
  bank_1_account: "1000123456789",
  bank_1_purpose: "Tuition & Annual Boarding Fees / የትምህርት ክፍያ",
  bank_2_name: "Dashen Bank",
  bank_2_account: "5289123456001",
  bank_2_purpose: "School Registration & Deposit Fund / የምዝገባ ክፍያ",
  bank_3_name: "Awash Bank",
  bank_3_account: "01320987654300",
  bank_3_purpose: "Dormitory & Facilities Maintenance / የዶርሚተሪ ክፍያ",
  bank_4_name: "Bank of Abyssinia",
  bank_4_account: "8923104561",
  bank_4_purpose: "Student Cafe & Meal Program / የካፌ ክፍያ",
  bank_5_name: "CBE Birr",
  bank_5_account: "0911000001",
  bank_5_purpose: "Mobile Fee Payment / የሞባይል ክፍያ",
  bank_6_name: "Telebirr",
  bank_6_account: "0911000001",
  bank_6_purpose: "Telebirr Merchant Payment / ቴሌብር ክፍያ",
  bank_7_name: "Hibret Bank",
  bank_7_account: "182390124567",
  bank_7_purpose: "Library & Lab Material Fund / ቤተ-መጽሐፍት ክፍያ",
  bank_8_name: "Nib International Bank",
  bank_8_account: "70000123456",
  bank_8_purpose: "Sports & Extracurricular Activities / የስፖርት ክፍያ",
  // Official Social Media Links
  facebookUrl: "https://facebook.com",
  telegramUrl: "https://t.me",
  linkedinUrl: "https://linkedin.com",
  youtubeUrl: "https://youtube.com",
  instagramUrl: "https://instagram.com",
  whatsappUrl: "https://whatsapp.com",
  tiktokUrl: "https://tiktok.com",
  twitterUrl: "https://twitter.com"
};

// --- General API Helper ---
export const db = {
  getLocal(table) {
    const data = localStorage.getItem(DB_PREFIX + table);
    if (table === "settings") {
      return data ? JSON.parse(data) : {};
    }
    return data ? JSON.parse(data) : [];
  },

  setLocal(table, data) {
    localStorage.setItem(DB_PREFIX + table, JSON.stringify(data));
  },

  async get(table) {
    const localData = this.getLocal(table);
    
    if (table === "settings") {
      const fallbackSettings = { ...defaultPortalSettings, ...(localData || {}) };
      if (!supabase) return fallbackSettings;

      try {
        const { data, error } = await supabase.from("settings").select("*");
        if (error || !data || data.length === 0) {
          if (error) console.error("Error fetching settings from Supabase:", error);
          return fallbackSettings;
        }
        const settingsObj = { ...defaultPortalSettings };
        data.forEach(row => {
          if (row.key && row.value !== undefined && row.value !== null) {
            settingsObj[row.key] = row.value;
          }
        });
        this.setLocal("settings", settingsObj);
        return settingsObj;
      } catch (err) {
        console.error("Exception fetching settings from Supabase:", err);
        return fallbackSettings;
      }
    }
    
    if (!supabase) return localData;
    const dbTable = dbTables[table];
    if (!dbTable) return localData;
    
    try {
      const { data, error } = await supabase.from(dbTable).select("*");
      if (error || !data) {
        console.error("Fetch error for table", table, error);
        return localData;
      }
      
      let result = data;
      if (table === "users") result = data.map(convertUserFromDb);
      if (table === "grades") result = data.map(convertGradeFromDb);
      if (table === "announcements") result = data.map(convertAnnouncementFromDb);
      
      // If remote table has items, update local cache. If remote is empty but local has items, sync local items to remote.
      if (result && result.length > 0) {
        this.setLocal(table, result);
        return result;
      } else if (localData && localData.length > 0) {
        this.syncTableToSupabase(table, [], localData).catch(e => console.warn("Auto-seed to Supabase background error:", e));
        return localData;
      }

      this.seedLocalMockData();
      const freshLocal = this.getLocal(table);
      if (freshLocal && freshLocal.length > 0) {
        this.syncTableToSupabase(table, [], freshLocal).catch(e => console.warn("Auto-seed to Supabase background error:", e));
        return freshLocal;
      }

      this.setLocal(table, result);
      return result;
    } catch (err) {
      console.error("Supabase query exception for table", table, err);
      return localData;
    }
  },

  async set(table, data) {
    if (table === "settings") {
      await this.syncSettingsToSupabase(data);
    } else {
      const oldList = this.getLocal(table) || [];
      this.setLocal(table, data);
      if (!supabase) return;
      await this.syncTableToSupabase(table, oldList, data);
    }
  },

  async updateUser(user) {
    if (!user || !user.id) return null;
    const localUsers = this.getLocal("users") || [];
    const updatedUsers = localUsers.map(u => u.id === user.id ? { ...u, ...user } : u);
    if (!localUsers.some(u => u.id === user.id)) updatedUsers.push(user);
    this.setLocal("users", updatedUsers);

    if (!supabase) return user;

    const dbUser = convertUserToDb(user);
    const { data, error } = await supabase.from("users").update(dbUser).eq("id", user.id).select("*");
    if (error) {
      console.error("Supabase updateUser error:", error);
      throw new Error(`Database error updating user: ${error.message}`);
    }
    const resultUser = data && data[0] ? convertUserFromDb(data[0]) : user;
    return resultUser;
  },

  async init() {
    this.seedLocalMockData();
    if (!supabase) {
      console.warn("Supabase credentials missing. Portal is running on LocalStorage offline mode.");
      return;
    }

    try {
      console.log("Database connected successfully. Live mode.");
      await this.get("users");
      await this.get("settings");
    } catch (err) {
      console.error("Failed to connect to Supabase:", err);
    }
  },

  async syncSettingsToSupabase(settingsObj) {
    this.setLocal("settings", settingsObj);
    if (!supabase) return;

    const rows = Object.entries(settingsObj).map(([key, value]) => ({
      key,
      value: value === null || value === undefined ? "" : String(value)
    }));

    // 1. Try batch upsert
    const { error: upsertError } = await supabase.from("settings").upsert(rows, { onConflict: 'key' });
    if (!upsertError) return;

    console.warn("Batch upsert for settings encountered error, attempting key-by-key update/insert fallback:", upsertError);

    // 2. Key-by-key fallback
    let lastErr = null;
    for (const row of rows) {
      const { error: updateErr } = await supabase
        .from("settings")
        .update({ value: row.value })
        .eq("key", row.key);

      if (updateErr) {
        const { error: insertErr } = await supabase
          .from("settings")
          .insert(row);
        if (insertErr) lastErr = insertErr;
      }
    }

    // 3. If RLS policy is blocking writes on Supabase, provide clear error message
    if (lastErr || upsertError) {
      const errDetail = (lastErr && lastErr.message) || upsertError.message || "";
      if (errDetail.toLowerCase().includes("row-level security") || (upsertError.code === "42501")) {
        throw new Error(
          "Supabase Row-Level Security (RLS) is blocking writes on table 'settings'.\n\n" +
          "Please execute the following SQL command in your Supabase SQL Editor:\n" +
          "ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;\n" +
          "CREATE POLICY \"Allow all for settings\" ON public.settings FOR ALL USING (true) WITH CHECK (true);\n" +
          "GRANT ALL ON public.settings TO anon, authenticated, service_role;"
        );
      }
      throw new Error(errDetail || "Database write failed for settings");
    }
  },

  subscribeSettings(callback) {
    return this.subscribeTable("settings", callback);
  },

  subscribeTable(table, callback) {
    if (!supabase) return;
    const dbTable = dbTables[table] || table;
    return supabase
      .channel(`public:${dbTable}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: dbTable }, payload => {
        if (callback) callback(payload);
      })
      .subscribe();
  },

  // Sync general array tables using differential logic
  async syncTableToSupabase(table, oldList, newList) {
    const pk = primaryKeys[table];
    const dbTable = dbTables[table];
    if (!pk || !dbTable) return;

    // Helper to find key matches
    const matchesPk = (item, keyVal) => {
      if (pk === "unique_composite") {
        return item.student_id === keyVal.student_id && 
               (item.course_id === keyVal.course_code || item.course_code === keyVal.course_code) && 
               parseInt(item.semester) === parseInt(keyVal.semester);
      }
      const itemKey = item[pk] || item.id || item.course_code || item.code;
      return itemKey === keyVal;
    };

    const getPkValue = (item) => {
      if (pk === "unique_composite") {
        return { student_id: item.student_id, course_code: item.course_id || item.course_code, semester: parseInt(item.semester) };
      }
      return item[pk] || item.id || item.course_code || item.code;
    };

    // 1. Identify Deleted Rows
    const deleted = oldList.filter(oldItem => {
      const oldPkVal = getPkValue(oldItem);
      if (pk === "unique_composite") {
        return !newList.some(newItem => matchesPk(newItem, oldPkVal));
      }
      return !newList.some(newItem => matchesPk(newItem, oldPkVal));
    });

    // 2. Identify Added Rows
    const added = newList.filter(newItem => {
      const newPkVal = getPkValue(newItem);
      if (pk === "unique_composite") {
        return !oldList.some(oldItem => matchesPk(oldItem, newPkVal));
      }
      return !oldList.some(oldItem => matchesPk(oldItem, newPkVal));
    });

    // 3. Identify Updated Rows
    const updated = newList.filter(newItem => {
      const newPkVal = getPkValue(newItem);
      const matchedOld = oldList.find(oldItem => {
        if (pk === "unique_composite") {
          return matchesPk(oldItem, newPkVal);
        }
        return oldItem[pk] === newPkVal;
      });

      if (!matchedOld) return false;
      // Deep equal string check to see if properties changed
      return JSON.stringify(matchedOld) !== JSON.stringify(newItem);
    });

    // Executed Deleted queries
    for (const delItem of deleted) {
      if (pk === "unique_composite") {
        await supabase.from(dbTable).delete().match({
          student_id: delItem.student_id,
          course_code: delItem.course_id || delItem.course_code,
          semester: parseInt(delItem.semester)
        });
      } else {
        await supabase.from(dbTable).delete().eq(pk, delItem[pk]);
      }
    }

    // Execute Added queries
    for (const addItem of added) {
      let dbData = addItem;
      if (table === "users") dbData = convertUserToDb(addItem);
      if (table === "grades") dbData = convertGradeToDb(addItem);
      if (table === "announcements") dbData = convertAnnouncementToDb(addItem);
      await supabase.from(dbTable).insert(dbData);
    }

    // Execute Updated queries
    for (const updItem of updated) {
      let dbData = updItem;
      if (table === "users") dbData = convertUserToDb(updItem);
      if (table === "grades") dbData = convertGradeToDb(updItem);
      if (table === "announcements") dbData = convertAnnouncementToDb(updItem);

      if (pk === "unique_composite") {
        await supabase.from(dbTable).update(dbData).match({
          student_id: updItem.student_id,
          course_code: updItem.course_id || updItem.course_code,
          semester: parseInt(updItem.semester)
        });
      } else {
        await supabase.from(dbTable).update(dbData).eq(pk, updItem[pk]);
      }
    }
  },

  // Fallback Local Storage Seed
  seedLocalMockData() {
    if (!localStorage.getItem(DB_PREFIX + "users")) {
      const defaultUsers = [
        {
          id: "HIGA/MRA/1234/2018",
          username: "HIGA/MRA/1234/2018",
          password: "1234",
          defaultPassword: "1234",
          name: "Main Registrar Admin",
          role: "MainRegistrar",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2018-09-10").toISOString(),
          privileges: "full",
          isActive: true,
          rights: ["users", "courses", "settings", "announcements"]
        },
        {
          id: "HIGA/ARA/5678/2020",
          username: "HIGA/ARA/5678/2020",
          password: "5678",
          defaultPassword: "5678",
          name: "Academic Registrar Admin",
          role: "AcademicRegistrar",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2020-10-15").toISOString(),
          privileges: "partial",
          isActive: true,
          rights: ["users", "courses"]
        },
        {
          id: "HIGA/Principal/1001/2019",
          username: "HIGA/Principal/1001/2019",
          password: "password1001",
          defaultPassword: "password1001",
          name: "Dr. Abraham Kebede",
          role: "Principal",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2019-01-15").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/ViceP/1002/2021",
          username: "HIGA/ViceP/1002/2021",
          password: "password1002",
          defaultPassword: "password1002",
          name: "W/ro Selamawit Alene",
          role: "VicePrincipal",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2021-03-22").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Manager/2001/2017",
          username: "HIGA/Manager/2001/2017",
          password: "password2001",
          defaultPassword: "password2001",
          name: "Ato Belayneh Gidey",
          role: "Manager",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2017-05-18").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/VM/2002/2022",
          username: "HIGA/VM/2002/2022",
          password: "password2002",
          defaultPassword: "password2002",
          name: "Ato Yonas Assefa",
          role: "ViceManager",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2022-02-10").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Teacher/3001/2020",
          username: "HIGA/Teacher/3001/2020",
          password: "password3001",
          defaultPassword: "password3001",
          name: "Ato Kassa Tekle",
          role: "Teacher",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2020-09-01").toISOString(),
          assignedSubject: "Mathematics",
          assignedSections: ["Grade 9-A", "Grade 9-B"],
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Student/4001/2024",
          username: "HIGA/Student/4001/2024",
          password: "password4001",
          defaultPassword: "password4001",
          name: "Biruk Hailu",
          role: "Student",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2024-09-05").toISOString(),
          classSection: "Grade 9-A",
          batch: "2024",
          nationality: "Ethiopian",
          telephone: "+251911223344",
          email: "biruk.hailu@higa.edu.et",
          dobGC: "2009-05-12",
          dobEC: "2001-09-02",
          motherName: "Tigist Demeke",
          highSchool: "Higa Junior School",
          guardianName: "Ato Hailu Assefa",
          guardianPhone: "+251911998877",
          placedSemester: "1",
          placedYear: "2024",
          placementSection: "Grade 9-A",
          placementAverage: "88.5",
          placementRank: 3,
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Guardian/5001/2023",
          username: "HIGA/Guardian/5001/2023",
          password: "password5001",
          defaultPassword: "password5001",
          name: "Ato Hailu Assefa",
          role: "Guardian",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2023-09-01").toISOString(),
          address: "Hawassa, Ethiopia",
          contactPhone: "+251911998877",
          shiftSchedule: "Night Shift",
          studentId: "HIGA/Student/4001/2024",
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Librarian/6001/2021",
          username: "HIGA/Librarian/6001/2021",
          password: "password6001",
          defaultPassword: "password6001",
          name: "Marta Negash",
          role: "Librarian",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2021-11-10").toISOString(),
          shiftSchedule: "Day Shift (8:00 AM - 5:00 PM)",
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Dormitory/7001/2022",
          username: "HIGA/Dormitory/7001/2022",
          password: "password7001",
          defaultPassword: "password7001",
          name: "Tewodros Kassaye",
          role: "Dormitory",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2022-01-20").toISOString(),
          dormNumber: "Block A - Room 102",
          location: "Male Campus North",
          dormType: "male",
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Book Store/8001/2020",
          username: "HIGA/Book Store/8001/2020",
          password: "password8001",
          defaultPassword: "password8001",
          name: "Daniel Yohannes",
          role: "BookStore",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2020-04-12").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/IT/9001/2022",
          username: "HIGA/IT/9001/2022",
          password: "password9001",
          defaultPassword: "password9001",
          name: "Estifanos Alula",
          role: "IT_Technician",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2022-09-15").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/ChemLb/9002/2023",
          username: "HIGA/ChemLb/9002/2023",
          password: "password9002",
          defaultPassword: "password9002",
          name: "Dr. Meron Abebe",
          role: "ChemistryLab",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2023-02-18").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Cafeteria/9101/2021",
          username: "HIGA/Cafeteria/9101/2021",
          password: "password9101",
          defaultPassword: "password9101",
          name: "Chala Tolosa",
          role: "Cafeteria",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2021-08-11").toISOString(),
          cafeteriaRole: "cafeteria manager",
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/PhysLb/9003/2023",
          username: "HIGA/PhysLb/9003/2023",
          password: "password9003",
          defaultPassword: "password9003",
          name: "Abebe Bekele",
          role: "PhysicsLab",
          gender: "Male",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2023-05-10").toISOString(),
          isActive: true,
          rights: []
        },
        {
          id: "HIGA/Draw/9004/2023",
          username: "HIGA/Draw/9004/2023",
          password: "password9004",
          defaultPassword: "password9004",
          name: "Selamawit Kebede",
          role: "Drawing",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
        },
        {
          id: "HIGA/SchStore/9005/2024",
          username: "HIGA/SchStore/9005/2024",
          password: "password9005",
          defaultPassword: "password9005",
          name: "Aster Bekele",
          role: "SchoolStore",
          gender: "Female",
          photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
          created_at: new Date("2024-01-10").toISOString(),
          isActive: true,
          rights: []
        }
      ];
      localStorage.setItem(DB_PREFIX + "users", JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem(DB_PREFIX + "courses")) {
      const defaultCourses = [
        { code: "MATH-09", name: "Mathematics Grade 9", grade: 9, credits: 4 },
        { code: "PHYS-09", name: "Physics Grade 9", grade: 9, credits: 3 },
        { code: "CHEM-09", name: "Chemistry Grade 9", grade: 9, credits: 3 },
        { code: "BIOL-09", name: "Biology Grade 9", grade: 9, credits: 3 },
        { code: "ENGL-09", name: "English Grade 9", grade: 9, credits: 4 },
        { code: "AMHA-09", name: "Amharic Grade 9", grade: 9, credits: 2 },
        { code: "IT-09", name: "Information Technology Grade 9", grade: 9, credits: 2 },
        { code: "DRAW-09", name: "Technical Drawing Grade 9", grade: 9, credits: 2 }
      ];
      localStorage.setItem(DB_PREFIX + "courses", JSON.stringify(defaultCourses));
    }

    if (!localStorage.getItem(DB_PREFIX + "grades")) {
      const defaultGrades = [
        { student_id: "HIGA/Student/4001/2024", course_id: "MATH-09", semester: 1, assessment_score: 26, exam_score: 62, total: 88, status: "approved" },
        { student_id: "HIGA/Student/4001/2024", course_id: "PHYS-09", semester: 1, assessment_score: 28, exam_score: 58, total: 86, status: "approved" },
        { student_id: "HIGA/Student/4001/2024", course_id: "CHEM-09", semester: 1, assessment_score: 25, exam_score: 60, total: 85, status: "approved" },
        { student_id: "HIGA/Student/4001/2024", course_id: "BIOL-09", semester: 1, assessment_score: 29, exam_score: 61, total: 90, status: "approved" }
      ];
      localStorage.setItem(DB_PREFIX + "grades", JSON.stringify(defaultGrades));
    }

    if (!localStorage.getItem(DB_PREFIX + "properties")) {
      const defaultProperties = [
        { id: "PROP-001", name: "Student Chairs", type: "wooden", category: "chairs", quantity: 320, working: 300, to_maintain: 20, maintained: 0 },
        { id: "PROP-002", name: "Student Tables", type: "plastic", category: "tables", quantity: 160, working: 155, to_maintain: 5, maintained: 0 },
        { id: "PROP-003", name: "Student Desks", type: "wooden", category: "desks", quantity: 150, working: 140, to_maintain: 10, maintained: 0 },
        { id: "PROP-004", name: "Dormitory Beds", type: "metal", category: "beds", quantity: 240, working: 236, to_maintain: 4, maintained: 0 },
        { id: "PROP-005", name: "Foam Mattresses", type: "foam", category: "foams", quantity: 240, working: 238, to_maintain: 2, maintained: 0 },
        { id: "PROP-006", name: "Blankets", type: "cotton", category: "blankets", quantity: 480, working: 475, to_maintain: 5, maintained: 0 },
        { id: "PROP-007", name: "IT Lab Computer Set", name_brand: "Dell OptiPlex", category: "it_equipment", computer_no: 50, keyboards: 50, mouse: 50, cases: 50, working: 48, to_maintain: 2, maintained: 0 }
      ];
      localStorage.setItem(DB_PREFIX + "properties", JSON.stringify(defaultProperties));
    }

    if (!localStorage.getItem(DB_PREFIX + "books")) {
      const defaultBooks = [
        { id: "BK-001", title: "General Mathematics Grade 9", author: "Dr. Tesfaye B.", publisher: "MoE Ethiopia", year: 2021, category: "mathematics", type: "textbook", grade: 9, copies: 120, donor: "MoE" },
        { id: "BK-002", title: "Extreme Physics Grade 9-10", author: "Ato Negash G.", publisher: "Aster Nega Pub", year: 2019, category: "physics", type: "guide book", grade: 9, copies: 60, donor: "Rotary Club" },
        { id: "BK-003", title: "Comprehensive Chemistry", author: "Marta H.", publisher: "Farren Books", year: 2020, category: "chemistry", type: "exam book", grade: 10, copies: 45, donor: "Alumni Donation" },
        { id: "BK-004", title: "Fikr Eske Mekabir", author: "Hadis Alemayehu", publisher: "Kuraz Pub", year: 1968, category: "fiction", type: "textbook", grade: 9, copies: 30, donor: "Personal Donation" }
      ];
      localStorage.setItem(DB_PREFIX + "books", JSON.stringify(defaultBooks));
    }

    if (!localStorage.getItem(DB_PREFIX + "chemicals")) {
      const defaultChemicals = [
        { id: "CHEM-LAB-001", name: "Hydrochloric Acid (HCl)", dose: "500ml", category: "Acid", type: "Liquid", stock: 12, required: 5 },
        { id: "CHEM-LAB-002", name: "Sodium Hydroxide (NaOH)", dose: "1kg", category: "Base", type: "Powder", stock: 8, required: 2 },
        { id: "CHEM-LAB-003", name: "Copper Sulfate (CuSO4)", dose: "500g", category: "Salt", type: "Crystals", stock: 4, required: 4 },
        { id: "PHYS-LAB-101", name: "Double Convex Lens", dose: "50mm dia", category: "Physics Optics", type: "Optics", stock: 15, required: 0 },
        { id: "PHYS-LAB-102", name: "Digital Multimeter", dose: "1 unit", category: "Physics Circuits", type: "Electronics", stock: 10, required: 0 },
        { id: "DRAW-LAB-101", name: "Drafting Board A2", dose: "Wood/Metal", category: "Drawing Boards", type: "Furniture", stock: 25, required: 0 },
        { id: "DRAW-LAB-102", name: "Precision Compass Set", dose: "Metal Case", category: "Drawing Instruments", type: "Tools", stock: 20, required: 0 }
      ];
      localStorage.setItem(DB_PREFIX + "chemicals", JSON.stringify(defaultChemicals));
    }

    if (!localStorage.getItem(DB_PREFIX + "settings")) {
      const defaultSettings = {
        copyright: "© 2026 Higa Model Boarding School. All Rights Reserved.",
        year: 2026,
        academicYear: "2018 E.C. / 2026 G.C.",
        schoolName: "Higa Model Boarding School",
        logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120",
        higaCompoundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
        backgroundImage: "",
        churchLocation: "Higa Town, Kambaata Zone, Southern Nations, Ethiopia",
        contactEmail: "info@higaportal.edu.et | registrar@higaportal.edu.et",
        contactPhone: "+251-46-211-1234 / +251-911-99-88-77",
        googleMapEmbedUrl: "https://maps.google.com/maps?q=Higa+Town,+Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed"
      };
      localStorage.setItem(DB_PREFIX + "settings", JSON.stringify(defaultSettings));
    }

    if (!localStorage.getItem(DB_PREFIX + "meal_menu")) {
      const defaultMenu = [
        { day: "Monday", breakfast: "Furr / Bread & Tea", lunch: "Shira wot with Injera", dinner: "Kolo / Rice with Veggies" },
        { day: "Tuesday", breakfast: "Porridge (Genfo)", lunch: "Misir wot with Injera", dinner: "Macaroni with tomato sauce" },
        { day: "Wednesday", breakfast: "Bread & Jam with Tea", lunch: "Gomen & Kik wot", dinner: "Potato soup & Bread" },
        { day: "Thursday", breakfast: "Kinche", lunch: "Soya chunks wot", dinner: "Rice with Lentils" },
        { day: "Friday", breakfast: "Firfir with Bread", lunch: "Fasting buffet wot", dinner: "Pasta with sauce" },
        { day: "Saturday", breakfast: "Porridge", lunch: "Egg firfir (Non-fasting) / Shiro", dinner: "Soup & Bread" },
        { day: "Sunday", breakfast: "Special Bread & Tea", lunch: "Meat wot (Key wot)", dinner: "Veggies fried rice" }
      ];
      localStorage.setItem(DB_PREFIX + "meal_menu", JSON.stringify(defaultMenu));
    }

    if (!localStorage.getItem(DB_PREFIX + "calendar")) {
      const defaultCalendar = [
        { id: "cal-1", date: "2026-09-10", event: "Registration for Semester 1 Begins", type: "academic" },
        { id: "cal-2", date: "2026-09-15", event: "First Day of Classes", type: "academic" },
        { id: "cal-3", date: "2026-11-20", event: "Midterm Exams Week", type: "exam" },
        { id: "cal-4", date: "2026-12-25", event: "Christmas Break (Boarding Students Stay/Leave)", type: "holiday" },
        { id: "cal-5", date: "2027-01-20", event: "Semester 1 Final Exams", type: "exam" }
      ];
      localStorage.setItem(DB_PREFIX + "calendar", JSON.stringify(defaultCalendar));
    }

    if (!localStorage.getItem(DB_PREFIX + "announcements")) {
      const defaultAnnouncements = [
        { id: "ann-1", title: "Welcome to Higa Model Portal", content: "We are excited to launch our new fully digitised portal system for teachers, students and staff. Registration is now online.", date: "2026-07-15", target: "all", expiryDate: "2026-08-15" },
        { id: "ann-2", title: "Academic Council Meeting", content: "All teachers and academic coordinators must attend the Semester 1 syllabus review meeting this Friday at 2:00 PM.", date: "2026-07-16", target: "teachers", expiryDate: "2027-08-16" },
        { id: "ann-3", title: "Extracurricular Sports Registration", content: "Boarding students can register for basketball, football, and table tennis tournaments starting Monday.", date: "2026-07-17", target: "students", expiryDate: "2027-08-17" }
      ];
      localStorage.setItem(DB_PREFIX + "announcements", JSON.stringify(defaultAnnouncements));
    }

    if (!localStorage.getItem(DB_PREFIX + "classes")) {
      const defaultClasses = [
        { id: 1, name: "Grade 9-A", grade: 9 },
        { id: 2, name: "Grade 9-B", grade: 9 },
        { id: 3, name: "Grade 10-A", grade: 10 },
        { id: 4, name: "Grade 10-B", grade: 10 },
        { id: 5, name: "Grade 11-A", grade: 11 },
        { id: 6, name: "Grade 11-B", grade: 11 },
        { id: 7, name: "Grade 12-A", grade: 12 },
        { id: 8, name: "Grade 12-B", grade: 12 }
      ];
      localStorage.setItem(DB_PREFIX + "classes", JSON.stringify(defaultClasses));
    }

    if (!localStorage.getItem(DB_PREFIX + "class_courses")) {
      const defaultClassCourses = [
        { id: 1, class_name: "Grade 9-A", course_code: "MATH-09", semester: 1 },
        { id: 2, class_name: "Grade 9-A", course_code: "PHYS-09", semester: 1 },
        { id: 3, class_name: "Grade 9-A", course_code: "CHEM-09", semester: 1 },
        { id: 4, class_name: "Grade 9-A", course_code: "BIOL-09", semester: 1 },
        { id: 5, class_name: "Grade 9-A", course_code: "ENGL-09", semester: 2 },
        { id: 6, class_name: "Grade 9-A", course_code: "AMHA-09", semester: 2 },
        { id: 7, class_name: "Grade 9-A", course_code: "IT-09", semester: 2 },
        { id: 8, class_name: "Grade 9-A", course_code: "DRAW-09", semester: 2 }
      ];
      localStorage.setItem(DB_PREFIX + "class_courses", JSON.stringify(defaultClassCourses));
    }

    if (!localStorage.getItem(DB_PREFIX + "dorm_assets")) {
      const defaultDormAssets = [
        { id: "ast-1", category: "Beds (Metal Frames)", totalCount: 50, goodCondition: 48, requiresMaintenance: 2, lastUpdated: new Date().toISOString() },
        { id: "ast-2", category: "Foam Mattresses", totalCount: 50, goodCondition: 50, requiresMaintenance: 0, lastUpdated: new Date().toISOString() },
        { id: "ast-3", category: "Cotton Blankets", totalCount: 100, goodCondition: 98, requiresMaintenance: 2, lastUpdated: new Date().toISOString() },
        { id: "ast-4", category: "Pillows", totalCount: 50, goodCondition: 49, requiresMaintenance: 1, lastUpdated: new Date().toISOString() }
      ];
      localStorage.setItem(DB_PREFIX + "dorm_assets", JSON.stringify(defaultDormAssets));
    }

    if (!localStorage.getItem(DB_PREFIX + "cafe_shifts")) {
      localStorage.setItem(DB_PREFIX + "cafe_shifts", JSON.stringify([]));
    }

    if (!localStorage.getItem(DB_PREFIX + "cafe_attendances")) {
      localStorage.setItem(DB_PREFIX + "cafe_attendances", JSON.stringify([]));
    }

    if (!localStorage.getItem(DB_PREFIX + "gallery_moments")) {
      const defaultMoments = [
        {
          id: "mom-1",
          title: "Class of 2026 Inauguration",
          description: "Celebrating the inauguration of the newest batch of students at Higa Model Boarding School.",
          category: "Event",
          batch: "2026",
          class_section: "",
          media_urls: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"],
          author_id: "HIGA/Registrar/1001/2010",
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(DB_PREFIX + "gallery_moments", JSON.stringify(defaultMoments));
    }

    if (!localStorage.getItem(DB_PREFIX + "alumni_records")) {
      const defaultAlumni = [
        {
          id: "alum-1",
          student_id: "HIGA/Alum/001/2023",
          student_name: "Abebe Kebede",
          entrance_score: 545,
          university_joined: "Addis Ababa University",
          department: "Software Engineering",
          graduation_year: 2023,
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(DB_PREFIX + "alumni_records", JSON.stringify(defaultAlumni));
    }
  }
};
