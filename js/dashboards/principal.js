// js/dashboards/principal.js
import { db } from '../db.js';

export function initDashboard(user) {
  renderSidebar();
  renderMainView("academics");
}

function renderSidebar() {
  const list = document.getElementById("sidebar-nav-list");
  if (!list) return;

  list.innerHTML = `
    <li class="active"><a href="#" id="side-academics"><i class="fas fa-graduation-cap"></i> Academics Info</a></li>
    <li><a href="#" id="side-approvals"><i class="fas fa-check-circle"></i> Grade Approvals</a></li>
    <li><a href="#" id="side-tech-staff"><i class="fas fa-flask"></i> Lab Technicians</a></li>
    <li><a href="#" id="side-posts"><i class="fas fa-bullhorn"></i> Bulletins & Meetings</a></li>
    <li><a href="#" id="side-gallery"><i class="fas fa-images"></i> Gallery & Events</a></li>
    <li><a href="#" id="side-materials"><i class="fas fa-file-pdf"></i> Course Materials</a></li>
    <li><a href="#" id="side-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    <li><a href="#" id="side-calendar"><i class="fas fa-calendar-alt"></i> Academic Calendar</a></li>
  `;

  const bindNavClick = (id, view) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveLink(id);
        renderMainView(view);
      });
    }
  };

  [
    ["side-academics", "academics"], ["side-approvals", "approvals"], ["side-tech-staff", "tech-staff"],
    ["side-posts", "posts"], ["side-gallery", "gallery"], ["side-materials", "materials"],
    ["side-profile", "profile"], ["side-calendar", "calendar"]
  ].forEach(([id, view]) => bindNavClick(id, view));
}

function setActiveLink(id) {
  document.querySelectorAll("#sidebar-nav-list li").forEach(li => li.classList.remove("active"));
  const link = document.getElementById(id);
  if (link && link.parentElement) link.parentElement.classList.add("active");
}

async function renderMainView(view) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const currentPrincipal = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!currentPrincipal) return;

  const users = await db.get("users") || [];
  const dbUser = users.find(u => u.id === currentPrincipal.id);
  if (dbUser && (dbUser.isActive === false || dbUser.is_active === false)) {
    alert("Session invalidated. Your account has been deactivated.");
    localStorage.removeItem("higa_current_user");
    window.location.reload();
    return;
  }

  switch (view) {
    case "academics":
      await renderAcademicsView(container, users);
      break;
    case "approvals":
      renderApprovalsView(container);
      break;
    case "tech-staff":
      renderTechStaffView(container);
      break;
    case "posts":
      renderPostsView(container);
      break;
    case "materials":
      await renderMaterialsView(container, users);
      break;
    case "profile":
      renderProfileView(container, currentPrincipal);
      break;
    case "calendar":
      await renderCalendarView(container);
      break;
    case "gallery":
      renderGalleryView(container);
      break;
  }
}

// --- View Renderers ---

async function renderAcademicsView(container, allUsers) {
  const teachers = allUsers.filter(u => u.role === "Teacher");
  const students = allUsers.filter(u => u.role === "Student");
  const grades = await db.get("grades") || [];
  const submittedGrades = grades.filter(g => g.status === "submitted").length;
  const approvedGrades = grades.filter(g => g.status === "approved").length;

  const teacherRowsHtml = teachers.map(t => {
    const sectionsHtml = (t.assignedSections || []).map(s => `<span class="badge badge-info" style="margin-right: 0.3rem;">${s}</span>`).join("");
    const photoUrl = t.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${photoUrl}" style="width: 30px; height: 30px; border-radius: 50%;">
            <span>${t.name}</span>
          </div>
        </td>
        <td>${t.assignedSubject || "General Curriculum"}</td>
        <td>${sectionsHtml}</td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom: 2rem;">
      <div class="glass-card stat-card">
        <div class="stat-info"><h3>${teachers.length}</h3><p>Active Teachers</p></div>
        <div class="stat-icon" style="background: rgba(45, 106, 79, 0.1); color: var(--accent-primary);"><i class="fas fa-chalkboard-teacher"></i></div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-info"><h3>${students.length}</h3><p>Registered Students</p></div>
        <div class="stat-icon" style="background: rgba(45, 106, 79, 0.1); color: var(--accent-primary);"><i class="fas fa-user-graduate"></i></div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-info"><h3>${submittedGrades}</h3><p>Pending Grade Approvals</p></div>
        <div class="stat-icon" style="background: rgba(230, 57, 70, 0.1); color: var(--accent-danger);"><i class="fas fa-clock"></i></div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-info"><h3>${approvedGrades}</h3><p>Approved Grades</p></div>
        <div class="stat-icon" style="background: rgba(76, 175, 80, 0.1); color: var(--accent-success);"><i class="fas fa-check-double"></i></div>
      </div>
    </div>

    <div class="glass-card" style="padding: 2rem;">
      <h3>Academic Teaching Staff Overview</h3>
      <div class="table-responsive">
        <table>
          <thead>
            <tr><th>Teacher</th><th>Subject</th><th>Assigned Sections</th></tr>
          </thead>
          <tbody>${teacherRowsHtml}</tbody>
        </table>
      </div>
    </div>

    <div class="glass-card" style="padding: 2rem; margin-top: 2rem;">
      <div id="principal-students-directory-header">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <h4>Student Registrations Directory</h4>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0;">Select Semester:</label>
            <select id="principal-semester-select" class="form-control" style="width: 130px; display: inline-block;">
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>
      </div>
      <div id="principal-students-directory-container" style="margin-top: 1.5rem;"></div>
    </div>
  `;

  const semSelect = document.getElementById("principal-semester-select");
  if (semSelect) semSelect.addEventListener("change", window.loadPrincipalStudentsDirectory);
  window.loadPrincipalStudentsDirectory();
}

function renderApprovalsView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
      <h3>Pending Grade Approvals</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Review grades submitted by subject teachers. Grouped by student for a complete profile.</p>
      <div id="pending-approvals-container"></div>
    </div>

    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3>Approved Grades (Ready to Release)</h3>
          <p style="color: var(--text-secondary); margin-bottom: 0; font-size: 0.88rem;">Send approved grades to the Registrar's portal and release them to students.</p>
        </div>
        <button class="btn-primary" id="btn-release-all-grades" style="display: none;"><i class="fas fa-paper-plane"></i> Send All to Registrar</button>
      </div>
      <div id="released-approvals-container"></div>
    </div>
  `;
  window.loadApprovalsTable();
}

function renderTechStaffView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3>Lab Technicians Registry</h3>
        <button class="btn-primary" id="btn-add-tech"><i class="fas fa-plus"></i> Add Technician</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID (Username)</th>
              <th>Category</th>
              <th>Assigned Section</th>
              <th>Gender</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="tech-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Add Technician Modal -->
    <div id="tech-modal" class="glass-card portal-modal">
      <h4 id="tech-modal-title">Add Lab Technician</h4>
      <form id="tech-form" style="margin-top: 1rem;">
        <input type="hidden" id="tech-id">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="tech-name" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select id="tech-gender" class="form-control">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label>Technician Speciality</label>
          <select id="tech-role" class="form-control">
            <option value="IT_Technician">IT Lab Technician</option>
            <option value="ChemistryLab">Chemistry Lab Technician</option>
            <option value="PhysicsLab">Physics Lab Technician</option>
            <option value="Drawing">Technical Drawing Lab Technician</option>
          </select>
        </div>
        <div class="form-group">
          <label>Assigned Section / Class</label>
          <input type="text" id="tech-section" class="form-control" placeholder="e.g. Grade 9 Lab Sessions" required>
        </div>
        <div class="form-group">
          <label>Profile Photo (URL or Upload File)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="tech-photo" class="form-control" placeholder="Paste URL or upload file..." style="flex: 1;">
            <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0;">
              <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
              <input type="file" id="tech-photo-file" accept="image/*" style="display: none;">
            </label>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="btn-secondary" id="btn-close-tech-modal">Cancel</button>
          <button type="submit" class="btn-primary">Save Technician</button>
        </div>
      </form>
    </div>
  `;

  window.loadTechTable();

  const btnAddTech = document.getElementById("btn-add-tech");
  if (btnAddTech) {
    btnAddTech.addEventListener("click", () => {
      const formEl = document.getElementById("tech-form");
      const idEl = document.getElementById("tech-id");
      if (formEl) formEl.reset();
      if (idEl) idEl.value = "";
      window.showPortalModal("tech-modal");
    });
  }

  const btnCloseTech = document.getElementById("btn-close-tech-modal");
  if (btnCloseTech) {
    btnCloseTech.addEventListener("click", () => {
      window.hidePortalModal("tech-modal");
    });
  }

  const techFormEl = document.getElementById("tech-form");
  if (techFormEl) {
    techFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      saveTechnician();
    });

    techFormEl.addEventListener("change", (e) => {
      if (e.target && e.target.id === "tech-photo-file") {
        const file = e.target.files[0];
        if (file && window.compressImage) {
          window.compressImage(file, 200, (compressedBase64) => {
            const photoEl = document.getElementById("tech-photo");
            if (photoEl) photoEl.value = compressedBase64;
          });
        }
      }
    });
  }
}

function renderPostsView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px; margin-bottom: 2rem;">
      <h4>Post Announcement or Academic Meeting</h4>
      <form id="post-announcement-form" style="margin-top: 1rem;">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="ann-title" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Target Audience</label>
          <select id="ann-target" class="form-control">
            <option value="all">Everyone</option>
            <option value="teachers">Teachers Only</option>
            <option value="students">Students Only</option>
          </select>
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="date" id="ann-expiry" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Details</label>
          <textarea id="ann-content" class="form-control" required></textarea>
        </div>
        <button type="submit" class="btn-primary">Publish Announcement</button>
      </form>
    </div>
  `;

  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 30);
  const expInput = document.getElementById("ann-expiry");
  if (expInput) expInput.value = defaultExpiry.toISOString().split('T')[0];

  const postForm = document.getElementById("post-announcement-form");
  if (postForm) {
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("ann-title").value;
      const target = document.getElementById("ann-target").value;
      const content = document.getElementById("ann-content").value;
      const expiry = document.getElementById("ann-expiry").value;

      const anns = await db.get("announcements") || [];
      anns.push({
        id: "ann-" + Date.now(),
        title, content, target,
        date: new Date().toISOString().split('T')[0],
        expiryDate: expiry
      });
      await db.set("announcements", anns);

      alert("Announcement posted successfully!");
      postForm.reset();
      if (expInput) expInput.value = defaultExpiry.toISOString().split('T')[0];
    });
  }
}

async function renderMaterialsView(container, allUsers) {
  const teachers = allUsers.filter(u => 
    ["Teacher", "ChemistryLab", "PhysicsLab", "Drawing", "IT_Technician"].includes(u.role)
  );

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px; margin-bottom: 2rem;">
      <h4>Upload Course Materials for Teachers</h4>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Distribute outlines, PowerPoint files, or PDFs to specific course teachers.</p>
      <form id="upload-materials-form">
        <div class="form-group">
          <label>Select Teacher</label>
          <select id="mat-teacher-select" class="form-control" required>
            ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.assignedSubject || 'General'})</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Material Name</label>
          <input type="text" id="mat-name" class="form-control" placeholder="e.g. Grade 10 Math Syllabus Outline" required>
        </div>
        <div class="form-group">
          <label>Upload File (from local directory)</label>
          <input type="file" id="mat-file-input" class="form-control" required style="padding: 0.4rem;">
        </div>
        <button type="submit" class="btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-upload"></i> Upload & Share Material</button>
      </form>
    </div>

    <div class="glass-card" style="padding: 2rem;">
      <h4>Uploaded Materials Registry</h4>
      <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">Monitor materials uploaded for portal teachers.</p>
      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
              <th style="padding: 0.5rem 0.75rem;">Material Details</th>
              <th style="padding: 0.5rem 0.75rem;">Assigned Teacher</th>
              <th style="padding: 0.5rem 0.75rem; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody id="materials-registry-body"></tbody>
        </table>
      </div>
    </div>
  `;

  window.loadMaterialsRegistry();

  const matForm = document.getElementById("upload-materials-form");
  if (matForm) {
    matForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fileInput = document.getElementById("mat-file-input");
      const file = fileInput ? fileInput.files[0] : null;
      if (!file) return;

      const name = document.getElementById("mat-name").value.trim();
      const teacherId = document.getElementById("mat-teacher-select").value;

      const reader = new FileReader();
      reader.onload = async function(evt) {
        const materials = await db.get("course_materials") || [];
        materials.push({
          id: "mat-" + Date.now(),
          name, teacher_id: teacherId,
          file_name: file.name,
          file_data: evt.target.result,
          file_type: file.type,
          uploaded_at: new Date().toISOString()
        });
        await db.set("course_materials", materials);
        alert("Course material uploaded and shared successfully!");
        renderMainView("materials");
      };
      reader.readAsDataURL(file);
    });
  }
}

function renderProfileView(container, currentUser) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px;">
      <h3>Update Profile Information</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Modify your profile details and save changes.</p>
      <form id="principal-profile-form">
        <div class="form-group" style="text-align: center; margin-bottom: 2rem;">
          <img id="prof-img-preview" src="${currentUser.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-primary); margin-bottom: 1rem;">
          <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center; max-width: 450px; margin: 0 auto;">
            <input type="text" id="prof-photo" class="form-control" value="${currentUser.photo || ''}" placeholder="Paste URL or upload file..." style="flex: 1;">
            <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0; height: 38px;">
              <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
              <input type="file" id="prof-photo-file" accept="image/*" style="display: none;">
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="prof-name" class="form-control" value="${currentUser.name || ''}" required>
        </div>
        <button type="submit" class="btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-check"></i> Save Profile Details</button>
      </form>
    </div>
  `;

  const photoFileEl = document.getElementById("prof-photo-file");
  if (photoFileEl) {
    photoFileEl.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && window.compressImage) {
        window.compressImage(file, 200, (compressedBase64) => {
          document.getElementById("prof-photo").value = compressedBase64;
          document.getElementById("prof-img-preview").src = compressedBase64;
        });
      }
    });
  }

  const photoInputEl = document.getElementById("prof-photo");
  if (photoInputEl) {
    photoInputEl.addEventListener("input", (e) => {
      document.getElementById("prof-img-preview").src = e.target.value || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
    });
  }

  const profileFormEl = document.getElementById("principal-profile-form");
  if (profileFormEl) {
    profileFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const updatedName = document.getElementById("prof-name").value;
      const updatedPhoto = document.getElementById("prof-photo").value;

      const users = await db.get("users") || [];
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          u.name = updatedName;
          u.photo = updatedPhoto;
        }
        return u;
      });
      await db.set("users", updatedUsers);

      currentUser.name = updatedName;
      currentUser.photo = updatedPhoto;
      localStorage.setItem("higa_current_user", JSON.stringify(currentUser));

      const nameEl = document.getElementById("sidebar-user-name");
      const imgEl = document.getElementById("sidebar-user-photo");
      if (nameEl) nameEl.innerText = updatedName;
      if (imgEl) imgEl.src = updatedPhoto;

      alert("Profile updated successfully!");
    });
  }
}

async function renderCalendarView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h3>Academic Calendar</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Official school calendar events, schedules, exams, and holidays.</p>
      <div class="table-responsive">
        <table>
          <thead>
            <tr><th>Date</th><th>Event Title / Description</th><th>Category</th></tr>
          </thead>
          <tbody id="principal-calendar-table"></tbody>
        </table>
      </div>
    </div>
  `;
  const rawEvents = await db.get("calendar") || [];
  const events = rawEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  const tbody = document.getElementById("principal-calendar-table");
  if (tbody) {
    if (events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-secondary);">No calendar events scheduled yet.</td></tr>`;
    } else {
      tbody.innerHTML = events.map(e => `
        <tr>
          <td><strong>${new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
          <td>${e.event}</td>
          <td><span class="badge badge-${e.type === 'holiday' ? 'warning' : (e.type === 'exam' ? 'danger' : 'info')}">${(e.type || 'EVENT').toUpperCase()}</span></td>
        </tr>
      `).join("");
    }
  }
}

function renderGalleryView(container) {
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
            <tr><th>Title & Category</th><th>Description</th><th>Author</th><th>Date Posted</th><th>Actions</th></tr>
          </thead>
          <tbody id="moments-table-body"></tbody>
        </table>
      </div>
    </div>
  `;
  window.loadGalleryMomentsTable();
  const btnAdd = document.getElementById("btn-add-moment");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const form = document.getElementById("moment-form");
      if (form) form.reset();
      const idEl = document.getElementById("moment-id");
      if (idEl) idEl.value = "";
      const titleEl = document.getElementById("moment-modal-title");
      if (titleEl) titleEl.innerText = "Post Special Moment / Event";
      window.showPortalModal("gallery-moment-modal");
    });
  }
}

// --- Data Helpers & Window Functions ---

window.loadApprovalsTable = async () => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  
  const pendingContainer = document.getElementById("pending-approvals-container");
  const releasedContainer = document.getElementById("released-approvals-container");
  const releaseAllBtn = document.getElementById("btn-release-all-grades");

  if (!pendingContainer || !releasedContainer) return;

  const pending = grades.filter(g => g.status === "submitted");
  const approvedList = grades.filter(g => g.status === "approved");

  const buildGroupedGradesHTML = (gradeList, actionButtonHTML) => {
    if (gradeList.length === 0) return `<p style="text-align: center; color: var(--text-secondary); padding: 1rem;">No grades found.</p>`;
    
    const grouped = {};
    gradeList.forEach(g => {
      if (!grouped[g.student_id]) grouped[g.student_id] = [];
      grouped[g.student_id].push(g);
    });

    return Object.entries(grouped).map(([studentId, studentGrades]) => {
      const student = users.find(u => u.id === studentId);
      const sName = student ? student.name : studentId;
      const sSection = student ? (student.classSection || "Unassigned") : "N/A";
      
      return `
        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; background: var(--glass-bg);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h5 style="margin: 0; color: var(--text-primary);"><i class="fas fa-user-graduate"></i> ${sName}</h5>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.3rem;">ID: <code>${studentId}</code> | Section: ${sSection}</div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-secondary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="window.printStudentReport('${studentId}')"><i class="fas fa-print"></i> Print</button>
              <button class="btn-secondary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="window.exportStudentCSV('${studentId}')"><i class="fas fa-file-csv"></i> CSV</button>
              ${actionButtonHTML(studentId)}
            </div>
          </div>
          <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                  <th style="padding: 0.5rem;">Course</th>
                  <th style="padding: 0.5rem;">Assessment Details (Breakdown)</th>
                  <th style="padding: 0.5rem;">Total (100)</th>
                </tr>
              </thead>
              <tbody>
                ${studentGrades.map(g => {
                  const courseCode = g.course_id || g.course_code;
                  const course = courses.find(c => c.code === courseCode);
                  const cName = course ? course.name : courseCode;
                  const breakdownHTML = g.breakdown && Object.keys(g.breakdown).length > 0 
                    ? Object.entries(g.breakdown).map(([k, v]) => `<span class="badge badge-info" style="margin-right: 0.3rem; margin-bottom: 0.2rem;">${k}: ${v}</span>`).join("")
                    : `<span class="badge badge-info">Ass: ${g.assessment_score}</span> <span class="badge badge-info">Exam: ${g.exam_score}</span>`;
                    
                  return `
                    <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                      <td style="padding: 0.5rem;"><strong>${cName}</strong> <br><span style="font-size:0.75rem; color: var(--text-tertiary);">${courseCode}</span></td>
                      <td style="padding: 0.5rem;">${breakdownHTML}</td>
                      <td style="padding: 0.5rem;"><strong>${g.total}</strong></td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join("");
  };

  pendingContainer.innerHTML = buildGroupedGradesHTML(pending, (sid) => `
    <button class="btn-primary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="window.approveGrade('${sid}')"><i class="fas fa-check"></i> Approve All</button>
  `);
  
  releasedContainer.innerHTML = buildGroupedGradesHTML(approvedList, (sid) => `
    <button class="btn-primary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="window.releaseGrade('${sid}')"><i class="fas fa-paper-plane"></i> Release</button>
  `);

  if (releaseAllBtn) {
    if (approvedList.length > 0) {
      releaseAllBtn.style.display = "inline-block";
      const newReleaseBtn = releaseAllBtn.cloneNode(true);
      releaseAllBtn.replaceWith(newReleaseBtn);
      newReleaseBtn.addEventListener("click", window.releaseAllGrades);
    } else {
      releaseAllBtn.style.display = "none";
    }
  }
};

window.approveGrade = async (studentId) => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  const classCourses = await db.get("class_courses") || [];

  let count = 0;
  grades.forEach(g => {
    if (g.student_id === studentId && (g.status === "submitted" || g.status === "pending")) {
      g.status = "approved";
      g.updated_at = new Date().toISOString();
      count++;
    }
  });

  await db.set("grades", grades);

  if (window.calculateStudentAveragesAndRanks) {
    window.calculateStudentAveragesAndRanks(users, grades, courses, classCourses);
  }

  alert(`Successfully approved ${count} grades for student ${studentId}. Ranks and averages updated!`);
  window.loadApprovalsTable();
};

window.releaseGrade = async (studentId) => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  const classCourses = await db.get("class_courses") || [];

  let count = 0;
  grades.forEach(g => {
    if (g.student_id === studentId && g.status === "approved") {
      g.status = "released";
      g.updated_at = new Date().toISOString();
      count++;
    }
  });

  await db.set("grades", grades);

  if (window.calculateStudentAveragesAndRanks) {
    window.calculateStudentAveragesAndRanks(users, grades, courses, classCourses);
  }

  alert(`Successfully sent ${count} grades to Registrar for student ${studentId}.`);
  window.loadApprovalsTable();
};

window.releaseAllGrades = async () => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  const classCourses = await db.get("class_courses") || [];

  let count = 0;
  const updated = grades.map(g => {
    if (g.status === "approved") {
      g.status = "released";
      g.updated_at = new Date().toISOString();
      count++;
    }
    return g;
  });

  await db.set("grades", updated);

  if (window.calculateStudentAveragesAndRanks) {
    window.calculateStudentAveragesAndRanks(users, updated, courses, classCourses);
  }

  alert(`Successfully sent ${count} approved grades to the Registrar! Averages and ranks updated across portal.`);
  window.loadApprovalsTable();
};

window.loadPrincipalStudentsDirectory = async () => {
  const semesterSelect = document.getElementById("principal-semester-select");
  const semester = semesterSelect ? parseInt(semesterSelect.value) : 1;
  const container = document.getElementById("principal-students-directory-container");
  if (!container) return;

  const users = await db.get("users") || [];
  const students = users.filter(u => u.role === "Student");
  const classCourses = await db.get("class_courses") || [];

  if (students.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 1.5rem;">No students enrolled in portal.</p>`;
    return;
  }

  const grouped = {};
  students.forEach(s => {
    const sec = s.classSection || "Unassigned Class";
    if (!grouped[sec]) grouped[sec] = [];
    grouped[sec].push(s);
  });

  container.innerHTML = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])).map(([sectionName, list]) => `
    <div class="glass-card" style="padding: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-primary); background: rgba(0,0,0,0.02);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <h5 style="color: var(--accent-primary); margin: 0;"><i class="fas fa-school"></i> ${sectionName} (${list.length} Students)</h5>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="window.printSectionReport('${sectionName}', ${semester})"><i class="fas fa-print"></i> Print Grades</button>
          <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="window.exportSectionCSV('${sectionName}', ${semester})"><i class="fas fa-file-csv"></i> CSV</button>
        </div>
      </div>
      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
              <th style="padding: 0.5rem 0.75rem;">Student ID</th>
              <th style="padding: 0.5rem 0.75rem;">Name</th>
              <th style="padding: 0.5rem 0.75rem;">Batch Year</th>
              <th style="padding: 0.5rem 0.75rem;">Registered Courses (Sem ${semester})</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(s => {
              const reg = s.registeredCourses || [];
              const posted = classCourses.filter(cc => cc.class_name === s.classSection && cc.semester === semester);
              const courseBadges = posted.length > 0
                ? posted.map(ac => {
                    const isReg = reg.includes(ac.course_code);
                    return `<span class="badge ${isReg ? 'badge-success' : 'badge-danger'}" style="margin: 0.1rem; font-size: 0.72rem;">${ac.course_code}</span>`;
                  }).join("")
                : `<span style="color: var(--text-tertiary); font-size: 0.8rem;">No courses assigned</span>`;

              return `
                <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                  <td style="padding: 0.5rem 0.75rem;"><code>${s.id}</code></td>
                  <td style="padding: 0.5rem 0.75rem;"><strong>${s.name}</strong></td>
                  <td style="padding: 0.5rem 0.75rem;">${s.batch || "N/A"}</td>
                  <td style="padding: 0.5rem 0.75rem;"><div style="display: flex; flex-wrap: wrap; gap: 0.2rem;">${courseBadges}</div></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `).join("");
};

window.loadTechTable = async () => {
  const users = await db.get("users") || [];
  const techRoles = ["IT_Technician", "ChemistryLab", "PhysicsLab", "Drawing"];
  const techs = users.filter(u => techRoles.includes(u.role));
  const tbody = document.getElementById("tech-table-body");
  if (!tbody) return;

  tbody.innerHTML = techs.map(t => {
    const createdDate = new Date(t.created_at).toLocaleDateString();
    let displayRole = t.role.replace("_", " ");
    if (t.role === "Drawing") displayRole = "Drawing Technician";

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${t.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 32px; height: 32px; border-radius: 50%;">
            <span>${t.name}</span>
          </div>
        </td>
        <td><code>${t.id}</code></td>
        <td><span class="badge badge-info">${displayRole}</span></td>
        <td>${t.assignedSection || "General"}</td>
        <td>${t.gender}</td>
        <td>${createdDate}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-icon-sm" onclick="window.editTech('${t.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteTech('${t.id}')"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
};

window.editTech = async (id) => {
  const users = await db.get("users") || [];
  const t = users.find(u => u.id === id);
  if (!t) return;

  document.getElementById("tech-id").value = t.id;
  document.getElementById("tech-name").value = t.name;
  document.getElementById("tech-gender").value = t.gender;
  document.getElementById("tech-role").value = t.role;
  document.getElementById("tech-section").value = t.assignedSection || "";
  document.getElementById("tech-photo").value = t.photo || "";

  document.getElementById("tech-modal-title").innerText = "Edit Technician Details";
  window.showPortalModal("tech-modal");
};

window.deleteTech = async (id) => {
  if (!await window.showConfirmModal("Confirm Technician Removal", `Are you sure you want to delete technician ${id}?`)) return;
  const users = await db.get("users") || [];
  await db.set("users", users.filter(u => u.id !== id));
  window.loadTechTable();
};

async function saveTechnician() {
  const editId = document.getElementById("tech-id").value;
  const name = document.getElementById("tech-name").value;
  const gender = document.getElementById("tech-gender").value;
  const role = document.getElementById("tech-role").value;
  const section = document.getElementById("tech-section").value;
  const photo = document.getElementById("tech-photo").value || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";

  const users = await db.get("users") || [];

  if (editId) {
    const updated = users.map(u => {
      if (u.id === editId) {
        u.name = name; u.gender = gender; u.role = role; u.assignedSection = section; u.photo = photo;
      }
      return u;
    });
    await db.set("users", updated);
    alert("Technician updated successfully.");
  } else {
    const currentYear = new Date().getFullYear();
    const fourDigit = Math.floor(1000 + Math.random() * 9000);
    let code = "IT";
    if (role === "ChemistryLab") code = "ChemLb";
    if (role === "PhysicsLab") code = "PhyLb";
    if (role === "Drawing") code = "Drawing";

    const username = `HIGA/${code}/${fourDigit}/${currentYear}`;
    const autoPassword = Math.floor(1000 + Math.random() * 9000).toString();

    users.push({
      id: username, username, password: autoPassword, defaultPassword: autoPassword,
      name, role, gender, photo, assignedSection: section, created_at: new Date().toISOString()
    });
    await db.set("users", users);
    alert(`Technician Added!\nUsername: ${username}\nGenerated Password: ${autoPassword}`);
  }

  window.hidePortalModal("tech-modal");
  window.loadTechTable();
}

window.loadMaterialsRegistry = async () => {
  const tbody = document.getElementById("materials-registry-body");
  if (!tbody) return;

  const materials = await db.get("course_materials") || [];
  const users = await db.get("users") || [];

  if (materials.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No course materials uploaded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = materials.map((m, index) => {
    const teacher = users.find(u => u.id === m.teacher_id);
    return `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
        <td style="padding: 0.5rem 0.75rem;">
          <strong>${m.name}</strong><br>
          <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-file"></i> ${m.file_name} (${new Date(m.uploaded_at).toLocaleDateString()})</span>
        </td>
        <td style="padding: 0.5rem 0.75rem;">${teacher ? teacher.name : m.teacher_id}</td>
        <td style="padding: 0.5rem 0.75rem; text-align: right;">
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteMaterial(${index})" title="Delete Material"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
  }).join("");
};

window.deleteMaterial = async (index) => {
  if (!confirm("Are you sure you want to delete this shared material?")) return;
  const materials = await db.get("course_materials") || [];
  materials.splice(index, 1);
  await db.set("course_materials", materials);
  alert("Course material deleted successfully.");
  window.loadMaterialsRegistry();
};

window.loadGalleryMomentsTable = async () => {
  const tbody = document.getElementById("moments-table-body");
  if (!tbody) return;

  const moments = await db.get("gallery_moments") || [];
  if (moments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No gallery moments or events posted.</td></tr>`;
    return;
  }

  tbody.innerHTML = moments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(m => `
    <tr>
      <td>
        <div style="font-weight: 500;">${m.title}</div>
        <div style="font-size: 0.8rem; color: var(--accent-primary);">${m.category} ${m.batch ? '(Batch ' + m.batch + ')' : ''}</div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary);">${m.media_urls ? m.media_urls.length : 0} Media Items</div>
      </td>
      <td><div style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.description || ''}</div></td>
      <td><code>${m.author_id || "Unknown"}</code></td>
      <td>
        <div>${new Date(m.created_at).toLocaleDateString()}</div>
        <div style="font-size: 0.75rem; color: var(--accent-warning);">Expires: ${m.expiry_date || 'Never'}</div>
      </td>
      <td>
        <button class="btn-icon-sm" onclick="window.editMoment('${m.id}')" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteMoment('${m.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  `).join("");
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

window.exportStudentCSV = async (studentId) => {
  const grades = await db.get("grades") || [];
  const sGrades = grades.filter(g => g.student_id === studentId);
  if (sGrades.length === 0) return alert("No grades found.");
  
  let csv = "Course,Assessment,Exam,Total,Status\n";
  sGrades.forEach(g => csv += `"${g.course_id}",${g.assessment_score},${g.exam_score},${g.total},${g.status}\n`);
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `grades_${studentId.replace(/[\/\\]/g, '_')}.csv`;
  a.click();
};

window.printStudentReport = async (studentId) => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const sGrades = grades.filter(g => g.student_id === studentId);
  const student = users.find(u => u.id === studentId);
  
  let html = `<h2 style="text-align:center;">Grade Report</h2><h3>Student: ${student ? student.name : studentId}</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse; text-align:left;">
    <tr style="background:#f4f4f4;"><th>Course</th><th>Total</th><th>Status</th></tr>`;
  sGrades.forEach(g => html += `<tr><td>${g.course_id}</td><td>${g.total}</td><td>${g.status}</td></tr>`);
  html += `</table>`;
  
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>Print Report</title></head><body onload="window.print();window.close();" style="font-family:sans-serif; padding:2rem;">${html}</body></html>`);
  win.document.close();
};

window.exportSectionCSV = async (sectionName, semester) => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const sectionStudents = users.filter(u => u.classSection === sectionName).map(u => u.id);
  const sectionGrades = grades.filter(g => sectionStudents.includes(g.student_id) && g.semester === semester);
  
  if (sectionGrades.length === 0) return alert("No grades found for this section.");
  
  let csv = "Student ID,Student Name,Course,Total,Status\n";
  sectionGrades.forEach(g => {
    const student = users.find(u => u.id === g.student_id);
    csv += `"${g.student_id}","${student ? student.name : ''}","${g.course_id}",${g.total},${g.status}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `section_${sectionName.replace(/[\s\/\\]+/g, '_')}_sem${semester}.csv`;
  a.click();
};

window.printSectionReport = async (sectionName, semester) => {
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const sectionStudents = users.filter(u => u.classSection === sectionName).map(u => u.id);
  const sectionGrades = grades.filter(g => sectionStudents.includes(g.student_id) && g.semester === semester);
  
  let html = `<h2 style="text-align:center;">Section Grade Report</h2><h3>Section: ${sectionName} | Semester: ${semester}</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse; text-align:left;">
    <tr style="background:#f4f4f4;"><th>Student ID</th><th>Name</th><th>Course</th><th>Total</th></tr>`;
  sectionGrades.forEach(g => {
    const student = users.find(u => u.id === g.student_id);
    html += `<tr><td>${g.student_id}</td><td>${student ? student.name : ''}</td><td>${g.course_id}</td><td>${g.total}</td></tr>`;
  });
  html += `</table>`;
  
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>Print Section Report</title></head><body onload="window.print();window.close();" style="font-family:sans-serif; padding:2rem;">${html}</body></html>`);
  win.document.close();
};
