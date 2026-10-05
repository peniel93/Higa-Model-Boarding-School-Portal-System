// js/app.js
import { db } from './db.js';
import { auth } from './auth.js';

// Dictionary mapping for localization (English <-> Amharic)
export const dictionary = {
  en: {
    title: "Higa Model Boarding School Portal System",
    school_name: "Higa Model Boarding School",
    home: "Home",
    announcements: "Announcements",
    news_vacancies: "News & Vacancies",
    admission: "Admission",
    programs: "Programs",
    notices: "Notices",
    events_ceremonies: "Events & Ceremonies",
    alumni_services: "Alumni Services",
    about: "About Us",
    contact: "Contact Us",
    portal_login: "Portal Login",
    login_title: "Sign in to Portal",
    username_placeholder: "Enter ID (e.g. HIGA/Student/4001/2024)",
    password_placeholder: "Enter Password",
    sign_in: "Sign In",
    forgot_password: "Forgot Password?",
    reset_physically: "Please visit the Registrar's office physically to reset your default password.",
    footer_desc: "Nurturing the future leaders of tomorrow through holistic boarding school education.",
    quick_links: "Quick Links",
    copyright: "© 2026 Higa Model Boarding School. All Rights Reserved.",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_message: "Message",
    contact_submit: "Send Message",
    contact_success: "Thank you! Your message has been sent successfully."
  },
  am: {
    title: "ሂጋ ሞዴል ቦርዲንግ ትምህርት ቤት ፖርታል ሲስተም",
    school_name: "ሂጋ ሞዴል ቦርዲንግ ትምህርት ቤት",
    home: "መነሻ",
    announcements: "ማስታወቂያዎች",
    news_vacancies: "ዜና እና ክፍት ቦታዎች",
    admission: "አድሚሽን",
    programs: "ፕሮግራሞች",
    notices: "ማሳሰቢያዎች",
    events_ceremonies: "ክስተቶች እና ስነ-ስርዓቶች",
    alumni_services: "የቀድሞ ተማሪዎች",
    about: "ስለ እኛ",
    contact: "ያግኙን",
    portal_login: "የፖርታል መግቢያ",
    login_title: "ወደ ፖርታል ይግቡ",
    username_placeholder: "መለያ ቁጥር ያስገቡ (ምሳሌ፡ HIGA/Student/4001/2024)",
    password_placeholder: "የይለፍ ቃል ያስገቡ",
    sign_in: "ግባ",
    forgot_password: "የይለፍ ቃል ረሱ?",
    reset_physically: "እባክዎን የይለፍ ቃልዎን ለመቀየር በአካል ወደ ሬጅስትራር ቢሮ ይምጡ።",
    footer_desc: "ሁለንተናዊ የቦርዲንግ ትምህርት በመስጠት የነገ መሪዎችን እናፈራለን።",
    quick_links: "ፈጣን ሊንኮች",
    copyright: "© 2026 ሂጋ ሞዴል ቦርዲንግ ትምህርት ቤት። መብቱ በህግ የተጠበቀ ነው።",
    dark_mode: "ጨለማ ሁነታ",
    light_mode: "ብርሃን ሁነታ",
    contact_name: "ሙሉ ስም",
    contact_email: "ኢሜይል አድራሻ",
    contact_message: "መልዕክት",
    contact_submit: "መልዕክት ላክ",
    contact_success: "እናመሰግናለን! መልዕክትዎ በተሳካ ሁኔታ ተልኳል።"
  }
};

class App {
  constructor() {
    this.currentLang = (typeof localStorage !== "undefined" ? localStorage.getItem("higa_lang") : null) || "en";
    this.theme = (typeof localStorage !== "undefined" ? localStorage.getItem("higa_theme") : null) || "dark";
    this.currentSlide = 0;
    this.slideInterval = null;
  }

  async init() {
    // 1. Initialise DB and default credentials
    await db.init();

    // 2. Set theme and language UI states
    this.setTheme(this.theme);
    this.translatePage(this.currentLang);
    this.applyDynamicLogo();

    // 3. Bind event listeners
    this.bindEvents();

    // 4. Initialize Landing Page Slider
    this.initSlider();

    // 5. Load dynamic announcements on website
    this.loadPublicAnnouncements();
    this.loadPublicMoments();
    this.loadPublicAlumni();
    this.loadPublicPrograms();
    this.loadPublicVacancies();

    // 6. Restore active user session if exists
    auth.checkSession();
  }

  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", async () => {
        const newTheme = this.theme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
      });
    }

    // Dashboard Theme toggle
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("#dashboard-theme-toggle");
      if (btn) {
        const newTheme = this.theme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
      }
    });

    // Language toggle
    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", async () => {
        const newLang = this.currentLang === "en" ? "am" : "en";
        this.translatePage(newLang);
      });
    }

    // Mobile Hamburger Toggle
    const hamburger = document.getElementById("hamburger");
    const drawer = document.getElementById("drawer");
    if (hamburger && drawer) {
      hamburger.addEventListener("click", async (e) => {
        e.stopPropagation();
        drawer.classList.toggle("open");
        hamburger.classList.toggle("active");
      });
    }

    // Drawer close on link click
    // Drawer close on click outside
    document.addEventListener("click", async (e) => {
      // Close mobile drawer when clicking anywhere outside the drawer
      if (drawer && drawer.classList.contains("open")) {
        if (!e.target.closest('.drawer') && !e.target.closest('#hamburger')) {
          drawer.classList.remove("open");
          hamburger.classList.remove("active");
        }
      }
      
      // Close mobile drawer when clicking a link inside it
      if (e.target.closest('.drawer-links a')) {
        drawer.classList.remove("open");
        hamburger.classList.remove("active");
      }
      
      // Dashboard hamburger menu
      if (e.target.closest('#dashboard-hamburger') || e.target.closest('.dashboard-hamburger')) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const overlay = document.getElementById('dashboard-sidebar-overlay');
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
      }
      
      // Dashboard sidebar overlay click
      if (e.target.closest('#dashboard-sidebar-overlay')) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const overlay = document.getElementById('dashboard-sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      }

      // Sidebar nav link click - close sidebar on mobile
      if (e.target.closest('.sidebar-nav a') && window.innerWidth <= 992) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const overlay = document.getElementById('dashboard-sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      }

      // Close mobile dashboard sidebar when clicking anywhere outside
      const dashSidebar = document.querySelector('.dashboard-sidebar');
      if (dashSidebar && dashSidebar.classList.contains('active')) {
        if (!e.target.closest('.dashboard-sidebar') && !e.target.closest('#dashboard-hamburger') && !e.target.closest('.dashboard-hamburger')) {
          dashSidebar.classList.remove('active');
          const overlay = document.getElementById('dashboard-sidebar-overlay');
          if (overlay) overlay.classList.remove('active');
        }
      }
    });

    // Dynamic window resize handler for end-to-end responsive menus
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        // Reset home page mobile drawer
        const drawer = document.getElementById("drawer");
        const hamburger = document.getElementById("hamburger");
        if (drawer) drawer.classList.remove("open");
        if (hamburger) hamburger.classList.remove("active");

        // Reset mobile dashboard sidebar & overlay
        const dashSidebar = document.querySelector(".dashboard-sidebar");
        const dashOverlay = document.getElementById("dashboard-sidebar-overlay");
        if (dashSidebar) dashSidebar.classList.remove("active");
        if (dashOverlay) dashOverlay.classList.remove("active");
      }
    });

    // Main Contact Form Submission Handler
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const successMsg = document.getElementById("contact-success");
        if (successMsg) {
          successMsg.style.display = "block";
          successMsg.innerText = dictionary[this.currentLang].contact_success;
          contactForm.reset();
          setTimeout(() => {
            successMsg.style.display = "none";
          }, 5000);
        }
      });
    }

    // Centralized event-delegated change listener for file upload and compression
    document.addEventListener("change", async (e) => {
      if (e.target) {
        if (e.target.id === "moment-media-file" || e.target.id === "alumni-media-file") {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          
          const isAlumni = e.target.id === "alumni-media-file";
          const statusText = document.getElementById(isAlumni ? "alumni-media-status" : "moment-media-status");
          if (statusText) statusText.innerText = "Processing " + files.length + " file(s)...";
          
          const targetInput = document.getElementById(isAlumni ? "alumni-media" : "moment-media");
          let currentVal = targetInput.value.trim();
          if (currentVal && !currentVal.endsWith("\n")) currentVal += "\n";
          
          const MAX_PHOTO_SIZE = 20 * 1024 * 1024; // 20 MB
          const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1 GB
          
          let processed = 0;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.type.startsWith('image/') && file.size > MAX_PHOTO_SIZE) {
              const msg = `File "${file.name}" is too large (${(file.size / (1024*1024)).toFixed(1)}MB). Max photo size is 20MB.`;
              if (statusText) statusText.innerText = msg;
              alert(msg);
              e.target.value = "";
              return;
            }

            if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
              const msg = `File "${file.name}" is too large (${(file.size / (1024*1024*1024)).toFixed(2)}GB). Max video size is 1GB.`;
              if (statusText) statusText.innerText = msg;
              alert(msg);
              e.target.value = "";
              return;
            }
            
            const handleResult = (resultData) => {
              currentVal += resultData + "\n";
              processed++;
              if (processed === files.length) {
                targetInput.value = currentVal;
                if (statusText) statusText.innerText = files.length + " file(s) attached successfully.";
                e.target.value = "";
              }
            };

            if (file.type.startsWith('image/')) {
              window.compressImage(file, 800, handleResult);
            } else {
              const reader = new FileReader();
              reader.onload = (evt) => handleResult(evt.target.result);
              reader.readAsDataURL(file);
            }
          }
        }
        else if (e.target.id === "user-photo-file" || e.target.id === "prof-photo-file" || e.target.id === "basic-photo-file" || e.target.id === "staff-photo-file" || e.target.id === "tech-photo-file" || e.target.id === "settings-logo-file") {
          const file = e.target.files[0];
          if (file) {
            compressImage(file, 200, (compressedBase64) => {
              let inputId = "";
              let previewId = "";
              if (e.target.id === "user-photo-file") inputId = "user-photo";
              else if (e.target.id === "prof-photo-file") {
                inputId = "prof-photo";
                previewId = "prof-img-preview";
              }
              else if (e.target.id === "basic-photo-file") {
                inputId = "basic-photo";
                previewId = "basic-img-preview";
              }
              else if (e.target.id === "staff-photo-file") inputId = "staff-photo";
              else if (e.target.id === "tech-photo-file") inputId = "tech-photo";
              else if (e.target.id === "settings-logo-file") {
                inputId = "settings-logo";
                previewId = "settings-logo-preview";
              }

              const targetInput = document.getElementById(inputId);
              if (targetInput) {
                targetInput.value = compressedBase64;
                targetInput.dispatchEvent(new Event("input"));
              }
              const targetPreview = document.getElementById(previewId);
              if (targetPreview) {
                targetPreview.src = compressedBase64;
              }
            });
          }
        }
      }
    });

  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("higa_theme", theme);
    const themeIcon = document.getElementById("theme-icon");
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
    const dashThemeIcon = document.getElementById("dashboard-theme-icon");
    if (dashThemeIcon) {
      dashThemeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  async translatePage(lang) {
    this.currentLang = lang;
    localStorage.setItem("higa_lang", lang);

    // Update language toggle text
    const langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
      langToggle.innerText = lang === "en" ? "አማርኛ" : "English";
    }

    // Update copyright text in settings
    const settings = await db.get("settings");
    const copyrightText = lang === "en" ? settings.copyright : "© 2026 ሂጋ ሞዴል ቦርዲንግ ትምህርት ቤት። መብቱ በህግ የተጠበቀ ነው።";
    const copyrightEl = document.getElementById("copyright-text");
    if (copyrightEl) copyrightEl.innerText = copyrightText;

    // Apply translations using data attributes
    document.querySelectorAll("[data-translate]").forEach(element => {
      const key = element.getAttribute("data-translate");
      if (dictionary[lang][key]) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.setAttribute("placeholder", dictionary[lang][key]);
        } else {
          element.innerText = dictionary[lang][key];
        }
      }
    });
  }

  initSlider() {
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.getElementById("slider-dots");
    if (!slides.length || !dotsContainer) return;

    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = `dot ${idx === 0 ? "active" : ""}`;
      dot.addEventListener("click", async () => this.goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    this.startSliderTimer();
  }

  goToSlide(idx) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    if (!slides[idx]) return;

    slides[this.currentSlide].classList.remove("active");
    dots[this.currentSlide].classList.remove("active");

    this.currentSlide = idx;

    slides[this.currentSlide].classList.add("active");
    dots[this.currentSlide].classList.add("active");

    this.startSliderTimer();
  }

  startSliderTimer() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.slideInterval = setInterval(() => {
      const slides = document.querySelectorAll(".slide");
      if (!slides.length) return;
      const nextIdx = (this.currentSlide + 1) % slides.length;
      this.goToSlide(nextIdx);
    }, 6000);
  }

  async loadPublicAnnouncements() {
    const container = document.getElementById("public-announcements-container");
    if (!container) return;

    const announcements = await db.get("announcements") || [];
    const nowStr = new Date().toISOString().split("T")[0];

    // Filter to active announcements targeting "all"
    const active = announcements.filter(a => {
      if (a.target !== "all") return false;
      const expiry = a.expiryDate || a.expiry_date || "2099-12-31";
      return expiry >= nowStr;
    });

    if (active.length === 0) {
      container.innerHTML = `
        <div class="glass-card card-body" style="grid-column: span 3; text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary); margin: 0;">No active school announcements at this time.</p>
        </div>
      `;
      return;
    }

    // Sort by date descending
    active.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render top 3 active announcements
    container.innerHTML = active.slice(0, 3).map(a => `
      <div class="glass-card card-body">
        <span class="card-date">${new Date(a.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <h4 class="card-title">${a.title}</h4>
        <p class="card-text">${a.content}</p>
      </div>
    `).join("");
  }

  async loadPublicMoments() {
    const container = document.getElementById("dynamic-moments-slides");
    const dotsContainer = document.getElementById("dynamic-moments-dots");
    const noMsg = document.getElementById("no-moments-message");
    const sliderParent = document.getElementById("dynamic-moments-slider-container");
    if (!container) return;

    const moments = await db.get("gallery_moments") || [];
    const nowStr = new Date().toISOString().split("T")[0];

    const activeMoments = moments.filter(m => {
      const expiry = m.expiry_date || "2099-12-31";
      return expiry >= nowStr;
    });

    if (activeMoments.length === 0) {
      sliderParent.style.display = "none";
      if(noMsg) noMsg.style.display = "block";
      return;
    }

    sliderParent.style.display = "block";
    if(noMsg) noMsg.style.display = "none";

    let slidesHtml = "";
    let dotsHtml = "";
    let slideCount = 0;

    activeMoments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    activeMoments.forEach(m => {
      const urls = m.media_urls || [];
      urls.forEach(url => {
        let mediaHtml = "";
        if (url.includes("youtube.com") || url.includes("youtu.be") || url.endsWith(".mp4") || url.startsWith("data:video/")) {
          if (url.includes("youtube")) {
            let videoId = "";
            if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
            else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
            mediaHtml = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="object-fit: cover; pointer-events: auto;"></iframe>`;
          } else {
             mediaHtml = `<video src="${url}" style="width:100%; height:100%; object-fit: cover;" autoplay muted loop playsinline controls></video>`;
          }
        } else {
          mediaHtml = `<img src="${url}" style="width:100%; height:100%; object-fit: cover; display: block;" alt="${m.title || 'Special Moment'}" onerror="this.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200'">`;
        }

        slidesHtml += `
          <div class="moment-slide" style="flex: 0 0 100%; height: 500px; position: relative;">
            ${mediaHtml}
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 2rem; color: white; pointer-events: none;">
              <span class="badge badge-primary" style="margin-bottom: 0.5rem; display: inline-block;">${m.category} ${m.batch ? ' - Batch ' + m.batch : ''}</span>
              <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">${m.title}</h3>
              <p style="margin: 0; font-size: 0.95rem; opacity: 0.9;">${m.description || ''}</p>
            </div>
          </div>
        `;
        dotsHtml += `<div class="moment-dot" data-index="${slideCount}" style="width: 12px; height: 12px; border-radius: 50%; background: ${slideCount === 0 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.5)'}; cursor: pointer; transition: 0.3s;"></div>`;
        slideCount++;
      });
    });

    container.innerHTML = slidesHtml;
    dotsContainer.innerHTML = dotsHtml;

    this.initMomentSlider(slideCount);
  }

  initMomentSlider(totalSlides) {
    if(totalSlides <= 1) {
      const prev = document.getElementById("moment-slider-prev");
      const next = document.getElementById("moment-slider-next");
      if(prev) prev.style.display = "none";
      if(next) next.style.display = "none";
      return;
    }
    
    document.getElementById("moment-slider-prev").style.display = "block";
    document.getElementById("moment-slider-next").style.display = "block";

    let current = 0;
    const slidesContainer = document.getElementById("dynamic-moments-slides");
    const dots = document.querySelectorAll(".moment-dot");

    const updateSlider = () => {
      slidesContainer.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => {
        d.style.background = i === current ? 'var(--accent-primary)' : 'rgba(255,255,255,0.5)';
      });
    };

    document.getElementById("moment-slider-prev").onclick = async () => {
      current = (current - 1 + totalSlides) % totalSlides;
      updateSlider();
    };
    
    document.getElementById("moment-slider-next").onclick = async () => {
      current = (current + 1) % totalSlides;
      updateSlider();
    };

    dots.forEach(d => {
      d.onclick = (e) => {
        current = parseInt(e.target.getAttribute("data-index"));
        updateSlider();
      };
    });

    if (this.momentInterval) clearInterval(this.momentInterval);
    this.momentInterval = setInterval(() => {
      current = (current + 1) % totalSlides;
      updateSlider();
    }, 6000);
  }

  async loadPublicAlumni() {
    const tbody = document.getElementById("public-alumni-table-body");
    const noMsg = document.getElementById("no-alumni-message");
    if (!tbody) return;

    const alumni = await db.get("alumni_records") || [];
    if (alumni.length === 0) {
      tbody.innerHTML = "";
      if (noMsg) noMsg.style.display = "block";
      document.querySelector("#alumni-directory table").style.display = "none";
      return;
    }

    if (noMsg) noMsg.style.display = "none";
    document.querySelector("#alumni-directory table").style.display = "table";

    alumni.sort((a, b) => {
      if (a.graduation_year !== b.graduation_year) return (b.graduation_year || 0) - (a.graduation_year || 0);
      return (b.entrance_score || 0) - (a.entrance_score || 0);
    });

    tbody.innerHTML = alumni.map(a => {
      let mediaPreviewHtml = "";
      if (a.media_urls && a.media_urls.length > 0) {
        const url = a.media_urls[0];
        if (url.includes("youtube.com") || url.includes("youtu.be") || url.endsWith(".mp4") || url.startsWith("data:video/")) {
          mediaPreviewHtml = `<i class="fas fa-video" style="color: var(--accent-primary); cursor: pointer;" title="Contains Video" onclick="window.open('${url}', '_blank')"></i>`;
        } else {
          mediaPreviewHtml = `<img src="${url}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 1px solid var(--border-color);" onclick="window.open('${url}', '_blank')" title="View Image">`;
        }
      }
      return `
      <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-primary);">
        <td style="padding: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          ${mediaPreviewHtml}
          <strong>${a.student_name}</strong>
        </td>
        <td style="padding: 1rem;">${a.graduation_year || '-'}</td>
        <td style="padding: 1rem; color: var(--accent-primary); font-weight: 600;">${a.entrance_score || '-'}</td>
        <td style="padding: 1rem;">${a.university_joined || '-'}</td>
        <td style="padding: 1rem;">${a.department || '-'}</td>
      </tr>
      `;
    }).join("");
  }

  async loadPublicPrograms() {
    const container = document.getElementById("public-programs-container");
    const noMsg = document.getElementById("no-programs-message");
    if (!container) return;

    const programs = await db.get("academic_programs") || [];
    
    if (programs.length === 0) {
      container.innerHTML = "";
      if (noMsg) noMsg.style.display = "block";
      return;
    }

    if (noMsg) noMsg.style.display = "none";

    container.innerHTML = programs.map(p => `
      <div class="glass-card" style="padding: 2rem;">
        <div style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 1rem;"><i class="fas fa-graduation-cap"></i></div>
        <h4 style="margin-bottom: 1rem; color: var(--text-primary);">${p.title}</h4>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6;">${p.description}</p>
        <div style="margin-bottom: 0.5rem;"><i class="fas fa-clock" style="color: var(--accent-primary);"></i> <strong style="color: var(--text-primary);">Duration:</strong> <span style="color: var(--text-secondary);">${p.duration}</span></div>
        <div><i class="fas fa-check-circle" style="color: var(--accent-primary);"></i> <strong style="color: var(--text-primary);">Requirements:</strong> <span style="color: var(--text-secondary);">${p.requirements}</span></div>
      </div>
    `).join("");
  }

  async loadPublicVacancies() {
    const container = document.getElementById("public-news-container");
    const noMsg = document.getElementById("no-news-message");
    if (!container) return;

    const vacancies = await db.get("vacancies") || [];
    const allResults = await db.get("vacancy_results") || [];
    
    if (vacancies.length === 0) {
      container.innerHTML = "";
      if (noMsg) noMsg.style.display = "block";
      return;
    }

    if (noMsg) noMsg.style.display = "none";

    vacancies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const today = new Date().toISOString().split('T')[0];
    const activeVacancies = [];
    const closedVacancies = [];

    vacancies.forEach(v => {
      if (v.expiry_date && v.expiry_date < today) {
        closedVacancies.push(v);
      } else {
        activeVacancies.push(v);
      }
    });

    const renderVacancy = (v, isClosed) => {
      let icon = "fa-bullhorn";
      if (v.type === "JOB VACANCY") icon = "fa-briefcase";
      if (v.type === "EXAM CALL") icon = "fa-pen-alt";
      if (v.type === "INTERVIEW CALL") icon = "fa-users";

      // Filter passed examinees for this vacancy
      const passedCandidates = allResults.filter(r => r.vacancy_id === v.id && r.final_status === "Passed");
      
      let resultsHtml = ""; // Intentionally empty to keep results private

      let actionsHtml = `<div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">`;
      
      if (!isClosed) {
        actionsHtml += `<button class="btn-primary" onclick="window.openPublicApplication('${v.id}')"><i class="fas fa-paper-plane"></i> Apply Now</button>`;
      }
      
      // Check Result Button: If there are ANY results mapped to this vacancy that aren't "Pending", we allow checking.
      // Actually, even if they are pending, they can check and see "Pending". So we just allow them to check if they applied.
      actionsHtml += `<button class="btn-secondary" onclick="window.openCheckResult('${v.id}')"><i class="fas fa-search"></i> Check My Result</button>`;
      
      actionsHtml += `</div>`;

      let badgeHtml = `<span class="badge badge-info" style="font-size: 0.75rem;"><i class="fas ${icon}"></i> ${v.type}</span>`;
      if (isClosed) {
        badgeHtml = `<span class="badge badge-danger" style="font-size: 0.75rem;"><i class="fas fa-ban"></i> CLOSED</span>`;
      }

      return `
        <div class="glass-card" style="padding: 2rem; border-left: 4px solid ${isClosed ? 'var(--accent-danger)' : 'var(--accent-primary)'}; opacity: ${isClosed ? '0.8' : '1'}; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
            <h4 style="margin: 0; color: var(--text-primary);">${v.title}</h4>
            ${badgeHtml}
          </div>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">${v.description}</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            ${v.application_days ? `<div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: var(--radius-md);"><i class="fas fa-calendar-alt" style="color: var(--accent-primary);"></i> <strong style="color: var(--text-primary);">Apply By:</strong> <span style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${v.application_days}</span></div>` : ''}
            ${v.expiry_date ? `<div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: var(--radius-md);"><i class="fas fa-hourglass-end" style="color: var(--accent-primary);"></i> <strong style="color: var(--text-primary);">Closes On:</strong> <span style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${v.expiry_date}</span></div>` : ''}
            ${v.application_type ? `<div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: var(--radius-md);"><i class="fas fa-file-alt" style="color: var(--accent-primary);"></i> <strong style="color: var(--text-primary);">App Type:</strong> <span style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${v.application_type}</span></div>` : ''}
            ${(v.written_exam_date || v.written_exam_time || v.written_exam_venue) ? `<div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: var(--radius-md);"><i class="fas fa-pen-alt" style="color: var(--accent-primary);"></i> <strong style="color: var(--text-primary);">Written Exam Call:</strong> <span style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${v.written_exam_date || 'TBD'} ${v.written_exam_time ? `(${v.written_exam_time})` : ''} ${v.written_exam_venue ? `@ ${v.written_exam_venue}` : ''}</span></div>` : ''}
            ${(v.interview_date || v.interview_time || v.interview_venue) ? `<div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: var(--radius-md);"><i class="fas fa-comments" style="color: var(--accent-secondary);"></i> <strong style="color: var(--text-primary);">Interview Call:</strong> <span style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">${v.interview_date || 'TBD'} ${v.interview_time ? `(${v.interview_time})` : ''} ${v.interview_venue ? `@ ${v.interview_venue}` : ''}</span></div>` : ''}
          </div>

          ${v.exam_call_notes ? `<div style="margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--accent-primary); border-radius: 4px; font-size: 0.88rem; color: var(--text-secondary);"><i class="fas fa-info-circle" style="color: var(--accent-primary); margin-right: 5px;"></i> <strong>Candidate Instructions:</strong> ${v.exam_call_notes}</div>` : ''}
          
          ${actionsHtml}
          ${resultsHtml}
        </div>
      `;
    };

    let finalHtml = "";
    if (activeVacancies.length > 0) {
      finalHtml += `<h4 style="margin-bottom: 1rem; color: var(--accent-primary);">Active Vacancies & Calls</h4>`;
      finalHtml += activeVacancies.map(v => renderVacancy(v, false)).join("");
    }
    
    if (closedVacancies.length > 0) {
      finalHtml += `<h4 style="margin-top: 3rem; margin-bottom: 1rem; color: var(--text-secondary);">Past / Closed Vacancies</h4>`;
      finalHtml += closedVacancies.map(v => renderVacancy(v, true)).join("");
    }

    container.innerHTML = finalHtml;
  }


  // Routing mechanism between landing view, login, and active portal dashboards
  routeTo(pageId) {
    this.applyDynamicLogo();

    // Close any active mobile drawers or overlays when changing pages
    const drawer = document.getElementById("drawer");
    const hamburger = document.getElementById("hamburger");
    if (drawer) drawer.classList.remove("open");
    if (hamburger) hamburger.classList.remove("active");

    const dashSidebar = document.querySelector(".dashboard-sidebar");
    const dashOverlay = document.getElementById("dashboard-sidebar-overlay");
    if (dashSidebar) dashSidebar.classList.remove("active");
    if (dashOverlay) dashOverlay.classList.remove("active");

    // Hide all major pages
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("login-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "none";

    if (pageId === "landing-page") {
      this.loadPublicAnnouncements();
      this.loadPublicMoments();
      this.loadPublicAlumni();
      this.loadPublicPrograms();
      this.loadPublicVacancies();
    }

    // Show selected page
    const target = document.getElementById(pageId);
    if (target) {
      target.style.display = "block";
      window.scrollTo(0, 0);
    }
  }

  async applyDynamicLogo() {
    const settings = await db.get("settings") || {};
    
    // 1. Logo & Browser Favicon
    const logoUrl = (settings.logo && settings.logo.trim()) ? settings.logo.trim() : "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120";
    document.querySelectorAll(".school-logo-img").forEach(img => {
      img.src = logoUrl;
      img.onerror = () => {
        img.src = "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120";
      };
    });

    let favicon = document.getElementById("app-favicon");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.id = "app-favicon";
      favicon.rel = "icon";
      favicon.type = "image/x-icon";
      document.head.appendChild(favicon);
    }
    favicon.href = logoUrl;

    // 2. School Name
    if (settings.schoolName && settings.schoolName.trim()) {
      const nameVal = settings.schoolName.trim();
      document.querySelectorAll(".school-name-text").forEach(el => {
        el.innerText = nameVal;
      });
      const navBrand = document.querySelector(".nav-brand span");
      if (navBrand) {
        navBrand.innerText = nameVal;
      }
    }

    // 3. Copyright Notice
    if (settings.copyright && settings.copyright.trim()) {
      const copyVal = settings.copyright.trim();
      const copyrightEl = document.getElementById("copyright-text");
      if (copyrightEl) copyrightEl.innerText = copyVal;
      document.querySelectorAll(".copyright-text").forEach(el => {
        el.innerText = copyVal;
      });
    }

    // 4. Academic Year
    if (settings.academicYear && settings.academicYear.trim()) {
      const yearVal = settings.academicYear.trim();
      document.querySelectorAll(".academic-year-text").forEach(el => {
        el.innerText = yearVal;
      });
    }

    // 5. Higa Compound Image
    const defaultHigaUrl = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200";
    const higaUrl = (settings.higaCompoundImage && settings.higaCompoundImage.trim()) ? settings.higaCompoundImage.trim() : defaultHigaUrl;

    document.querySelectorAll(".higa-compound-img").forEach(img => {
      img.src = higaUrl;
      img.onerror = () => {
        img.src = defaultHigaUrl;
      };
    });

    const safeHigaUrl = higaUrl.replace(/"/g, '\\"');
    document.querySelectorAll(".higa-compound-bg").forEach(el => {
      el.style.backgroundImage = `url("${safeHigaUrl}")`;
    });

    const firstSlide = document.querySelector(".hero-slider-container .slide:first-child");
    if (firstSlide) {
      firstSlide.style.backgroundImage = `url("${safeHigaUrl}")`;
    }

    // 6. Church / School Location Address
    if (settings.churchLocation && settings.churchLocation.trim()) {
      const locVal = settings.churchLocation.trim();
      const addrEl = document.getElementById("school-address-display");
      if (addrEl) addrEl.innerText = locVal;
      document.querySelectorAll(".school-address-text").forEach(el => { el.innerText = locVal; });
    }

    // 7. Contact Email Address
    if (settings.contactEmail && settings.contactEmail.trim()) {
      const emailVal = settings.contactEmail.trim();
      const emailEl = document.getElementById("contact-email-display");
      if (emailEl) emailEl.innerText = emailVal;
      document.querySelectorAll(".contact-email-text").forEach(el => { el.innerText = emailVal; });
    }

    // 8. Contact Phone Number
    if (settings.contactPhone && settings.contactPhone.trim()) {
      const phoneVal = settings.contactPhone.trim();
      const phoneEl = document.getElementById("contact-phone-display");
      if (phoneEl) phoneEl.innerText = phoneVal;
      document.querySelectorAll(".contact-phone-text").forEach(el => { el.innerText = phoneVal; });
    }

    // 9. Google Map Embed Iframe
    const mapIframe = document.getElementById("google-map-iframe");
    if (mapIframe) {
      if (settings.googleMapEmbedUrl && settings.googleMapEmbedUrl.trim()) {
        mapIframe.src = settings.googleMapEmbedUrl.trim();
      } else if (settings.churchLocation && settings.churchLocation.trim()) {
        mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(settings.churchLocation.trim())}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      }
    }

    // 10. Background Image
    if (settings.backgroundImage && settings.backgroundImage.trim()) {
      const safeBgUrl = settings.backgroundImage.trim().replace(/"/g, '\\"');
      document.body.style.backgroundImage = `url("${safeBgUrl}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "none";
    }

    // 11. School Bank Accounts Display
    const bankSection = document.getElementById("school-bank-accounts-section");
    const bankGrid = document.getElementById("school-bank-accounts-grid");
    const bankBadge = document.getElementById("school-bank-count-badge");
    if (bankSection && bankGrid) {
      const activeAccounts = [];
      for (let i = 1; i <= 8; i++) {
        const bName = settings[`bank_${i}_name`]?.trim();
        const bAcc = settings[`bank_${i}_account`]?.trim();
        const bPurp = settings[`bank_${i}_purpose`]?.trim();
        if (bName || bAcc) {
          activeAccounts.push({
            num: i,
            name: bName || `School Account #${i}`,
            account: bAcc || 'N/A',
            purpose: bPurp || ''
          });
        }
      }
      if (activeAccounts.length > 0) {
        bankSection.style.display = "block";
        if (bankBadge) bankBadge.innerText = `${activeAccounts.length} Bank Account${activeAccounts.length > 1 ? 's' : ''}`;
        bankGrid.innerHTML = activeAccounts.map((acc, idx) => `
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                <i class="fas fa-credit-card"></i> ${acc.name}
              </div>
              <div style="font-family: monospace; font-size: 0.95rem; font-weight: 800; color: var(--text-primary); background: var(--bg-tertiary); padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-color); word-break: break-all;">
                ${acc.account}
              </div>
              ${acc.purpose ? `<div style="font-size: 0.76rem; color: var(--accent-primary); margin-top: 0.35rem; font-weight: 600;"><i class="fas fa-bullseye" style="margin-right: 4px;"></i> Purpose: ${acc.purpose}</div>` : ''}
            </div>
            <button type="button" onclick="navigator.clipboard.writeText('${acc.account.replace(/'/g, "\\'")}'); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy Number', 2000);" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.6rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem; transition: all 0.2s;">
              <i class="fas fa-copy"></i> Copy Number
            </button>
          </div>
        `).join('');
      } else {
        bankSection.style.display = "none";
      }
    }

    // 12. Social Media Links
    const socialMap = {
      'social-facebook': settings.facebookUrl || 'https://facebook.com',
      'social-telegram': settings.telegramUrl || 'https://t.me',
      'social-linkedin': settings.linkedinUrl || 'https://linkedin.com',
      'social-youtube': settings.youtubeUrl || 'https://youtube.com',
      'social-instagram': settings.instagramUrl || 'https://instagram.com',
      'social-whatsapp': settings.whatsappUrl || 'https://whatsapp.com',
      'social-tiktok': settings.tiktokUrl || 'https://tiktok.com',
      'social-twitter': settings.twitterUrl || 'https://twitter.com'
    };
    Object.entries(socialMap).forEach(([id, url]) => {
      const el = document.getElementById(id);
      if (el) {
        if (url && url.trim()) {
          el.href = url.trim();
          el.style.display = "inline-flex";
        } else {
          el.style.display = "none";
        }
      }
    });
  }
}

export const app = new App();
if (typeof window !== "undefined") {
  window.updateDynamicSettingsUI = async () => {
    await app.applyDynamicLogo();
  };

  window.addEventListener("DOMContentLoaded", async () => {
    await app.init();

    window.addEventListener('storage', (e) => {
      if (e.key && e.key.includes('settings')) {
        app.applyDynamicLogo();
      }
    });

    if (db.subscribeTable) {
      db.subscribeTable("users", async () => {
        await db.get("users");
      });
      db.subscribeTable("settings", async () => {
        await db.get("settings");
        await app.applyDynamicLogo();
      });
    }
  });
  window.appRoute = (pageId) => app.routeTo(pageId);
  window.logoutUser = () => auth.logout();
  window.applyDynamicLogo = () => app.applyDynamicLogo();
  window.compressImage = compressImage;

  window.showBootstrapAlert = (message, type = "success") => {
    let container = document.getElementById("bootstrap-alerts-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "bootstrap-alerts-container";
      document.body.appendChild(container);
    }

    const alertDiv = document.createElement("div");
    alertDiv.className = `custom-alert custom-alert-${type}`;
    
    let icon = '<i class="fas fa-check-circle"></i>';
    if (type === "danger" || type === "error") {
      icon = '<i class="fas fa-times-circle"></i>';
      alertDiv.className = `custom-alert custom-alert-danger`;
    } else if (type === "warning") {
      icon = '<i class="fas fa-exclamation-triangle"></i>';
    }

    alertDiv.innerHTML = `
      ${icon}
      <span style="flex-grow: 1;">${message}</span>
      <button class="alert-close" type="button" style="margin-left: 10px;">&times;</button>
    `;

    const closeBtn = alertDiv.querySelector(".alert-close");
    closeBtn.addEventListener("click", async () => {
      alertDiv.classList.add("fade-out");
      setTimeout(() => {
        alertDiv.remove();
      }, 300);
    });

    container.appendChild(alertDiv);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.classList.add("fade-out");
        setTimeout(() => {
          if (alertDiv.parentNode) alertDiv.remove();
        }, 300);
      }
    }, 4000);
  };

  window.alert = (message) => {
    let type = "success";
    const msgLower = String(message || "").toLowerCase();
    if (msgLower.includes("unauthorized") || 
        msgLower.includes("error") || 
        msgLower.includes("already exists") || 
        msgLower.includes("failed") || 
        msgLower.includes("please") || 
        msgLower.includes("invalid") ||
        msgLower.includes("not registered") ||
        msgLower.includes("deactivated") ||
        msgLower.includes("no pending")) {
      type = "danger";
    } else if (msgLower.includes("warning")) {
      type = "warning";
    }
    window.showBootstrapAlert(message, type);
  };

  // Global Portal Modal Helpers
  window.showPortalModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Make sure modal is a direct child of body (avoids backdrop-filter stacking clipping bugs)
    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
    
    // Force premium modal styling class and z-index overrides to stay above overlay
    modal.classList.add("portal-modal");
    modal.style.zIndex = "2000";
    
    // Ensure overlay exists
    let overlay = document.getElementById("portal-modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "portal-modal-overlay";
      overlay.className = "portal-modal-overlay";
      document.body.appendChild(overlay);
    }
    
    // Display modal and overlay
    overlay.style.display = "block";
    modal.style.display = "block";
  };

  window.hidePortalModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    }
    const overlay = document.getElementById("portal-modal-overlay");
    if (overlay) {
      const anyVisible = Array.from(document.querySelectorAll(".portal-modal")).some(m => m.style.display === "block");
      if (!anyVisible) {
        overlay.style.display = "none";
      }
    }
  };

  window.showConfirmModal = (title, message, confirmBtnText = "Delete") => {
    return new Promise((resolve) => {
      const modal = document.getElementById("confirm-modal");
      if (!modal) {
        resolve(window.confirm(message));
        return;
      }

      const titleEl = document.getElementById("confirm-modal-title");
      const msgEl = document.getElementById("confirm-modal-message");
      const proceedBtn = document.getElementById("btn-confirm-proceed");
      const cancelBtn = document.getElementById("btn-confirm-cancel");

      if (titleEl) titleEl.innerText = title || "Confirm Action";
      if (msgEl) msgEl.innerText = message || "Are you sure you want to proceed with this action?";
      if (proceedBtn) proceedBtn.innerHTML = `<i class="fas fa-trash-alt"></i> ${confirmBtnText}`;

      const handleProceed = () => {
        cleanup();
        resolve(true);
      };

      const handleCancel = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        window.hidePortalModal("confirm-modal");
        if (proceedBtn) proceedBtn.removeEventListener("click", handleProceed);
        if (cancelBtn) cancelBtn.removeEventListener("click", handleCancel);
      };

      if (proceedBtn) proceedBtn.addEventListener("click", handleProceed);
      if (cancelBtn) cancelBtn.addEventListener("click", handleCancel);

      window.showPortalModal("confirm-modal");
    });
  };

  window.toggleConditionalUserFields = (role) => {
    const studFields = document.getElementById("student-only-fields");
    const teachFields = document.getElementById("teacher-only-fields");
    if (studFields) studFields.style.display = role === "Student" ? "block" : "none";
    if (teachFields) teachFields.style.display = role === "Teacher" ? "block" : "none";
  };

  window.openPublicApplication = (vacancyId) => {
    document.getElementById("public-application-form").reset();
    document.getElementById("app-vacancy-id").value = vacancyId;
    window.showPortalModal("public-application-modal");
  };
}

export function compressImage(file, maxDimension, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      callback(dataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Helper to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

if (typeof window !== "undefined") {
  window.fileToBase64 = fileToBase64;

  document.addEventListener("DOMContentLoaded", async () => {
    const appForm = document.getElementById("public-application-form");
    if (appForm) {
      appForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById("app-submit-btn");
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        try {
          const id = "app-" + Date.now();
          const vacancyId = document.getElementById("app-vacancy-id").value;
          const name = document.getElementById("app-name").value.trim();
          const phone = document.getElementById("app-phone").value.trim();
          const email = document.getElementById("app-email").value.trim();
          const address = document.getElementById("app-address").value.trim();
          
          const idDocFile = document.getElementById("app-id-doc").files[0];
          const cvDocFile = document.getElementById("app-cv-doc").files[0];
          const tempDocFile = document.getElementById("app-temp-doc").files[0];

          // 20MB Photo / 1GB Video check
          const MAX_DOC_SIZE = 20 * 1024 * 1024;
          if (idDocFile && idDocFile.size > MAX_DOC_SIZE) throw new Error("ID Document size exceeds 20MB limit.");
          if (cvDocFile && cvDocFile.size > MAX_DOC_SIZE) throw new Error("CV Document size exceeds 20MB limit.");
          if (tempDocFile && tempDocFile.size > MAX_DOC_SIZE) throw new Error("Temporary Document size exceeds 20MB limit.");

          const idUrl = idDocFile ? await fileToBase64(idDocFile) : null;
          const cvUrl = cvDocFile ? await fileToBase64(cvDocFile) : null;
          const tempUrl = tempDocFile ? await fileToBase64(tempDocFile) : null;

          const newResult = {
            id,
            vacancy_id: vacancyId,
            examinee_name: name,
            phone_number: phone,
            email,
            address,
            id_document_url: idUrl,
            cv_document_url: cvUrl,
            temp_document_url: tempUrl,
            written_score: null,
            interview_score: null,
            final_status: "Submitted"
          };

          const allResults = await db.get("vacancy_results") || [];
          allResults.push(newResult);
          await db.set("vacancy_results", allResults);

          window.hidePortalModal("public-application-modal");
          alert("Application submitted successfully! You can track your status using your Email or Phone Number.");
        } catch (err) {
          alert(err.message || "Failed to submit application.");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit Application";
        }
      });
    }

    const checkResultForm = document.getElementById("check-result-form");
    if (checkResultForm) {
      checkResultForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const vacancyId = document.getElementById("check-result-vacancy-id").value;
        const contact = document.getElementById("check-result-contact").value.trim().toLowerCase();
        
        const allResults = await db.get("vacancy_results") || [];
        const match = allResults.find(r => r.vacancy_id === vacancyId && (
          (r.email && r.email.toLowerCase() === contact) || 
          (r.phone_number && r.phone_number === contact)
        ));

        const displayDiv = document.getElementById("check-result-display");
        displayDiv.style.display = "block";

        if (!match) {
          displayDiv.innerHTML = `<div class="custom-alert custom-alert-danger">No application found matching that Email or Phone Number. Please try again.</div>`;
          return;
        }

        let statusColor = "var(--accent-info)";
        if (match.final_status === "Passed") statusColor = "var(--accent-success)";
        if (match.final_status === "Failed") statusColor = "var(--accent-danger)";

        displayDiv.innerHTML = `
          <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <h5 style="margin-bottom: 1rem; color: var(--text-primary);">Applicant: ${match.examinee_name}</h5>
            <div style="display: grid; gap: 0.5rem; font-size: 0.95rem;">
              <div><strong style="color: var(--text-secondary);">Written Score:</strong> ${match.written_score !== null ? match.written_score : "Pending"}</div>
              <div><strong style="color: var(--text-secondary);">Interview Score:</strong> ${match.interview_score !== null ? match.interview_score : "Pending"}</div>
              <div style="margin-top: 0.5rem; font-size: 1.1rem;"><strong style="color: var(--text-secondary);">Final Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${match.final_status}</span></div>
            </div>
          </div>
        `;
      });
    }
  });

  window.openCheckResult = (vacancyId) => {
    document.getElementById("check-result-form").reset();
    document.getElementById("check-result-vacancy-id").value = vacancyId;
    document.getElementById("check-result-display").style.display = "none";
    window.showPortalModal("check-result-modal");
  };
}
