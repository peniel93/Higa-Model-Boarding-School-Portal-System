// js/dashboards/registrar.js
import { db } from '../db.js';

export function initDashboard(user) {
  renderSidebar(user);
  renderMainView("dashboard");
}

function renderSidebar(user) {
  const list = document.getElementById("sidebar-nav-list");
  if (!list) return;

  const isMain = user.role === "MainRegistrar";
  const hasUsersRight = isMain || (user.rights && user.rights.includes("users"));
  const hasCoursesRight = isMain || (user.rights && user.rights.includes("courses"));
  const hasSettingsRight = isMain || (user.rights && user.rights.includes("settings"));
  const hasAnnouncementsRight = isMain || (user.rights && user.rights.includes("announcements"));

  let sidebarHtml = `<li><a href="#" id="side-dashboard"><i class="fas fa-chart-line"></i> Analytics Overview</a></li>`;
  if (hasUsersRight) {
    sidebarHtml += `<li><a href="#" id="side-users"><i class="fas fa-users"></i> Users Database</a></li>`;
  }
  if (hasCoursesRight) {
    sidebarHtml += `<li><a href="#" id="side-courses"><i class="fas fa-book-open"></i> Manage Courses</a></li>`;
    sidebarHtml += `<li><a href="#" id="side-classes"><i class="fas fa-school"></i> Classes & Sections</a></li>`;
    sidebarHtml += `<li><a href="#" id="side-enrollments"><i class="fas fa-tasks"></i> Course Assignments</a></li>`;
  }
  if (hasSettingsRight) {
    sidebarHtml += `<li><a href="#" id="side-settings"><i class="fas fa-cog"></i> Portal Settings</a></li>`;
  }
  if (hasAnnouncementsRight) {
    sidebarHtml += `<li><a href="#" id="side-announcements"><i class="fas fa-bullhorn"></i> Bulletins & Announcements</a></li>`;
  }
  sidebarHtml += `<li><a href="#" id="side-grades"><i class="fas fa-file-invoice"></i> Grades Registry</a></li>`;
  sidebarHtml += `<li><a href="#" id="side-ranking"><i class="fas fa-trophy"></i> Grade Calculation & Ranking</a></li>`;
  sidebarHtml += `<li><a href="#" id="side-calendar"><i class="fas fa-calendar-alt"></i> Academic Calendar</a></li>`;
  if (isMain) {
    sidebarHtml += `<li><a href="#" id="side-rights"><i class="fas fa-user-shield"></i> Staff Rights & Status</a></li>`;
    sidebarHtml += `<li><a href="#" id="side-programs"><i class="fas fa-layer-group"></i> Manage Programs</a></li>`;
    sidebarHtml += `<li><a href="#" id="side-vacancies"><i class="fas fa-briefcase"></i> Vacancies & News</a></li>`;
    sidebarHtml += `<li><a href="#" id="side-vacancy-results"><i class="fas fa-clipboard-list"></i> Examinee Results</a></li>`;
  }
  sidebarHtml += `<li><a href="#" id="side-gallery"><i class="fas fa-images"></i> Gallery & Events</a></li>`;
  sidebarHtml += `<li><a href="#" id="side-alumni"><i class="fas fa-graduation-cap"></i> Alumni Records</a></li>`;

  list.innerHTML = sidebarHtml;

  // Bind clicks
  document.getElementById("side-dashboard").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-dashboard");
    renderMainView("dashboard");
  });
  if (hasUsersRight) {
    document.getElementById("side-users").addEventListener("click", async (e) => {
      e.preventDefault();
      setActiveLink("side-users");
      renderMainView("users");
    });
  }
  if (hasCoursesRight) {
    document.getElementById("side-courses").addEventListener("click", async (e) => {
      e.preventDefault();
      setActiveLink("side-courses");
      renderMainView("courses");
    });
    document.getElementById("side-classes").addEventListener("click", async (e) => {
      e.preventDefault();
      setActiveLink("side-classes");
      renderMainView("classes");
    });
    document.getElementById("side-enrollments").addEventListener("click", async (e) => {
      e.preventDefault();
      setActiveLink("side-enrollments");
      renderMainView("enrollments");
    });
  }
  if (hasSettingsRight) {
    document.getElementById("side-settings").addEventListener("click", async (e) => {
      e.preventDefault();
      setActiveLink("side-settings");
      renderMainView("settings");
    });
  }
  if (hasAnnouncementsRight) {
    document.getElementById("side-announcements").addEventListener("click", async (e) => {
      e.preventDefault();
      setActiveLink("side-announcements");
      renderMainView("announcements");
    });
  }
  document.getElementById("side-grades").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-grades");
    renderMainView("grades");
  });
  document.getElementById("side-ranking").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-ranking");
    renderMainView("ranking");
  });
  document.getElementById("side-calendar").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-calendar");
    renderMainView("calendar");
  });
  if (isMain) {
    const sideRightsBtn = document.getElementById("side-rights");
    if (sideRightsBtn) {
      sideRightsBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        setActiveLink("side-rights");
        renderMainView("rights");
      });
    }
    const sideProgramsBtn = document.getElementById("side-programs");
    if (sideProgramsBtn) {
      sideProgramsBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        setActiveLink("side-programs");
        renderMainView("programs");
      });
    }
    const sideVacanciesBtn = document.getElementById("side-vacancies");
    if (sideVacanciesBtn) {
      sideVacanciesBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        setActiveLink("side-vacancies");
        renderMainView("vacancies");
      });
    }
    const sideVacancyResultsBtn = document.getElementById("side-vacancy-results");
    if (sideVacancyResultsBtn) {
      sideVacancyResultsBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        setActiveLink("side-vacancy-results");
        renderMainView("vacancy-results");
      });
    }
  }

  document.getElementById("side-gallery").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-gallery");
    renderMainView("gallery");
  });
  document.getElementById("side-alumni").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-alumni");
    renderMainView("alumni");
  });

  // Set first child active
  const firstChild = list.querySelector("li");
  if (firstChild) firstChild.classList.add("active");
}

function setActiveLink(id) {
  document.querySelectorAll("#sidebar-nav-list li").forEach(li => li.classList.remove("active"));
  const link = document.getElementById(id);
  if (link) link.parentElement.classList.add("active");
}

async function renderMainView(view) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  // Modals are permanent in index.html, do not remove them.
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  
  // Real-time security deactivation check (Requirement 8)
  const users = await db.get("users");
  const dbUser = users.find(u => u.id === currentUser.id);
  if (!dbUser || dbUser.isActive === false || dbUser.is_active === false) {
    alert("Session invalidated. Your account has been deactivated.");
    import('../auth.js').then(module => {
      module.auth.logout();
    });
    return;
  }

  // Sync session permissions
  localStorage.setItem("higa_current_user", JSON.stringify(dbUser));

  const isMain = dbUser.role === "MainRegistrar";
  const hasUsersAccess = isMain || (dbUser.rights && dbUser.rights.includes("users"));
  const hasCoursesAccess = isMain || (dbUser.rights && dbUser.rights.includes("courses"));
  const hasSettingsAccess = isMain || (dbUser.rights && dbUser.rights.includes("settings"));
  const hasAnnouncementsAccess = isMain || (dbUser.rights && dbUser.rights.includes("announcements"));

  if (view === "dashboard") {
    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h3>Analytics Overview Dashboard</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0;">Portal real-time enrollment, staff directory distribution, and course metrics analysis.</p>
      </div>

      <!-- General Counters -->
      <div class="stats-grid" id="analytics-general-stats" style="margin-bottom: 2rem;">
        <!-- Loaded Dynamically -->
      </div>

      <div class="grid-2" style="margin-bottom: 2rem;">
        <!-- User Roles Card -->
        <div class="glass-card" style="padding: 1.5rem;">
          <h5 style="color: var(--accent-primary); margin-bottom: 1rem;"><i class="fas fa-user-tag"></i> User Accounts Distribution</h5>
          <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                  <th style="padding: 0.5rem;">Role / Designation</th>
                  <th style="padding: 0.5rem; text-align: right;">Total Accounts</th>
                </tr>
              </thead>
              <tbody id="analytics-roles-body">
                <!-- Loaded Dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Course Registrations Stats Card -->
        <div class="glass-card" style="padding: 1.5rem;">
          <h5 style="color: var(--accent-primary); margin-bottom: 1rem;"><i class="fas fa-book"></i> Popular Course Registrations</h5>
          <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                  <th style="padding: 0.5rem;">Course Code & Name</th>
                  <th style="padding: 0.5rem; text-align: right;">Registered Students</th>
                </tr>
              </thead>
              <tbody id="analytics-courses-body">
                <!-- Loaded Dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Advanced Class Section, Batch & Semester Student Breakdown Counter -->
      <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <h5 style="color: var(--accent-primary); margin-bottom: 0;"><i class="fas fa-chart-bar"></i> Students Breakdown (Class, Section, Batch & Semester)</h5>
          
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0;">Batch:</label>
              <select id="analytics-batch-select" class="form-control" style="width: 110px; height: 32px; padding: 0.2rem 0.5rem; font-size: 0.82rem;">
                <!-- Loaded Dynamically -->
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0;">Semester:</label>
              <select id="analytics-semester-select" class="form-control" style="width: 110px; height: 32px; padding: 0.2rem 0.5rem; font-size: 0.82rem;">
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                <th style="padding: 0.5rem 0.75rem;">Class Section</th>
                <th style="padding: 0.5rem 0.75rem;">Batch Year</th>
                <th style="padding: 0.5rem 0.75rem;">Total Class Size</th>
                <th style="padding: 0.5rem 0.75rem;">Fully Registered</th>
                <th style="padding: 0.5rem 0.75rem;">Partially Registered</th>
                <th style="padding: 0.5rem 0.75rem;">Unregistered</th>
              </tr>
            </thead>
            <tbody id="analytics-breakdown-body">
              <!-- Loaded Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Populate Batch Filter
    const usersList = await db.get("users") || [];
    const studentBatches = [...new Set(usersList.filter(u => u.role === "Student" && u.batch).map(u => u.batch))].sort();
    const batchSel = document.getElementById("analytics-batch-select");
    if (batchSel) {
      batchSel.innerHTML = `<option value="all">All Batches</option>` + studentBatches.map(b => `<option value="${b}">${b}</option>`).join("");
      batchSel.addEventListener("change", window.loadRegistrarAnalyticsData);
    }
    
    const semSel = document.getElementById("analytics-semester-select");
    if (semSel) {
      semSel.addEventListener("change", window.loadRegistrarAnalyticsData);
    }

    window.loadRegistrarAnalyticsData();
  }

  else if (view === "users") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <h3>Users Registry</h3>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${hasUsersAccess ? `
              <button class="btn-primary" id="btn-add-user"><i class="fas fa-user-plus"></i> Add New User</button>
            ` : `<span class="badge badge-warning">Read-Only Access</span>`}
          </div>
        </div>

        <details class="glass-card" style="padding: 1rem; margin-bottom: 1.5rem; cursor: pointer;">
          <summary style="font-weight: 600; color: var(--accent-primary); list-style: none; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-chart-pie"></i> View Categorization & Grouping Summary
          </summary>
          <div id="users-summary-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <!-- Loaded Dynamically -->
          </div>
        </details>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <input type="text" id="search-users" class="form-control" placeholder="Search by ID or Name..." style="width: 100%; max-width: 250px;">
            <button class="btn-secondary" id="btn-toggle-grouped-view" style="padding: 0.5rem 1rem;" type="button"><i class="fas fa-layer-group"></i> Grouped Directory</button>
            <button class="btn-secondary" onclick="window.printUserList()" style="padding: 0.5rem 1rem;" type="button" title="Print Directory"><i class="fas fa-print"></i> Print</button>
            <button class="btn-secondary" onclick="window.exportUserList()" style="padding: 0.5rem 1rem;" type="button" title="Export CSV"><i class="fas fa-file-csv"></i> Export</button>
            <div id="dynamic-user-filters" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <!-- Loaded Dynamically -->
            </div>
          </div>
          
          <div class="user-role-tabs" style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
            <button class="btn-secondary active" onclick="switchUserRoleTab('all')">All</button>
            <button class="btn-secondary" onclick="switchUserRoleTab('Registrars')">Registrars</button>
            <button class="btn-secondary" onclick="switchUserRoleTab('Principals')">Principals</button>
            <button class="btn-secondary" onclick="switchUserRoleTab('Managers')">Managers</button>
            <button class="btn-secondary" onclick="switchUserRoleTab('Teachers')">Teachers</button>
            <button class="btn-secondary" onclick="switchUserRoleTab('Students')">Students</button>
            <button class="btn-secondary" onclick="switchUserRoleTab('Other Staff')">Other Staff</button>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Default Password</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="users-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    loadUsersTable();
    loadUsersSummary();

    // Attach Event Listeners
    document.getElementById("search-users").addEventListener("input", loadUsersTable);

    const toggleBtn = document.getElementById("btn-toggle-grouped-view");
    if (toggleBtn) {
      if (window.isUserGroupedView) {
        toggleBtn.innerHTML = `<i class="fas fa-table"></i> Flat List View`;
        toggleBtn.className = "btn-primary";
      } else {
        toggleBtn.innerHTML = `<i class="fas fa-layer-group"></i> Grouped Directory`;
        toggleBtn.className = "btn-secondary";
      }
      
      toggleBtn.addEventListener("click", async () => {
        window.isUserGroupedView = !window.isUserGroupedView;
        if (window.isUserGroupedView) {
          toggleBtn.innerHTML = `<i class="fas fa-table"></i> Flat List View`;
          toggleBtn.className = "btn-primary";
        } else {
          toggleBtn.innerHTML = `<i class="fas fa-layer-group"></i> Grouped Directory`;
          toggleBtn.className = "btn-secondary";
        }
        loadUsersTable();
      });
    }

    // Remove Assign Teacher button from flat list view

    if (hasUsersAccess) {
      document.getElementById("btn-add-user").addEventListener("click", async () => {
        const form = document.getElementById("user-form");
        if (form) form.reset();
        document.getElementById("edit-user-id").value = "";
        document.getElementById("user-modal-title").innerText = "Add New User";
        document.getElementById("user-photo-preview").src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
        window.populateUserRoleOptions(); // Limit roles for Academic Registrar
        window.populateUserClassSectionOptions();
        window.toggleConditionalUserFields("Student");
        window.showPortalModal("user-modal");
      });

      const userForm = document.getElementById("user-form");
      if (userForm) {
        const newUserForm = userForm.cloneNode(true);
        userForm.replaceWith(newUserForm);
        newUserForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          saveUser();
        });
      }
    }
  }

  else if (view === "courses") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div id="courses-tab-content">
          <!-- Loaded Dynamically -->
        </div>
      </div>
    `;

    loadCourseCatalogView(hasCoursesAccess);
  }

  else if (view === "classes") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div id="classes-tab-content">
          <!-- Loaded Dynamically -->
        </div>
      </div>
    `;

    loadClassesSectionsView(hasCoursesAccess);
  }

  else if (view === "enrollments") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <h3>Teacher Assignments</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Assign courses and class sections to teachers and academic staff.</p>
          </div>
          ${hasUsersAccess ? `
            <button class="btn-primary" id="btn-assign-teacher-modal" style="padding: 0.5rem 1rem;"><i class="fas fa-link"></i> Assign Teacher</button>
          ` : ""}
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Staff ID</th>
                <th>Assigned Course</th>
                <th>Assigned Class Sections</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="teacher-assignments-table-body">
              <!-- Loaded Dynamically -->
            </tbody>
          </table>
        </div>
      </div>

      <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
        <div id="classes-tab-content">
          <!-- Loaded Dynamically (Class Course Postings & Tracker) -->
        </div>
      </div>
    `;

    loadTeacherAssignmentsTable(hasUsersAccess);
    loadEnrollmentsPostingsView(hasCoursesAccess);

    const assignTeacherModalBtn = document.getElementById("btn-assign-teacher-modal");
    if (assignTeacherModalBtn) {
      assignTeacherModalBtn.addEventListener("click", async () => {
        window.assignTeacherModal();
      });
    }
  }

  else if (view === "calendar") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3>Academic Calendar Events</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Post and schedule official school dates, exams, holidays, and semester events.</p>
          </div>
          <button class="btn-primary" id="btn-add-calendar-event"><i class="fas fa-plus-circle"></i> Create Calendar Event</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Event Description</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="registrar-calendar-table">
              <!-- Dynamically Loaded -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    loadRegistrarCalendarTable();

    document.getElementById("btn-add-calendar-event").addEventListener("click", async () => {
      document.getElementById("calendar-event-form").reset();
      document.getElementById("calendar-event-id").value = "";
      document.getElementById("calendar-event-modal-title").innerText = "Post Calendar Event";
      window.showPortalModal("calendar-event-modal");
    });
  }

  else if (view === "settings") {
    const settings = await db.get("settings");
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 600px;">
        <h3>Portal Global Settings</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Configure details shown on the website and the portal footer.</p>
        <form id="settings-form">
          <div class="form-group">
            <label>School Name</label>
            <input type="text" id="settings-schoolname" class="form-control" value="${settings.schoolName}" ${hasSettingsAccess ? "" : "readonly"} required>
          </div>
          <div class="form-group">
            <label>Copyright Text</label>
            <input type="text" id="settings-copyright" class="form-control" value="${settings.copyright}" ${hasSettingsAccess ? "" : "readonly"} required>
          </div>
          <div class="form-group">
            <label>Academic Year Description</label>
            <input type="text" id="settings-academicyear" class="form-control" value="${settings.academicYear}" ${hasSettingsAccess ? "" : "readonly"} required>
          </div>
          
          <div class="form-group">
            <label>Church / School Location Address</label>
            <input type="text" id="settings-churchlocation" class="form-control" value="${settings.churchLocation || ''}" ${hasSettingsAccess ? "" : "readonly"} placeholder="e.g. Higa Town, Kambaata Zone, Ethiopia">
          </div>

          <div class="form-group">
            <label>Contact Email Support Address</label>
            <input type="text" id="settings-contactemail" class="form-control" value="${settings.contactEmail || ''}" ${hasSettingsAccess ? "" : "readonly"} placeholder="e.g. info@higaportal.edu.et | registrar@higaportal.edu.et">
          </div>

          <div class="form-group">
            <label>Telephone Contacts</label>
            <input type="text" id="settings-contactphone" class="form-control" value="${settings.contactPhone || ''}" ${hasSettingsAccess ? "" : "readonly"} placeholder="e.g. +251-46-211-1234 / +251-911-99-88-77">
          </div>

          <div class="form-group">
            <label>Google Map Embed URL / Location Search</label>
            <input type="text" id="settings-mapurl" class="form-control" value="${settings.googleMapEmbedUrl || ''}" ${hasSettingsAccess ? "" : "readonly"} placeholder="https://maps.google.com/maps?q=Higa+Town&output=embed">
            <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Paste Google Maps Embed iframe URL or address query link.</small>
          </div>

          <div class="form-group">
            <label>School Logo (URL or Upload File)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <img id="settings-logo-preview" src="${settings.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120'}" onerror="this.src='https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120'" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
              <input type="text" id="settings-logo" class="form-control" value="${settings.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120'}" placeholder="Paste URL or upload file..." style="flex: 1;" ${hasSettingsAccess ? "" : "readonly"}>
              ${hasSettingsAccess ? `
                <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0; height: 38px;">
                  <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
                  <input type="file" id="settings-logo-file" accept="image/*" style="display: none;">
                </label>
              ` : ""}
            </div>
          </div>
          
          <div class="form-group">
            <label>Higa Compound Image (URL or Upload File)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <img id="settings-higa-preview" src="${settings.higaCompoundImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'}" onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'" style="width: 48px; height: 48px; border-radius: 5px; object-fit: cover;">
              <input type="text" id="settings-higa" class="form-control" value="${settings.higaCompoundImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'}" placeholder="Paste URL or upload file..." style="flex: 1;" ${hasSettingsAccess ? "" : "readonly"}>
              ${hasSettingsAccess ? `
                <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0; height: 38px;">
                  <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
                  <input type="file" id="settings-higa-file" accept="image/*" style="display: none;">
                </label>
              ` : ""}
            </div>
          </div>

          <div class="form-group">
            <label>Background Image (URL or Upload File)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <img id="settings-bg-preview" src="${settings.backgroundImage || ''}" style="width: 48px; height: 48px; border-radius: 5px; object-fit: cover; background: #333;">
              <input type="text" id="settings-bg" class="form-control" value="${settings.backgroundImage || ''}" placeholder="Paste URL or upload file..." style="flex: 1;" ${hasSettingsAccess ? "" : "readonly"}>
              ${hasSettingsAccess ? `
                <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0; height: 38px;">
                  <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
                  <input type="file" id="settings-bg-file" accept="image/*" style="display: none;">
                </label>
              ` : ""}
            </div>
          </div>

          <!-- School Bank Accounts Section (8 Fields for Names & 8 Fields for Account Numbers) -->
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-primary);">
              <i class="fas fa-university" style="margin-right: 6px;"></i> School Bank Accounts (Up to 8 Accounts)
            </h4>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.25rem;">
              Enter school bank names and account numbers for tuition, boarding fees, and donations. Active accounts will be automatically listed in the website footer.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
              ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `
                <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem;">
                  <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--accent-primary);">
                    <i class="fas fa-credit-card"></i> Bank Account #${i}
                  </div>
                  <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label style="font-size: 0.78rem;">Bank Name #${i}</label>
                    <input type="text" id="settings-bank-${i}-name" class="form-control" value="${settings[`bank_${i}_name`] || ''}" placeholder="${i === 1 ? 'e.g. Commercial Bank of Ethiopia' : 'Bank Name'}" ${hasSettingsAccess ? "" : "readonly"}>
                  </div>
                  <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label style="font-size: 0.78rem;">Account Number #${i}</label>
                    <input type="text" id="settings-bank-${i}-account" class="form-control" value="${settings[`bank_${i}_account`] || ''}" placeholder="${i === 1 ? 'e.g. 1000123456789' : 'Account Number'}" ${hasSettingsAccess ? "" : "readonly"}>
                  </div>
                  <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.78rem;">Account Purpose / Description #${i}</label>
                    <input type="text" id="settings-bank-${i}-purpose" class="form-control" value="${settings[`bank_${i}_purpose`] || ''}" placeholder="${i === 1 ? 'e.g. Tuition & Boarding Fees / የትምህርት ክፍያ' : 'Account Purpose'}" ${hasSettingsAccess ? "" : "readonly"}>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Official Social Media Links Section -->
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-primary);">
              <i class="fas fa-share-alt" style="margin-right: 6px;"></i> Official Social Media Links
            </h4>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.25rem;">
              Configure URLs for social media icons displayed in the website footer.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem;">
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-facebook-f" style="color: #1877f2; margin-right: 4px;"></i> Facebook Page URL</label>
                <input type="url" id="settings-facebook-url" class="form-control" value="${settings.facebookUrl || ''}" placeholder="https://facebook.com/higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-telegram-plane" style="color: #0088cc; margin-right: 4px;"></i> Telegram Channel URL</label>
                <input type="url" id="settings-telegram-url" class="form-control" value="${settings.telegramUrl || ''}" placeholder="https://t.me/higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-linkedin-in" style="color: #0077b5; margin-right: 4px;"></i> LinkedIn Profile URL</label>
                <input type="url" id="settings-linkedin-url" class="form-control" value="${settings.linkedinUrl || ''}" placeholder="https://linkedin.com/company/higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-youtube" style="color: #ff0000; margin-right: 4px;"></i> YouTube Channel URL</label>
                <input type="url" id="settings-youtube-url" class="form-control" value="${settings.youtubeUrl || ''}" placeholder="https://youtube.com/@higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-instagram" style="color: #e4405f; margin-right: 4px;"></i> Instagram Profile URL</label>
                <input type="url" id="settings-instagram-url" class="form-control" value="${settings.instagramUrl || ''}" placeholder="https://instagram.com/higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-whatsapp" style="color: #25d366; margin-right: 4px;"></i> WhatsApp Link / Group</label>
                <input type="url" id="settings-whatsapp-url" class="form-control" value="${settings.whatsappUrl || ''}" placeholder="https://chat.whatsapp.com/..." ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-tiktok" style="color: #000; margin-right: 4px;"></i> TikTok Channel URL</label>
                <input type="url" id="settings-tiktok-url" class="form-control" value="${settings.tiktokUrl || ''}" placeholder="https://tiktok.com/@higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label style="font-size: 0.8rem;"><i class="fab fa-twitter" style="color: #1da1f2; margin-right: 4px;"></i> Twitter / X Profile URL</label>
                <input type="url" id="settings-twitter-url" class="form-control" value="${settings.twitterUrl || ''}" placeholder="https://twitter.com/higaschool" ${hasSettingsAccess ? "" : "readonly"}>
              </div>
            </div>
          </div>
          
          ${hasSettingsAccess ? `<button type="submit" class="btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-save"></i> Save Settings</button>` : `<span class="badge badge-warning">Read-Only Access</span>`}
        </form>
      </div>
    `;

    if (hasSettingsAccess) {
      document.getElementById("settings-logo-file").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          window.compressImage(file, 120, (compressedBase64) => {
            document.getElementById("settings-logo").value = compressedBase64;
            document.getElementById("settings-logo-preview").src = compressedBase64;
          });
        }
      });
      document.getElementById("settings-logo").addEventListener("input", async (e) => {
        document.getElementById("settings-logo-preview").src = e.target.value || "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=120";
      });

      document.getElementById("settings-higa-file").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          window.compressImage(file, 1200, (compressedBase64) => {
            document.getElementById("settings-higa").value = compressedBase64;
            document.getElementById("settings-higa-preview").src = compressedBase64;
          });
        }
      });
      document.getElementById("settings-higa").addEventListener("input", async (e) => {
        document.getElementById("settings-higa-preview").src = e.target.value || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200";
      });

      document.getElementById("settings-bg-file").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          window.compressImage(file, 1200, (compressedBase64) => {
            document.getElementById("settings-bg").value = compressedBase64;
            document.getElementById("settings-bg-preview").src = compressedBase64;
          });
        }
      });
      document.getElementById("settings-bg").addEventListener("input", async (e) => {
        document.getElementById("settings-bg-preview").src = e.target.value;
      });

      document.getElementById("settings-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const updated = {
          schoolName: document.getElementById("settings-schoolname").value,
          copyright: document.getElementById("settings-copyright").value,
          academicYear: document.getElementById("settings-academicyear").value,
          churchLocation: document.getElementById("settings-churchlocation").value,
          contactEmail: document.getElementById("settings-contactemail").value,
          contactPhone: document.getElementById("settings-contactphone").value,
          googleMapEmbedUrl: document.getElementById("settings-mapurl").value,
          logo: document.getElementById("settings-logo").value,
          higaCompoundImage: document.getElementById("settings-higa").value,
          backgroundImage: document.getElementById("settings-bg").value,
          // Social Media Links
          facebookUrl: document.getElementById("settings-facebook-url")?.value || '',
          telegramUrl: document.getElementById("settings-telegram-url")?.value || '',
          linkedinUrl: document.getElementById("settings-linkedin-url")?.value || '',
          youtubeUrl: document.getElementById("settings-youtube-url")?.value || '',
          instagramUrl: document.getElementById("settings-instagram-url")?.value || '',
          whatsappUrl: document.getElementById("settings-whatsapp-url")?.value || '',
          tiktokUrl: document.getElementById("settings-tiktok-url")?.value || '',
          twitterUrl: document.getElementById("settings-twitter-url")?.value || ''
        };
        // 8 Bank Accounts
        for (let i = 1; i <= 8; i++) {
          const bNameEl = document.getElementById(`settings-bank-${i}-name`);
          const bAccEl = document.getElementById(`settings-bank-${i}-account`);
          const bPurpEl = document.getElementById(`settings-bank-${i}-purpose`);
          if (bNameEl) updated[`bank_${i}_name`] = bNameEl.value;
          if (bAccEl) updated[`bank_${i}_account`] = bAccEl.value;
          if (bPurpEl) updated[`bank_${i}_purpose`] = bPurpEl.value;
        }
        try {
          await db.set("settings", updated);
          if (window.updateDynamicSettingsUI) {
            window.updateDynamicSettingsUI(updated);
          }
          alert("Settings saved to database successfully! Changes are now applied universally across all devices.");
          if (window.applyDynamicLogo) {
            await window.applyDynamicLogo();
          }
        } catch (err) {
          console.error("Failed to save settings to database:", err);
          alert("Failed to save settings to database: " + (err.message || err));
        }
      });
    }
  }

  else if (view === "announcements") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3>Bulletins & Announcements</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Publish notices and school newsletters. Expired events automatically timedout.</p>
          </div>
          ${hasAnnouncementsAccess ? `<button class="btn-primary" id="btn-add-announcement"><i class="fas fa-plus"></i> Post Announcement</button>` : `<span class="badge badge-warning">Read-Only Access</span>`}
        </div>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <button class="btn-secondary active" id="btn-ann-folder-active" style="padding: 0.4rem 1rem;">Active Announcements</button>
          <button class="btn-secondary" id="btn-ann-folder-expired" style="padding: 0.4rem 1rem;">Expired (Timedout List)</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Target</th>
                <th>Posted Date</th>
                <th>Expiry Date</th>
                ${hasAnnouncementsAccess ? `<th>Actions</th>` : ""}
              </tr>
            </thead>
            <tbody id="announcements-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.activeAnnFolder = "active";
    loadAnnouncementsTable(hasAnnouncementsAccess);

    document.getElementById("btn-ann-folder-active").addEventListener("click", async () => {
      document.getElementById("btn-ann-folder-active").classList.add("active");
      document.getElementById("btn-ann-folder-expired").classList.remove("active");
      window.activeAnnFolder = "active";
      loadAnnouncementsTable(hasAnnouncementsAccess);
    });

    document.getElementById("btn-ann-folder-expired").addEventListener("click", async () => {
      document.getElementById("btn-ann-folder-expired").classList.add("active");
      document.getElementById("btn-ann-folder-active").classList.remove("active");
      window.activeAnnFolder = "expired";
      loadAnnouncementsTable(hasAnnouncementsAccess);
    });

    if (hasAnnouncementsAccess) {
      document.getElementById("btn-add-announcement").addEventListener("click", async () => {
        document.getElementById("announcement-form").reset();
        document.getElementById("announcement-id").value = "";
        document.getElementById("announcement-modal-title").innerText = "Post Announcement";
        
        const thirtyDays = new Date();
        thirtyDays.setDate(thirtyDays.getDate() + 30);
        document.getElementById("announcement-expiry").value = thirtyDays.toISOString().split("T")[0];

        window.showPortalModal("announcement-modal");
      });

      document.getElementById("announcement-form").onsubmit = async (e) => {
        e.preventDefault();
        const annId = document.getElementById("announcement-id").value;
        const title = document.getElementById("announcement-title").value.trim();
        const target = document.getElementById("announcement-target").value;
        const expiry = document.getElementById("announcement-expiry").value;
        const content = document.getElementById("announcement-content").value.trim();

        if (title && expiry && content) {
          const announcements = await db.get("announcements");
          if (annId) {
            const updated = announcements.map(a => {
              if (a.id === annId) {
                a.title = title;
                a.target = target;
                a.expiryDate = expiry;
                a.content = content;
              }
              return a;
            });
            await db.set("announcements", updated);
            alert("Announcement updated.");
          } else {
            announcements.push({
              id: "ann-" + Date.now(),
              title,
              content,
              target,
              date: new Date().toISOString().split("T")[0],
              expiryDate: expiry
            });
            await db.set("announcements", announcements);
            alert("Announcement published successfully.");
          }
          window.hidePortalModal("announcement-modal");
          loadAnnouncementsTable(true);
        }
      };
    }
  }

  else if (view === "grades") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3>Official Grades Registry</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">View transcripts, final scores, and reports approved by the School Principal.</p>
          </div>
          <input type="text" id="search-grades" class="form-control" placeholder="Search by Student ID or Course..." style="width: 280px;">
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Course Code</th>
                <th>Semester</th>
                <th>Assessment (30)</th>
                <th>Final Exam (70)</th>
                <th>Total (100)</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="registrar-grades-table">
              <!-- Dynamically Loaded -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    loadRegistrarGradesTable();
    document.getElementById("search-grades").addEventListener("input", loadRegistrarGradesTable);
  }

  else if (view === "ranking") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3><i class="fas fa-calculator" style="color: var(--accent-primary);"></i> Grade Calculation & Student Ranking</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Filter students by section & semester, calculate section ranks, and export ranking reports.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-primary" id="btn-calc-sem1"><i class="fas fa-calculator"></i> Calc Sem 1 Ranks</button>
            <button class="btn-primary" id="btn-calc-sem2"><i class="fas fa-calculator"></i> Calc Sem 2 Ranks</button>
            <button class="btn-primary" id="btn-calc-yearly" style="background: var(--accent-success);"><i class="fas fa-trophy"></i> Calc Yearly Ranks</button>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; background: rgba(0,0,0,0.03); padding: 1rem; border-radius: var(--radius-sm);">
          <div style="flex: 2; min-width: 200px;">
            <label style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">SEARCH STUDENT</label>
            <input type="text" id="ranking-search" class="form-control" placeholder="Search student name or ID...">
          </div>
          <div style="flex: 1.5; min-width: 160px;">
            <label style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">CLASS SECTION</label>
            <select id="ranking-filter-class" class="form-control">
              <option value="all">All Class Sections</option>
            </select>
          </div>
          <div style="flex: 1.5; min-width: 160px;">
            <label style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">SEMESTER / PERIOD</label>
            <select id="ranking-filter-semester" class="form-control">
              <option value="all">Both Semesters & Yearly (All)</option>
              <option value="1">First Semester (Sem 1)</option>
              <option value="2">Second Semester (Sem 2)</option>
            </select>
          </div>
          <div style="flex: 1.5; min-width: 140px;">
            <label style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">BATCH (YEAR)</label>
            <select id="ranking-filter-batch" class="form-control">
              <option value="all">All Batches</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
          <h4 id="ranking-table-heading" style="font-size: 0.95rem; margin: 0; color: var(--accent-primary);"><i class="fas fa-list-ol"></i> Student Rankings List</h4>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-secondary" id="btn-export-rank-csv" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fas fa-file-csv" style="color: var(--accent-success);"></i> Export CSV</button>
            <button class="btn-secondary" id="btn-export-rank-word" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fas fa-file-word" style="color: #2b579a;"></i> Export Word</button>
            <button class="btn-secondary" id="btn-export-rank-pdf" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fas fa-file-pdf" style="color: var(--accent-danger);"></i> Export PDF / Print</button>
            <button class="btn-secondary" id="btn-print-rank" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fas fa-print"></i> Print Window</button>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead id="ranking-table-head">
              <!-- Rendered Dynamically -->
            </thead>
            <tbody id="ranking-table-body">
              <!-- Dynamically Loaded -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.loadRankingTable();

    document.getElementById("btn-calc-sem1").addEventListener("click", async () => {
      window.calculateRanks(1);
    });
    document.getElementById("btn-calc-sem2").addEventListener("click", async () => {
      window.calculateRanks(2);
    });
    document.getElementById("btn-calc-yearly").addEventListener("click", async () => {
      window.calculateYearlyRanks();
    });

    document.getElementById("btn-export-rank-csv").addEventListener("click", () => window.exportRankingToCSV());
    document.getElementById("btn-export-rank-word").addEventListener("click", () => window.exportRankingToWord());
    document.getElementById("btn-export-rank-pdf").addEventListener("click", () => window.printRankingReport());
    document.getElementById("btn-print-rank").addEventListener("click", () => window.printRankingReport());
  }

  else if (view === "rights" && isMain) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3>Staff Rights & Status</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Activate/disable staff accounts and manage specific access rights (Teachers, Principals, Managers, Registrars).</p>
          </div>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Assigned Rights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admins-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    loadAdminsTable();

    document.getElementById("btn-create-admin").addEventListener("click", async () => {
      window.createAdmin();
    });

    document.getElementById("manage-rights-form").onsubmit = async (e) => {
      e.preventDefault();
      const adminId = document.getElementById("manage-rights-user-id").value;
      const rights = [];
      if (document.getElementById("right-users").checked) rights.push("users");
      if (document.getElementById("right-courses").checked) rights.push("courses");
      if (document.getElementById("right-settings").checked) rights.push("settings");
      if (document.getElementById("right-announcements").checked) rights.push("announcements");

      const users = await db.get("users");
      let updatedUser = null;
      const updated = users.map(u => {
        if (u.id === adminId) {
          u.rights = rights;
          u.privileges = rights.length === 4 ? "full" : "partial";
          updatedUser = u;
        }
        return u;
      });
      await db.set("users", updated);
      
      // If the edited admin is the current logged-in user, update their session
      const currentLoggedIn = JSON.parse(localStorage.getItem("higa_current_user"));
      if (currentLoggedIn && currentLoggedIn.id === adminId) {
        localStorage.setItem("higa_current_user", JSON.stringify(updatedUser));
        import('../auth.js').then(module => {
          module.auth.loadUserDashboard(updatedUser);
        });
      }

      window.hidePortalModal("manage-rights-modal");
      alert("Academic Registrar rights updated successfully.");
      loadAdminsTable();
    };
  }

  else if (view === "gallery") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3>Gallery & Events</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Manage special moments, trainings, inaugurations, and graduations posted on the homepage.</p>
          </div>
          <button class="btn-primary" id="btn-add-moment"><i class="fas fa-plus"></i> Post New Moment</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title & Category</th>
                <th>Description</th>
                <th>Author</th>
                <th>Date Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="moments-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    window.loadGalleryMomentsTable();
    document.getElementById("btn-add-moment").addEventListener("click", async () => {
      document.getElementById("moment-form").reset();
      document.getElementById("moment-id").value = "";
      document.getElementById("moment-modal-title").innerText = "Post Special Moment / Event";
      window.showPortalModal("gallery-moment-modal");
    });
  }

  else if (view === "programs" && isMain) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3>Academic Programs</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Manage the educational tracks and curriculums visible on the public portal.</p>
          </div>
          <button class="btn-primary" id="btn-add-program"><i class="fas fa-plus"></i> Add Program</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Program Title</th>
                <th>Duration</th>
                <th>Requirements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="programs-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    window.loadProgramsTable();
    document.getElementById("btn-add-program").addEventListener("click", async () => {
      document.getElementById("program-form").reset();
      document.getElementById("program-id").value = "";
      document.getElementById("program-modal-title").innerText = "Publish Academic Program";
      window.showPortalModal("program-modal");
    });
  }

  else if (view === "vacancies" && isMain) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3>Vacancies & News</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Manage job vacancies, exam calls, interview schedules, and applicant results.</p>
          </div>
          <button class="btn-primary" id="btn-add-vacancy"><i class="fas fa-plus"></i> Publish Vacancy</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title & Application Days</th>
                <th>Exam & Interview Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="vacancies-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    window.loadVacanciesTable();
    document.getElementById("btn-add-vacancy").addEventListener("click", async () => {
      document.getElementById("vacancy-form").reset();
      document.getElementById("vacancy-id").value = "";
      document.getElementById("vacancy-modal-title").innerText = "Publish Vacancy & News";
      window.showPortalModal("vacancy-modal");
    });
  }

  else if (view === "vacancy-results" && isMain) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3>Examinee Results</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Manage written exam and interview scores for candidates separately.</p>
          </div>
          <button class="btn-primary" id="btn-add-result" style="display: none;"><i class="fas fa-plus"></i> Add Examinee Result</button>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">Select Vacancy / Exam Call:</label>
          <select id="vr-vacancy-select" class="form-control" style="max-width: 500px;" onchange="window.selectVacancyForResults(this.value)">
            <option value="">-- Choose Vacancy --</option>
          </select>
        </div>

        <div id="vacancy-results-view" style="display: none;">
          <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;" id="ats-filter-tabs">
            <button class="btn-primary" onclick="window.setVacancyResultFilter('All')">All Applicants</button>
            <button class="btn-secondary" onclick="window.setVacancyResultFilter('Pending')">Registered / Pending</button>
            <button class="btn-secondary" onclick="window.setVacancyResultFilter('Passed')">Passed</button>
            <button class="btn-secondary" onclick="window.setVacancyResultFilter('Failed')">Failed</button>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Examinee Name</th>
                  <th>Written Exam Score</th>
                  <th>Interview Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="vacancy-results-table-body">
                <!-- Rendered Dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Populate select
    const vacancies = await db.get("vacancies") || [];
    const select = document.getElementById("vr-vacancy-select");
    vacancies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(v => {
      select.innerHTML += `<option value="${v.id}">${v.title} (${v.type})</option>`;
    });

    document.getElementById("btn-add-result").addEventListener("click", async () => {
      if (!window.activeVacancyId) return;
      document.getElementById("vacancy-result-form").reset();
      document.getElementById("vr-id").value = "";
      document.getElementById("vr-vacancy-id").value = window.activeVacancyId;
      document.getElementById("vacancy-result-modal-title").innerText = "Add Examinee Result";
      window.showPortalModal("vacancy-result-modal");
    });
  }

  else if (view === "alumni") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3>Alumni Records</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Manage grade 12 graduated students, university joined, and entrance exam scores.</p>
          </div>
          <button class="btn-primary" id="btn-add-alumni"><i class="fas fa-plus"></i> Add Alumni Record</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Grad Year</th>
                <th>Entrance Score</th>
                <th>University</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="alumni-table-body">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    window.loadAlumniRecordsTable();
    document.getElementById("btn-add-alumni").addEventListener("click", async () => {
      document.getElementById("alumni-form").reset();
      document.getElementById("alumni-id").value = "";
      document.getElementById("alumni-modal-title").innerText = "Record Graduating Alumni";
      window.showPortalModal("alumni-record-modal");
    });
  }

}

async function loadUsersSummary() {
  const users = await db.get("users");
  const content = document.getElementById("users-summary-content");
  if (!content) return;

  const studentBatches = {};
  const studentSections = {};
  const staffCategories = {};

  users.forEach(u => {
    if (u.role === "Student") {
      const b = u.batch || "N/A";
      studentBatches[b] = (studentBatches[b] || 0) + 1;

      const s = u.classSection || "Unassigned";
      studentSections[s] = (studentSections[s] || 0) + 1;
    } else {
      const r = u.role.replace(/([A-Z])/g, ' $1').trim();
      staffCategories[r] = (staffCategories[r] || 0) + 1;
    }
  });

  let batchHtml = "<div><h5 style='margin-bottom:0.5rem; color:var(--accent-primary);'>Students by Batch</h5><ul style='list-style: none; padding: 0;'>";
  Object.entries(studentBatches).forEach(([b, count]) => {
    batchHtml += `<li style='margin-bottom: 0.3rem;'>Batch ${b}: <strong>${count}</strong></li>`;
  });
  batchHtml += "</ul></div>";

  let sectionHtml = "<div><h5 style='margin-bottom:0.5rem; color:var(--accent-primary);'>Students by Section</h5><ul style='list-style: none; padding: 0;'>";
  Object.entries(studentSections).forEach(([s, count]) => {
    sectionHtml += `<li style='margin-bottom: 0.3rem;'>${s}: <strong>${count}</strong></li>`;
  });
  sectionHtml += "</ul></div>";

  let staffHtml = "<div><h5 style='margin-bottom:0.5rem; color:var(--accent-primary);'>Staff by Role</h5><ul style='list-style: none; padding: 0;'>";
  Object.entries(staffCategories).forEach(([r, count]) => {
    staffHtml += `<li style='margin-bottom: 0.3rem;'>${r}: <strong>${count}</strong></li>`;
  });
  staffHtml += "</ul></div>";

  content.innerHTML = batchHtml + sectionHtml + staffHtml;
}

function renderPasswordResetRequestsCard(users) {
  const requests = users.filter(u => u.passwordResetRequested || u.password_reset_requested);
  if (requests.length === 0) return "";

  return `
    <div style="margin-bottom: 2rem;">
      <div class="glass-card" style="padding: 1.25rem; border-left: 4px solid var(--accent-warning); background: rgba(255, 193, 7, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h5 style="color: var(--accent-warning); margin: 0; font-size: 1.05rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-triangle"></i> Pending Password Reset Requests (${requests.length} Pending)
          </h5>
          <span class="badge badge-warning">Action Required</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
          The following users submitted a password reset request because they forgot their password:
        </p>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                <th style="padding: 0.5rem 0.75rem;">User</th>
                <th style="padding: 0.5rem 0.75rem;">ID / Username</th>
                <th style="padding: 0.5rem 0.75rem;">Role</th>
                <th style="padding: 0.5rem 0.75rem;">Request Date</th>
                <th style="padding: 0.5rem 0.75rem;">Reason / Notes</th>
                <th style="padding: 0.5rem 0.75rem; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${requests.map(u => `
                <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                  <td style="padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${u.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
                    <strong>${u.name}</strong>
                  </td>
                  <td style="padding: 0.5rem 0.75rem;"><code>${u.id}</code></td>
                  <td style="padding: 0.5rem 0.75rem;">${u.role}</td>
                  <td style="padding: 0.5rem 0.75rem;">${u.resetRequestDate ? new Date(u.resetRequestDate).toLocaleString() : 'Recently'}</td>
                  <td style="padding: 0.5rem 0.75rem;">${u.resetRequestNotes || 'Forgot password'}</td>
                  <td style="padding: 0.5rem 0.75rem; text-align: right;">
                    <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; margin-right: 0.35rem;" onclick="approvePasswordReset('${u.id}')"><i class="fas fa-key"></i> Reset to Default</button>
                    <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--accent-danger);" onclick="rejectPasswordReset('${u.id}')"><i class="fas fa-times"></i> Dismiss</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

async function loadGroupedUsersView() {
  const query = document.getElementById("search-users") ? document.getElementById("search-users").value.toLowerCase() : "";
  const users = await db.get("users");
  const tableContainer = document.querySelector(".table-responsive");
  if (!tableContainer) return;

  const activeTab = window.activeUserRoleTab || "all";
  
  const batchFilter = document.getElementById("filter-student-batch") ? document.getElementById("filter-student-batch").value : "all";
  const sectionFilter = document.getElementById("filter-student-section") ? document.getElementById("filter-student-section").value : "all";
  const staffRoleFilter = document.getElementById("filter-staff-role") ? document.getElementById("filter-staff-role").value : "all";

  // Filter students
  const studentsFiltered = users.filter(u => {
    if (u.role !== "Student") return false;
    const nameLower = (u.name || "").toLowerCase();
    const idLower = (u.id || "").toLowerCase();
    const matchesQuery = idLower.includes(query) || nameLower.includes(query);
    let matchesTab = activeTab === "all" || activeTab === "Students";
    if (batchFilter !== "all" && String(u.batch || "") !== batchFilter) matchesTab = false;
    if (sectionFilter !== "all" && (u.classSection || "") !== sectionFilter) matchesTab = false;
    return matchesQuery && matchesTab;
  });

  // Filter staff
  const staffFiltered = users.filter(u => {
    if (u.role === "Student" || u.role === "MainRegistrar" || u.role === "AcademicRegistrar") return false;
    const nameLower = (u.name || "").toLowerCase();
    const idLower = (u.id || "").toLowerCase();
    const matchesQuery = idLower.includes(query) || nameLower.includes(query);
    
    let matchesTab = true;
    if (activeTab !== "all") {
      if (activeTab === "Principals") {
        matchesTab = u.role === "Principal" || u.role === "VicePrincipal";
      } else if (activeTab === "Managers") {
        matchesTab = u.role === "Manager" || u.role === "ViceManager";
      } else if (activeTab === "Teachers") {
        matchesTab = u.role === "Teacher";
      } else if (activeTab === "Other Staff") {
        const otherRoles = ["Guardian", "Librarian", "Dormitory", "BookStore", "SchoolStore", "Cafeteria", "IT_Technician", "ChemistryLab", "PhysicsLab", "Drawing"];
        matchesTab = otherRoles.includes(u.role);
        if (staffRoleFilter !== "all" && u.role !== staffRoleFilter) matchesTab = false;
      } else {
        matchesTab = false;
      }
    }
    return matchesQuery && matchesTab;
  });

  let html = renderPasswordResetRequestsCard(users);

  if (studentsFiltered.length > 0) {
    html += `<h4 style="margin-top: 1rem; margin-bottom: 1.25rem; color: var(--accent-primary); border-bottom: 2px solid var(--accent-primary); padding-bottom: 0.5rem; font-size: 1.1rem;"><i class="fas fa-user-graduate"></i> Student Batches & Sections Directory</h4>`;

    // Group students by batch, then by section
    const batches = {};
    studentsFiltered.forEach(s => {
      const b = s.batch || "Unspecified Batch";
      if (!batches[b]) batches[b] = {};
      
      const sec = s.classSection || "Unassigned Section";
      if (!batches[b][sec]) batches[b][sec] = [];
      batches[b][sec].push(s);
    });

    Object.entries(batches).forEach(([batchName, sections]) => {
      html += `<div style="margin-bottom: 2rem;">
        <h5 style="color: var(--text-primary); margin-bottom: 0.75rem; font-size: 1rem;"><i class="fas fa-layer-group"></i> Batch Year: ${batchName}</h5>`;
      
      Object.entries(sections).forEach(([secName, list]) => {
        html += `
          <div class="glass-card" style="padding: 1.25rem; margin-bottom: 1.25rem; border-left: 4px solid var(--accent-primary);">
            <h6 style="color: var(--accent-primary); margin-bottom: 0.75rem; font-size: 0.92rem; font-weight: 600;">
              <i class="fas fa-chevron-right"></i> Section ${secName} (${list.length} Student${list.length > 1 ? 's' : ''})
            </h6>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                    <th style="padding: 0.5rem 0.75rem;">Full Name / Photo</th>
                    <th style="padding: 0.5rem 0.75rem;">Student ID</th>
                    <th style="padding: 0.5rem 0.75rem;">Gender</th>
                    <th style="padding: 0.5rem 0.75rem;">Nationality</th>
                    <th style="padding: 0.5rem 0.75rem;">Status</th>
                    <th style="padding: 0.5rem 0.75rem; text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map(u => {
                    const activeBadge = u.isActive !== false ? `<span class="badge badge-success">Active</span>` : `<span class="badge badge-danger">Disabled</span>`;
                    return `
                      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                        <td style="padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
                          <img src="${u.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);">
                          <span style="font-weight: 500;">${u.name}</span>
                        </td>
                        <td style="padding: 0.5rem 0.75rem;"><code>${u.id}</code></td>
                        <td style="padding: 0.5rem 0.75rem;">${u.gender}</td>
                        <td style="padding: 0.5rem 0.75rem;">${u.nationality || 'Ethiopian'}</td>
                        <td style="padding: 0.5rem 0.75rem;">${activeBadge}</td>
                        <td style="padding: 0.5rem 0.75rem; text-align: right;">
                          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
                            <button class="btn-icon-sm" onclick="window.viewUserProfile('${u.id}')" title="View Profile Details"><i class="fas fa-eye"></i></button>
                            <button class="btn-icon-sm" style="color: ${u.isActive !== false ? 'var(--accent-danger)' : 'var(--accent-primary)'};" onclick="window.toggleUserActiveStatus('${u.id}')" title="${u.isActive !== false ? 'Revoke Access (Deactivate)' : 'Grant Access (Activate)'}"><i class="fas ${u.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}"></i></button>
                            <button class="btn-icon-sm" onclick="editUser('${u.id}')" title="Edit Profile"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon-sm" onclick="resetUserPassword('${u.id}')" title="Reset Default Password"><i class="fas fa-key"></i></button>
                            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteUser('${u.id}')" title="Delete User"><i class="fas fa-trash-alt"></i></button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    });
  }

  if (staffFiltered.length > 0) {
    html += `<h4 style="margin-top: 2rem; margin-bottom: 1.25rem; color: var(--accent-secondary); border-bottom: 2px solid var(--accent-secondary); padding-bottom: 0.5rem; font-size: 1.1rem;"><i class="fas fa-user-shield"></i> Staff Sub-Roles Directory</h4>`;

    // Group staff by role
    const staffRoles = {};
    staffFiltered.forEach(s => {
      const r = s.role;
      if (!staffRoles[r]) staffRoles[r] = [];
      staffRoles[r].push(s);
    });

    Object.entries(staffRoles).forEach(([roleName, list]) => {
      const displayRole = roleName.replace(/([A-Z])/g, ' $1').trim();
      html += `
        <div class="glass-card" style="padding: 1.25rem; margin-bottom: 1.25rem; border-left: 4px solid var(--accent-secondary);">
          <h6 style="color: var(--accent-secondary); margin-bottom: 0.75rem; font-size: 0.92rem; font-weight: 600;">
            <i class="fas fa-chevron-right"></i> ${displayRole} (${list.length} Staff Member${list.length > 1 ? 's' : ''})
          </h6>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                  <th style="padding: 0.5rem 0.75rem;">Full Name / Photo</th>
                  <th style="padding: 0.5rem 0.75rem;">Staff ID (Username)</th>
                  <th style="padding: 0.5rem 0.75rem;">Gender</th>
                  <th style="padding: 0.5rem 0.75rem;">Status</th>
                  <th style="padding: 0.5rem 0.75rem; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(u => {
                  const activeBadge = u.isActive !== false ? `<span class="badge badge-success">Active</span>` : `<span class="badge badge-danger">Disabled</span>`;
                  const isTeacherRole = u.role === "Teacher" || u.role === "ChemistryLab" || u.role === "PhysicsLab" || u.role === "Drawing" || u.role === "IT_Technician";
                  let nameCol = `
                    <img src="${u.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);">
                    <div style="display: flex; flex-direction: column; text-align: left;">
                      <span style="font-weight: 500;">${u.name}</span>
                  `;
                  if (isTeacherRole) {
                    const subject = u.assignedSubject || "";
                    const sections = u.assignedSections && u.assignedSections.length > 0 ? u.assignedSections.join(", ") : "";
                    if (subject || sections) {
                      nameCol += `<span style="font-size: 0.72rem; color: var(--accent-primary); font-weight: 500;">Teaches: ${subject || "General"}${sections ? " in " + sections : ""}</span>`;
                    }
                  }
                  nameCol += `</div>`;

                  return `
                    <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                      <td style="padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
                        ${nameCol}
                      </td>
                      <td style="padding: 0.5rem 0.75rem;"><code>${u.id}</code></td>
                      <td style="padding: 0.5rem 0.75rem;">${u.gender}</td>
                      <td style="padding: 0.5rem 0.75rem;">${activeBadge}</td>
                      <td style="padding: 0.5rem 0.75rem; text-align: right;">
                        <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
                          <button class="btn-icon-sm" onclick="window.viewUserProfile('${u.id}')" title="View Profile Details"><i class="fas fa-eye"></i></button>
                          <button class="btn-icon-sm" style="color: ${u.isActive !== false ? 'var(--accent-danger)' : 'var(--accent-primary)'};" onclick="window.toggleUserActiveStatus('${u.id}')" title="${u.isActive !== false ? 'Revoke Access (Deactivate)' : 'Grant Access (Activate)'}"><i class="fas ${u.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}"></i></button>
                          ${isTeacherRole ? `<button class="btn-icon-sm" style="color: var(--accent-primary);" onclick="window.assignTeacherModal('${u.id}')" title="Assign Course & Section"><i class="fas fa-link"></i></button>` : ""}
                          <button class="btn-icon-sm" onclick="editUser('${u.id}')" title="Edit Profile"><i class="fas fa-edit"></i></button>
                          <button class="btn-icon-sm" onclick="resetUserPassword('${u.id}')" title="Reset Default Password"><i class="fas fa-key"></i></button>
                          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteUser('${u.id}')" title="Delete User"><i class="fas fa-trash-alt"></i></button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });
  }

  if (studentsFiltered.length === 0 && staffFiltered.length === 0) {
    tableContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 3rem; font-size: 0.95rem;">No matching grouped records found.</div>`;
  } else {
    tableContainer.innerHTML = html;
  }
}

async function loadUsersTable() {
  if (window.isUserGroupedView) {
    loadGroupedUsersView();
    return;
  }

  const tableContainer = document.querySelector(".table-responsive");
  if (tableContainer && !tableContainer.querySelector("table")) {
    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Profile</th>
            <th>User ID</th>
            <th>Role</th>
            <th>Gender</th>
            <th>Default Password</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="users-table-body">
          <!-- Rendered Dynamically -->
        </tbody>
      </table>
    `;
  }

  const query = document.getElementById("search-users") ? document.getElementById("search-users").value.toLowerCase() : "";
  const users = await db.get("users");
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;

  // Render pending reset requests banner above table
  let reqBanner = document.getElementById("users-reset-requests-banner");
  const requestsCardHtml = renderPasswordResetRequestsCard(users);
  if (requestsCardHtml) {
    if (!reqBanner && tableContainer) {
      reqBanner = document.createElement("div");
      reqBanner.id = "users-reset-requests-banner";
      tableContainer.parentNode.insertBefore(reqBanner, tableContainer);
    }
    if (reqBanner) reqBanner.innerHTML = requestsCardHtml;
  } else if (reqBanner) {
    reqBanner.innerHTML = "";
  }

  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasUsersAccess = isMain || (currentUser.rights && currentUser.rights.includes("users"));

  tbody.innerHTML = "";

  const activeTab = window.activeUserRoleTab || "all";

  const batchFilter = document.getElementById("filter-student-batch") ? document.getElementById("filter-student-batch").value : "all";
  const sectionFilter = document.getElementById("filter-student-section") ? document.getElementById("filter-student-section").value : "all";
  const staffRoleFilter = document.getElementById("filter-staff-role") ? document.getElementById("filter-staff-role").value : "all";

  const filtered = users.filter(u => {
    const nameLower = (u.name || "").toLowerCase();
    const idLower = (u.id || "").toLowerCase();
    const matchesQuery = idLower.includes(query) || nameLower.includes(query);
    
    let matchesTab = true;
    if (activeTab !== "all") {
      if (activeTab === "Registrars") {
        matchesTab = u.role === "MainRegistrar" || u.role === "AcademicRegistrar";
      } else if (activeTab === "Principals") {
        matchesTab = u.role === "Principal" || u.role === "VicePrincipal";
      } else if (activeTab === "Managers") {
        matchesTab = u.role === "Manager" || u.role === "ViceManager";
      } else if (activeTab === "Teachers") {
        matchesTab = u.role === "Teacher";
      } else if (activeTab === "Students") {
        matchesTab = u.role === "Student";
        if (batchFilter !== "all" && String(u.batch || "") !== batchFilter) matchesTab = false;
        if (sectionFilter !== "all" && (u.classSection || "") !== sectionFilter) matchesTab = false;
      } else if (activeTab === "Other Staff") {
        const otherRoles = ["Guardian", "Librarian", "Dormitory", "BookStore", "SchoolStore", "Cafeteria", "IT_Technician", "ChemistryLab", "PhysicsLab", "Drawing"];
        matchesTab = otherRoles.includes(u.role);
        if (staffRoleFilter !== "all" && u.role !== staffRoleFilter) matchesTab = false;
      }
    }
    return matchesQuery && matchesTab;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary);">No matching users found in this tab.</td></tr>`;
    return;
  }

  filtered.forEach(u => {
    const createdDate = new Date(u.created_at).toLocaleDateString();
    const subroleDisplay = u.role.replace(/([A-Z])/g, ' $1').trim();
    const activeBadge = u.isActive !== false ? `<span class="badge badge-success">Active</span>` : `<span class="badge badge-danger">Inactive</span>`;
    
    const isTeacherRole = u.role === "Teacher" || u.role === "ChemistryLab" || u.role === "PhysicsLab" || u.role === "Drawing" || u.role === "IT_Technician";
    let roleCell = `<span class="badge badge-info">${subroleDisplay}</span>`;
    if (isTeacherRole) {
      const subject = u.assignedSubject || "";
      const sections = u.assignedSections && u.assignedSections.length > 0 ? u.assignedSections.join(", ") : "";
      if (subject || sections) {
        roleCell += `<br><span style="font-size: 0.72rem; color: var(--accent-primary); font-weight: 500;">(${subject || "General"}${sections ? " in " + sections : ""})</span>`;
      }
    }

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <img src="${u.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
            <span>${u.name}</span>
          </div>
        </td>
        <td><code>${u.id}</code></td>
        <td>${roleCell}</td>
        <td>${u.gender}</td>
        <td><code>${u.defaultPassword}</code></td>
        <td>${activeBadge}</td>
        <td>${createdDate}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-icon-sm" onclick="window.viewUserProfile('${u.id}')" title="View Profile Details"><i class="fas fa-eye"></i></button>
            ${hasUsersAccess ? `
              ${isTeacherRole ? `<button class="btn-icon-sm" style="color: var(--accent-primary);" onclick="window.assignTeacherModal('${u.id}')" title="Assign Course & Section"><i class="fas fa-link"></i></button>` : ""}
              <button class="btn-icon-sm" style="color: ${u.isActive !== false ? 'var(--accent-danger)' : 'var(--accent-primary)'};" onclick="window.toggleUserActiveStatus('${u.id}')" title="${u.isActive !== false ? 'Revoke Access (Deactivate)' : 'Grant Access (Activate)'}"><i class="fas ${u.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}"></i></button>
              <button class="btn-icon-sm" onclick="editUser('${u.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-icon-sm" style="color: var(--accent-warning);" onclick="resetUserPassword('${u.id}')" title="Reset Default Password"><i class="fas fa-undo"></i></button>
              <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteUser('${u.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
            ` : ""}
          </div>
        </td>
      </tr>
    `;
  });
}

function loadCourseCatalogView(hasCoursesAccess) {
  const content = document.getElementById("courses-tab-content");
  if (!content) return;

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h3>Course Catalog</h3>
      ${hasCoursesAccess ? `<button class="btn-primary" id="btn-add-course"><i class="fas fa-plus"></i> Add Course</button>` : ""}
    </div>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Grade Level</th>
            <th>Semester</th>
            <th>Credits</th>
            ${hasCoursesAccess ? `<th>Actions</th>` : ""}
          </tr>
        </thead>
        <tbody id="courses-table-body">
          <!-- Rendered Dynamically -->
        </tbody>
      </table>
    </div>
  `;
  
  loadCoursesTable(hasCoursesAccess);

  if (hasCoursesAccess) {
    document.getElementById("btn-add-course").addEventListener("click", async () => {
      const title = document.getElementById("course-modal").querySelector("h4");
      if (title) title.innerText = "Add New Course";
      document.getElementById("edit-course-original-code").value = "";
      document.getElementById("course-form").reset();
      window.showPortalModal("course-modal");
    });

    const courseForm = document.getElementById("course-form");
    if (courseForm) {
      const newForm = courseForm.cloneNode(true);
      courseForm.replaceWith(newForm);
      newForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const originalCode = document.getElementById("edit-course-original-code").value;
        const code = document.getElementById("course-code").value.trim();
        const name = document.getElementById("course-name").value.trim();
        const grade = parseInt(document.getElementById("course-grade").value);
        const credits = parseInt(document.getElementById("course-credits").value);
        const semester = parseInt(document.getElementById("course-semester").value || "1");

        if (code && name && grade && credits && semester) {
          const courses = await db.get("courses") || [];

          if (originalCode) {
            // Edit Mode
            if (code !== originalCode && courses.some(c => c.code === code)) {
              alert(`Course with code ${code} already exists!`);
              return;
            }

            const updatedCourses = courses.map(c => {
              if (c.code === originalCode) {
                return { code, name, grade, credits, semester };
              }
              return c;
            });
            await db.set("courses", updatedCourses);

            // Update references if course code changed
            if (code !== originalCode) {
              const classCourses = await db.get("class_courses") || [];
              const updatedCC = classCourses.map(cc => {
                if (cc.course_code === originalCode) cc.course_code = code;
                return cc;
              });
              await db.set("class_courses", updatedCC);

              const grades = await db.get("grades") || [];
              const updatedGrades = grades.map(g => {
                if (g.course_id === originalCode) g.course_id = code;
                return g;
              });
              await db.set("grades", updatedGrades);

              const users = await db.get("users") || [];
              const updatedUsers = users.map(u => {
                if (u.role === "Student" && u.registeredCourses) {
                  u.registeredCourses = u.registeredCourses.map(rc => rc === originalCode ? code : rc);
                }
                if (u.role === "Teacher" && u.assignedSubject === originalCode) {
                  u.assignedSubject = code;
                }
                return u;
              });
              await db.set("users", updatedUsers);
            }

            alert("Course details updated successfully.");
          } else {
            // Add Mode
            if (courses.some(c => c.code === code)) {
              alert(`Course with code ${code} already exists!`);
              return;
            }
            courses.push({ code, name, grade, credits, semester });
            await db.set("courses", courses);
            alert("New course added successfully.");
          }

          window.hidePortalModal("course-modal");
          loadCourseCatalogView(true);
        }
      });
    }
  }
}

function loadClassesSectionsView(hasCoursesAccess) {
  const content = document.getElementById("classes-tab-content");
  if (!content) return;

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h3>Classes & Sections</h3>
      ${hasCoursesAccess ? `
        <form id="class-add-form" style="display: flex; gap: 0.5rem; align-items: center;">
          <input type="text" id="class-name" class="form-control" placeholder="Class Name (e.g. 10-B)" required style="width: 200px;">
          <input type="number" id="class-grade" class="form-control" placeholder="Grade Level" min="9" max="12" required style="width: 120px;">
          <button type="submit" class="btn-primary" style="white-space: nowrap;"><i class="fas fa-plus"></i> Create Class</button>
        </form>
      ` : ""}
    </div>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Grade Level</th>
            <th>Created At</th>
            ${hasCoursesAccess ? `<th>Actions</th>` : ""}
          </tr>
        </thead>
        <tbody id="classes-table-body">
          <!-- Loaded Dynamically -->
        </tbody>
      </table>
    </div>
  `;

  loadClassesTable(hasCoursesAccess);

  if (hasCoursesAccess) {
    document.getElementById("class-add-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("class-name").value.trim();
      const grade = parseInt(document.getElementById("class-grade").value);

      if (name && grade) {
        const classes = await db.get("classes");
        if (classes.some(c => c.name.toLowerCase() === name.toLowerCase())) {
          alert(`Class section "${name}" already exists!`);
          return;
        }

        const newId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1;
        classes.push({
          id: newId,
          name,
          grade,
          created_at: new Date().toISOString()
        });

        await db.set("classes", classes);
        alert(`Class "${name}" created successfully.`);
        document.getElementById("class-add-form").reset();
        loadClassesSectionsView(hasCoursesAccess);
        window.populateUserClassSectionOptions();
      }
    });
  }
}

async function loadClassCoursesTable(hasCoursesAccess) {
  const classCourses = await db.get("class_courses") || [];
  const courses = await db.get("courses") || [];
  const tbody = document.getElementById("class-courses-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (classCourses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No courses posted for any class sections yet.</td></tr>`;
    return;
  }

  classCourses.sort((a, b) => {
    if (a.class_name !== b.class_name) return a.class_name.localeCompare(b.class_name);
    return a.semester - b.semester;
  });

  classCourses.forEach(cc => {
    const course = courses.find(c => c.code === cc.course_code) || {};
    tbody.innerHTML += `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
        <td style="padding: 0.5rem 0.75rem;"><strong>${cc.class_name}</strong></td>
        <td style="padding: 0.5rem 0.75rem;"><code>${cc.course_code}</code></td>
        <td style="padding: 0.5rem 0.75rem;">${course.name || "Unknown Course"}</td>
        <td style="padding: 0.5rem 0.75rem;">Semester ${cc.semester}</td>
        ${hasCoursesAccess ? `
          <td style="padding: 0.5rem 0.75rem; text-align: right;">
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteClassCourse(${cc.id})"><i class="fas fa-trash-alt"></i></button>
          </td>
        ` : ""}
      </tr>
    `;
  });
}

window.deleteClassCourse = async (id) => {
  if (!confirm("Are you sure you want to remove this course assignment from the class section?")) return;
  const classCourses = await db.get("class_courses") || [];
  const filtered = classCourses.filter(cc => cc.id !== id);
  await db.set("class_courses", filtered);
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasCoursesAccess = isMain || (currentUser.rights && currentUser.rights.includes("courses"));
  loadClassCoursesTable(hasCoursesAccess);
};

async function loadClassesTable(hasCoursesAccess) {
  const classes = await db.get("classes");
  const tbody = document.getElementById("classes-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (classes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No classes found.</td></tr>`;
    return;
  }

  classes.forEach(c => {
    const dateStr = new Date(c.created_at || new Date()).toLocaleDateString();
    tbody.innerHTML += `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>Grade ${c.grade}</td>
        <td>${dateStr}</td>
        ${hasCoursesAccess ? `
          <td>
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteClassSection(${c.id})"><i class="fas fa-trash-alt"></i></button>
          </td>
        ` : ""}
      </tr>
    `;
  });
}

async function loadCoursesTable(hasCoursesAccess) {
  const courses = await db.get("courses");
  const tbody = document.getElementById("courses-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  courses.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td><code>${c.code}</code></td>
        <td>${c.name}</td>
        <td>Grade ${c.grade}</td>
        <td>Semester ${c.semester || 1}</td>
        <td>${c.credits} Credits</td>
        ${hasCoursesAccess ? `
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn-icon-sm" onclick="window.editCourse('${c.code}')" title="Edit Course"><i class="fas fa-edit"></i></button>
              <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteCourse('${c.code}')" title="Delete Course"><i class="fas fa-trash-alt"></i></button>
            </div>
          </td>
        ` : ""}
      </tr>
    `;
  });
}

async function loadAdminsTable() {
  const staffRoles = ["Teacher", "Principal", "VicePrincipal", "Manager", "ViceManager", "AcademicRegistrar", "MainRegistrar"];
  const allUsers = await db.get("users");
  const settings = await db.get("settings");
  const customRoles = settings.customRoles || [];
  const users = allUsers.filter(u => staffRoles.includes(u.role) || customRoles.includes(u.role));
  const tbody = document.getElementById("admins-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No staff registered yet.</td></tr>`;
    return;
  }

  users.forEach(u => {
    const activeBadge = u.isActive !== false ? `<span class="badge badge-success">Active</span>` : `<span class="badge badge-danger">Disabled</span>`;
    const toggleActiveText = u.isActive !== false ? "Disable" : "Enable";
    const toggleActiveColor = u.isActive !== false ? "color: var(--accent-danger);" : "color: var(--accent-success);";
    
    // Display granular rights
    const rightsList = u.rights || [];
    const displayRights = rightsList.length > 0 
      ? rightsList.map(r => `<span class="badge badge-info" style="margin-right: 0.2rem; text-transform: capitalize;">${r}</span>`).join("") 
      : `<span style="color: var(--text-secondary); font-size: 0.85rem;">None</span>`;

    tbody.innerHTML += `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td><code>${u.id}</code></td>
        <td>${activeBadge}</td>
        <td>${displayRights}</td>
        <td>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="manageAdminRights('${u.id}')"><i class="fas fa-key"></i> Rights</button>
            <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; ${toggleActiveColor}" onclick="toggleAdminActiveStatus('${u.id}')"><i class="fas fa-power-off"></i> ${toggleActiveText}</button>
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteAdmin('${u.id}')" title="Delete Admin"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
}



async function loadAnnouncementsTable(hasAnnouncementsAccess) {
  const announcements = await db.get("announcements");
  const tbody = document.getElementById("announcements-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  const folder = window.activeAnnFolder || "active";
  const nowStr = new Date().toISOString().split("T")[0];

  const filtered = announcements.filter(a => {
    const expiry = a.expiryDate || a.expiry_date || "2099-12-31";
    if (folder === "active") {
      return expiry >= nowStr;
    } else {
      return expiry < nowStr;
    }
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No announcements in this folder.</td></tr>`;
    return;
  }

  for (const a of filtered) {
    const expiry = a.expiryDate || a.expiry_date || "N/A";
    tbody.innerHTML += `
      <tr>
        <td><strong>${a.title}</strong></td>
        <td><span class="badge badge-info" style="text-transform: capitalize;">${a.target}</span></td>
        <td>${a.date}</td>
        <td><code>${expiry}</code></td>
        ${hasAnnouncementsAccess ? `
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-icon-sm" onclick="editAnnouncement('${a.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteAnnouncement('${a.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </div>
          </td>
        ` : ""}
      </tr>
    `;
  }
}

async function loadRegistrarGradesTable() {
  const query = document.getElementById("search-grades") ? document.getElementById("search-grades").value.toLowerCase() : "";
  const grades = await db.get("grades");
  const users = await db.get("users");
  const tbody = document.getElementById("registrar-grades-table");
  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = grades.filter(g => {
    if (g.status !== "released") return false;
    const student = users.find(u => u.id === g.student_id);
    const studentName = student ? (student.name || "") : "";
    const matchesStudentName = studentName.toLowerCase().includes(query);
    const matchesId = (g.student_id || "").toLowerCase().includes(query);
    const matchesCourse = (g.course_id || g.course_code || "").toLowerCase().includes(query);
    return matchesStudentName || matchesId || matchesCourse;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-secondary);">No grades found.</td></tr>`;
    return;
  }

  filtered.forEach(g => {
    const student = users.find(u => u.id === g.student_id);
    const studentName = student ? student.name : "Unknown Student";
    let badgeClass = "badge-warning";
    if (g.status === "released") badgeClass = "badge-success";
    if (g.status === "submitted") badgeClass = "badge-info";

    const breakdownTooltip = g.breakdown 
      ? Object.entries(g.breakdown).map(([k, v]) => `${k}: ${v}`).join(", ") 
      : `Assessment: ${g.assessment_score}, Exam: ${g.exam_score}`;

    tbody.innerHTML += `
      <tr title="${breakdownTooltip}">
        <td><strong>${studentName}</strong></td>
        <td><code>${g.student_id}</code></td>
        <td><code>${g.course_id || g.course_code}</code></td>
        <td>Semester ${g.semester}</td>
        <td>${g.assessment_score}</td>
        <td>${g.exam_score}</td>
        <td><strong style="cursor: help;">${g.total}</strong></td>
        <td><span class="badge ${badgeClass}" style="text-transform: capitalize;">${g.status}</span></td>
        <td>
          <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.viewStudentTranscript('${g.student_id}')"><i class="fas fa-file-invoice"></i> Transcript</button>
        </td>
      </tr>
    `;
  });
}

// Global functions attached to window for click triggers
window.switchUserRoleTab = async (tabName) => {
  document.querySelectorAll(".user-role-tabs button").forEach(async btn => {
    btn.classList.remove("active");
    if (btn.innerText.toLowerCase() === tabName.toLowerCase() || (tabName === "all" && btn.innerText === "All")) {
      btn.classList.add("active");
    }
  });
  window.activeUserRoleTab = tabName;

  if (tabName === "Students") {
    window.isUserGroupedView = true;
  } else {
    window.isUserGroupedView = false;
  }

  const toggleBtn = document.getElementById("btn-toggle-grouped-view");
  if (toggleBtn) {
    if (window.isUserGroupedView) {
      toggleBtn.innerHTML = `<i class="fas fa-table"></i> Flat List View`;
      toggleBtn.className = "btn-primary";
    } else {
      toggleBtn.innerHTML = `<i class="fas fa-layer-group"></i> Grouped Directory`;
      toggleBtn.className = "btn-secondary";
    }
  }

  // Render filters dynamically
  const filterArea = document.getElementById("dynamic-user-filters");
  if (filterArea) {
    filterArea.innerHTML = "";
    const users = await db.get("users");

    if (tabName === "Students") {
      const batches = [...new Set(users.filter(u => u.role === "Student" && u.batch).map(u => u.batch))].sort();
      const sections = [...new Set(users.filter(u => u.role === "Student" && u.classSection).map(u => u.classSection))].sort();

      let batchOpts = `<option value="all">All Batches</option>`;
      batches.forEach(b => { batchOpts += `<option value="${b}">${b}</option>`; });

      let secOpts = `<option value="all">All Sections</option>`;
      sections.forEach(s => { secOpts += `<option value="${s}">${s}</option>`; });

      filterArea.innerHTML = `
        <select id="filter-student-batch" class="form-control" style="width: 150px;">${batchOpts}</select>
        <select id="filter-student-section" class="form-control" style="width: 150px;">${secOpts}</select>
      `;

      document.getElementById("filter-student-batch").addEventListener("change", loadUsersTable);
      document.getElementById("filter-student-section").addEventListener("change", loadUsersTable);
    } else if (tabName === "Other Staff") {
      filterArea.innerHTML = `
        <select id="filter-staff-role" class="form-control" style="width: 180px;">
          <option value="all">All Roles</option>
          <option value="Guardian">Guardian</option>
          <option value="Librarian">Librarian</option>
          <option value="Dormitory">Dormitory Manager</option>
          <option value="BookStore">Bookstore Manager</option>
          <option value="Cafeteria">Cafeteria Worker</option>
          <option value="IT_Technician">IT Technician</option>
          <option value="ChemistryLab">Chemistry Lab Tech</option>
          <option value="PhysicsLab">Physics Lab Tech</option>
          <option value="Drawing">Drawing Lab Tech</option>
        </select>
      `;
      document.getElementById("filter-staff-role").addEventListener("change", loadUsersTable);
    }
  }

  loadUsersTable();
};

window.populateUserClassSectionOptions = async () => {
  const select = document.getElementById("user-class-section");
  if (!select) return;

  const classes = await db.get("classes");
  select.innerHTML = "";
  classes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.innerText = c.name;
    select.appendChild(opt);
  });
};

window.editUser = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasUsersAccess = isMain || (currentUser.rights && currentUser.rights.includes("users"));
  if (!hasUsersAccess) {
    alert("Unauthorized! You do not have permission to manage users.");
    return;
  }

  const users = await db.get("users");
  const u = users.find(user => user.id === id);
  if (!u) return;

  document.getElementById("edit-user-id").value = u.id;
  document.getElementById("user-fullname").value = u.name;
  document.getElementById("user-gender").value = u.gender;
  document.getElementById("user-role").value = u.role;
  document.getElementById("user-photo").value = u.photo || "";
  document.getElementById("user-photo-preview").src = u.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";

  window.populateUserClassSectionOptions();
  window.toggleConditionalUserFields(u.role);

  if (u.role === "Student") {
    document.getElementById("user-class-section").value = u.classSection || "";
    document.getElementById("user-batch").value = u.batch || "2026";
    document.getElementById("user-nationality").value = u.nationality || "Ethiopian";
  } else if (u.role === "Teacher") {
    document.getElementById("user-assigned-subject").value = u.assignedSubject || "Mathematics";
    document.getElementById("user-assigned-sections").value = u.assignedSections ? u.assignedSections[0] || "" : "";
  }

  document.getElementById("user-modal-title").innerText = "Edit User Details";
  window.showPortalModal("user-modal");
};

window.resetUserPassword = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasUsersAccess = isMain || (currentUser.rights && currentUser.rights.includes("users"));
  if (!hasUsersAccess) {
    alert("Unauthorized! You do not have permission to manage users.");
    return;
  }

  if (!confirm(`Are you sure you want to reset the password for ${id} back to the default generated password?`)) return;

  const users = await db.get("users");
  const user = users.find(u => u.id === id);
  if (!user) return;

  user.password = user.defaultPassword;
  user.passwordResetRequested = false;
  user.resetRequestDate = null;
  user.resetRequestNotes = null;

  await db.updateUser(user);
  const updated = users.map(u => u.id === id ? { ...u, password: u.defaultPassword, passwordResetRequested: false, resetRequestDate: null, resetRequestNotes: null } : u);
  await db.set("users", updated);

  if (window.showBootstrapAlert) window.showBootstrapAlert("Password reset to default value successfully! The user will be required to set a new password on their next login.", "success");
  else alert("Password reset to default value successfully! The user will be required to set a new password on their next login.");
  loadUsersTable();
};

window.approvePasswordReset = async (id) => {
  const users = await db.get("users");
  const user = users.find(u => u.id === id);
  if (!user) return;

  if (!confirm(`Are you sure you want to approve the password reset request for ${user.name} (${user.id})? Their password will be reset to default.`)) return;

  user.password = user.defaultPassword;
  user.passwordResetRequested = false;
  user.resetRequestDate = null;
  user.resetRequestNotes = null;

  await db.updateUser(user);
  const updated = users.map(u => u.id === id ? { ...u, password: u.defaultPassword, passwordResetRequested: false, resetRequestDate: null, resetRequestNotes: null } : u);
  await db.set("users", updated);

  if (window.showBootstrapAlert) window.showBootstrapAlert(`Password for ${user.name} reset to default successfully. They will update their password on next login.`, "success");
  else alert(`Password for ${user.name} reset to default successfully. They will update their password on next login.`);

  loadUsersTable();
};

window.rejectPasswordReset = async (id) => {
  const users = await db.get("users");
  const user = users.find(u => u.id === id);
  if (!user) return;

  if (!confirm(`Are you sure you want to dismiss the password reset request for ${user.name}?`)) return;

  user.passwordResetRequested = false;
  user.resetRequestDate = null;
  user.resetRequestNotes = null;

  await db.updateUser(user);
  const updated = users.map(u => u.id === id ? { ...u, passwordResetRequested: false, resetRequestDate: null, resetRequestNotes: null } : u);
  await db.set("users", updated);

  if (window.showBootstrapAlert) window.showBootstrapAlert(`Password reset request for ${user.name} dismissed.`, "info");
  else alert(`Password reset request for ${user.name} dismissed.`);

  loadUsersTable();
};

window.viewUserProfile = async (id) => {
  const users = await db.get("users") || [];
  const u = users.find(user => user.id === id);
  if (!u) return;

  const title = document.getElementById("view-user-title");
  if (title) title.innerText = `${u.name}'s Profile`;
  
  const photo = document.getElementById("view-user-photo");
  if (photo) photo.src = u.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';
  
  const name = document.getElementById("view-user-name");
  if (name) name.innerText = u.name;
  
  const roleBadge = document.getElementById("view-user-role-badge");
  if (roleBadge) {
    const subroleDisplay = u.role.replace(/([A-Z])/g, ' $1').trim();
    roleBadge.innerText = subroleDisplay;
  }
  
  const userId = document.getElementById("view-user-id");
  if (userId) userId.innerText = u.id;
  
  const userGender = document.getElementById("view-user-gender");
  if (userGender) userGender.innerText = u.gender;
  
  const userStatus = document.getElementById("view-user-status");
  if (userStatus) {
    const isActive = u.isActive !== false;
    userStatus.innerHTML = `<span class="badge ${isActive ? 'badge-success' : 'badge-danger'}">${isActive ? 'Active' : 'Inactive / Revoked'}</span>`;
  }

  // Student specific elements
  const batchCont = document.getElementById("view-user-batch-container");
  const classCont = document.getElementById("view-user-class-container");
  const natCont = document.getElementById("view-user-nationality-container");
  const subCont = document.getElementById("view-user-subject-container");
  const historySec = document.getElementById("view-user-history-section");

  if (u.role === "Student") {
    if (batchCont) batchCont.style.display = "block";
    if (classCont) classCont.style.display = "block";
    if (natCont) natCont.style.display = "block";
    if (subCont) subCont.style.display = "none";

    const batch = document.getElementById("view-user-batch");
    if (batch) batch.innerText = u.batch || "Unspecified";
    
    const cls = document.getElementById("view-user-class");
    if (cls) cls.innerText = u.classSection || "Unassigned";
    
    const nat = document.getElementById("view-user-nationality");
    if (nat) nat.innerText = u.nationality || "Ethiopian";

    // Load academic history
    const history = u.academicHistory || [];
    if (history.length > 0) {
      if (historySec) historySec.style.display = "block";
      const timeline = document.getElementById("view-user-history-timeline");
      if (timeline) {
        timeline.innerHTML = history.map((h, index) => {
          const dateStr = new Date(h.promoted_at).toLocaleDateString();
          const courseBadges = h.registeredCourses && h.registeredCourses.length > 0
            ? h.registeredCourses.map(c => `<span class="badge badge-info" style="margin: 0.1rem; font-size: 0.7rem;">${c}</span>`).join("")
            : `<span style="color:var(--text-tertiary); font-size: 0.8rem;">No courses registered</span>`;

          const gradesRows = h.grades && h.grades.length > 0
            ? h.grades.map(g => `
                <tr style="font-size: 0.78rem; border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.35rem 0.5rem;"><code>${g.course_id}</code></td>
                  <td style="padding: 0.35rem 0.5rem;">Sem ${g.semester}</td>
                  <td style="padding: 0.35rem 0.5rem;">Ass: ${g.assessment_score}</td>
                  <td style="padding: 0.35rem 0.5rem;">Exam: ${g.exam_score}</td>
                  <td style="padding: 0.35rem 0.5rem;"><strong>Total: ${g.total || (g.assessment_score + g.exam_score)}</strong></td>
                  <td style="padding: 0.35rem 0.5rem;"><span class="badge ${g.status === 'released' ? 'badge-success' : 'badge-warning'}">${g.status}</span></td>
                </tr>
              `).join("")
            : `<tr><td colspan="6" style="text-align: center; color: var(--text-tertiary); font-size: 0.78rem; padding: 0.5rem;">No grades recorded for this period.</td></tr>`;

          return `
            <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: 6px; background: rgba(0,0,0,0.02); margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-primary);">Placement Block ${index + 1}</span>
                <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-calendar-alt"></i> Archived: ${dateStr}</span>
              </div>
              <div style="font-size: 0.82rem; margin-bottom: 0.5rem;">
                <strong>Class:</strong> ${h.classSection} | <strong>Batch:</strong> ${h.batch}
              </div>
              <div style="margin-bottom: 0.75rem;">
                <strong style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Courses Attended:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.2rem;">${courseBadges}</div>
              </div>
              <div>
                <strong style="font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">Historical Grades:</strong>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-secondary); text-align: left;">
                      <th style="padding: 0.35rem 0.5rem;">Course</th>
                      <th style="padding: 0.35rem 0.5rem;">Semester</th>
                      <th style="padding: 0.35rem 0.5rem;">Assess</th>
                      <th style="padding: 0.35rem 0.5rem;">Exam</th>
                      <th style="padding: 0.35rem 0.5rem;">Total</th>
                      <th style="padding: 0.35rem 0.5rem;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${gradesRows}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).reverse().join("");
      }
    } else {
      if (historySec) historySec.style.display = "none";
    }

  } else {
    // Staff/Teacher specific elements
    if (batchCont) batchCont.style.display = "none";
    if (classCont) classCont.style.display = "none";
    if (natCont) natCont.style.display = "none";
    if (historySec) historySec.style.display = "none";
    if (subCont) subCont.style.display = "block";

    const subject = document.getElementById("view-user-subject");
    if (subject) {
      subject.innerText = u.assignedSubject ? `${u.assignedSubject} (${u.assignedSections ? u.assignedSections.join(", ") : "None"})` : "None";
    }
  }

  window.showPortalModal("view-user-modal");
};

window.toggleUserActiveStatus = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasUsersAccess = isMain || (currentUser.rights && currentUser.rights.includes("users"));
  if (!hasUsersAccess) {
    alert("Unauthorized! You do not have permission to manage users.");
    return;
  }

  const users = await db.get("users") || [];
  const u = users.find(user => user.id === id);
  if (!u) return;

  if (u.id === currentUser.id) {
    alert("You cannot deactivate your own active session!");
    return;
  }

  const newStatus = u.isActive === false;
  const updated = users.map(user => {
    if (user.id === id) {
      user.isActive = newStatus;
      user.is_active = newStatus;
    }
    return user;
  });

  await db.set("users", updated);
  alert(`User ${u.name} has been successfully ${newStatus ? 'activated' : 'deactivated'}.`);
  loadUsersTable();
};

window.deleteUser = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasUsersAccess = isMain || (currentUser.rights && currentUser.rights.includes("users"));
  if (!hasUsersAccess) {
    alert("Unauthorized! You do not have permission to manage users.");
    return;
  }

  if (!await window.showConfirmModal("Confirm User Deletion", `Are you sure you want to permanently delete user record ${id}?`)) return;

  const users = await db.get("users");
  await db.set("users", users.filter(u => u.id !== id));
  loadUsersTable();
};

window.deleteCourse = async (code) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasCoursesAccess = isMain || (currentUser.rights && currentUser.rights.includes("courses"));
  if (!hasCoursesAccess) {
    alert("Unauthorized! You do not have permission to manage courses.");
    return;
  }

  if (!await window.showConfirmModal("Confirm Course Deletion", `Are you sure you want to delete course ${code}?`)) return;
  const courses = await db.get("courses");
  await db.set("courses", courses.filter(c => c.code !== code));
  loadCourseCatalogView(true);
};

window.editCourse = async (code) => {
  const courses = await db.get("courses") || [];
  const c = courses.find(course => course.code === code);
  if (!c) return;

  const title = document.getElementById("course-modal").querySelector("h4");
  if (title) title.innerText = "Edit Course Details";
  
  document.getElementById("edit-course-original-code").value = code;
  document.getElementById("course-code").value = c.code;
  document.getElementById("course-name").value = c.name;
  document.getElementById("course-grade").value = c.grade;
  document.getElementById("course-credits").value = c.credits;
  document.getElementById("course-semester").value = c.semester || "1";

  window.showPortalModal("course-modal");
};

window.deleteClassSection = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasCoursesAccess = isMain || (currentUser.rights && currentUser.rights.includes("courses"));
  if (!hasCoursesAccess) {
    alert("Unauthorized! You do not have permission to delete classes.");
    return;
  }

  if (!await window.showConfirmModal("Confirm Class Deletion", "Are you sure you want to delete this class section?")) return;

  const classes = await db.get("classes");
  await db.set("classes", classes.filter(c => c.id !== id));
  loadClassesTable(true);
  window.populateUserClassSectionOptions();
};

window.toggleAdminActiveStatus = async (id) => {
  const users = await db.get("users");
  const updated = users.map(u => {
    if (u.id === id) {
      u.isActive = u.isActive === false ? true : false;
    }
    return u;
  });
  await db.set("users", updated);
  alert("Admin active status updated.");
  loadAdminsTable();
};

window.deleteAdmin = async (id) => {
  if (!await window.showConfirmModal("Confirm Admin Deletion", `Are you sure you want to completely delete Academic Registrar Admin ${id}?`)) return;
  const users = await db.get("users");
  await db.set("users", users.filter(u => u.id !== id));
  loadAdminsTable();
};

window.manageAdminRights = async (id) => {
  const users = await db.get("users");
  const u = users.find(user => user.id === id);
  if (!u) return;

  document.getElementById("manage-rights-user-id").value = u.id;
  document.getElementById("manage-rights-title").innerText = `Manage Permissions for ${u.name}`;

  const rights = u.rights || [];
  document.getElementById("right-users").checked = rights.includes("users");
  document.getElementById("right-courses").checked = rights.includes("courses");
  document.getElementById("right-settings").checked = rights.includes("settings");
  document.getElementById("right-announcements").checked = rights.includes("announcements");

  window.showPortalModal("manage-rights-modal");
};

window.createAdmin = async () => {
  document.getElementById("user-form").reset();
  document.getElementById("edit-user-id").value = "";
  document.getElementById("user-role").value = "AcademicRegistrar";
  document.getElementById("user-modal-title").innerText = "Create Registrar Admin";
  window.populateUserClassSectionOptions();
  window.showPortalModal("user-modal");
};

window.editAnnouncement = async (id) => {
  const announcements = await db.get("announcements");
  const a = announcements.find(item => item.id === id);
  if (!a) return;

  document.getElementById("announcement-id").value = a.id;
  document.getElementById("announcement-title").value = a.title;
  document.getElementById("announcement-target").value = a.target;
  document.getElementById("announcement-expiry").value = a.expiryDate || a.expiry_date || "";
  document.getElementById("announcement-content").value = a.content;

  document.getElementById("announcement-modal-title").innerText = "Edit Announcement";
  window.showPortalModal("announcement-modal");
};

window.deleteAnnouncement = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasAnnouncementsAccess = isMain || (currentUser.rights && currentUser.rights.includes("announcements"));
  if (!hasAnnouncementsAccess) {
    alert("Unauthorized! You do not have permission to manage announcements.");
    return;
  }

  if (!await window.showConfirmModal("Confirm Announcement Deletion", "Are you sure you want to delete this announcement?")) return;
  const announcements = await db.get("announcements");
  await db.set("announcements", announcements.filter(a => a.id !== id));
  loadAnnouncementsTable(true);
};

async function saveUser() {
  const editId = document.getElementById("edit-user-id").value;
  const name = document.getElementById("user-fullname").value;
  const gender = document.getElementById("user-gender").value;
  const role = document.getElementById("user-role").value;
  const photo = document.getElementById("user-photo").value || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";

  // Role Restriction Check for Academic Registrar
  const curUser = JSON.parse(localStorage.getItem("higa_current_user"));
  if (curUser.role === "AcademicRegistrar") {
    const allowed = ["Student", "Teacher", "Principal", "VicePrincipal"];
    if (!allowed.includes(role)) {
      alert("Unauthorized! Academic Registrar can only create academic roles: Students, Teachers, Principals, and Vice Principals.");
      return;
    }
  }

  // Conditional fields
  const classSection = document.getElementById("user-class-section").value;
  const batch = document.getElementById("user-batch").value || "2026";
  const nationality = document.getElementById("user-nationality").value || "Ethiopian";
  
  const teacherCategory = document.getElementById("user-teacher-category") ? document.getElementById("user-teacher-category").value : "Main Course Teacher";
  const assignedSubject = document.getElementById("user-assigned-subject").value;
  const assignedSecRaw = document.getElementById("user-assigned-sections").value;
  const assignedSections = assignedSecRaw ? [assignedSecRaw] : [];

  const users = await db.get("users");

  if (editId) {
    // Edit Mode
    const updated = users.map(u => {
      if (u.id === editId) {
        // Archive promotion details before updates
        if (u.role === "Student" && (u.classSection !== classSection || u.batch !== batch)) {
          if (!u.academicHistory) u.academicHistory = [];
          
          (async () => {
            const grades = await db.get("grades") || [];
            const studentGrades = grades.filter(g => g.student_id === editId).map(g => ({
              course_id: g.course_id,
              semester: g.semester,
              assessment_score: g.assessment_score,
              exam_score: g.exam_score,
              total: g.total,
              status: g.status
            }));

            u.academicHistory.push({
              promoted_at: new Date().toISOString(),
              classSection: u.classSection || "Unassigned",
              batch: u.batch || "Unspecified",
              registeredCourses: [...(u.registeredCourses || [])],
              grades: studentGrades
            });
          })();

          u.registeredCourses = [];
        }

        u.name = name;
        u.gender = gender;
        u.role = role;
        u.photo = photo;
        
        // Clean conditional fields
        delete u.classSection;
        delete u.batch;
        delete u.nationality;
        delete u.assignedSubject;
        delete u.assignedSections;
        delete u.teacherCategory;

        if (role === "Student") {
          u.classSection = classSection;
          u.batch = batch;
          u.nationality = nationality;
        } else if (role === "Teacher") {
          u.assignedSubject = assignedSubject;
          u.assignedSections = assignedSections;
          u.teacherCategory = teacherCategory;
        }
      }
      return u;
    });
    await db.set("users", updated);
    alert("User details updated.");
    loadUsersSummary();
  } else {
    // Add Mode (Generate ID automatically)
    const currentYear = new Date().getFullYear();
    const fourDigit = Math.floor(1000 + Math.random() * 9000);
    let idRoleKey = role;
    if (role === "VicePrincipal") idRoleKey = "ViceP";
    if (role === "ViceManager") idRoleKey = "VM";
    if (role === "IT_Technician") idRoleKey = "IT";
    if (role === "ChemistryLab") idRoleKey = "ChemLb";
    if (role === "PhysicsLab") idRoleKey = "PhysLb";
    if (role === "Drawing") idRoleKey = "Draw";
    if (role === "MainRegistrar") idRoleKey = "MainReg";

    const generatedId = `HIGA/${idRoleKey}/${fourDigit}/${currentYear}`;
    const generatedPassword = Math.floor(1000 + Math.random() * 9000).toString();

    // Default rights for AcademicRegistrar or MainRegistrar
    const defaultRights = role === "AcademicRegistrar" 
      ? ["users", "courses"] 
      : (role === "MainRegistrar" ? ["users", "courses", "settings", "announcements"] : []);

    const newUser = {
      id: generatedId,
      username: generatedId,
      password: generatedPassword,
      defaultPassword: generatedPassword,
      name,
      role,
      gender,
      photo,
      isActive: true,
      privileges: role === "MainRegistrar" ? "full" : "partial",
      rights: defaultRights,
      created_at: new Date().toISOString()
    };

    if (role === "Student") {
      newUser.classSection = classSection;
      newUser.batch = batch;
      newUser.nationality = nationality;
      newUser.registeredCourses = [];
    } else if (role === "Teacher") {
      newUser.assignedSubject = assignedSubject;
      newUser.assignedSections = assignedSections;
    }

    users.push(newUser);
    await db.set("users", users);
    alert(`User Created!\nID/Username: ${generatedId}\nDefault Password: ${generatedPassword}`);
    loadUsersSummary();
  }

  window.hidePortalModal("user-modal");
  loadUsersTable();
  if (role === "AcademicRegistrar") {
    loadAdminsTable();
  }
}

// Limit role selection options in user form dynamically based on registrar access permissions
window.populateUserRoleOptions = () => {
  const roleSelect = document.getElementById("user-role");
  if (!roleSelect) return;

  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";

  if (isMain) {
    roleSelect.innerHTML = `
      <option value="Student">Student</option>
      <option value="Teacher">Teacher</option>
      <option value="Principal">Principal</option>
      <option value="VicePrincipal">Vice Principal</option>
      <option value="Manager">School Manager</option>
      <option value="ViceManager">Vice Manager</option>
      <option value="MainRegistrar">Main Registrar</option>
      <option value="AcademicRegistrar">Academic Registrar</option>
      <option value="Guardian">Guardian</option>
      <option value="Librarian">Librarian</option>
      <option value="Dormitory">Dormitory Manager</option>
      <option value="BookStore">Bookstore Manager</option>
      <option value="SchoolStore">School Store Admin</option>
      <option value="Cafeteria">Cafeteria Worker</option>
      <option value="IT_Technician">IT Technician</option>
      <option value="ChemistryLab">Chemistry Lab Technician</option>
      <option value="PhysicsLab">Physics Lab Technician</option>
      <option value="Drawing">Drawing Lab Technician</option>
    `;
  } else {
    // Academic Registrar (Academic related cases only)
    roleSelect.innerHTML = `
      <option value="Student">Student</option>
      <option value="Teacher">Teacher</option>
      <option value="Principal">Principal</option>
      <option value="VicePrincipal">Vice Principal</option>
      <option value="IT_Technician">IT Technician</option>
      <option value="ChemistryLab">Chemistry Lab Technician</option>
      <option value="PhysicsLab">Physics Lab Technician</option>
      <option value="Drawing">Drawing Lab Technician</option>
    `;
  }
};

window.editCalendarEvent = async (id) => {
  const events = await db.get("calendar");
  const e = events.find(item => item.id === id);
  if (!e) return;

  document.getElementById("calendar-event-id").value = e.id;
  document.getElementById("calendar-event-date").value = e.date;
  document.getElementById("calendar-event-desc").value = e.event;
  document.getElementById("calendar-event-type").value = e.type;

  document.getElementById("calendar-event-modal-title").innerText = "Edit Calendar Event";
  window.showPortalModal("calendar-event-modal");
};

window.deleteCalendarEvent = async (id) => {
  if (!confirm("Are you sure you want to delete this calendar event?")) return;
  const events = await db.get("calendar");
  await db.set("calendar", events.filter(e => e.id !== id));
  loadRegistrarCalendarTable();
};

async function loadRegistrarCalendarTable() {
  const events = (await db.get("calendar") || []).sort((a, b) => new Date(a.date) - new Date(b.date));
  const tbody = document.getElementById("registrar-calendar-table");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (events.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No calendar events registered.</td></tr>`;
    return;
  }

  events.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
        <td>${e.event}</td>
        <td><span class="badge badge-${e.type === 'holiday' ? 'warning' : (e.type === 'exam' ? 'danger' : 'info')}">${e.type.toUpperCase()}</span></td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-icon-sm" onclick="editCalendarEvent('${e.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteCalendarEvent('${e.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
}

// Global calendar event form save logic registration
// Helper to initialize forms immediately (since module loads after DOMContentLoaded has fired)
async function initRegistrarForms() {
  const calForm = document.getElementById("calendar-event-form");
  if (calForm) {
    const newForm = calForm.cloneNode(true);
    calForm.replaceWith(newForm);
    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("calendar-event-id").value;
      const date = document.getElementById("calendar-event-date").value;
      const desc = document.getElementById("calendar-event-desc").value.trim();
      const type = document.getElementById("calendar-event-type").value;

      if (date && desc && type) {
        const events = await db.get("calendar") || [];
        if (id) {
          const updated = events.map(evt => {
            if (evt.id === id) {
              evt.date = date;
              evt.event = desc;
              evt.type = type;
            }
            return evt;
          });
          await db.set("calendar", updated);
          alert("Calendar event updated.");
        } else {
          events.push({
            id: "cal-" + Date.now(),
            date,
            event: desc,
            type
          });
          await db.set("calendar", events);
          alert("Calendar event posted successfully.");
        }
        window.hidePortalModal("calendar-event-modal");
        loadRegistrarCalendarTable();
      }
    });
  }

  const assignForm = document.getElementById("assign-teacher-form");
  if (assignForm) {
    const newForm = assignForm.cloneNode(true);
    assignForm.replaceWith(newForm);
    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const teacherId = document.getElementById("assign-teacher-select").value;
      const courseCode = document.getElementById("assign-teacher-course").value;
      const selectSections = document.getElementById("assign-teacher-sections");
      const sections = Array.from(selectSections.selectedOptions).map(opt => opt.value);

      if (teacherId && courseCode && sections.length > 0) {
        const users = await db.get("users");
        const updated = users.map(u => {
          if (u.id === teacherId) {
            u.assignedSubject = courseCode;
            u.assignedSections = sections;
          }
          return u;
        });
        await db.set("users", updated);
        alert("Teacher assignment saved successfully.");
        window.hidePortalModal("assign-teacher-modal");
        
        const usersTable = document.getElementById("users-table-body");
        if (usersTable) {
          loadUsersTable();
        } else {
          loadTeacherAssignmentsTable(true);
        }
      } else {
        alert("Please fill in all parameters.");
      }
    });
  }
}

// Execute form initialization immediately
initRegistrarForms();

// Helper rendering functions for Course Assignments tab (Requirement 6)
async function loadTeacherAssignmentsTable(hasUsersAccess) {
  const tbody = document.getElementById("teacher-assignments-table-body");
  if (!tbody) return;

  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  const teachers = users.filter(u => 
    u.role === "Teacher" || u.role === "ChemistryLab" || u.role === "PhysicsLab" || u.role === "Drawing" || u.role === "IT_Technician"
  );

  tbody.innerHTML = "";
  if (teachers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No teachers found in registry.</td></tr>`;
    return;
  }

  teachers.forEach(t => {
    const course = courses.find(c => c.code === t.assignedSubject) || {};
    const sections = t.assignedSections && t.assignedSections.length > 0 ? t.assignedSections.join(", ") : "None";
    
    tbody.innerHTML += `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
        <td><strong>${t.name}</strong> <span style="font-size: 0.75rem; color: var(--text-tertiary);">(${t.role})</span></td>
        <td><code>${t.id}</code></td>
        <td>${course.name ? `<code>${t.assignedSubject}</code> - ${course.name}` : `<span style="color: var(--text-tertiary);">Unassigned</span>`}</td>
        <td>${sections}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            ${hasUsersAccess ? `
              <button class="btn-icon-sm" onclick="window.assignTeacherModal('${t.id}')" title="Modify Assignment"><i class="fas fa-edit"></i></button>
              ${t.assignedSubject || (t.assignedSections && t.assignedSections.length > 0) ? `
                <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.unassignTeacher('${t.id}')" title="Clear Assignment"><i class="fas fa-unlink"></i></button>
              ` : ""}
            ` : `<span style="font-size: 0.8rem; color: var(--text-tertiary);">None</span>`}
          </div>
        </td>
      </tr>
    `;
  });
}

window.unassignTeacher = async (teacherId) => {
  if (!await window.showConfirmModal("Clear Teacher Assignments", "Are you sure you want to clear this teacher's subject and class assignments?", "Clear")) return;
  const users = await db.get("users") || [];
  const updated = users.map(u => {
    if (u.id === teacherId) {
      u.assignedSubject = "";
      u.assignedSections = [];
    }
    return u;
  });
  await db.set("users", updated);
  alert("Teacher assignments cleared successfully.");
  loadTeacherAssignmentsTable(true);
};

window.prepareClassCourseForm = async (courseId) => {
  if (!await window.showConfirmModal("Remove Course Assignment", "Are you sure you want to remove this course assignment from the class section?", "Remove")) return;
  const classCourses = await db.get("class_courses") || [];
  const filtered = classCourses.filter(cc => cc.id !== courseId);
  await db.set("class_courses", filtered);
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const isMain = currentUser.role === "MainRegistrar";
  const hasCoursesAccess = isMain || (currentUser.rights && currentUser.rights.includes("courses"));
  loadClassCoursesTable(hasCoursesAccess);
};

function loadEnrollmentsPostingsView(hasCoursesAccess) {
  const content = document.getElementById("classes-tab-content");
  if (!content) return;

  content.innerHTML = `
    <!-- Class Course Postings (Requirement 1 & 4) -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h4 style="margin-bottom: 0.25rem;"><i class="fas fa-upload"></i> Class Course Postings</h4>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 0;">Upload/Post mandatory courses for students in the same class section for registration.</p>
      </div>
      ${hasCoursesAccess ? `<button class="btn-primary" id="btn-add-class-course" style="height: 38px;"><i class="fas fa-plus-circle"></i> Post Course to Class</button>` : ""}
    </div>
    <div class="table-responsive" style="margin-bottom: 3rem;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
            <th style="padding: 0.5rem 0.75rem;">Class Section</th>
            <th style="padding: 0.5rem 0.75rem;">Course Code</th>
            <th style="padding: 0.5rem 0.75rem;">Course Name</th>
            <th style="padding: 0.5rem 0.75rem;">Semester</th>
            ${hasCoursesAccess ? `<th style="padding: 0.5rem 0.75rem; text-align: right;">Actions</th>` : ""}
          </tr>
        </thead>
        <tbody id="class-courses-table-body">
          <!-- Loaded Dynamically -->
        </tbody>
      </table>
    </div>

    <!-- Student Course Registration Tracker (Requirement 2 & 3) -->
    <div class="glass-card" style="padding: 1.5rem; border: 1px solid var(--border-color); background: rgba(0,0,0,0.05);">
      <h4 style="margin-bottom: 0.5rem;"><i class="fas fa-id-card"></i> Student Course Enrollment Tracker</h4>
      <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">Review and track course registrations for student attendance control.</p>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 1.5rem;">
        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem; display: block;">Select Batch Year</label>
          <select id="enrollment-batch-select" class="form-control" style="width: 150px;">
            <!-- Loaded Dynamically -->
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem; display: block;">Select Class Section</label>
          <select id="enrollment-class-select" class="form-control" style="width: 200px;">
            <!-- Loaded Dynamically -->
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem; display: block;">Select Semester</label>
          <select id="enrollment-semester-select" class="form-control" style="width: 150px;">
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
        <button class="btn-primary" id="btn-load-enrollment" style="height: 38px; padding: 0 1.5rem;"><i class="fas fa-search"></i> Check Registrations</button>
        <button class="btn-secondary" id="btn-bulk-register-all" style="height: 38px; display: none; padding: 0 1.5rem;"><i class="fas fa-check-double"></i> Register All Unregistered Students</button>
      </div>

      <div id="enrollment-results-container" style="margin-top: 2rem;">
        <div style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">Select options above and click check.</div>
      </div>
    </div>
  `;

  loadClassCoursesTable(hasCoursesAccess);

  (async () => {
    const classesList = await db.get("classes") || [];
    const coursesList = await db.get("courses") || [];
    const users = await db.get("users") || [];

    // Populate Batch Select
    const batches = [...new Set(users.filter(u => u.role === "Student" && u.batch).map(u => u.batch))].sort();
    const batchSelect = document.getElementById("enrollment-batch-select");
    if (batchSelect) {
      batchSelect.innerHTML = `<option value="all">All Batches</option>` + batches.map(b => `<option value="${b}">${b}</option>`).join("");
    }

    // Populate Class Section Select
    const classSelect = document.getElementById("enrollment-class-select");
    if (classSelect) {
      classSelect.innerHTML = `<option value="all">All Class Sections</option>` + classesList.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
    }

    document.getElementById("btn-load-enrollment").addEventListener("click", async () => {
      window.loadEnrollmentTrackerData();
    });

    if (hasCoursesAccess) {
      const addClassCourseBtn = document.getElementById("btn-add-class-course");
      if (addClassCourseBtn) {
        addClassCourseBtn.addEventListener("click", async () => {
          const modalClass = document.getElementById("post-class-course-class");
          const modalCheckboxes = document.getElementById("post-class-course-checkboxes");
          
          if (modalClass) {
            modalClass.innerHTML = classesList.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
          }
          if (modalCheckboxes) {
            modalCheckboxes.innerHTML = coursesList.map(c => `
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; padding-bottom: 0.25rem; border-bottom: 1px solid var(--border-color);">
                <input type="checkbox" id="post-cc-${c.code}" class="post-class-course-checkbox" value="${c.code}" style="width: 16px; height: 16px; cursor: pointer;">
                <label for="post-cc-${c.code}" style="cursor: pointer; margin-bottom: 0; font-weight: normal; font-size: 0.9rem;">
                  <strong>${c.code}</strong> - ${c.name}
                </label>
              </div>
            `).join("");
          }
          
          document.getElementById("post-class-course-form").reset();
          window.showPortalModal("post-class-course-modal");
        });
      }

      const postClassCourseForm = document.getElementById("post-class-course-form");
      if (postClassCourseForm) {
        const newForm = postClassCourseForm.cloneNode(true);
        postClassCourseForm.replaceWith(newForm);
        newForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const className = document.getElementById("post-class-course-class").value;
          const semester = parseInt(document.getElementById("post-class-course-semester").value);
          
          const checkedControls = document.querySelectorAll(".post-class-course-checkbox:checked");
          const selectedCourses = Array.from(checkedControls).map(cb => cb.value);

          if (className && selectedCourses.length > 0 && semester) {
            const classCourses = await db.get("class_courses") || [];
            let addedCount = 0;

            for (const courseCode of selectedCourses) {
              if (!classCourses.some(cc => cc.class_name === className && cc.course_code === courseCode && cc.semester === semester)) {
                const newId = classCourses.length > 0 ? Math.max(...classCourses.map(cc => cc.id)) + 1 : 1;
                classCourses.push({ id: newId, class_name: className, course_code: courseCode, semester });
                addedCount++;
              }
            }

            if (addedCount > 0) {
              await db.set("class_courses", classCourses);
              alert(`Successfully posted ${addedCount} courses to ${className} for Semester ${semester}!`);
            } else {
              alert("Selected courses are already assigned to this class section for the given semester.");
            }
            window.hidePortalModal("post-class-course-modal");
            loadClassCoursesTable(true);
          } else {
            alert("Please select at least one course to post.");
          }
        });
      }
    }
  })();
}


// Assign Teacher Modal and Form Handlers
window.assignTeacherModal = async (teacherId) => {
  const selectTeacher = document.getElementById("assign-teacher-select");
  const selectCourse = document.getElementById("assign-teacher-course");
  const selectSections = document.getElementById("assign-teacher-sections");

  if (!selectTeacher || !selectCourse || !selectSections) return;

  const users = await db.get("users");
  // Teachers, lab techs and IT tech
  const teachers = users.filter(u => 
    u.role === "Teacher" || u.role === "ChemistryLab" || u.role === "PhysicsLab" || u.role === "Drawing" || u.role === "IT_Technician"
  );
  const courses = await db.get("courses");
  const classes = await db.get("classes");

  selectTeacher.innerHTML = teachers.map(t => `<option value="${t.id}">${t.name} (${t.role})</option>`).join("");
  selectCourse.innerHTML = courses.map(c => `<option value="${c.code}">${c.code} - ${c.name}</option>`).join("");
  selectSections.innerHTML = classes.map(cls => `<option value="${cls.name}">${cls.name}</option>`).join("");

  if (teacherId) {
    selectTeacher.value = teacherId;
  }

  // Pre-fill existing assignments if edit mode
  const currentId = selectTeacher.value;
  const currentTeacher = users.find(u => u.id === currentId);
  if (currentTeacher) {
    if (currentTeacher.assignedSubject) selectCourse.value = currentTeacher.assignedSubject;
    const existingSec = currentTeacher.assignedSections || [];
    Array.from(selectSections.options).forEach(opt => {
      opt.selected = existingSec.includes(opt.value);
    });
  }

  selectTeacher.onchange = () => {
    const activeTeacher = users.find(u => u.id === selectTeacher.value);
    if (activeTeacher) {
      if (activeTeacher.assignedSubject) selectCourse.value = activeTeacher.assignedSubject;
      const existingSec = activeTeacher.assignedSections || [];
      Array.from(selectSections.options).forEach(opt => {
        opt.selected = existingSec.includes(opt.value);
      });
    }
  };

  window.showPortalModal("assign-teacher-modal");
};

// Form listener initialization for teacher assignment
// Remove redundant DOMContentLoaded assignForm initialization (now handled by initRegistrarForms)

// Printable & Exportable User Directory Views
window.printUserList = async () => {
  const query = document.getElementById("search-users") ? document.getElementById("search-users").value.toLowerCase() : "";
  const users = await db.get("users");
  const activeTab = window.activeUserRoleTab || "all";
  const batchFilter = document.getElementById("filter-student-batch") ? document.getElementById("filter-student-batch").value : "all";
  const sectionFilter = document.getElementById("filter-student-section") ? document.getElementById("filter-student-section").value : "all";
  const staffRoleFilter = document.getElementById("filter-staff-role") ? document.getElementById("filter-staff-role").value : "all";

  const filtered = users.filter(u => {
    const nameLower = (u.name || "").toLowerCase();
    const idLower = (u.id || "").toLowerCase();
    const matchesQuery = idLower.includes(query) || nameLower.includes(query);
    
    let matchesTab = true;
    if (activeTab !== "all") {
      if (activeTab === "Registrars") {
        matchesTab = u.role === "MainRegistrar" || u.role === "AcademicRegistrar";
      } else if (activeTab === "Principals") {
        matchesTab = u.role === "Principal" || u.role === "VicePrincipal";
      } else if (activeTab === "Managers") {
        matchesTab = u.role === "Manager" || u.role === "ViceManager";
      } else if (activeTab === "Teachers") {
        matchesTab = u.role === "Teacher";
      } else if (activeTab === "Students") {
        matchesTab = u.role === "Student";
        if (batchFilter !== "all" && String(u.batch || "") !== batchFilter) matchesTab = false;
        if (sectionFilter !== "all" && (u.classSection || "") !== sectionFilter) matchesTab = false;
      } else if (activeTab === "Other Staff") {
        const otherRoles = ["Guardian", "Librarian", "Dormitory", "BookStore", "Cafeteria", "IT_Technician", "ChemistryLab", "PhysicsLab", "Drawing"];
        matchesTab = otherRoles.includes(u.role);
        if (staffRoleFilter !== "all" && u.role !== staffRoleFilter) matchesTab = false;
      }
    }
    return matchesQuery && matchesTab;
  });

  let html = `
    <html>
      <head>
        <title>Higa Boarding Directory Print</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; color: #333; }
          h2 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Higa Model Boarding School - User Directory (${activeTab.toUpperCase()})</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Gender</th>
              <th>Class/Section</th>
              <th>Batch</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(u => `
              <tr>
                <td><code>${u.id}</code></td>
                <td>${u.name}</td>
                <td>${u.role}</td>
                <td>${u.gender}</td>
                <td>${u.classSection || 'N/A'}</td>
                <td>${u.batch || 'N/A'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const printWin = window.open("", "_blank");
  printWin.document.write(html);
  printWin.document.close();
  printWin.print();
};

window.exportUserList = async () => {
  const query = document.getElementById("search-users") ? document.getElementById("search-users").value.toLowerCase() : "";
  const users = await db.get("users");
  const activeTab = window.activeUserRoleTab || "all";
  const batchFilter = document.getElementById("filter-student-batch") ? document.getElementById("filter-student-batch").value : "all";
  const sectionFilter = document.getElementById("filter-student-section") ? document.getElementById("filter-student-section").value : "all";
  const staffRoleFilter = document.getElementById("filter-staff-role") ? document.getElementById("filter-staff-role").value : "all";

  const filtered = users.filter(u => {
    const nameLower = (u.name || "").toLowerCase();
    const idLower = (u.id || "").toLowerCase();
    const matchesQuery = idLower.includes(query) || nameLower.includes(query);
    
    let matchesTab = true;
    if (activeTab !== "all") {
      if (activeTab === "Registrars") {
        matchesTab = u.role === "MainRegistrar" || u.role === "AcademicRegistrar";
      } else if (activeTab === "Principals") {
        matchesTab = u.role === "Principal" || u.role === "VicePrincipal";
      } else if (activeTab === "Managers") {
        matchesTab = u.role === "Manager" || u.role === "ViceManager";
      } else if (activeTab === "Teachers") {
        matchesTab = u.role === "Teacher";
      } else if (activeTab === "Students") {
        matchesTab = u.role === "Student";
        if (batchFilter !== "all" && String(u.batch || "") !== batchFilter) matchesTab = false;
        if (sectionFilter !== "all" && (u.classSection || "") !== sectionFilter) matchesTab = false;
      } else if (activeTab === "Other Staff") {
        const otherRoles = ["Guardian", "Librarian", "Dormitory", "BookStore", "Cafeteria", "IT_Technician", "ChemistryLab", "PhysicsLab", "Drawing"];
        matchesTab = otherRoles.includes(u.role);
        if (staffRoleFilter !== "all" && u.role !== staffRoleFilter) matchesTab = false;
      }
    }
    return matchesQuery && matchesTab;
  });

  let csv = "User ID,Full Name,Role,Gender,Class Section,Batch,Status\n";
  for (const u of filtered) {
    const activeText = u.isActive !== false ? "Active" : "Disabled";
    csv += `"${u.id}","${u.name}","${u.role}","${u.gender}","${u.classSection || ''}","${u.batch || ''}","${activeText}"\n`;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `higa_directory_${activeTab}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Course Registration Control & Manual Enrollment Toggle (Semester-based Bulk Registration)
window.loadEnrollmentTrackerData = async () => {
  const selectedClass = document.getElementById("enrollment-class-select").value;
  const selectedBatch = document.getElementById("enrollment-batch-select").value;
  const semesterSelect = document.getElementById("enrollment-semester-select");
  const semester = semesterSelect ? parseInt(semesterSelect.value) : 1;
  const resultsContainer = document.getElementById("enrollment-results-container");
  const bulkBtn = document.getElementById("btn-bulk-register-all");

  if (!resultsContainer) return;

  const users = await db.get("users") || [];
  let students = users.filter(u => u.role === "Student");
  
  if (selectedClass !== "all") {
    students = students.filter(s => s.classSection === selectedClass);
  }
  if (selectedBatch !== "all") {
    students = students.filter(s => s.batch === selectedBatch);
  }

  const classCourses = await db.get("class_courses") || [];

  const fullyRegistered = [];
  const partiallyOrUnregistered = [];

  students.forEach(s => {
    const reg = s.registeredCourses || [];
    const assignedCourses = classCourses.filter(cc => cc.class_name === s.classSection && cc.semester === semester);
    
    // If no courses posted, skip
    if (assignedCourses.length === 0) {
      return; 
    }

    const regCount = assignedCourses.filter(ac => reg.includes(ac.course_code)).length;
    const isFully = regCount === assignedCourses.length;

    const studentData = {
      student: s,
      assignedCourses,
      registeredCount: regCount,
      totalCount: assignedCourses.length
    };

    if (isFully) {
      fullyRegistered.push(studentData);
    } else {
      partiallyOrUnregistered.push(studentData);
    }
  });

  // Render bulk register button if there are unregistered students
  if (partiallyOrUnregistered.length > 0) {
    if (bulkBtn) {
      bulkBtn.style.display = "inline-block";
      const newBulk = bulkBtn.cloneNode(true);
      bulkBtn.replaceWith(newBulk);
      newBulk.addEventListener("click", async () => {
        window.bulkRegisterUnregisteredList(partiallyOrUnregistered, semester);
      });
    }
  } else {
    if (bulkBtn) bulkBtn.style.display = "none";
  }

  // Helper to build group UI
  const buildGroupedUI = (list) => {
    if (list.length === 0) {
      return `<p style="color: var(--text-tertiary); font-style: italic; padding: 0.5rem 1rem;">No students in this category.</p>`;
    }

    // Group by Batch, then by Class Section
    const grouped = {};
    list.forEach(item => {
      const b = item.student.batch || "Unspecified Batch";
      const c = item.student.classSection || "Unassigned Class";
      if (!grouped[b]) grouped[b] = {};
      if (!grouped[b][c]) grouped[b][c] = [];
      grouped[b][c].push(item);
    });

    let html = "";
    Object.keys(grouped).sort().forEach(batch => {
      html += `
        <div style="margin-top: 1rem; padding-left: 0.5rem; border-left: 3px solid var(--accent-secondary);">
          <h6 style="color: var(--accent-secondary); font-weight: bold; font-size: 0.95rem; margin-bottom: 0.75rem;"><i class="fas fa-calendar-alt"></i> Batch: ${batch}</h6>
      `;
      
      Object.keys(grouped[batch]).sort().forEach(cls => {
        html += `
          <div style="margin-left: 1rem; margin-bottom: 1.5rem;">
            <h7 style="color: var(--accent-primary); font-weight: 600; font-size: 0.88rem; display: block; margin-bottom: 0.5rem;"><i class="fas fa-school"></i> Section: ${cls}</h7>
            <div class="table-responsive">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.75rem; color: var(--text-secondary);">
                    <th style="padding: 0.4rem 0.6rem;">Student Name</th>
                    <th style="padding: 0.4rem 0.6rem;">Student ID</th>
                    <th style="padding: 0.4rem 0.6rem;">Required Courses Status</th>
                    <th style="padding: 0.4rem 0.6rem;">Count</th>
                    <th style="padding: 0.4rem 0.6rem; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
        `;

        grouped[batch][cls].forEach(item => {
          const s = item.student;
          const reg = s.registeredCourses || [];
          const courseBadges = item.assignedCourses.map(ac => {
            const isReg = reg.includes(ac.course_code);
            return `<span class="badge ${isReg ? 'badge-success' : 'badge-danger'}" style="margin: 0.1rem; font-size: 0.7rem;">${ac.course_code}</span>`;
          }).join("");

          const isFully = item.registeredCount === item.totalCount;
          const actionBtn = isFully
            ? `<button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;" onclick="window.unregisterAllClassCourses('${s.id}', ${semester})"><i class="fas fa-user-minus"></i> Unregister</button>`
            : `<button class="btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;" onclick="window.registerAllClassCourses('${s.id}', ${semester})"><i class="fas fa-user-plus"></i> Register</button>`;

          html += `
            <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
              <td style="padding: 0.4rem 0.6rem;"><strong>${s.name}</strong></td>
              <td style="padding: 0.4rem 0.6rem;"><code>${s.id}</code></td>
              <td style="padding: 0.4rem 0.6rem;"><div style="display: flex; flex-wrap: wrap; gap: 0.1rem;">${courseBadges}</div></td>
              <td style="padding: 0.4rem 0.6rem;"><span class="badge ${isFully ? 'badge-success' : 'badge-warning'}">${item.registeredCount} / ${item.totalCount}</span></td>
              <td style="padding: 0.4rem 0.6rem; text-align: right;">${actionBtn}</td>
            </tr>
          `;
        });

        html += `</tbody></table></div></div>`;
      });
      html += `</div>`;
    });

    return html;
  };

  resultsContainer.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h5 style="color: var(--accent-danger); font-weight: 600; margin-bottom: 1rem; border-bottom: 2px solid var(--accent-danger); padding-bottom: 0.5rem;"><i class="fas fa-times-circle"></i> Partially & Unregistered Students (${partiallyOrUnregistered.length})</h5>
      ${buildGroupedUI(partiallyOrUnregistered)}
    </div>
    
    <div>
      <h5 style="color: var(--accent-success); font-weight: 600; margin-bottom: 1rem; border-bottom: 2px solid var(--accent-success); padding-bottom: 0.5rem;"><i class="fas fa-check-circle"></i> Fully Registered Students (${fullyRegistered.length})</h5>
      ${buildGroupedUI(fullyRegistered)}
    </div>
  `;
};

window.bulkRegisterUnregisteredList = async (unregisteredList, semester) => {
  if (unregisteredList.length === 0) {
    alert("No unregistered students in the list to register.");
    return;
  }

  const users = await db.get("users") || [];
  const updated = users.map(u => {
    const item = unregisteredList.find(ul => ul.student.id === u.id);
    if (item) {
      const reg = u.registeredCourses || [];
      item.assignedCourses.forEach(ac => {
        if (!reg.includes(ac.course_code)) {
          reg.push(ac.course_code);
        }
      });
      u.registeredCourses = reg;
    }
    return u;
  });

  await db.set("users", updated);
  alert(`Successfully registered all ${unregisteredList.length} unregistered students for Semester ${semester} courses!`);
  window.loadEnrollmentTrackerData();
};

window.registerAllClassCourses = async (studentId, semester) => {
  const users = await db.get("users");
  const student = users.find(u => u.id === studentId);
  if (!student) return;

  const classCourses = await db.get("class_courses") || [];
  const assignedCourses = classCourses.filter(cc => cc.class_name === student.classSection && cc.semester === semester);
  if (assignedCourses.length === 0) return;

  const updated = users.map(u => {
    if (u.id === studentId) {
      const reg = u.registeredCourses || [];
      assignedCourses.forEach(ac => {
        if (!reg.includes(ac.course_code)) {
          reg.push(ac.course_code);
        }
      });
      u.registeredCourses = reg;
    }
    return u;
  });

  await db.set("users", updated);
  alert(`Successfully registered ${student.name} for all Semester ${semester} courses!`);
  window.loadEnrollmentTrackerData();
};

window.unregisterAllClassCourses = async (studentId, semester) => {
  const users = await db.get("users");
  const student = users.find(u => u.id === studentId);
  if (!student) return;

  const classCourses = await db.get("class_courses") || [];
  const assignedCourses = classCourses.filter(cc => cc.class_name === student.classSection && cc.semester === semester);
  if (assignedCourses.length === 0) return;

  const codesToRemove = assignedCourses.map(cc => cc.course_code);

  const updated = users.map(u => {
    if (u.id === studentId) {
      const reg = u.registeredCourses || [];
      u.registeredCourses = reg.filter(c => !codesToRemove.includes(c));
    }
    return u;
  });

  await db.set("users", updated);
  alert(`Successfully unregistered ${student.name} from all Semester ${semester} courses.`);
  window.loadEnrollmentTrackerData();
};


// Registrar View of Continuous Student Transcript
window.viewStudentTranscript = async (studentId) => {
  const users = await db.get("users");
  const student = users.find(u => u.id === studentId);
  if (!student) return;

  const registered = student.registeredCourses || [];
  const grades = (await db.get("grades") || []).filter(g => g.student_id === studentId && g.status === "released" && registered.includes(g.course_id));
  const courses = await db.get("courses");

  document.getElementById("transcript-modal-title").innerText = `Academic Transcript: ${student.name} (${student.id})`;
  const container = document.getElementById("transcript-modal-content");

  // Group by semesters
  const semesters = {};
  grades.forEach(g => {
    const sem = g.semester || 1;
    if (!semesters[sem]) semesters[sem] = [];
    semesters[sem].push(g);
  });

  let html = "";
  if (grades.length === 0) {
    html = `<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No released grade record releases for this student yet.</div>`;
  } else {
    Object.entries(semesters).sort(([a], [b]) => a - b).forEach(([sem, list]) => {
      let semTotal = 0;
      let semCount = 0;

      const rows = list.map(g => {
        const cDetails = courses.find(c => c.code === g.course_id) || {};
        semTotal += g.total;
        semCount++;
        return `
          <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
            <td style="padding: 0.4rem 0.6rem;"><strong>${g.course_id}</strong></td>
            <td style="padding: 0.4rem 0.6rem;">${cDetails.name || 'General Course'}</td>
            <td style="padding: 0.4rem 0.6rem;">${cDetails.credits || 3}</td>
            <td style="padding: 0.4rem 0.6rem;">${g.assessment_score}</td>
            <td style="padding: 0.4rem 0.6rem;">${g.exam_score}</td>
            <td style="padding: 0.4rem 0.6rem; font-weight: 600;">${g.total}</td>
          </tr>
        `;
      }).join("");

      const semAvg = semCount > 0 ? (semTotal / semCount).toFixed(2) : "0.00";

      html += `
        <div style="margin-bottom: 1.5rem; border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm);">
          <h5 style="color: var(--accent-primary); display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <span>Semester ${sem} Record</span>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Semester Average: <strong>${semAvg}%</strong></span>
          </h5>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.75rem; color: var(--text-secondary);">
                <th style="padding: 0.4rem 0.6rem;">Course</th>
                <th style="padding: 0.4rem 0.6rem;">Name</th>
                <th style="padding: 0.4rem 0.6rem;">Credits</th>
                <th style="padding: 0.4rem 0.6rem;">Assessment</th>
                <th style="padding: 0.4rem 0.6rem;">Exam</th>
                <th style="padding: 0.4rem 0.6rem;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
    });
  }

  container.innerHTML = html;
  window.showPortalModal("transcript-modal");
};

window.printModalTranscript = async () => {
  const content = document.getElementById("transcript-modal-content").innerHTML;
  const title = document.getElementById("transcript-modal-title").innerText;
  
  const printWin = window.open("", "_blank");
  printWin.document.write(`
    <html>
      <head>
        <title>Student Transcript Print</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; color: #333; }
          h2 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
          h5 { font-size: 1.1rem; color: #4f46e5; margin-top: 1.5rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        ${content}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
};

window.loadRegistrarAnalyticsData = async () => {
  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  const classCourses = await db.get("class_courses") || [];
  
  const students = users.filter(u => u.role === "Student");
  const teachers = users.filter(u => u.role === "Teacher");
  const registrars = users.filter(u => u.role === "AcademicRegistrar" || u.role === "MainRegistrar");

  // 1. General Stats Counters
  const statsDiv = document.getElementById("analytics-general-stats");
  if (statsDiv) {
    statsDiv.innerHTML = `
      <div class="glass-card stat-card" style="padding: 1.25rem;">
        <div class="stat-info">
          <h3>${students.length}</h3>
          <p>Total Enrolled Students</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-primary);"><i class="fas fa-user-graduate"></i></div>
      </div>
      <div class="glass-card stat-card" style="padding: 1.25rem;">
        <div class="stat-info">
          <h3>${teachers.length}</h3>
          <p>Active Course Teachers</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-secondary);"><i class="fas fa-chalkboard-teacher"></i></div>
      </div>
      <div class="glass-card stat-card" style="padding: 1.25rem;">
        <div class="stat-info">
          <h3>${registrars.length}</h3>
          <p>Registrar Personnel</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-success);"><i class="fas fa-user-shield"></i></div>
      </div>
      <div class="glass-card stat-card" style="padding: 1.25rem;">
        <div class="stat-info">
          <h3>${courses.length}</h3>
          <p>Total Active Courses</p>
        </div>
        <div class="stat-icon" style="color: var(--accent-warning);"><i class="fas fa-book-open"></i></div>
      </div>
    `;
  }

  // 2. Roles Distribution
  const rolesBody = document.getElementById("analytics-roles-body");
  if (rolesBody) {
    const rolesMap = {
      "Principal": 0,
      "VicePrincipal": 0,
      "ViceManager": 0,
      "IT_Technician": 0,
      "ChemistryLab": 0,
      "PhysicsLab": 0,
      "Drawing": 0,
      "Teacher": 0,
      "AcademicRegistrar": 0,
      "MainRegistrar": 0
    };
    users.forEach(u => {
      if (rolesMap[u.role] !== undefined) {
        rolesMap[u.role]++;
      }
    });

    rolesBody.innerHTML = Object.entries(rolesMap).map(([role, count]) => {
      const displayRole = role.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').trim();
      return `
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <td style="padding: 0.4rem 0.5rem;"><strong>${displayRole}</strong></td>
          <td style="padding: 0.4rem 0.5rem; text-align: right;"><span class="badge badge-info">${count}</span></td>
        </tr>
      `;
    }).join("");
  }

  // 3. Courses Registration Count
  const coursesBody = document.getElementById("analytics-courses-body");
  if (coursesBody) {
    const counts = {};
    courses.forEach(c => {
      counts[c.code] = 0;
    });

    students.forEach(s => {
      const reg = s.registeredCourses || [];
      reg.forEach(code => {
        if (counts[code] !== undefined) {
          counts[code]++;
        }
      });
    });

    const sortedCourses = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7); // Show top 7 most popular

    if (sortedCourses.length === 0) {
      coursesBody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--text-secondary); padding: 1rem;">No student course registrations recorded yet.</td></tr>`;
    } else {
      coursesBody.innerHTML = sortedCourses.map(([code, count]) => {
        const cDetails = courses.find(c => c.code === code) || {};
        return `
          <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
            <td style="padding: 0.4rem 0.5rem;"><code>${code}</code> - ${cDetails.name || 'General Course'}</td>
            <td style="padding: 0.4rem 0.5rem; text-align: right;"><span class="badge badge-success">${count} students</span></td>
          </tr>
        `;
      }).join("");
    }
  }

  // 4. Student Breakdown Table (based on selected Batch and Semester)
  const breakdownBody = document.getElementById("analytics-breakdown-body");
  if (breakdownBody) {
    const selectedBatch = document.getElementById("analytics-batch-select").value;
    const selectedSem = parseInt(document.getElementById("analytics-semester-select").value || "1");

    let filteredStudents = students;
    if (selectedBatch !== "all") {
      filteredStudents = students.filter(s => s.batch === selectedBatch);
    }

    // Group filtered students by Class Section
    const sectionsMap = {};
    filteredStudents.forEach(s => {
      const sec = s.classSection || "Unassigned Section";
      if (!sectionsMap[sec]) sectionsMap[sec] = [];
      sectionsMap[sec].push(s);
    });

    const rows = [];
    Object.entries(sectionsMap).sort((a, b) => a[0].localeCompare(b[0])).forEach(([secName, list]) => {
      let fullyRegCount = 0;
      let partiallyRegCount = 0;
      let unregCount = 0;

      list.forEach(s => {
        const reg = s.registeredCourses || [];
        const posted = classCourses.filter(cc => cc.class_name === s.classSection && cc.semester === selectedSem);
        
        if (posted.length === 0) {
          fullyRegCount++; // No courses posted, count as registered
          return;
        }

        const registeredCount = posted.filter(ac => reg.includes(ac.course_code)).length;
        if (registeredCount === posted.length) {
          fullyRegCount++;
        } else if (registeredCount === 0) {
          unregCount++;
        } else {
          partiallyRegCount++;
        }
      });

      const batchDisplay = list[0].batch || "N/A";

      rows.push(`
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <td style="padding: 0.5rem 0.75rem;"><strong>${secName}</strong></td>
          <td style="padding: 0.5rem 0.75rem;">${batchDisplay}</td>
          <td style="padding: 0.5rem 0.75rem;"><span class="badge badge-info">${list.length}</span></td>
          <td style="padding: 0.5rem 0.75rem;"><span class="badge badge-success">${fullyRegCount}</span></td>
          <td style="padding: 0.5rem 0.75rem;"><span class="badge badge-warning">${partiallyRegCount}</span></td>
          <td style="padding: 0.5rem 0.75rem;"><span class="badge badge-danger">${unregCount}</span></td>
        </tr>
      `);
    });

    if (rows.length === 0) {
      breakdownBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No student records found matching the filter.</td></tr>`;
    } else {
      breakdownBody.innerHTML = rows.join("");
    }
  }
};

window.loadRegistrarGradesTable = async () => {
  const tbody = document.getElementById("registrar-grades-table");
  if (!tbody) return;

  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const searchInput = document.getElementById("search-grades");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const students = users.filter(u => u.role === "Student");

  const filteredGrades = grades.filter(g => {
    const student = students.find(s => 
      String(s.id).toLowerCase() === String(g.student_id).toLowerCase() ||
      String(s.studentId || "").toLowerCase() === String(g.student_id).toLowerCase() ||
      String(s.username || "").toLowerCase() === String(g.student_id).toLowerCase()
    );
    const sName = student ? student.name.toLowerCase() : "";
    const sId = String(g.student_id || "").toLowerCase();
    const cCode = String(g.course_code || g.course_id || "").toLowerCase();

    return !query || sName.includes(query) || sId.includes(query) || cCode.includes(query);
  });

  tbody.innerHTML = "";
  if (filteredGrades.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No grade entries found matching your search query.</td></tr>`;
    return;
  }

  filteredGrades.forEach(g => {
    const student = students.find(s => 
      String(s.id).toLowerCase() === String(g.student_id).toLowerCase() ||
      String(s.studentId || "").toLowerCase() === String(g.student_id).toLowerCase() ||
      String(s.username || "").toLowerCase() === String(g.student_id).toLowerCase()
    );
    const sName = student ? student.name : (g.student_id || "Unknown Student");
    const ass = parseFloat(g.assessment_score) || 0;
    const exam = parseFloat(g.exam_score) || 0;
    const total = parseFloat(g.total) || (ass + exam);
    const statusBadge = g.status === "released" ? `<span class="badge badge-success">Released</span>` :
                        g.status === "approved" ? `<span class="badge badge-info">Approved</span>` :
                        g.status === "submitted" ? `<span class="badge badge-warning">Submitted</span>` :
                        `<span class="badge badge-warning">${g.status || 'Pending'}</span>`;

    const updatedAtStr = g.updated_at 
      ? new Date(g.updated_at).toLocaleDateString() + ' ' + new Date(g.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : 'N/A';

    tbody.innerHTML += `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
        <td><strong>${sName}</strong></td>
        <td><code>${g.student_id}</code></td>
        <td><code>${g.course_code || g.course_id}</code></td>
        <td>Semester ${g.semester || 1}</td>
        <td>${ass}</td>
        <td>${exam}</td>
        <td><strong style="color: var(--accent-primary);">${total}</strong></td>
        <td>${statusBadge} ${g.is_revision ? '<span class="badge badge-warning" style="margin-left: 2px;"><i class="fas fa-history"></i> Revised</span>' : ''}</td>
        <td style="font-size: 0.78rem; color: var(--text-secondary);">${updatedAtStr}</td>
        <td>
          <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.viewStudentTranscript('${g.student_id}')"><i class="fas fa-file-invoice"></i> Transcript</button>
        </td>
      </tr>
    `;
  });
};

window.populateRankingDropdowns = async (allUsers) => {
  const classFilter = document.getElementById("ranking-filter-class");
  const batchFilter = document.getElementById("ranking-filter-batch");
  if (!classFilter || !batchFilter) return;

  const currentClassVal = classFilter.value || "all";
  const currentBatchVal = batchFilter.value || "all";

  // Master sections from classes table + student profiles
  const classesData = await db.get("classes") || [];
  const masterClassNames = classesData.map(c => c.name);
  const userSections = allUsers.map(u => u.classSection || u.class_section || u.placementSection || u.placement_section).filter(Boolean);
  
  const defaultSections = [
    "Grade 9-A", "Grade 9-B", "Grade 10-A", "Grade 10-B",
    "Grade 11-A", "Grade 11-B", "Grade 12-A", "Grade 12-B"
  ];

  const uniqueSections = [...new Set([...defaultSections, ...masterClassNames, ...userSections])].sort();

  // Batches from student profiles + default years
  const userBatches = allUsers.map(u => u.batch || u.placedYear || u.placed_year || (u.grade ? `Grade ${u.grade}` : null)).filter(Boolean).map(String);
  const defaultBatches = ["2026 Batch", "2025 Batch", "2024 Batch", "2023 Batch"];
  const uniqueBatches = [...new Set([...defaultBatches, ...userBatches])].sort();

  // Populate Class Section dropdown
  if (classFilter.options.length <= 1 || !classFilter.dataset.populated) {
    classFilter.dataset.populated = "true";
    classFilter.innerHTML = `<option value="all">All Class Sections (${uniqueSections.length})</option>` +
      uniqueSections.map(c => `<option value="${c}" ${c === currentClassVal ? 'selected' : ''}>${c}</option>`).join("");
  }

  // Populate Batch dropdown
  if (batchFilter.options.length <= 1 || !batchFilter.dataset.populated) {
    batchFilter.dataset.populated = "true";
    batchFilter.innerHTML = `<option value="all">All Batches / Years</option>` +
      uniqueBatches.map(b => `<option value="${b}" ${b === currentBatchVal ? 'selected' : ''}>${b}</option>`).join("");
  }
};

window.calculateStudentAveragesAndRanks = (allUsers, gradesData, coursesData = [], classCoursesData = []) => {
  const students = allUsers.filter(u => u.role === "Student");
  if (students.length === 0 || !gradesData || gradesData.length === 0) return students;

  const matchStudentGrade = (st, g) => {
    const gId = String(g.student_id || "").trim().toLowerCase();
    if (!gId) return false;

    const stIds = [
      String(st.id || "").trim().toLowerCase(),
      String(st.studentId || "").trim().toLowerCase(),
      String(st.student_id || "").trim().toLowerCase(),
      String(st.username || "").trim().toLowerCase()
    ].filter(Boolean);

    return stIds.includes(gId);
  };

  // Helper to determine the mandatory total number of courses assigned by the registrar for a student
  const getAssignedCourseCount = (st) => {
    const sec = st.classSection || st.class_section || st.placementSection || st.placement_section;
    const grade = st.grade || st.placedYear || st.batch;
    
    let secCourses = [];
    if (classCoursesData.length > 0) {
      secCourses = classCoursesData.filter(cc => 
        (sec && cc.class_section === sec) || (grade && String(cc.grade) === String(grade))
      );
    }
    
    if (secCourses.length > 0) return secCourses.length;
    if (coursesData.length > 0) return coursesData.length;
    return 0; // Fallback to posted count if no course master registry exists
  };

  const calcSemesterStats = (semNum) => {
    const semGrades = gradesData.filter(g => parseInt(g.semester) === semNum);
    const totals = {};

    students.forEach(st => {
      const stKey = String(st.id);
      const stGrades = semGrades.filter(g => matchStudentGrade(st, g));

      // Deduplicate grades by course code to avoid counting duplicate entries
      const courseMap = {};
      stGrades.forEach(g => {
        const cKey = g.course_code || g.course_id || "default_course";
        courseMap[cKey] = g;
      });

      const uniqueGrades = Object.values(courseMap);

      if (uniqueGrades.length > 0) {
        let sum = 0;
        uniqueGrades.forEach(g => {
          const score = parseFloat(g.total) || (parseFloat(g.assessment_score || 0) + parseFloat(g.exam_score || 0));
          sum += score;
        });

        // MANDATORY RULE: Divide sum by total assigned courses posted by registrar for student to attend
        const totalAssigned = getAssignedCourseCount(st);
        const divisor = totalAssigned > 0 ? totalAssigned : uniqueGrades.length;

        totals[stKey] = { sum, divisor };
      } else {
        const totalAssigned = getAssignedCourseCount(st);
        if (totalAssigned > 0) {
          totals[stKey] = { sum: 0, divisor: totalAssigned };
        }
      }
    });

    const secGroups = {};
    students.forEach(st => {
      const stKey = String(st.id);
      const sec = st.classSection || st.class_section || st.placementSection || st.placement_section || "Unassigned Section";
      if (!secGroups[sec]) secGroups[sec] = [];

      if (totals[stKey] && totals[stKey].divisor > 0) {
        const avg = parseFloat((totals[stKey].sum / totals[stKey].divisor).toFixed(2));
        secGroups[sec].push({ id: st.id, avg });
      }
    });

    const rankMap = {};
    Object.entries(secGroups).forEach(([secName, secSts]) => {
      secSts.sort((a, b) => b.avg - a.avg);
      let curRank = 1;
      let curAvg = -1;
      secSts.forEach((s, idx) => {
        if (s.avg !== curAvg) {
          curRank = idx + 1;
          curAvg = s.avg;
        }
        rankMap[String(s.id)] = { avg: s.avg, rank: curRank, section: secName };
      });
    });

    return rankMap;
  };

  // Step 1: Calculate Semester 1 & Semester 2 averages and section ranks
  const sem1Ranks = calcSemesterStats(1);
  const sem2Ranks = calcSemesterStats(2);

  students.forEach(st => {
    const stKey = String(st.id);
    if (sem1Ranks[stKey]) {
      st.sem1_avg = sem1Ranks[stKey].avg;
      st.sem1_rank = sem1Ranks[stKey].rank;
    }
    if (sem2Ranks[stKey]) {
      st.sem2_avg = sem2Ranks[stKey].avg;
      st.sem2_rank = sem2Ranks[stKey].rank;
    }
  });

  // Step 2: Calculate Yearly Average Grade (Add Sem 1 & Sem 2 score for each course / 2, then sum / total courses)
  const sem1Grades = gradesData.filter(g => parseInt(g.semester) === 1);
  const sem2Grades = gradesData.filter(g => parseInt(g.semester) === 2);

  students.forEach(st => {
    const stSem1 = sem1Grades.filter(g => matchStudentGrade(st, g));
    const stSem2 = sem2Grades.filter(g => matchStudentGrade(st, g));

    const courseMapSem1 = {};
    stSem1.forEach(g => { courseMapSem1[g.course_code || g.course_id || "default_course"] = parseFloat(g.total) || (parseFloat(g.assessment_score || 0) + parseFloat(g.exam_score || 0)); });

    const courseMapSem2 = {};
    stSem2.forEach(g => { courseMapSem2[g.course_code || g.course_id || "default_course"] = parseFloat(g.total) || (parseFloat(g.assessment_score || 0) + parseFloat(g.exam_score || 0)); });

    const allCourseCodes = [...new Set([...Object.keys(courseMapSem1), ...Object.keys(courseMapSem2)])];

    if (allCourseCodes.length > 0) {
      let yearlyCoursesSum = 0;
      allCourseCodes.forEach(code => {
        const s1Score = courseMapSem1[code] !== undefined ? courseMapSem1[code] : null;
        const s2Score = courseMapSem2[code] !== undefined ? courseMapSem2[code] : null;

        let courseYearlyAvg = 0;
        if (s1Score !== null && s2Score !== null) {
          courseYearlyAvg = (s1Score + s2Score) / 2;
        } else if (s1Score !== null) {
          courseYearlyAvg = s1Score;
        } else if (s2Score !== null) {
          courseYearlyAvg = s2Score;
        }
        yearlyCoursesSum += courseYearlyAvg;
      });

      const totalAssigned = getAssignedCourseCount(st);
      const divisor = totalAssigned > 0 ? totalAssigned : allCourseCodes.length;
      st.yearly_avg = parseFloat((yearlyCoursesSum / divisor).toFixed(2));
    } else if (st.sem1_avg !== undefined || st.sem2_avg !== undefined) {
      const s1 = st.sem1_avg !== undefined && st.sem1_avg !== null ? parseFloat(st.sem1_avg) : null;
      const s2 = st.sem2_avg !== undefined && st.sem2_avg !== null ? parseFloat(st.sem2_avg) : null;
      if (s1 !== null && s2 !== null) st.yearly_avg = parseFloat(((s1 + s2) / 2).toFixed(2));
      else if (s1 !== null) st.yearly_avg = s1;
      else if (s2 !== null) st.yearly_avg = s2;
    }
  });

  // Step 3: Calculate Yearly Ranks per section (Compare yearly average grade points across section)
  const yearlySecGroups = {};
  students.forEach(st => {
    if (st.yearly_avg !== undefined && st.yearly_avg !== null) {
      const sec = st.classSection || st.class_section || st.placementSection || st.placement_section || "Unassigned Section";
      if (!yearlySecGroups[sec]) yearlySecGroups[sec] = [];
      yearlySecGroups[sec].push({ id: st.id, avg: st.yearly_avg });
    }
  });

  Object.entries(yearlySecGroups).forEach(([secName, secSts]) => {
    secSts.sort((a, b) => b.avg - a.avg);
    let curRank = 1;
    let curAvg = -1;
    secSts.forEach((s, idx) => {
      if (s.avg !== curAvg) {
        curRank = idx + 1;
        curAvg = s.avg;
      }
      const matchSt = students.find(st => String(st.id) === String(s.id));
      if (matchSt) matchSt.yearly_rank = curRank;
    });
  });

  return students;
};

window.getFilteredRankingData = async () => {
  const usersData = await db.get("users") || [];
  const gradesData = await db.get("grades") || [];
  const coursesData = await db.get("courses") || [];
  const classCoursesData = await db.get("class_courses") || [];
  const allUsers = usersData.filter(u => u.role === "Student");
  
  // Dynamically compute averages and section ranks on-the-fly according to mandatory total assigned courses rule
  window.calculateStudentAveragesAndRanks(allUsers, gradesData, coursesData, classCoursesData);

  const classFilter = document.getElementById("ranking-filter-class");
  const batchFilter = document.getElementById("ranking-filter-batch");
  const semFilter = document.getElementById("ranking-filter-semester");
  const searchInput = document.getElementById("ranking-search");

  await window.populateRankingDropdowns(allUsers);

  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const cls = classFilter ? classFilter.value : "all";
  const bch = batchFilter ? batchFilter.value : "all";
  const sem = semFilter ? semFilter.value : "all";

  const users = allUsers.filter(s => {
    const matchesSearch = (s.name || "").toLowerCase().includes(query) || (s.id || "").toLowerCase().includes(query);
    const studentSec = s.classSection || s.class_section || s.placementSection || s.placement_section;
    const matchesClass = cls === "all" || studentSec === cls;
    const studentBatch = String(s.batch || s.placedYear || s.placed_year || "");
    const matchesBatch = bch === "all" || studentBatch === bch || bch.includes(studentBatch);
    return matchesSearch && matchesClass && matchesBatch;
  });

  // Sort based on selected semester filter
  users.sort((a, b) => {
    if (sem === "1") {
      if (a.sem1_rank && b.sem1_rank) return a.sem1_rank - b.sem1_rank;
      return (parseFloat(b.sem1_avg) || 0) - (parseFloat(a.sem1_avg) || 0);
    } else if (sem === "2") {
      if (a.sem2_rank && b.sem2_rank) return a.sem2_rank - b.sem2_rank;
      return (parseFloat(b.sem2_avg) || 0) - (parseFloat(a.sem2_avg) || 0);
    } else {
      if (a.yearly_rank && b.yearly_rank) return a.yearly_rank - b.yearly_rank;
      if (a.sem2_rank && b.sem2_rank) return a.sem2_rank - b.sem2_rank;
      if (a.sem1_rank && b.sem1_rank) return a.sem1_rank - b.sem1_rank;
      return a.name.localeCompare(b.name);
    }
  });

  return { students: users, cls, bch, sem, allUsers };
};

window.loadRankingTable = async () => {
  const tbody = document.getElementById("ranking-table-body");
  const thead = document.getElementById("ranking-table-head");
  const classFilter = document.getElementById("ranking-filter-class");
  const batchFilter = document.getElementById("ranking-filter-batch");
  const semFilter = document.getElementById("ranking-filter-semester");
  const searchInput = document.getElementById("ranking-search");

  if (!tbody) return;

  const { students, cls, sem } = await window.getFilteredRankingData();

  // Bind event listeners if not already bound
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.addEventListener("input", window.loadRankingTable);
    if (classFilter) classFilter.addEventListener("change", window.loadRankingTable);
    if (batchFilter) batchFilter.addEventListener("change", window.loadRankingTable);
    if (semFilter) semFilter.addEventListener("change", window.loadRankingTable);
  }

  // Update dynamic Table Header
  if (thead) {
    if (sem === "1") {
      thead.innerHTML = `
        <tr>
          <th>Student Name</th>
          <th>Student ID</th>
          <th>Class Section</th>
          <th>Sem 1 Average</th>
          <th>Section Rank (Sem 1)</th>
          <th>Actions</th>
        </tr>
      `;
    } else if (sem === "2") {
      thead.innerHTML = `
        <tr>
          <th>Student Name</th>
          <th>Student ID</th>
          <th>Class Section</th>
          <th>Sem 2 Average</th>
          <th>Section Rank (Sem 2)</th>
          <th>Actions</th>
        </tr>
      `;
    } else {
      thead.innerHTML = `
        <tr>
          <th>Student Name</th>
          <th>Student ID</th>
          <th>Class Section</th>
          <th>Sem 1 (Avg / Rank)</th>
          <th>Sem 2 (Avg / Rank)</th>
          <th>Yearly (Avg / Rank)</th>
          <th>Actions</th>
        </tr>
      `;
    }
  }

  tbody.innerHTML = "";
  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No students found matching the selected class section and semester filters.</td></tr>`;
    return;
  }

  students.forEach(s => {
    const s1Info = s.sem1_avg ? `${s.sem1_avg}% / <span class="badge badge-info">Rank ${s.sem1_rank || 'N/A'}</span>` : `<span style="color:var(--text-tertiary);">N/A</span>`;
    const s2Info = s.sem2_avg ? `${s.sem2_avg}% / <span class="badge badge-info">Rank ${s.sem2_rank || 'N/A'}</span>` : `<span style="color:var(--text-tertiary);">N/A</span>`;
    const yrInfo = s.yearly_avg ? `${s.yearly_avg}% / <span class="badge badge-success">Rank ${s.yearly_rank || 'N/A'}</span>` : `<span style="color:var(--text-tertiary);">N/A</span>`;
    
    let rowsHtml = "";
    if (sem === "1") {
      rowsHtml = `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td><code>${s.id}</code></td>
          <td>${s.classSection || s.class_section || "Unassigned"}</td>
          <td><strong>${s.sem1_avg ? s.sem1_avg + '%' : 'N/A'}</strong></td>
          <td>${s.sem1_rank ? `<span class="badge badge-info">Rank ${s.sem1_rank}</span>` : `<span style="color:var(--text-tertiary);">N/A</span>`}</td>
          <td>
            <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.viewStudentTranscript('${s.id}')"><i class="fas fa-file-invoice"></i> Report Card</button>
          </td>
        </tr>
      `;
    } else if (sem === "2") {
      rowsHtml = `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td><code>${s.id}</code></td>
          <td>${s.classSection || s.class_section || "Unassigned"}</td>
          <td><strong>${s.sem2_avg ? s.sem2_avg + '%' : 'N/A'}</strong></td>
          <td>${s.sem2_rank ? `<span class="badge badge-info">Rank ${s.sem2_rank}</span>` : `<span style="color:var(--text-tertiary);">N/A</span>`}</td>
          <td>
            <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.viewStudentTranscript('${s.id}')"><i class="fas fa-file-invoice"></i> Report Card</button>
          </td>
        </tr>
      `;
    } else {
      rowsHtml = `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td><code>${s.id}</code></td>
          <td>${s.classSection || s.class_section || "Unassigned"}</td>
          <td>${s1Info}</td>
          <td>${s2Info}</td>
          <td>${yrInfo}</td>
          <td>
            <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.viewStudentTranscript('${s.id}')"><i class="fas fa-file-invoice"></i> Report Card</button>
          </td>
        </tr>
      `;
    }
    tbody.innerHTML += rowsHtml;
  });
};

window.exportRankingToCSV = async () => {
  const { students, cls, sem } = await window.getFilteredRankingData();
  if (students.length === 0) {
    alert("No student data available for the selected filters.");
    return;
  }

  const termText = sem === "1" ? "First_Semester" : sem === "2" ? "Second_Semester" : "Yearly_Both_Semesters";
  let csv = `Higa Model Boarding School - Official Student Ranking Report\n`;
  csv += `Class Section: ${cls === 'all' ? 'All Sections' : cls}, Period: ${termText.replace(/_/g, " ")}, Date: ${new Date().toLocaleDateString()}\n\n`;

  if (sem === "1") {
    csv += `"Student ID","Full Name","Class Section","Semester 1 Avg (%)","Semester 1 Rank"\n`;
    students.forEach(s => {
      csv += `"${s.id}","${s.name}","${s.classSection || s.class_section || 'Unassigned'}","${s.sem1_avg || 'N/A'}","${s.sem1_rank || 'N/A'}"\n`;
    });
  } else if (sem === "2") {
    csv += `"Student ID","Full Name","Class Section","Semester 2 Avg (%)","Semester 2 Rank"\n`;
    students.forEach(s => {
      csv += `"${s.id}","${s.name}","${s.classSection || s.class_section || 'Unassigned'}","${s.sem2_avg || 'N/A'}","${s.sem2_rank || 'N/A'}"\n`;
    });
  } else {
    csv += `"Student ID","Full Name","Class Section","Sem 1 Avg (%)","Sem 1 Rank","Sem 2 Avg (%)","Sem 2 Rank","Yearly Avg (%)","Yearly Rank"\n`;
    students.forEach(s => {
      csv += `"${s.id}","${s.name}","${s.classSection || s.class_section || 'Unassigned'}","${s.sem1_avg || 'N/A'}","${s.sem1_rank || 'N/A'}","${s.sem2_avg || 'N/A'}","${s.sem2_rank || 'N/A'}","${s.yearly_avg || 'N/A'}","${s.yearly_rank || 'N/A'}"\n`;
    });
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Student_Ranking_${cls}_${termText}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportRankingToWord = async () => {
  const { students, cls, sem } = await window.getFilteredRankingData();
  if (students.length === 0) {
    alert("No student data available for the selected filters.");
    return;
  }

  const termText = sem === "1" ? "First Semester" : sem === "2" ? "Second Semester" : "Yearly / Both Semesters";
  
  let tableHeaders = "";
  let tableRows = "";

  if (sem === "1") {
    tableHeaders = `<th>Student ID</th><th>Full Name</th><th>Class Section</th><th>Sem 1 Average</th><th>Section Rank</th>`;
    tableRows = students.map(s => `
      <tr>
        <td>${s.id}</td>
        <td><b>${s.name}</b></td>
        <td>${s.classSection || s.class_section || 'Unassigned'}</td>
        <td>${s.sem1_avg ? s.sem1_avg + '%' : 'N/A'}</td>
        <td><b>${s.sem1_rank ? 'Rank ' + s.sem1_rank : 'N/A'}</b></td>
      </tr>
    `).join("");
  } else if (sem === "2") {
    tableHeaders = `<th>Student ID</th><th>Full Name</th><th>Class Section</th><th>Sem 2 Average</th><th>Section Rank</th>`;
    tableRows = students.map(s => `
      <tr>
        <td>${s.id}</td>
        <td><b>${s.name}</b></td>
        <td>${s.classSection || s.class_section || 'Unassigned'}</td>
        <td>${s.sem2_avg ? s.sem2_avg + '%' : 'N/A'}</td>
        <td><b>${s.sem2_rank ? 'Rank ' + s.sem2_rank : 'N/A'}</b></td>
      </tr>
    `).join("");
  } else {
    tableHeaders = `<th>Student ID</th><th>Full Name</th><th>Class Section</th><th>Sem 1 (Avg / Rank)</th><th>Sem 2 (Avg / Rank)</th><th>Yearly Avg</th><th>Yearly Rank</th>`;
    tableRows = students.map(s => `
      <tr>
        <td>${s.id}</td>
        <td><b>${s.name}</b></td>
        <td>${s.classSection || s.class_section || 'Unassigned'}</td>
        <td>${s.sem1_avg ? s.sem1_avg + '% (R' + s.sem1_rank + ')' : 'N/A'}</td>
        <td>${s.sem2_avg ? s.sem2_avg + '% (R' + s.sem2_rank + ')' : 'N/A'}</td>
        <td>${s.yearly_avg ? s.yearly_avg + '%' : 'N/A'}</td>
        <td><b>${s.yearly_rank ? 'Rank ' + s.yearly_rank : 'N/A'}</b></td>
      </tr>
    `).join("");
  }

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Student Ranking Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { color: #1e3a8a; }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; }
      </style>
    </head>
    <body>
      <h2>HIGA MODEL BOARDING SCHOOL</h2>
      <h3>Official Student Ranking Report</h3>
      <p><b>Class Section:</b> ${cls === 'all' ? 'All Sections' : cls} | <b>Period:</b> ${termText} | <b>Date:</b> ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Student_Ranking_${cls}_${termText.replace(/\s+/g, "_")}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.printRankingReport = async () => {
  const { students, cls, sem } = await window.getFilteredRankingData();
  if (students.length === 0) {
    alert("No student data available for the selected filters.");
    return;
  }

  const termText = sem === "1" ? "First Semester" : sem === "2" ? "Second Semester" : "Yearly / Both Semesters";
  
  let tableHeaders = "";
  let tableRows = "";

  if (sem === "1") {
    tableHeaders = `<th>#</th><th>Student ID</th><th>Full Name</th><th>Class Section</th><th>Sem 1 Average</th><th>Section Rank</th>`;
    tableRows = students.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><code>${s.id}</code></td>
        <td><b>${s.name}</b></td>
        <td>${s.classSection || s.class_section || 'Unassigned'}</td>
        <td>${s.sem1_avg ? s.sem1_avg + '%' : 'N/A'}</td>
        <td><b>${s.sem1_rank ? 'Rank ' + s.sem1_rank : 'N/A'}</b></td>
      </tr>
    `).join("");
  } else if (sem === "2") {
    tableHeaders = `<th>#</th><th>Student ID</th><th>Full Name</th><th>Class Section</th><th>Sem 2 Average</th><th>Section Rank</th>`;
    tableRows = students.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><code>${s.id}</code></td>
        <td><b>${s.name}</b></td>
        <td>${s.classSection || s.class_section || 'Unassigned'}</td>
        <td>${s.sem2_avg ? s.sem2_avg + '%' : 'N/A'}</td>
        <td><b>${s.sem2_rank ? 'Rank ' + s.sem2_rank : 'N/A'}</b></td>
      </tr>
    `).join("");
  } else {
    tableHeaders = `<th>#</th><th>Student ID</th><th>Full Name</th><th>Class Section</th><th>Sem 1 (Avg / Rank)</th><th>Sem 2 (Avg / Rank)</th><th>Yearly Avg</th><th>Yearly Rank</th>`;
    tableRows = students.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><code>${s.id}</code></td>
        <td><b>${s.name}</b></td>
        <td>${s.classSection || s.class_section || 'Unassigned'}</td>
        <td>${s.sem1_avg ? s.sem1_avg + '% (R' + s.sem1_rank + ')' : 'N/A'}</td>
        <td>${s.sem2_avg ? s.sem2_avg + '% (R' + s.sem2_rank + ')' : 'N/A'}</td>
        <td>${s.yearly_avg ? s.yearly_avg + '%' : 'N/A'}</td>
        <td><b>${s.yearly_rank ? 'Rank ' + s.yearly_rank : 'N/A'}</b></td>
      </tr>
    `).join("");
  }

  const printWin = window.open('', '', 'width=900,height=700');
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Ranking Report - ${cls}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #1e3a8a; font-size: 22px; }
        .header h3 { margin: 5px 0 0 0; color: #4b5563; font-size: 14px; font-weight: normal; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 13px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #9ca3af; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; color: #1f2937; }
        tr:nth-child(even) { background-color: #f9fafb; }
        @media print {
          @page { size: auto; margin: 15mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HIGA MODEL BOARDING SCHOOL</h1>
        <h3>Office of the Main Registrar - Official Student Section Rankings</h3>
      </div>
      <div class="meta">
        <div>Class Section: ${cls === 'all' ? 'All Sections' : cls}</div>
        <div>Period: ${termText}</div>
        <div>Date: ${new Date().toLocaleDateString()}</div>
      </div>
      <table>
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
        <div>Prepared By: Main Registrar Office</div>
        <div>Approved By: School Principal</div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
};

window.calculateRanks = async (semester) => {
  const gradesData = await db.get("grades") || [];
  const semInt = parseInt(semester);

  // Allow rank calculation on any posted/available grades in the system
  const grades = gradesData.filter(g => parseInt(g.semester) === semInt);
  const users = await db.get("users") || [];
  const students = users.filter(u => u.role === "Student");
  
  if (grades.length === 0) {
    alert(`No grade records found in the system for Semester ${semInt}. Please post grades first.`);
    return;
  }

  // Group grade total & count by student ID (type-safe matching)
  const studentTotals = {};
  grades.forEach(g => {
    const sId = String(g.student_id);
    if (!studentTotals[sId]) studentTotals[sId] = { sum: 0, count: 0 };
    studentTotals[sId].sum += parseFloat(g.total) || 0;
    studentTotals[sId].count += 1;
  });

  // Group student averages by class section
  const sectionGroups = {};
  students.forEach(st => {
    const section = st.classSection || st.class_section || st.placementSection || st.placement_section || "Unassigned Section";
    if (!sectionGroups[section]) sectionGroups[section] = [];
    
    const sId = String(st.id);
    if (studentTotals[sId] && studentTotals[sId].count > 0) {
      const avg = parseFloat((studentTotals[sId].sum / studentTotals[sId].count).toFixed(2));
      sectionGroups[section].push({ id: st.id, avg });
    }
  });

  // Assign ranks WITHIN EACH SECTION
  const rankedStudentMap = {};
  Object.entries(sectionGroups).forEach(([secName, secStudents]) => {
    secStudents.sort((a, b) => b.avg - a.avg);

    let currentRank = 1;
    let currentAvg = -1;

    secStudents.forEach((s, index) => {
      if (s.avg !== currentAvg) {
        currentRank = index + 1;
        currentAvg = s.avg;
      }
      rankedStudentMap[String(s.id)] = { avg: s.avg, rank: currentRank, section: secName };
    });
  });

  // Update users table with section-based ranks
  const updatedUsers = users.map(u => {
    if (u.role === "Student" && rankedStudentMap[String(u.id)]) {
      const stats = rankedStudentMap[String(u.id)];
      if (semInt === 1) {
        u.sem1_avg = stats.avg;
        u.sem1_rank = stats.rank;
      } else {
        u.sem2_avg = stats.avg;
        u.sem2_rank = stats.rank;
      }
    }
    return u;
  });

  await db.set("users", updatedUsers);

  // Sync to student_ranks table for audit & review history
  const currentRanks = await db.get("student_ranks") || [];
  students.forEach(st => {
    const sId = String(st.id);
    if (rankedStudentMap[sId]) {
      const stats = rankedStudentMap[sId];
      const existingIdx = currentRanks.findIndex(r => String(r.student_id) === sId && parseInt(r.year) === 2026);
      const rankEntry = {
        id: `rank_${sId}_2026`,
        student_id: st.id,
        year: 2026,
        class_section: stats.section,
        semester_1_average: semInt === 1 ? stats.avg : (st.sem1_avg || null),
        semester_1_rank: semInt === 1 ? stats.rank : (st.sem1_rank || null),
        semester_2_average: semInt === 2 ? stats.avg : (st.sem2_avg || null),
        semester_2_rank: semInt === 2 ? stats.rank : (st.sem2_rank || null),
        status: 'calculated'
      };

      if (existingIdx > -1) {
        currentRanks[existingIdx] = { ...currentRanks[existingIdx], ...rankEntry };
      } else {
        currentRanks.push(rankEntry);
      }
    }
  });

  await db.set("student_ranks", currentRanks);

  alert(`Semester ${semInt} averages and section-based ranks calculated successfully!`);
  if (window.loadRankingTable) window.loadRankingTable();
};

window.calculateYearlyRanks = async () => {
  const users = await db.get("users") || [];
  const students = users.filter(u => u.role === "Student");
  
  // Group student yearly averages by class section
  const sectionGroups = {};
  students.forEach(st => {
    if (st.sem1_avg !== undefined && st.sem2_avg !== undefined) {
      const section = st.classSection || st.class_section || st.placementSection || st.placement_section || "Unassigned Section";
      if (!sectionGroups[section]) sectionGroups[section] = [];
      const yrAvg = parseFloat(( (parseFloat(st.sem1_avg) + parseFloat(st.sem2_avg)) / 2 ).toFixed(2));
      sectionGroups[section].push({ id: st.id, avg: yrAvg });
    }
  });

  // Fallback: If not all students have both sem1 & sem2, calculate yearly rank using any available sem1 or sem2 average
  if (Object.keys(sectionGroups).length === 0) {
    students.forEach(st => {
      const sem1 = st.sem1_avg !== undefined ? parseFloat(st.sem1_avg) : null;
      const sem2 = st.sem2_avg !== undefined ? parseFloat(st.sem2_avg) : null;
      let yrAvg = null;
      if (sem1 !== null && sem2 !== null) yrAvg = (sem1 + sem2) / 2;
      else if (sem1 !== null) yrAvg = sem1;
      else if (sem2 !== null) yrAvg = sem2;

      if (yrAvg !== null) {
        const section = st.classSection || st.class_section || st.placementSection || st.placement_section || "Unassigned Section";
        if (!sectionGroups[section]) sectionGroups[section] = [];
        sectionGroups[section].push({ id: st.id, avg: parseFloat(yrAvg.toFixed(2)) });
      }
    });
  }

  if (Object.keys(sectionGroups).length === 0) {
    alert("No student averages available. Calculate Semester 1 or Semester 2 ranks first.");
    return;
  }

  // Assign yearly ranks WITHIN EACH SECTION
  const rankedStudentMap = {};
  Object.entries(sectionGroups).forEach(([secName, secStudents]) => {
    secStudents.sort((a, b) => b.avg - a.avg);

    let currentRank = 1;
    let currentAvg = -1;

    secStudents.forEach((s, index) => {
      if (s.avg !== currentAvg) {
        currentRank = index + 1;
        currentAvg = s.avg;
      }
      rankedStudentMap[String(s.id)] = { avg: s.avg, rank: currentRank };
    });
  });

  // Update users table with section-based yearly ranks
  const updatedUsers = users.map(u => {
    if (u.role === "Student" && rankedStudentMap[String(u.id)]) {
      const stats = rankedStudentMap[String(u.id)];
      u.yearly_avg = stats.avg;
      u.yearly_rank = stats.rank;
    }
    return u;
  });

  await db.set("users", updatedUsers);

  // Sync to student_ranks table for audit & review history
  const currentRanks = await db.get("student_ranks") || [];
  students.forEach(st => {
    const sId = String(st.id);
    if (rankedStudentMap[sId]) {
      const stats = rankedStudentMap[sId];
      const existingIdx = currentRanks.findIndex(r => String(r.student_id) === sId && parseInt(r.year) === 2026);
      const rankEntry = {
        id: `rank_${sId}_2026`,
        student_id: st.id,
        year: 2026,
        yearly_average: stats.avg,
        yearly_rank: stats.rank,
        status: 'calculated'
      };

      if (existingIdx > -1) {
        currentRanks[existingIdx] = { ...currentRanks[existingIdx], ...rankEntry };
      } else {
        currentRanks.push(rankEntry);
      }
    }
  });

  await db.set("student_ranks", currentRanks);

  alert("Yearly averages and section-based ranks calculated successfully!");
  if (window.loadRankingTable) window.loadRankingTable();
};

// ==========================================
// GALLERY & MOMENTS LOGIC
// ==========================================
window.loadGalleryMomentsTable = async () => {
  const tbody = document.getElementById("moments-table-body");
  if (!tbody) return;

  const moments = await db.get("gallery_moments") || [];
  tbody.innerHTML = "";

  if (moments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No gallery moments or events posted.</td></tr>`;
    return;
  }

  // Sort by date desc
  moments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  moments.forEach(async m => {
    const urlsCount = m.media_urls ? m.media_urls.length : 0;
    const author = m.author_id || "Unknown";
    const dateStr = new Date(m.created_at).toLocaleDateString();

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="font-weight: 500;">${m.title}</div>
          <div style="font-size: 0.8rem; color: var(--accent-primary);">${m.category} ${m.batch ? '(Batch ' + m.batch + ')' : ''}</div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">${urlsCount} Media Items</div>
        </td>
        <td><div style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.description}</div></td>
        <td><code>${author}</code></td>
        <td>
          <div>${dateStr}</div>
          <div style="font-size: 0.75rem; color: var(--accent-warning);">Expires: ${m.expiry_date || 'Never'}</div>
        </td>
        <td>
          <button class="btn-icon-sm" onclick="window.editMoment('${m.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteMoment('${m.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
  });
};

window.editMoment = async (id) => {
  const moments = await db.get("gallery_moments") || [];
  const m = moments.find(x => x.id === id);
  if (!m) return;

  document.getElementById("moment-id").value = m.id;
  document.getElementById("moment-title").value = m.title;
  document.getElementById("moment-category").value = m.category;
  document.getElementById("moment-batch").value = m.batch || "";
  document.getElementById("moment-media").value = (m.media_urls || []).join("\n");
  document.getElementById("moment-expiry").value = m.expiry_date || "";
  document.getElementById("moment-description").value = m.description || "";

  document.getElementById("moment-modal-title").innerText = "Edit Special Moment";
  window.showPortalModal("gallery-moment-modal");
};

window.deleteMoment = async (id) => {
  if (!confirm("Are you sure you want to delete this moment?")) return;
  const moments = await db.get("gallery_moments") || [];
  await db.set("gallery_moments", moments.filter(m => m.id !== id));
  window.loadGalleryMomentsTable();
};

const momentForm = document.getElementById("moment-form");
if (momentForm) {
  momentForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("moment-id").value;
    const title = document.getElementById("moment-title").value.trim();
    const category = document.getElementById("moment-category").value;
    const batch = document.getElementById("moment-batch").value.trim();
    const mediaRaw = document.getElementById("moment-media").value.trim();
    const expiry = document.getElementById("moment-expiry").value;
    const desc = document.getElementById("moment-description").value.trim();

    const rawLines = mediaRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const mediaUrls = [];
    for (const line of rawLines) {
      if (line.startsWith("data:")) {
        mediaUrls.push(line);
      } else {
        const parts = line.split(",").map(s => s.trim()).filter(Boolean);
        mediaUrls.push(...parts);
      }
    }
    const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));

    const moments = await db.get("gallery_moments") || [];

    if (id) {
      // Edit
      const updated = moments.map(m => {
        if (m.id === id) {
          return { ...m, title, category, batch, media_urls: mediaUrls, expiry_date: expiry, description: desc };
        }
        return m;
      });
      await db.set("gallery_moments", updated);
      alert("Moment updated successfully.");
    } else {
      // Create
      const newId = "mom-" + Date.now();
      moments.push({
        id: newId,
        title,
        category,
        batch,
        media_urls: mediaUrls,
        expiry_date: expiry,
        description: desc,
        author_id: currentUser.id,
        created_at: new Date().toISOString()
      });
      await db.set("gallery_moments", moments);
      alert("New moment posted successfully.");
    }

    window.hidePortalModal("gallery-moment-modal");
    if (document.getElementById("moments-table-body")) {
      window.loadGalleryMomentsTable();
    }
  };
}



const alumniForm = document.getElementById("alumni-form");
if (alumniForm) {
  alumniForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("alumni-id").value;
    const name = document.getElementById("alumni-name").value.trim();
    const score = parseFloat(document.getElementById("alumni-score").value);
    const university = document.getElementById("alumni-university").value.trim();
    const department = document.getElementById("alumni-department").value.trim();
    const year = parseInt(document.getElementById("alumni-year").value);
    
    const mediaRaw = document.getElementById("alumni-media").value.trim();
    const mediaUrls = mediaRaw.split(/\r?\n|,\s+/).map(s => s.trim()).filter(s => s.length > 0);

    const records = await db.get("alumni_records") || [];

    if (id) {
      const updated = records.map(r => {
        if (r.id === id) {
          return { ...r, student_name: name, entrance_score: score, university_joined: university, department, graduation_year: year, media_urls: mediaUrls };
        }
        return r;
      });
      await db.set("alumni_records", updated);
      alert("Alumni record updated.");
    } else {
      const newId = "alum-" + Date.now();
      records.push({
        id: newId,
        student_id: "Ext-" + newId, // Generic if not linked to system
        student_name: name,
        entrance_score: score,
        university_joined: university,
        department,
        graduation_year: year,
        media_urls: mediaUrls,
        created_at: new Date().toISOString()
      });
      await db.set("alumni_records", records);
      alert("Alumni record added.");
    }

    window.hidePortalModal("alumni-record-modal");
    if (document.getElementById("alumni-table-body")) {
      window.loadAlumniRecordsTable();
    }
  };
}



// ==========================================
// ALUMNI RECORDS LOGIC
// ==========================================
window.loadAlumniRecordsTable = async () => {
  const tbody = document.getElementById("alumni-table-body");
  if (!tbody) return;

  const records = await db.get("alumni_records") || [];
  tbody.innerHTML = "";

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No alumni records found.</td></tr>`;
    return;
  }

  records.sort((a, b) => b.graduation_year - a.graduation_year);

  records.forEach(async r => {
    const mediaCount = r.media_urls ? r.media_urls.length : 0;
    tbody.innerHTML += `
      <tr>
        <td>
          <strong>${r.student_name}</strong>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">${mediaCount} Media Items</div>
        </td>
        <td>${r.graduation_year}</td>
        <td><span style="color: var(--accent-primary); font-weight: bold;">${r.entrance_score}</span></td>
        <td>${r.university_joined}</td>
        <td>${r.department}</td>
        <td>
          <button class="btn-icon-sm" onclick="window.editAlumni('${r.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteAlumni('${r.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
  });
};

window.editAlumni = async (id) => {
  const records = await db.get("alumni_records") || [];
  const r = records.find(x => x.id === id);
  if (!r) return;

  document.getElementById("alumni-id").value = r.id;
  document.getElementById("alumni-name").value = r.student_name;
  document.getElementById("alumni-score").value = r.entrance_score;
  document.getElementById("alumni-university").value = r.university_joined;
  document.getElementById("alumni-department").value = r.department;
  document.getElementById("alumni-year").value = r.graduation_year;
  
  const mediaEl = document.getElementById("alumni-media");
  if (mediaEl) mediaEl.value = (r.media_urls || []).join(", ");

  document.getElementById("alumni-modal-title").innerText = "Edit Alumni Record";
  window.showPortalModal("alumni-record-modal");
};

window.deleteAlumni = async (id) => {
  if (!confirm("Are you sure you want to delete this alumni record?")) return;
  const records = await db.get("alumni_records") || [];
  await db.set("alumni_records", records.filter(r => r.id !== id));
  window.loadAlumniRecordsTable();
};

// ==========================================
// ACADEMIC PROGRAMS LOGIC
// ==========================================
const programForm = document.getElementById("program-form");
if (programForm) {
  programForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("program-id").value;
    const title = document.getElementById("program-title").value.trim();
    const duration = document.getElementById("program-duration").value.trim();
    const reqs = document.getElementById("program-reqs").value.trim();
    const desc = document.getElementById("program-desc").value.trim();

    const programs = await db.get("academic_programs") || [];

    if (id) {
      const updated = programs.map(p => {
        if (p.id === id) return { ...p, title, duration, requirements: reqs, description: desc };
        return p;
      });
      await db.set("academic_programs", updated);
      alert("Academic Program updated successfully.");
    } else {
      programs.push({
        id: "prog-" + Date.now(),
        title,
        duration,
        requirements: reqs,
        description: desc,
        created_at: new Date().toISOString()
      });
      await db.set("academic_programs", programs);
      alert("New Academic Program published.");
    }

    window.hidePortalModal("program-modal");
    if (document.getElementById("programs-table-body")) {
      window.loadProgramsTable();
    }
  };
}

window.loadProgramsTable = async () => {
  const tbody = document.getElementById("programs-table-body");
  if (!tbody) return;
  const programs = await db.get("academic_programs") || [];
  tbody.innerHTML = "";
  if (programs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No academic programs published yet.</td></tr>`;
    return;
  }
  programs.forEach(async p => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${p.title}</strong></td>
        <td>${p.duration}</td>
        <td><span style="font-size: 0.85rem; color: var(--text-secondary);">${p.requirements}</span></td>
        <td>
          <button class="btn-icon-sm" onclick="window.editProgram('${p.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteProgram('${p.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
  });
};

window.editProgram = async (id) => {
  const p = (await db.get("academic_programs") || []).find(x => x.id === id);
  if (!p) return;
  document.getElementById("program-id").value = p.id;
  document.getElementById("program-title").value = p.title;
  document.getElementById("program-duration").value = p.duration || "";
  document.getElementById("program-reqs").value = p.requirements || "";
  document.getElementById("program-desc").value = p.description || "";
  document.getElementById("program-modal-title").innerText = "Edit Academic Program";
  window.showPortalModal("program-modal");
};

window.deleteProgram = async (id) => {
  if (!confirm("Are you sure you want to delete this program?")) return;
  const programs = await db.get("academic_programs") || [];
  await db.set("academic_programs", programs.filter(x => x.id !== id));
  window.loadProgramsTable();
};

// ==========================================
// VACANCIES & NEWS LOGIC
// ==========================================
const vacancyForm = document.getElementById("vacancy-form");
if (vacancyForm) {
  vacancyForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("vacancy-id").value;
    const type = document.getElementById("vacancy-type").value;
    const title = document.getElementById("vacancy-title").value.trim();
    const days = document.getElementById("vacancy-days") ? document.getElementById("vacancy-days").value.trim() : "";
    const expiry = document.getElementById("vacancy-expiry").value;
    const appType = document.getElementById("vacancy-app-type") ? document.getElementById("vacancy-app-type").value.trim() : "";
    const examDate = document.getElementById("vacancy-exam-date") ? document.getElementById("vacancy-exam-date").value.trim() : "";
    const examTime = document.getElementById("vacancy-exam-time") ? document.getElementById("vacancy-exam-time").value.trim() : "";
    const examVenue = document.getElementById("vacancy-exam-venue") ? document.getElementById("vacancy-exam-venue").value.trim() : "";
    const interviewDate = document.getElementById("vacancy-interview-date") ? document.getElementById("vacancy-interview-date").value.trim() : (document.getElementById("vacancy-interview") ? document.getElementById("vacancy-interview").value.trim() : "");
    const interviewTime = document.getElementById("vacancy-interview-time") ? document.getElementById("vacancy-interview-time").value.trim() : "";
    const interviewVenue = document.getElementById("vacancy-interview-venue") ? document.getElementById("vacancy-interview-venue").value.trim() : "";
    const examCallNotes = document.getElementById("vacancy-exam-notes") ? document.getElementById("vacancy-exam-notes").value.trim() : "";
    const desc = document.getElementById("vacancy-desc").value.trim();

    const vacancies = await db.get("vacancies") || [];

    if (id) {
      const updated = vacancies.map(v => {
        if (v.id === id) return {
          ...v,
          type,
          title,
          application_days: days,
          expiry_date: expiry,
          application_type: appType,
          written_exam_date: examDate,
          written_exam_time: examTime,
          written_exam_venue: examVenue,
          interview_date: interviewDate,
          interview_time: interviewTime,
          interview_venue: interviewVenue,
          exam_call_notes: examCallNotes,
          description: desc
        };
        return v;
      });
      await db.set("vacancies", updated);
      alert("Vacancy / News updated.");
    } else {
      vacancies.push({
        id: "vac-" + Date.now(),
        type,
        title,
        application_days: days,
        expiry_date: expiry,
        application_type: appType,
        written_exam_date: examDate,
        written_exam_time: examTime,
        written_exam_venue: examVenue,
        interview_date: interviewDate,
        interview_time: interviewTime,
        interview_venue: interviewVenue,
        exam_call_notes: examCallNotes,
        description: desc,
        created_at: new Date().toISOString()
      });
      await db.set("vacancies", vacancies);
      alert("New Vacancy / News published.");
    }

    window.hidePortalModal("vacancy-modal");
    if (document.getElementById("vacancies-table-body")) {
      window.loadVacanciesTable();
    }
  };
}

window.loadVacanciesTable = async () => {
  const tbody = document.getElementById("vacancies-table-body");
  if (!tbody) return;
  const vacancies = await db.get("vacancies") || [];
  const results = await db.get("vacancy_results") || [];
  tbody.innerHTML = "";

  if (vacancies.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No vacancies or news published yet.</td></tr>`;
    return;
  }

  vacancies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  vacancies.forEach(async v => {
    const resCount = results.filter(r => r.vacancy_id === v.id).length;
    tbody.innerHTML += `
      <tr>
        <td><span class="badge badge-info" style="font-size: 0.75rem;">${v.type}</span></td>
        <td>
          <strong>${v.title}</strong>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">Apply: ${v.application_days || "N/A"}</div>
          ${v.expiry_date ? `<div style="font-size: 0.8rem; color: var(--accent-danger); margin-top: 2px;">Closes: ${v.expiry_date}</div>` : ''}
        </td>
        <td>
          <div style="font-size: 0.82rem;"><i class="fas fa-pen" style="color: var(--accent-primary);"></i> <strong>Exam:</strong> ${v.written_exam_date || "-"} ${v.written_exam_time ? `(${v.written_exam_time})` : ''} ${v.written_exam_venue ? `@ ${v.written_exam_venue}` : ''}</div>
          <div style="font-size: 0.82rem; margin-top: 2px;"><i class="fas fa-comments" style="color: var(--accent-secondary);"></i> <strong>Interview:</strong> ${v.interview_date || "-"} ${v.interview_time ? `(${v.interview_time})` : ''} ${v.interview_venue ? `@ ${v.interview_venue}` : ''}</div>
        </td>
        <td>
          <button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="window.viewVacancyResults('${v.id}', '${v.title.replace(/'/g, "\\'")}')">
            ${resCount} Examinees
          </button>
        </td>
        <td>
          <button class="btn-icon-sm" onclick="window.editVacancy('${v.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteVacancy('${v.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
  });
};

window.editVacancy = async (id) => {
  const v = (await db.get("vacancies") || []).find(x => x.id === id);
  if (!v) return;
  document.getElementById("vacancy-id").value = v.id;
  document.getElementById("vacancy-type").value = v.type;
  document.getElementById("vacancy-title").value = v.title;
  if (document.getElementById("vacancy-days")) document.getElementById("vacancy-days").value = v.application_days || "";
  document.getElementById("vacancy-expiry").value = v.expiry_date || "";
  if (document.getElementById("vacancy-app-type")) document.getElementById("vacancy-app-type").value = v.application_type || "";
  
  if (document.getElementById("vacancy-exam-date")) document.getElementById("vacancy-exam-date").value = v.written_exam_date || "";
  if (document.getElementById("vacancy-exam-time")) document.getElementById("vacancy-exam-time").value = v.written_exam_time || "";
  if (document.getElementById("vacancy-exam-venue")) document.getElementById("vacancy-exam-venue").value = v.written_exam_venue || "";
  
  if (document.getElementById("vacancy-interview-date")) document.getElementById("vacancy-interview-date").value = v.interview_date || "";
  else if (document.getElementById("vacancy-interview")) document.getElementById("vacancy-interview").value = v.interview_date || "";
  
  if (document.getElementById("vacancy-interview-time")) document.getElementById("vacancy-interview-time").value = v.interview_time || "";
  if (document.getElementById("vacancy-interview-venue")) document.getElementById("vacancy-interview-venue").value = v.interview_venue || "";
  if (document.getElementById("vacancy-exam-notes")) document.getElementById("vacancy-exam-notes").value = v.exam_call_notes || "";

  document.getElementById("vacancy-desc").value = v.description || "";
  
  document.getElementById("vacancy-modal-title").innerText = "Edit Vacancy & Exam Call";
  window.showPortalModal("vacancy-modal");
};

window.deleteVacancy = async (id) => {
  if (!confirm("Are you sure you want to delete this vacancy? Examinee results will also be lost.")) return;
  const vacancies = await db.get("vacancies") || [];
  const results = await db.get("vacancy_results") || [];
  await db.set("vacancies", vacancies.filter(x => x.id !== id));
  await db.set("vacancy_results", results.filter(x => x.vacancy_id !== id));
  window.loadVacanciesTable();
  window.closeVacancyResults();
};

window.viewVacancyResults = (id, title) => {
  window.activeVacancyId = id;
  document.getElementById("results-vacancy-title").innerText = "Results: " + title;
  document.getElementById("vacancy-results-view").style.display = "block";
  window.loadVacancyResultsTable();
  // Scroll to results
  document.getElementById("vacancy-results-view").scrollIntoView({ behavior: 'smooth' });
};

window.closeVacancyResults = async () => {
  window.activeVacancyId = null;
  document.getElementById("vacancy-results-view").style.display = "none";
};

const vacancyResultForm = document.getElementById("vacancy-result-form");
if (vacancyResultForm) {
  vacancyResultForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("vr-id").value;
    const vacancyId = document.getElementById("vr-vacancy-id").value;
    const name = document.getElementById("vr-name").value.trim();
    const written = document.getElementById("vr-written").value;
    const interview = document.getElementById("vr-interview").value;
    const status = document.getElementById("vr-status").value;

    const results = await db.get("vacancy_results") || [];

    if (id) {
      const updated = results.map(r => {
        if (r.id === id) return { ...r, examinee_name: name, written_score: written ? parseFloat(written) : null, interview_score: interview ? parseFloat(interview) : null, final_status: status };
        return r;
      });
      await db.set("vacancy_results", updated);
    } else {
      results.push({
        id: "vr-" + Date.now(),
        vacancy_id: vacancyId,
        examinee_name: name,
        written_score: written ? parseFloat(written) : null,
        interview_score: interview ? parseFloat(interview) : null,
        final_status: status,
        created_at: new Date().toISOString()
      });
      await db.set("vacancy_results", results);
    }

    window.hidePortalModal("vacancy-result-modal");
    window.loadVacancyResultsTable();
    window.loadVacanciesTable(); // Update count
  };
}

window.loadVacancyResultsTable = async () => {
  if (!window.activeVacancyId) return;
  const tbody = document.getElementById("vacancy-results-table-body");
  if (!tbody) return;
  
  let results = (await db.get("vacancy_results") || []).filter(r => r.vacancy_id === window.activeVacancyId);
  
  // Apply ATS Filter
  const filter = window.activeVacancyFilter || "All";
  if (filter !== "All") {
    results = results.filter(r => r.final_status === filter);
  }

  tbody.innerHTML = "";

  if (results.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No examinees match this filter.</td></tr>`;
    return;
  }

  results.sort((a, b) => ((b.written_score || 0) + (b.interview_score || 0)) - ((a.written_score || 0) + (a.interview_score || 0)));

  results.forEach(async r => {
    let statusBadge = `<span class="badge badge-info">${r.final_status}</span>`;
    if (r.final_status === "Passed") statusBadge = `<span class="badge badge-success">Passed</span>`;
    if (r.final_status === "Failed") statusBadge = `<span class="badge badge-danger">Failed</span>`;

    let documentsBtn = "";
    if (r.id_document_url) {
      documentsBtn = `<button class="btn-icon-sm" style="color: var(--accent-info);" onclick="window.viewApplicantDocuments('${r.id}')" title="View Documents"><i class="fas fa-file-pdf"></i></button>`;
    }

    let contactInfo = "";
    if (r.phone_number || r.email) {
      contactInfo = `<div style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fas fa-phone"></i> ${r.phone_number || '-'} | <i class="fas fa-envelope"></i> ${r.email || '-'}</div>`;
    }

    tbody.innerHTML += `
      <tr>
        <td><strong>${r.examinee_name}</strong>${contactInfo}</td>
        <td>${r.written_score !== null ? r.written_score : '-'}</td>
        <td>${r.interview_score !== null ? r.interview_score : '-'}</td>
        <td>${statusBadge}</td>
        <td>
          ${documentsBtn}
          <button class="btn-icon-sm" onclick="window.editVacancyResult('${r.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteVacancyResult('${r.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
  });
};

window.editVacancyResult = async (id) => {
  const r = (await db.get("vacancy_results") || []).find(x => x.id === id);
  if (!r) return;
  document.getElementById("vr-id").value = r.id;
  document.getElementById("vr-vacancy-id").value = r.vacancy_id;
  document.getElementById("vr-name").value = r.examinee_name;
  document.getElementById("vr-written").value = r.written_score !== null ? r.written_score : "";
  document.getElementById("vr-interview").value = r.interview_score !== null ? r.interview_score : "";
  document.getElementById("vr-status").value = r.final_status;
  
  document.getElementById("vacancy-result-modal-title").innerText = "Edit Examinee Result";
  window.showPortalModal("vacancy-result-modal");
};

window.deleteVacancyResult = async (id) => {
  if (!confirm("Are you sure you want to delete this examinee result?")) return;
  const results = await db.get("vacancy_results") || [];
  await db.set("vacancy_results", results.filter(x => x.id !== id));
  window.loadVacancyResultsTable();
  if (window.loadVacanciesTable) window.loadVacanciesTable();
};

window.selectVacancyForResults = (vacancyId) => {
  window.activeVacancyId = vacancyId;
  window.activeVacancyFilter = "All"; // Reset filter on vacancy change
  window.updateATSFilterUI();
  
  const btn = document.getElementById("btn-add-result");
  const view = document.getElementById("vacancy-results-view");
  
  if (!vacancyId) {
    if(btn) btn.style.display = "none";
    if(view) view.style.display = "none";
    return;
  }
  
  if(btn) btn.style.display = "inline-flex";
  if(view) view.style.display = "block";
  window.loadVacancyResultsTable();
};

window.setVacancyResultFilter = (filter) => {
  window.activeVacancyFilter = filter;
  window.updateATSFilterUI();
  window.loadVacancyResultsTable();
};

window.updateATSFilterUI = () => {
  const filter = window.activeVacancyFilter || "All";
  const tabsContainer = document.getElementById("ats-filter-tabs");
  if (!tabsContainer) return;
  const buttons = tabsContainer.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.className = "btn-secondary";
    if (btn.innerText.includes(filter) || (filter === "Pending" && btn.innerText.includes("Registered"))) {
      btn.className = "btn-primary";
    }
  });
};

window.viewApplicantDocuments = async (id) => {
  const r = (await db.get("vacancy_results") || []).find(x => x.id === id);
  if (!r) return;
  
  const content = document.getElementById("view-documents-content");
  let docsHtml = `
    <div style="margin-bottom: 1rem;">
      <strong>Name:</strong> ${r.examinee_name}<br>
      <strong>Phone:</strong> ${r.phone_number || 'N/A'}<br>
      <strong>Email:</strong> ${r.email || 'N/A'}<br>
      <strong>Address:</strong> ${r.address || 'N/A'}
    </div>
    <div style="display: grid; gap: 1rem;">
  `;

  if (r.id_document_url) {
    docsHtml += `
      <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <strong><i class="fas fa-id-card"></i> Fayda / National ID:</strong>
        <div style="margin-top: 0.5rem;">
          <a href="${r.id_document_url}" download="ID_Document" class="btn-primary" style="font-size: 0.8rem; display: inline-block;">Download / View</a>
        </div>
      </div>
    `;
  }
  if (r.cv_document_url) {
    docsHtml += `
      <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <strong><i class="fas fa-file-alt"></i> CV / Resume:</strong>
        <div style="margin-top: 0.5rem;">
          <a href="${r.cv_document_url}" download="CV_Document" class="btn-primary" style="font-size: 0.8rem; display: inline-block;">Download / View</a>
        </div>
      </div>
    `;
  }
  if (r.temp_document_url) {
    docsHtml += `
      <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <strong><i class="fas fa-file-signature"></i> Campus Temporary Document:</strong>
        <div style="margin-top: 0.5rem;">
          <a href="${r.temp_document_url}" download="Temp_Document" class="btn-primary" style="font-size: 0.8rem; display: inline-block;">Download / View</a>
        </div>
      </div>
    `;
  }
  docsHtml += `</div>`;
  content.innerHTML = docsHtml;
  window.showPortalModal("view-documents-modal");
};
