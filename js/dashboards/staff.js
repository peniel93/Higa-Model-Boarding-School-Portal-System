// js/dashboards/staff.js
import { db } from '../db.js';

export function initDashboard(user) {
  renderSidebar(user);
  renderDefaultView(user);
}

function renderSidebar(user) {
  const list = document.getElementById("sidebar-nav-list");
  if (!list) return;

  list.innerHTML = ""; // Clear existing

  if (user.role === "Guardian") {
    list.innerHTML = `
      <li class="active"><a href="#" id="side-guard-main"><i class="fas fa-user-shield"></i> Guardian Profile</a></li>
      <li><a href="#" id="side-guard-ann"><i class="fas fa-bullhorn"></i> Manager Announcements</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-guard-main", () => renderGuardianMain(user));
    bindClick("side-guard-ann", () => renderGuardianAnnouncements());
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  } 
  
  else if (user.role === "Cafeteria") {
    const isManager = user.cafeteriaRole === "cafeteria manager";
    const isTicker = user.cafeteriaRole === "ticker";
    const isCook = user.cafeteriaRole === "cook";

    if (isManager) {
      list.innerHTML = `
        <li class="active"><a href="#" id="side-cafe-manage"><i class="fas fa-users-cog"></i> Manage Workers</a></li>
        <li><a href="#" id="side-cafe-menu"><i class="fas fa-utensils"></i> Weekly Menus</a></li>
        <li><a href="#" id="side-cafe-shifts"><i class="fas fa-calendar-alt"></i> Shifts</a></li>
        <li><a href="#" id="side-cafe-attendance-manager"><i class="fas fa-check-circle"></i> Daily Attendance</a></li>
        <li><a href="#" id="side-cafe-ann"><i class="fas fa-bullhorn"></i> Announcements</a></li>
        <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
      `;
      bindClick("side-cafe-manage", () => renderCafeteriaManager(user));
      bindClick("side-cafe-menu", () => renderCafeteriaMenu(user, true));
      bindClick("side-cafe-shifts", () => renderCafeteriaShifts(user));
      bindClick("side-cafe-attendance-manager", () => renderCafeteriaManagerAttendance(user));
      bindClick("side-cafe-ann", () => renderCafeteriaAnnouncements(user));
      bindClick("side-staff-profile", () => renderStaffUserProfile(user));
    } else if (isTicker) {
      list.innerHTML = `
        <li class="active"><a href="#" id="side-cafe-attendance"><i class="fas fa-user-check"></i> Meal Roll Call</a></li>
        <li><a href="#" id="side-cafe-shifts-view"><i class="fas fa-calendar-alt"></i> My Shifts</a></li>
        <li><a href="#" id="side-cafe-my-att"><i class="fas fa-check-circle"></i> My Attendance</a></li>
        <li><a href="#" id="side-cafe-menu-view"><i class="fas fa-utensils"></i> View Menu</a></li>
        <li><a href="#" id="side-cafe-ann"><i class="fas fa-bullhorn"></i> Announcements</a></li>
        <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
      `;
      bindClick("side-cafe-attendance", () => renderCafeteriaTicker(user));
      bindClick("side-cafe-shifts-view", () => renderCafeteriaShiftsView(user));
      bindClick("side-cafe-my-att", () => renderCafeteriaMyAttendance(user));
      bindClick("side-cafe-menu-view", () => renderCafeteriaMenu(user, false));
      bindClick("side-cafe-ann", () => renderCafeteriaAnnouncements(user));
      bindClick("side-staff-profile", () => renderStaffUserProfile(user));
    } else if (isCook) {
      list.innerHTML = `
        <li class="active"><a href="#" id="side-cafe-cook"><i class="fas fa-soup"></i> Daily Menu</a></li>
        <li><a href="#" id="side-cafe-shifts-view"><i class="fas fa-calendar-alt"></i> My Shifts</a></li>
        <li><a href="#" id="side-cafe-my-att"><i class="fas fa-check-circle"></i> My Attendance</a></li>
        <li><a href="#" id="side-cafe-ann"><i class="fas fa-bullhorn"></i> Announcements</a></li>
        <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
      `;
      bindClick("side-cafe-cook", () => renderCafeteriaMenu(user, false));
      bindClick("side-cafe-shifts-view", () => renderCafeteriaShiftsView(user));
      bindClick("side-cafe-my-att", () => renderCafeteriaMyAttendance(user));
      bindClick("side-cafe-ann", () => renderCafeteriaAnnouncements(user));
      bindClick("side-staff-profile", () => renderStaffUserProfile(user));
    }
  } 
  
  else if (user.role === "Librarian") {
    list.innerHTML = `
      <li class="active"><a href="#" id="side-lib-profile"><i class="fas fa-user"></i> Profile & Shift</a></li>
      <li><a href="#" id="side-lib-books"><i class="fas fa-book"></i> Catalog Books</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-lib-profile", () => renderLibrarianProfile(user));
    bindClick("side-lib-books", () => renderLibrarianBooks());
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  } 
  
  else if (user.role === "Dormitory") {
    list.innerHTML = `
      <li class="active"><a href="#" id="side-dorm-main"><i class="fas fa-bed"></i> Dorm allocation</a></li>
      <li><a href="#" id="side-dorm-cohort"><i class="fas fa-users"></i> Cohort Roommates</a></li>
      <li><a href="#" id="side-dorm-assets"><i class="fas fa-warehouse"></i> Dorm Assets</a></li>
      <li><a href="#" id="side-dorm-att"><i class="fas fa-clipboard-list"></i> Student Roll Call</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-dorm-main", () => renderDormMain(user));
    bindClick("side-dorm-cohort", () => renderDormCohortRoommates(user));
    bindClick("side-dorm-assets", () => renderDormAssets(user));
    bindClick("side-dorm-att", () => renderDormAttendance(user));
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  } 
  
  else if (user.role === "BookStore") {
    list.innerHTML = `
      <li class="active"><a href="#" id="side-bookstore-profile"><i class="fas fa-user-circle"></i> Profile & Shift</a></li>
      <li><a href="#" id="side-bookstore-main"><i class="fas fa-warehouse"></i> Bookstore Inventory</a></li>
      <li><a href="#" id="side-bookstore-export"><i class="fas fa-file-export"></i> Print & Export Catalog</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-bookstore-profile", () => renderBookstoreProfile(user));
    bindClick("side-bookstore-main", () => renderBookStore(user));
    bindClick("side-bookstore-export", () => renderBookstoreExport(user));
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  } 
  
  else if (user.role === "SchoolStore") {
    list.innerHTML = `
      <li class="active"><a href="#" id="side-schoolstore-main"><i class="fas fa-boxes"></i> Store Inventory</a></li>
      <li><a href="#" id="side-schoolstore-ann"><i class="fas fa-bullhorn"></i> Announcements</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-schoolstore-main", () => renderSchoolStoreMain(user));
    bindClick("side-schoolstore-ann", () => renderCafeteriaAnnouncements(user)); // Reuse announcement UI
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  } 
  
  else if (user.role === "IT_Technician") {
    list.innerHTML = `
      <li class="active"><a href="#" id="side-it-main"><i class="fas fa-laptop"></i> Lab Computers</a></li>
      <li><a href="#" id="side-it-grades"><i class="fas fa-star"></i> Student Lab Grades</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-it-main", () => renderITLab(user));
    bindClick("side-it-grades", () => renderITGrades(user));
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  } 
  
  else if (["ChemistryLab", "PhysicsLab", "Drawing"].includes(user.role)) {
    // ChemistryLab, PhysicsLab, Drawing lab techs
    let inventoryLabel = "Chemicals Inventory";
    let iconClass = "fas fa-vial";
    if (user.role === "PhysicsLab") {
      inventoryLabel = "Physics Equipment";
      iconClass = "fas fa-atom";
    } else if (user.role === "Drawing") {
      inventoryLabel = "Drafting Instruments";
      iconClass = "fas fa-drafting-compass";
    }

    list.innerHTML = `
      <li class="active"><a href="#" id="side-lab-chemicals"><i class="${iconClass}"></i> ${inventoryLabel}</a></li>
      <li><a href="#" id="side-lab-grades"><i class="fas fa-award"></i> Session Grades</a></li>
      <li><a href="#" id="side-lab-reports"><i class="fas fa-paper-plane"></i> Restock Reports</a></li>
      <li><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
    `;
    bindClick("side-lab-chemicals", () => renderLabChemicals(user));
    bindClick("side-lab-grades", () => renderLabGrades(user));
    bindClick("side-lab-reports", () => renderLabReports(user));
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
  }
  else {
    // Custom roles created by the registrar
    list.innerHTML = `
      <li class="active"><a href="#" id="side-staff-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
      <li><a href="#" id="side-staff-ann"><i class="fas fa-bullhorn"></i> Announcements</a></li>
    `;
    bindClick("side-staff-profile", () => renderStaffUserProfile(user));
    bindClick("side-staff-ann", () => renderGuardianAnnouncements()); // Reusing announcements view
  }
}

function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", async (e) => {
      e.preventDefault();

      // Real-time security deactivation check (Requirement 8)
      const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
      const users = await db.get("users");
      const dbUser = users.find(u => u.id === currentUser.id);
      if (!dbUser || dbUser.isActive === false || dbUser.is_active === false) {
        alert("Session invalidated. Your account has been deactivated.");
        localStorage.removeItem("higa_current_user");
        window.location.reload();
        return;
      }

      document.querySelectorAll("#sidebar-nav-list li").forEach(li => li.classList.remove("active"));
      el.parentElement.classList.add("active");
      handler();
    });
  }
}

function renderStaffUserProfile(currentUser) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px;">
      <h3>Update Profile Information</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Modify your profile details and save changes.</p>
      <form id="staff-profile-form">
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
          <input type="text" id="prof-name" class="form-control" value="${currentUser.name}" required>
        </div>
      <button type="submit" class="btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-check"></i> Save Profile Details</button>
    </form>
  </div>
  
  <div class="glass-card" style="padding: 2rem; max-width: 600px; margin-top: 2rem;">
    <h4>Announcements & Meetings</h4>
    <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.9rem;">Important updates and meeting invitations from your Manager.</p>
    ${getAnnouncementsHtml(currentUser)}
  </div>
  `;

  document.getElementById("prof-photo-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      window.compressImage(file, 200, (compressedBase64) => {
        document.getElementById("prof-photo").value = compressedBase64;
        document.getElementById("prof-img-preview").src = compressedBase64;
      });
    }
  });

  document.getElementById("prof-photo").addEventListener("input", async (e) => {
    document.getElementById("prof-img-preview").src = e.target.value || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
  });

  document.getElementById("staff-profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedName = document.getElementById("prof-name").value;
    const updatedPhoto = document.getElementById("prof-photo").value;

    const users = await db.get("users");
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

    document.getElementById("sidebar-user-name").innerText = updatedName;
    document.getElementById("sidebar-user-photo").src = updatedPhoto;

    alert("Profile updated successfully!");
  });
}

function renderDefaultView(user) {
  if (user.role === "Guardian") renderGuardianMain(user);
  else if (user.role === "Cafeteria") {
    if (user.cafeteriaRole === "cafeteria manager") renderCafeteriaManager(user);
    else if (user.cafeteriaRole === "ticker") renderCafeteriaTicker(user);
    else renderCafeteriaMenu(user, false);
  }
  else if (user.role === "Librarian") renderLibrarianProfile(user);
  else if (user.role === "Dormitory") renderDormMain(user);
  else if (user.role === "BookStore") renderBookstoreProfile(user);
  else if (user.role === "IT_Technician") renderITLab(user);
  else if (["ChemistryLab", "PhysicsLab", "Drawing"].includes(user.role)) renderLabChemicals(user);
  else renderStaffUserProfile(user); // Fallback for custom roles
}

// ---------------- GUARDIANS ----------------
async function renderGuardianMain(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const students = await db.get("users").filter(u => u.role === "Student");
  const ward = students.find(s => s.id === user.studentId) || students[0];

  container.innerHTML = `
    <div class="grid-2">
      <div class="glass-card" style="padding: 2rem;">
        <h4>Guardian Profile Information</h4>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center;">
          <img src="${user.photo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
          <div>
            <h5>${user.name}</h5>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Duty Shift: <strong>${user.shiftSchedule}</strong></p>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Address: ${user.address || "Hawassa"}</p>
          </div>
        </div>
      </div>

      <div class="glass-card" style="padding: 2rem;">
        <h4>My Student Ward Details</h4>
        ${ward ? `
          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center;">
            <img src="${ward.photo}" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover;">
            <div>
              <h5>${ward.name}</h5>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">ID: <code>${ward.id}</code></p>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Class Placed: <strong>${ward.classSection || "Grade 9-A"}</strong></p>
            </div>
          </div>
        ` : `<p style="margin-top: 1.5rem; color: var(--text-secondary);">No ward linked currently.</p>`}
      </div>
    </div>
  `;
}

function renderGuardianAnnouncements() {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h4>Announcements & Meetings</h4>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Important updates and meeting invitations from the School Manager.</p>
      ${getAnnouncementsHtml(currentUser)}
    </div>
  `;
}

// ---------------- CAFETERIA ----------------
async function renderCafeteriaManager(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const users = await db.get("users").filter(u => u.role === "Cafeteria" && u.id !== user.id);

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4>Manage Cafeteria Staff & Cooks</h4>
        <button class="btn-primary" id="btn-add-cafe-staff"><i class="fas fa-plus"></i> Add Worker</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username ID</th>
              <th>Assigned Role</th>
              <th>Gender</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.name}</td>
                <td><code>${u.id}</code></td>
                <td><span class="badge badge-info">${u.cafeteriaRole}</span></td>
                <td>${u.gender}</td>
                <td>
                  <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteCafeWorker('${u.id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("btn-add-cafe-staff").addEventListener("click", async () => {
    document.getElementById("cafe-worker-form").reset();
    window.showPortalModal("cafe-worker-modal");

    document.getElementById("cafe-worker-form").onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById("cafe-worker-name").value.trim();
      const role = document.getElementById("cafe-worker-role").value.toLowerCase();
      const gender = document.getElementById("cafe-worker-gender").value;

      if (name && role && gender) {
        const allUsers = await db.get("users");
        const currentYear = new Date().getFullYear();
        const fourDigit = Math.floor(1000 + Math.random() * 9000);
        const generatedId = `HIGA/Cafeteria/${fourDigit}/${currentYear}`;

        allUsers.push({
          id: generatedId,
          username: generatedId,
          password: "password123",
          defaultPassword: "password123",
          name,
          role: "Cafeteria",
          cafeteriaRole: role,
          gender,
          created_at: new Date().toISOString()
        });
        await db.set("users", allUsers);
        window.hidePortalModal("cafe-worker-modal");
        alert(`Worker added successfully!\nUsername ID: ${generatedId}`);
        renderCafeteriaManager(user);
      }
    };
  });
}

window.deleteCafeWorker = async (id) => {
  if (!confirm(`Delete cafeteria worker ${id}?`)) return;
  const users = await db.get("users");
  await db.set("users", users.filter(u => u.id !== id));
  alert("Worker deleted.");
  // Reload
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  renderCafeteriaManager(currentUser);
};

async function renderCafeteriaMenu(user, canEdit) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const menu = await db.get("meal_menu");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Weekly Boarding School Meal Menus</h4>
          ${canEdit ? `<span class="badge badge-success">Manager Editing Privileges</span>` : `<span class="badge badge-info">View Mode</span>`}
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${canEdit ? `<button class="btn-primary" onclick="window.addMealDay()"><i class="fas fa-plus"></i> Add Meal Day</button>` : ""}
          <button class="btn-secondary" onclick="window.exportCafeMenuPrint()"><i class="fas fa-print"></i> Print</button>
          <button class="btn-secondary" onclick="window.exportCafeMenuCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportCafeMenuWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      <div class="table-responsive" id="cafe-menu-export-container">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Day / Title</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Breakfast</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Lunch</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Dinner</th>
              ${canEdit ? `<th style="border: 1px solid #ccc; padding: 8px;" class="no-export">Action</th>` : ""}
            </tr>
          </thead>
          <tbody>
            ${menu.map((m, index) => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;"><strong>${m.day}</strong></td>
                <td style="border: 1px solid #ccc; padding: 8px;">${m.breakfast}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${m.lunch}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${m.dinner}</td>
                ${canEdit ? `<td style="border: 1px solid #ccc; padding: 8px;" class="no-export">
                  <button class="btn-icon-sm" style="color: var(--accent-primary);" onclick="editMealDay(${index})"><i class="fas fa-edit"></i></button>
                  <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteMealDay(${index})"><i class="fas fa-trash"></i></button>
                </td>` : ""}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.addMealDay = async () => {
  document.getElementById("meal-menu-form").reset();
  document.getElementById("meal-day-index").value = "";
  window.showPortalModal("meal-menu-modal");

  document.getElementById("meal-menu-form").onsubmit = async (e) => {
    e.preventDefault();
    const day = document.getElementById("meal-day-title").value.trim();
    const breakfast = document.getElementById("meal-breakfast").value.trim();
    const lunch = document.getElementById("meal-lunch").value.trim();
    const dinner = document.getElementById("meal-dinner").value.trim();

    if (day && breakfast && lunch && dinner) {
      const menu = await db.get("meal_menu") || [];
      menu.push({ day, breakfast, lunch, dinner });
      await db.set("meal_menu", menu);
      window.hidePortalModal("meal-menu-modal");
      alert("Meal menu updated.");
      const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
      renderCafeteriaMenu(currentUser, true);
    }
  };
};

window.editMealDay = async (idx) => {
  const menu = await db.get("meal_menu");
  const d = menu[idx];

  document.getElementById("meal-day-index").value = idx;
  document.getElementById("meal-day-title").value = d.day;
  document.getElementById("meal-breakfast").value = d.breakfast;
  document.getElementById("meal-lunch").value = d.lunch;
  document.getElementById("meal-dinner").value = d.dinner;

  window.showPortalModal("meal-menu-modal");

  document.getElementById("meal-menu-form").onsubmit = async (e) => {
    e.preventDefault();
    const day = document.getElementById("meal-day-title").value.trim();
    const breakfast = document.getElementById("meal-breakfast").value.trim();
    const lunch = document.getElementById("meal-lunch").value.trim();
    const dinner = document.getElementById("meal-dinner").value.trim();

    if (day && breakfast && lunch && dinner) {
      menu[idx] = { day, breakfast, lunch, dinner };
      await db.set("meal_menu", menu);
      window.hidePortalModal("meal-menu-modal");
      alert("Meal menu updated.");
      const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
      renderCafeteriaMenu(currentUser, true);
    }
  };
};

window.deleteMealDay = async (idx) => {
  if (!confirm("Are you sure you want to delete this meal day?")) return;
  const menu = await db.get("meal_menu") || [];
  menu.splice(idx, 1);
  await db.set("meal_menu", menu);
  alert("Meal day removed.");
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  renderCafeteriaMenu(currentUser, true);
};

// Global Export Functions for Cafeteria Menu
window.exportCafeMenuPrint = () => {
  const htmlContent = document.getElementById("cafe-menu-export-container").innerHTML;
  const printWin = window.open("", "_blank");
  printWin.document.write(`
    <html>
      <head>
        <title>Weekly Meal Menu</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .no-export { display: none !important; }
        </style>
      </head>
      <body>
        <h2>Weekly Boarding School Meal Menu</h2>
        <p>Date Generated: ${new Date().toLocaleDateString()}</p>
        ${htmlContent}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
};

window.exportCafeMenuCSV = async () => {
  const menu = await db.get("meal_menu") || [];
  let csv = "Day / Title,Breakfast,Lunch,Dinner\n";
  menu.forEach(m => {
    csv += `"${m.day}","${m.breakfast}","${m.lunch}","${m.dinner}"\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Cafeteria_Menu_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportCafeMenuWord = () => {
  const htmlContent = document.getElementById("cafe-menu-export-container").innerHTML;
  
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>Weekly Meal Menu Export</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .no-export { display: none; }
  </style>
  </head><body>
  <h2>Weekly Boarding School Meal Menu</h2>
  <p>Date Generated: ${new Date().toLocaleDateString()}</p>
  `;
  const footer = "</body></html>";
  const sourceHTML = header + htmlContent + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Cafeteria_Menu_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

async function renderCafeteriaShifts(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Cafeteria Staff Shifts</h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 0.3rem;">Manage and post shifts for cooks and tickers.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-primary" id="btn-post-shift"><i class="fas fa-plus"></i> Post Shift</button>
          <button class="btn-secondary" onclick="window.exportCafeShiftsPrint()"><i class="fas fa-print"></i> Print</button>
          <button class="btn-secondary" onclick="window.exportCafeShiftsCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportCafeShiftsWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      <div class="table-responsive" id="cafe-shifts-export-container">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Assigned Workers</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Week Of</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Time</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Duty</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Remarks</th>
              <th style="border: 1px solid #ccc; padding: 8px;" class="no-export">Action</th>
            </tr>
          </thead>
          <tbody id="cafe-shifts-body"></tbody>
        </table>
      </div>
    </div>
  `;

  window.loadCafeShifts = async () => {
    const shifts = await db.get("cafe_shifts") || [];
    const users = await db.get("users") || [];
    const tbody = document.getElementById("cafe-shifts-body");
    if (!tbody) return;
    
    const grouped = {};
    shifts.forEach(s => {
      // Handle legacy records that have 'date' instead of 'week_start'
      const wk = s.week_start || s.date;
      const daysStr = (s.days || []).join(", ");
      const key = `${wk}|${daysStr}|${s.time}|${s.duty}`;
      if (!grouped[key]) grouped[key] = { week_start: wk, days: daysStr, time: s.time, duty: s.duty, remarks: s.remarks, items: [] };
      grouped[key].items.push(s);
    });

    if (Object.keys(grouped).length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No weekly shifts posted.</td></tr>`;
      return;
    }

    const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(grouped[b].week_start) - new Date(grouped[a].week_start));

    tbody.innerHTML = sortedKeys.map(key => {
      const g = grouped[key];
      const workersHtml = g.items.map(shf => {
        const u = users.find(user => user.id === shf.worker_ids[0]);
        const name = u ? u.name : "Unknown";
        return `<span class="badge badge-info" style="display:inline-flex; align-items:center; gap:4px; margin-bottom:2px;">
          ${name} <i class="fas fa-times" style="cursor:pointer; color:#fff;" onclick="deleteCafeShift('${shf.id}')" title="Remove worker from shift"></i>
        </span>`;
      }).join(" ");

      return `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">${workersHtml}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${g.week_start} ${g.days ? `<b>(${g.days})</b>` : ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${g.time}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${g.duty}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${g.remarks || '-'}</td>
          <td style="border: 1px solid #ccc; padding: 8px;" class="no-export">
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteCafeShiftGroup('${key}')" title="Delete Entire Group"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>
      `;
    }).join("");
  };

  window.deleteCafeShiftGroup = async (key) => {
    if (!confirm("Delete all shifts in this group?")) return;
    const shifts = await db.get("cafe_shifts") || [];
    const filtered = shifts.filter(async s => {
      const wk = s.week_start || s.date;
      const daysStr = (s.days || []).join(", ");
      return `${wk}|${daysStr}|${s.time}|${s.duty}` !== key;
    });
    await db.set("cafe_shifts", filtered);
    window.loadCafeShifts();
  };

  window.loadCafeShifts();

  document.getElementById("btn-post-shift").addEventListener("click", async () => {
    document.getElementById("cafe-shift-form").reset();
    document.getElementById("cafe-shift-id").value = "";
    
    const users = await db.get("users") || [];
    const cafeteriaWorkers = users.filter(u => u.role === "Cafeteria" && u.cafeteriaRole !== "cafeteria manager");
    const listContainer = document.getElementById("cafe-shift-workers-list");
    if (listContainer) {
      listContainer.innerHTML = cafeteriaWorkers.map(w => `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <input type="checkbox" id="cw-${w.id}" value="${w.id}" class="shift-worker-checkbox">
          <label for="cw-${w.id}" style="margin: 0; flex-grow: 1;">${w.name} <span class="badge badge-info" style="font-size:0.7rem;">${w.cafeteriaRole}</span></label>
        </div>
      `).join("");
    }
    
    document.getElementById('new-cafe-worker-fields').style.display = 'none';
    const addWorkerBtn = document.getElementById('btn-add-cafe-worker');
    if (addWorkerBtn) addWorkerBtn.style.display = 'inline-block';
    
    window.showPortalModal("cafe-shift-modal");

    const shiftForm = document.getElementById("cafe-shift-form");
    const newForm = shiftForm.cloneNode(true);
    shiftForm.replaceWith(newForm);

    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const checkboxes = document.querySelectorAll('.shift-worker-checkbox:checked');
      const worker_ids = Array.from(checkboxes).map(cb => cb.value);
      
      const isAddingNewWorker = document.getElementById('new-cafe-worker-fields').style.display !== 'none';
      let allUsers = await db.get("users") || [];
      
      if (isAddingNewWorker) {
        const newName = document.getElementById("new-cafe-worker-name").value.trim();
        const newRole = document.getElementById("new-cafe-worker-role").value;
        if (!newName) {
          alert("Please enter the name for the new worker.");
          return;
        }
        
        const newWorkerId = 'cw-' + Date.now();
        const newUser = {
          id: newWorkerId,
          name: newName,
          email: `${newName.toLowerCase().replace(/\s+/g, '.')}@higa.edu`,
          password: "password123",
          role: "Cafeteria",
          cafeteriaRole: newRole,
          isActive: true
        };
        allUsers.push(newUser);
        await db.set("users", allUsers);
        worker_ids.push(newWorkerId);
      }
      
      if (worker_ids.length === 0) {
        alert("Please select at least one worker or create a new one for this shift.");
        return;
      }
      
      const dayCheckboxes = document.querySelectorAll('input[name="cafe_shift_days"]:checked');
      const selectedDays = Array.from(dayCheckboxes).map(cb => cb.value);
      if (selectedDays.length === 0) {
        alert("Please select at least one day for this shift.");
        return;
      }
      const week_start = document.getElementById("cafe-shift-date").value;
      const startTime = document.getElementById("cafe-shift-time-start").value;
      const endTime = document.getElementById("cafe-shift-time-end").value;
      
      // Convert to 12-hour format for better readability (optional, but good for UX)
      const formatTime = async (timeStr) => {
        if (!timeStr) return "";
        let [h, m] = timeStr.split(':');
        h = parseInt(h);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
      };
      
      const time = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      const duty = document.getElementById("cafe-shift-duty").value.trim();
      const remarks = document.getElementById("cafe-shift-remarks") ? document.getElementById("cafe-shift-remarks").value.trim() : "";

      const shifts = await db.get("cafe_shifts") || [];
      // To support grouping elegantly and deleting efficiently, if multiple workers are selected, we can either
      // create one shift record with all worker_ids, or one for each. 
      // Previously, we created one shift record with `worker_ids` as an array. We will continue this approach!
      // But we will create ONE shift record for EACH worker, to match how single-select dropdown worked previously!
      // Wait, no. If we create one shift record with all `worker_ids`, they group naturally. But if they delete one worker, it modifies the array.
      // Wait, the deleteCafeShift function deletes the ENTIRE shift record (`id`). If they delete an individual worker, it deletes everyone in that record.
      // So to allow deleting individual workers, we must create ONE shift record per worker!
      worker_ids.forEach(async wid => {
        shifts.push({ id: 'shf-' + Date.now() + '-' + wid, worker_ids: [wid], week_start, days: selectedDays, time, duty, remarks, created_at: new Date().toISOString() });
      });
      await db.set("cafe_shifts", shifts);
      window.hidePortalModal("cafe-shift-modal");
      window.loadCafeShifts();
      alert("Shift posted successfully.");
    });
  });
}

// Global Export Functions for Shifts
window.exportCafeShiftsPrint = async () => {
  const htmlContent = document.getElementById("cafe-shifts-export-container").innerHTML;
  const printWin = window.open("", "_blank");
  printWin.document.write(`
    <html>
      <head>
        <title>Cafeteria Shifts</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .no-export { display: none !important; }
          .badge { margin-right: 4px; }
        </style>
      </head>
      <body>
        <h2>Cafeteria Staff Shifts</h2>
        <p>Date Generated: ${new Date().toLocaleDateString()}</p>
        ${htmlContent}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
};

window.exportCafeShiftsCSV = async () => {
  const shifts = await db.get("cafe_shifts") || [];
  const users = await db.get("users") || [];
  let csv = "Assigned Workers,Week Of,Time,Duty,Remarks\n";
  shifts.forEach(s => {
    const workerNames = (s.worker_ids || []).map(id => {
      const u = users.find(user => user.id === id);
      return u ? u.name : "Unknown";
    }).join(" & ");
    csv += `"${workerNames}","${s.week_start || s.date}","${s.time}","${s.duty}","${s.remarks || ''}"\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Cafeteria_Shifts_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportCafeShiftsWord = async () => {
  const htmlContent = document.getElementById("cafe-shifts-export-container").innerHTML;
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>Cafeteria Shifts Export</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .no-export { display: none; }
  </style>
  </head><body>
  <h2>Cafeteria Staff Shifts</h2>
  <p>Date Generated: ${new Date().toLocaleDateString()}</p>
  `;
  const footer = "</body></html>";
  const sourceHTML = header + htmlContent + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Cafeteria_Shifts_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

window.deleteCafeShift = async (id) => {
  if (!confirm("Delete this shift?")) return;
  const shifts = await db.get("cafe_shifts") || [];
  await db.set("cafe_shifts", shifts.filter(s => s.id !== id));
  if (window.loadCafeShifts) window.loadCafeShifts();
};

async function renderCafeteriaManagerAttendance(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const allUsers = await db.get("users") || [];
  const staff = allUsers.filter(u => u.role === "Cafeteria" && u.cafeteriaRole !== "cafeteria manager");
  const today = new Date().toISOString().split('T')[0];
  const attendances = await db.get("cafe_attendances") || [];
  const todaysAtt = attendances.filter(a => a.date === today);

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Daily Staff Attendance (${today})</h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Mark attendance for cooks and tickers.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-secondary" onclick="window.exportCafeAttPrint()"><i class="fas fa-print"></i> Print</button>
          <button class="btn-secondary" onclick="window.exportCafeAttCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportCafeAttWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      
      <form id="cafe-attendance-form" style="margin-bottom: 2rem; background: rgba(0,0,0,0.02); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;">
          <div style="flex: 1; min-width: 200px;">
            <label>Select Worker</label>
            <select id="cafe-att-worker" class="form-control" required onchange="document.getElementById('new-att-worker-fields').style.display = this.value === 'add_new' ? 'block' : 'none';">
              <option value="" disabled selected>Select a worker...</option>
              ${staff.map(s => `<option value="${s.id}">${s.name} (${s.cafeteriaRole})</option>`).join("")}
              <option value="add_new">+ Add New Worker</option>
            </select>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <label>Status</label>
            <div style="display: flex; gap: 1rem; align-items: center; height: 38px;">
              <label style="margin: 0; cursor: pointer; color: green;"><input type="radio" name="att_status" value="Present" required> Present</label>
              <label style="margin: 0; cursor: pointer; color: red;"><input type="radio" name="att_status" value="Absent"> Absent</label>
              <label style="margin: 0; cursor: pointer; color: orange;"><input type="radio" name="att_status" value="Late"> Late</label>
            </div>
          </div>
          <div style="flex: 2; min-width: 200px;">
            <label>Remarks / Notes</label>
            <input type="text" id="cafe-att-remarks" class="form-control" placeholder="Optional remarks">
          </div>
          <div>
            <button type="submit" class="btn-primary" style="height: 38px;">Log Attendance</button>
          </div>
        </div>
        <div id="new-att-worker-fields" style="display: none; margin-top: 1rem; padding: 1rem; border: 1px dashed var(--border-color); border-radius: 4px; background: rgba(0,0,0,0.02);">
          <h6 style="margin-bottom: 0.5rem; font-size: 0.85rem;">Create New Worker</h6>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <div style="flex: 1;">
              <label>Worker Full Name</label>
              <input type="text" id="new-att-worker-name" class="form-control" placeholder="e.g. Abebe Kebede">
            </div>
            <div style="flex: 1;">
              <label>Assigned Role</label>
              <select id="new-att-worker-role" class="form-control">
                <option value="cook">Cook</option>
                <option value="ticker">Ticker</option>
              </select>
            </div>
          </div>
        </div>
      </form>
      
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
        <h5 style="margin: 0;">Today's Logged Attendance</h5>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${todaysAtt.length > 0 && todaysAtt.every(a => a.is_forwarded) ? `<span class="badge badge-success">All Forwarded</span>` : ''}
          <button class="btn-primary" style="font-size: 0.8rem; padding: 4px 10px; ${todaysAtt.some(a => !a.is_forwarded) ? '' : 'opacity: 0.6; cursor: not-allowed;'}" onclick="forwardCafeAttendance()">Forward to Manager</button>
        </div>
      </div>
      <div class="table-responsive" id="cafe-attendance-export-container">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Staff Name</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Status</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Remarks</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Logged At</th>
              <th style="border: 1px solid #ccc; padding: 8px;" class="no-export">Action</th>
            </tr>
          </thead>
          <tbody>
            ${todaysAtt.length > 0 ? todaysAtt.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map(a => {
              const u = allUsers.find(user => user.id === a.userId);
              const name = u ? u.name : "Unknown";
              return `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 8px;">${name}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;"><span class="badge ${a.status === 'Present' ? 'badge-success' : (a.status === 'Absent' ? 'badge-danger' : 'badge-warning')}">${a.status}</span></td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${a.remarks || '-'}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${new Date(a.timestamp).toLocaleTimeString()}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;" class="no-export">
                    ${!a.is_forwarded ? `<button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteCafeAtt('${a.id}')"><i class="fas fa-trash"></i></button>` : `<i class="fas fa-check" style="color: green;" title="Forwarded"></i>`}
                  </td>
                </tr>
              `;
            }).join("") : '<tr><td colspan="5" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No attendance logged today.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("cafe-attendance-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let workerId = document.getElementById("cafe-att-worker").value;
    if (!workerId) {
      alert("Please select a worker.");
      return;
    }
    
    let allUsers = await db.get("users") || [];
    
    if (workerId === 'add_new') {
      const newName = document.getElementById("new-att-worker-name").value.trim();
      const newRole = document.getElementById("new-att-worker-role").value;
      if (!newName) {
        alert("Please enter the name for the new worker.");
        return;
      }
      
      workerId = 'cw-' + Date.now();
      const newUser = {
        id: workerId,
        name: newName,
        email: `${newName.toLowerCase().replace(/\s+/g, '.')}@higa.edu`,
        password: "password123",
        role: "Cafeteria",
        cafeteriaRole: newRole,
        isActive: true
      };
      allUsers.push(newUser);
      await db.set("users", allUsers);
    }

    const status = document.querySelector('input[name="att_status"]:checked').value;
    const remarks = document.getElementById("cafe-att-remarks").value.trim();

    const allAttendances = await db.get("cafe_attendances") || [];
    // Remove existing record for this user today if replacing
    const filteredAtt = allAttendances.filter(a => !(a.userId === workerId && a.date === today));
    
    filteredAtt.push({
      id: 'catt-' + Date.now() + '-' + workerId,
      userId: workerId,
      date: today,
      status: status,
      remarks: remarks,
      is_forwarded: false,
      timestamp: new Date().toISOString()
    });
    
    await db.set("cafe_attendances", filteredAtt);
    
    alert("Attendance logged.");
    const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
    renderCafeteriaManagerAttendance(currentUser);
  });
}

window.forwardCafeAttendance = async () => {
  if (!confirm("Forward all of today's un-forwarded attendance logs to the manager? You won't be able to delete them after forwarding.")) return;
  const today = new Date().toISOString().split("T")[0];
  const attendances = await db.get("cafe_attendances") || [];
  let updatedCount = 0;
  const updated = attendances.map(a => {
    if (a.date === today && !a.is_forwarded) {
      a.is_forwarded = true;
      updatedCount++;
    }
    return a;
  });
  if (updatedCount === 0) {
    alert("No un-forwarded logs found for today.");
    return;
  }
  
  // Generate CSV attachment for the forwarded records
  const users = await db.get("users") || [];
  let csv = "Staff Name,Date,Status,Remarks,Logged At\n";
  updated.filter(a => a.date === today && a.is_forwarded).forEach(async a => {
    const u = users.find(u => u.id === a.userId);
    const name = u ? u.name : a.userId;
    csv += `"${name}","${a.date}","${a.status}","${a.remarks || ''}","${new Date(a.timestamp).toLocaleTimeString()}"\n`;
  });
  
  // Create message
  const messages = await db.get("messages") || [];
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  messages.push({
    id: 'msg-' + Date.now(),
    sender_id: currentUser ? currentUser.id : 'unknown',
    receiver_role: 'Manager',
    title: `Cafeteria Attendance Report: ${today}`,
    content: `Please find the attached attendance report for cafeteria staff for ${today}. Generated automatically by the Cafeteria Manager.`,
    attachment_type: 'text/csv',
    attachment_data: csv,
    is_read: false,
    created_at: new Date().toISOString()
  });
  await db.set("messages", messages);
  await db.set("cafe_attendances", updated);
  
  if (currentUser) renderCafeteriaManagerAttendance(currentUser);
  alert(`Successfully forwarded ${updatedCount} attendance log(s) and sent the report to the manager's inbox.`);
};

window.deleteCafeAtt = async (id) => {
  if (!confirm("Delete this attendance log?")) return;
  const atts = await db.get("cafe_attendances") || [];
  await db.set("cafe_attendances", atts.filter(a => a.id !== id));
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  if (currentUser) renderCafeteriaManagerAttendance(currentUser);
};

// Global Export Functions for Attendance
window.exportCafeAttPrint = async () => {
  const htmlContent = document.getElementById("cafe-attendance-export-container").innerHTML;
  const printWin = window.open("", "_blank");
  printWin.document.write(`
    <html>
      <head>
        <title>Cafeteria Attendance</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .badge { margin-right: 4px; }
        </style>
      </head>
      <body>
        <h2>Cafeteria Staff Attendance</h2>
        <p>Date Generated: ${new Date().toLocaleDateString()}</p>
        ${htmlContent}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
};

window.exportCafeAttCSV = async () => {
  const staff = await db.get("users").filter(u => u.role === "Cafeteria" && u.cafeteriaRole !== "cafeteria manager");
  const today = new Date().toISOString().split('T')[0];
  const attendances = await db.get("cafe_attendances") || [];
  const todaysAtt = attendances.filter(a => a.date === today);

  let csv = "Staff Name,Role,Status,Date,Remarks\n";
  staff.forEach(s => {
    const rec = todaysAtt.find(a => a.userId === s.id);
    const status = rec ? rec.status : 'Pending';
    const remarks = rec ? (rec.remarks || '') : '';
    csv += `"${s.name}","${s.cafeteriaRole}","${status}","${today}","${remarks}"\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Cafeteria_Attendance_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportCafeAttWord = () => {
  const htmlContent = document.getElementById("cafe-attendance-export-container").innerHTML;
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>Cafeteria Attendance Export</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
  </head><body>
  <h2>Cafeteria Staff Attendance</h2>
  <p>Date Generated: ${new Date().toLocaleDateString()}</p>
  `;
  const footer = "</body></html>";
  const sourceHTML = header + htmlContent + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Cafeteria_Attendance_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

async function renderCafeteriaShiftsView(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;
  const shifts = (await db.get("cafe_shifts") || []).filter(s => (s.worker_ids || []).includes(user.id) || s.worker_id === user.id);

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h4>My Assigned Shifts</h4>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">View your weekly shifts assigned by the Cafeteria Manager.</p>
      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Week Of</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Time</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Duty</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${shifts.length > 0 ? shifts.sort((a,b) => new Date(b.week_start || b.date || 0) - new Date(a.week_start || a.date || 0)).map(s => {
              const daysStr = s.days ? ` <b>(${s.days.join(", ")})</b>` : '';
              return `
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">${s.week_start || s.date}${daysStr}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${s.time}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${s.duty}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${s.remarks || '-'}</td>
              </tr>
              `;
            }).join("") : '<tr><td colspan="3" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No shifts assigned.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function renderCafeteriaMyAttendance(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;
  const atts = (await db.get("cafe_attendances") || []).filter(a => a.userId === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h4>My Attendance Logs</h4>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Your attendance history recorded by the manager.</p>
      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Date</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${atts.length > 0 ? atts.map(a => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">${a.date}</td>
                <td style="border: 1px solid #ccc; padding: 8px;"><span class="badge ${a.status === 'Present' ? 'badge-success' : (a.status === 'Absent' ? 'badge-danger' : 'badge-warning')}">${a.status}</span></td>
              </tr>
            `).join("") : '<tr><td colspan="2" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No attendance recorded.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCafeteriaAnnouncements(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Cafeteria Announcements</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Post updates and news for cafeteria staff.</p>
        </div>
        <button class="btn-primary" id="btn-create-cafe-ann"><i class="fas fa-plus"></i> Post Announcement</button>
      </div>
      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Title</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Date Posted</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Target</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Action</th>
            </tr>
          </thead>
          <tbody id="cafe-ann-body"></tbody>
        </table>
      </div>
    </div>
  `;

  window.loadCafeAnnouncements = async () => {
    const anns = await db.get("announcements") || [];
    const tbody = document.getElementById("cafe-ann-body");
    if (!tbody) return;

    // Filter to show announcements created by cafeteria manager or targeting cafeteria
    const filtered = anns.filter(a => a.target === 'cafeteria' || a.author === user.id);

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 8px; border: 1px solid #ccc;">No announcements found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;"><strong>${a.title}</strong></td>
        <td style="border: 1px solid #ccc; padding: 8px;">${a.date}</td>
        <td style="border: 1px solid #ccc; padding: 8px;"><span class="badge badge-info" style="text-transform: capitalize;">${a.target}</span></td>
        <td style="border: 1px solid #ccc; padding: 8px;">
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteCafeAnnouncement('${a.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join("");
  };

  window.loadCafeAnnouncements();

  document.getElementById("btn-create-cafe-ann").addEventListener("click", async () => {
    document.getElementById("announcement-form").reset();
    document.getElementById("announcement-id").value = "";
    document.getElementById("announcement-target").value = "cafeteria"; // Default
    window.showPortalModal("announcement-modal");

    const form = document.getElementById("announcement-form");
    const newForm = form.cloneNode(true);
    form.replaceWith(newForm);

    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("announcement-title").value.trim();
      const target = document.getElementById("announcement-target").value;
      const expiry = document.getElementById("announcement-expiry").value;
      const content = document.getElementById("announcement-content").value.trim();

      const anns = await db.get("announcements") || [];
      anns.push({
        id: 'ann-' + Date.now(),
        title,
        target,
        expiryDate: expiry,
        content,
        date: new Date().toISOString().split('T')[0],
        author: user.id
      });
      await db.set("announcements", anns);
      window.hidePortalModal("announcement-modal");
      window.loadCafeAnnouncements();
      alert("Announcement posted.");
    });
  });
}

window.deleteCafeAnnouncement = async (id) => {
  if (!confirm("Delete this announcement?")) return;
  const anns = await db.get("announcements") || [];
  await db.set("announcements", anns.filter(a => a.id !== id));
  if (window.loadCafeAnnouncements) window.loadCafeAnnouncements();
};

async function renderCafeteriaTicker(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const students = await db.get("users").filter(u => u.role === "Student");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h4>Student Meal Attendance (Roll Call)</h4>
        <button class="btn-primary" id="btn-submit-ticker-att">Submit Meal Log to Cafeteria Manager</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Breakfast Present</th>
              <th>Lunch Present</th>
              <th>Dinner Present</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td>${s.name}</td>
                <td><code>${s.id}</code></td>
                <td><input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;"></td>
                <td><input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;"></td>
                <td><input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;"></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("btn-submit-ticker-att").addEventListener("click", async () => {
    alert("Today's meal attendance submitted to Cafeteria Manager.");
  });
}

// ---------------- SHARED SHIFTS RENDERER ----------------
async function getAssignedShiftsHtml(user) {
  const shifts = await db.get("shifts") || [];
  const myShifts = shifts.filter(s => {
    if (s.worker_ids) return s.worker_ids.includes(user.id);
    return s.target === user.role;
  });

  if (myShifts.length === 0) {
    return `<div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; text-align: center; color: var(--text-secondary);">No shifts assigned yet.</div>`;
  }

  let html = `<div style="display: flex; flex-direction: column; gap: 1rem; max-height: 400px; overflow-y: auto;">`;
  myShifts.sort((a,b) => new Date(b.week_start || b.postedAt || 0) - new Date(a.week_start || a.postedAt || 0)).forEach(s => {
    if (s.week_start) {
      html += `
        <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(var(--accent-primary-rgb), 0.03);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong style="color: var(--accent-primary);">${s.duty}</strong>
            <span class="badge badge-info">Week of ${s.week_start}</span>
          </div>
          <div style="font-size: 0.9rem;">
            <i class="fas fa-calendar-day" style="width: 20px; color: var(--text-secondary);"></i> ${s.days.join(", ")}<br>
            <i class="fas fa-clock" style="width: 20px; color: var(--text-secondary);"></i> ${s.time}
            ${s.remarks ? `<br><i class="fas fa-comment" style="width: 20px; color: var(--text-secondary);"></i> ${s.remarks}` : ''}
          </div>
        </div>
      `;
    } else {
      html += `
        <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong>${s.title} (Legacy)</strong>
            <span class="badge badge-warning">${s.date}</span>
          </div>
          <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">${s.details}</p>
        </div>
      `;
    }
  });
  html += `</div>`;
  return html;
}

// ---------------- SHARED ANNOUNCEMENTS RENDERER ----------------
async function getAnnouncementsHtml(user) {
  const anns = await db.get("announcements") || [];
  
  // Filter announcements for this user
  const myAnns = anns.filter(a => {
    // If it's a legacy or old announcement without explicit target formatting
    if (!a.target && a.author === user.id) return true; // My own posts? Actually we only want received.
    if (a.target === "all") return true;
    if (a.target === user.role) return true;
    if (a.target === `USER:${user.id}`) return true;
    // For cafeteria specific (old hardcoded 'cafeteria')
    if (user.role === 'Cafeteria' && a.target === 'cafeteria') return true;
    return false;
  });

  if (myAnns.length === 0) {
    return `<div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; text-align: center; color: var(--text-secondary);">No new announcements.</div>`;
  }

  const getUrgencyColor = (urgency) => {
    if (urgency === "urgent") return "var(--accent-danger)";
    if (urgency === "high") return "var(--accent-warning)";
    return "var(--accent-primary)";
  };

  const getUrgencyBg = (urgency) => {
    if (urgency === "urgent") return "rgba(220, 53, 69, 0.05)";
    if (urgency === "high") return "rgba(255, 193, 7, 0.05)";
    return "rgba(var(--accent-primary-rgb), 0.03)";
  };

  // Sort: Urgent first, then High, then Normal. Then by date.
  myAnns.sort((a, b) => {
    const val = { "urgent": 3, "high": 2, "normal": 1, undefined: 1 };
    const uA = val[a.urgency];
    const uB = val[b.urgency];
    if (uA !== uB) return uB - uA;
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  let html = `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
  myAnns.forEach(a => {
    const isMeeting = a.postType === "meeting";
    const color = getUrgencyColor(a.urgency);
    html += `
      <div style="border-left: 4px solid ${color}; padding: 1rem; background: ${getUrgencyBg(a.urgency)}; border-radius: 0 8px 8px 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h5 style="margin: 0; color: ${color};"><i class="fas ${isMeeting ? 'fa-handshake' : 'fa-bullhorn'}"></i> ${a.title}</h5>
          ${a.urgency ? `<span class="badge" style="background: ${color}; color: #fff;">${a.urgency.toUpperCase()}</span>` : ''}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.5; margin-bottom: 0.5rem;">
          ${a.content}
        </p>
        ${isMeeting && a.meetingTime ? `<p style="margin-bottom: 0.5rem; font-weight: bold; color: var(--accent-primary);"><i class="fas fa-clock"></i> Meeting Time: ${new Date(a.meetingTime).toLocaleString()}</p>` : ''}
        <span style="font-size: 0.75rem; color: var(--text-tertiary); display: block;">Posted on ${a.date}</span>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

// ---------------- LIBRARIANS ----------------
function renderLibrarianProfile(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="grid-2">
      <div class="glass-card" style="padding: 2rem;">
        <h4>Librarian Duties & Shifts</h4>
        <div style="margin-top: 1.5rem;">
          <p>Name: <strong>${user.name}</strong></p>
          <p>Librarian ID: <code>${user.id}</code></p>
          <p>Assigned Shift Schedule: <strong>${user.shiftSchedule || 'Day Shift'}</strong></p>
        </div>
        <div style="margin-top: 2rem;">
          <h5 style="margin-bottom: 1rem;">My Manager-Assigned Shifts</h5>
          ${getAssignedShiftsHtml(user)}
        </div>
      </div>
      <div class="glass-card" style="padding: 2rem;">
        <h4>Submit Daily Librarian Attendance</h4>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">Submit clock-in and work log reports directly to Managers.</p>
        <button class="btn-primary" id="btn-lib-attendance">Clock-In Duty Attendance</button>
      </div>
    </div>
  `;

  document.getElementById("btn-lib-attendance").addEventListener("click", async () => {
    alert("Attendance registered. Daily report dispatched to Ato Belayneh Gidey.");
  });
}

async function renderLibrarianBooks() {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const books = await db.get("books");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4>Library Books Catalog</h4>
        <button class="btn-primary" id="btn-add-book"><i class="fas fa-plus"></i> Catalogue New Book</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Category</th>
              <th>Total Copies</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(b => `
              <tr>
                <td>${b.title}</td>
                <td>${b.author}</td>
                <td>${b.publisher} (${b.year})</td>
                <td><span class="badge badge-info">${b.category}</span></td>
                <td>${b.copies} copies</td>
                <td>
                  <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteLibBook('${b.id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("btn-add-book").addEventListener("click", async () => {
    document.getElementById("book-form").reset();
    window.showPortalModal("book-modal");

    document.getElementById("book-form").onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById("book-title").value.trim();
      const author = document.getElementById("book-author").value.trim();
      const category = document.getElementById("book-category").value.trim().toLowerCase();
      const copies = parseInt(document.getElementById("book-copies").value);

      if (title && author && category && copies) {
        const allBooks = await db.get("books");
        allBooks.push({
          id: "BK-" + Date.now(),
          title,
          author,
          publisher: "Higa Publisher",
          year: 2026,
          category: category,
          copies: copies
        });
        await db.set("books", allBooks);
        window.hidePortalModal("book-modal");
        alert("Book catalogue updated.");
        renderLibrarianBooks();
      }
    };
  });
}

window.deleteLibBook = async (id) => {
  if (!confirm(`Delete book ${id}?`)) return;
  const allBooks = await db.get("books");
  await db.set("books", allBooks.filter(b => b.id !== id));
  renderLibrarianBooks();
};

// ---------------- DORMITORY MANAGERS ----------------
function renderDormMain(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Student Dormitory Allocations</h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Manage beds, rooms, and items (${user.dormType === 'male' ? 'Male Table' : 'Female Table'}). Students are grouped by Block and Room.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-primary" onclick="window.sendDormAllocationsToManager()"><i class="fas fa-paper-plane"></i> Post to Manager</button>
          <button class="btn-secondary" onclick="window.printDormAllocations()"><i class="fas fa-print"></i> Print / PDF</button>
          <button class="btn-secondary" onclick="window.exportDormAllocationsCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportDormAllocationsWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      
      <div id="dorm-allocations-export-container">
        <!-- Loaded Dynamically grouped by Room -->
      </div>
    </div>

    <!-- Allocation Modal -->
    <div id="dorm-alloc-modal" class="glass-card" style="display: none; position: fixed; top: 10%; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px; z-index: 1200; padding: 2rem;">
      <h4>Allocate Dormitory & Assets</h4>
      <form id="dorm-alloc-form" style="margin-top: 1.5rem;">
        <input type="hidden" id="alloc-student-id">
        <div class="form-group">
          <label>Student Name</label>
          <input type="text" id="alloc-student-name" class="form-control" readonly>
        </div>
        <div class="form-group">
          <label>Block / Building</label>
          <input type="text" id="alloc-block" class="form-control" placeholder="e.g. Block B" required>
        </div>
        <div class="form-group">
          <label>Room Number</label>
          <input type="text" id="alloc-room" class="form-control" placeholder="e.g. 204" required>
        </div>
        <div class="form-group">
          <label>Bed Number</label>
          <input type="text" id="alloc-bed" class="form-control" placeholder="e.g. 12" required>
        </div>
        <div class="form-group">
          <label style="margin-bottom: 0.5rem; display: block;">Issued Items</label>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <input type="checkbox" id="alloc-mattress"> Mattress
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <input type="checkbox" id="alloc-pillow"> Pillow
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <input type="checkbox" id="alloc-blanket"> Blanket
          </label>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-secondary" onclick="window.hidePortalModal('dorm-alloc-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Save Allocation</button>
        </div>
      </form>
    </div>
  `;

  window.loadDormAllocationsTable();
}

window.printDormAllocations = () => {
  const printContents = document.getElementById("dorm-allocations-export-container").innerHTML;
  const originalContents = document.body.innerHTML;
  
  document.body.innerHTML = `
    <div style="padding: 2rem; background: white; color: black;">
      <h2>Student Dormitory Allocations Report</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      ${printContents}
    </div>
  `;
  const styles = document.createElement('style');
  styles.innerHTML = ".no-export { display: none !important; }";
  document.head.appendChild(styles);
  
  window.print();
  
  document.body.innerHTML = originalContents;
  window.location.reload();
};

window.exportDormAllocationsCSV = async () => {
  const students = await db.get("users").filter(u => u.role === "Student");
  
  students.sort((a, b) => {
    const blockA = a.dormBlock || "Unassigned";
    const blockB = b.dormBlock || "Unassigned";
    if (blockA !== blockB) return blockA.localeCompare(blockB);
    
    const roomA = a.dormRoom || "Unassigned";
    const roomB = b.dormRoom || "Unassigned";
    if (roomA !== roomB) return roomA.localeCompare(roomB);
    
    const batchA = a.batch || "";
    const batchB = b.batch || "";
    if (batchA !== batchB) return batchA.localeCompare(batchB);
    
    const classA = a.classSection || "";
    const classB = b.classSection || "";
    return classA.localeCompare(classB);
  });

  let csv = "Block,Room,Batch,Class Section,Student ID,Name,Bed,Has Mattress,Has Pillow,Has Blanket\n";
  students.forEach(s => {
    csv += `"${s.dormBlock || 'Unassigned'}","${s.dormRoom || 'Unassigned'}","${s.batch || 'N/A'}","${s.classSection || 'N/A'}","${s.id}","${s.name}","${s.bedNumber || 'N/A'}","${s.hasMattress ? 'Yes' : 'No'}","${s.hasPillow ? 'Yes' : 'No'}","${s.hasBlanket ? 'Yes' : 'No'}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `Dorm_Allocations_${new Date().getTime()}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.exportDormAllocationsWord = () => {
  const htmlContent = document.getElementById("dorm-allocations-export-container").innerHTML;
  
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>Dorm Allocations Export</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .no-export { display: none; }
  </style>
  </head><body>
  <h2>Student Dormitory Allocations Report</h2>
  <p>Date: ${new Date().toLocaleDateString()}</p>
  `;
  const footer = "</body></html>";
  
  const sourceHTML = header + htmlContent + footer;
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Dorm_Allocations_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

window.sendDormAllocationsToManager = async () => {
  const students = await db.get("users").filter(u => u.role === "Student");
  
  students.sortasync ((a, b) => {
    const blockA = a.dormBlock || "Unassigned";
    const blockB = b.dormBlock || "Unassigned";
    if (blockA !== blockB) return blockA.localeCompare(blockB);
    
    const roomA = a.dormRoom || "Unassigned";
    const roomB = b.dormRoom || "Unassigned";
    if (roomA !== roomB) return roomA.localeCompare(roomB);
    
    const batchA = a.batch || "";
    const batchB = b.batch || "";
    if (batchA !== batchB) return batchA.localeCompare(batchB);
    
    const classA = a.classSection || "";
    const classB = b.classSection || "";
    return classA.localeCompare(classB);
  });

  let csv = "Block,Room,Batch,Class Section,Student ID,Name,Bed,Has Mattress,Has Pillow,Has Blanket\n";
  students.forEach(async s => {
    csv += `"${s.dormBlock || 'Unassigned'}","${s.dormRoom || 'Unassigned'}","${s.batch || 'N/A'}","${s.classSection || 'N/A'}","${s.id}","${s.name}","${s.bedNumber || 'N/A'}","${s.hasMattress ? 'Yes' : 'No'}","${s.hasPillow ? 'Yes' : 'No'}","${s.hasBlanket ? 'Yes' : 'No'}"\n`;
  });

  const messages = await db.get("messages") || [];
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  
  messages.push({
    id: 'msg-' + Date.now(),
    sender_id: currentUser ? currentUser.id : 'unknown',
    receiver_role: 'Manager',
    title: `Dormitory Allocations Update`,
    content: `Please find the attached latest dormitory allocations report. Generated automatically by the Dormitory Manager.`,
    attachment_type: 'text/csv',
    attachment_data: csv,
    is_read: false,
    created_at: new Date().toISOString()
  });
  
  await db.set("messages", messages);
  alert("Successfully posted the dormitory allocations report to the Manager's inbox.");
};

async function renderDormCohortRoommates(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Cohort Roommates View</h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Students sharing the same Block, Room, Batch, and Class Section.</p>
        </div>
        <button class="btn-primary" onclick="window.sendDormAllocationsToManager()"><i class="fas fa-paper-plane"></i> Post to Manager</button>
      </div>
      <div id="cohort-roommates-container">
        <!-- Dynamically populated -->
      </div>
    </div>
  `;

  const students = await db.get("users").filter(u => u.role === "Student" && u.dormBlock && u.dormRoom);
  
  const groups = {};
  students.forEach(s => {
    const block = s.dormBlock;
    const room = s.dormRoom;
    const batch = s.batch || 'Unassigned Batch';
    const section = s.classSection || 'Unassigned Section';
    
    const key = `${block} | Room ${room} | Batch: ${batch} | Class: ${section}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  const cohortsContainer = document.getElementById("cohort-roommates-container");
  let html = "";

  const sortedKeys = Object.keys(groups).sort();
  
  if (sortedKeys.length === 0) {
    cohortsContainer.innerHTML = `<p style="color: var(--text-secondary);">No allocated students found.</p>`;
    return;
  }

  sortedKeys.forEach(key => {
    const groupStudents = groups[key];
    
    // Split key for nice display
    const parts = key.split(' | ');
    
    html += `
      <div style="margin-bottom: 1.5rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
        <div style="background: var(--bg-tertiary); padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h5 style="margin: 0; color: var(--accent-primary);"><i class="fas fa-users"></i> ${parts[0]} - ${parts[1]}</h5>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">${parts[2]} &nbsp;&bull;&nbsp; ${parts[3]}</span>
          </div>
          <span class="badge badge-info">${groupStudents.length} Students</span>
        </div>
        <div class="table-responsive">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; background: var(--bg-secondary);">
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Student Name</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Student ID</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Bed Number</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Contact Phone</th>
              </tr>
            </thead>
            <tbody>
              ${groupStudents.map(s => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem; font-weight: 500;">${s.name}</td>
                  <td style="padding: 0.75rem;"><code>${s.id}</code></td>
                  <td style="padding: 0.75rem;">${s.bedNumber ? 'Bed #' + s.bedNumber : 'Unassigned'}</td>
                  <td style="padding: 0.75rem;">${s.telephone || 'N/A'}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  cohortsContainer.innerHTML = html;
}


window.loadDormAllocationsTable = async () => {
  const students = await db.get("users").filter(u => u.role === "Student");
  const container = document.getElementById("dorm-allocations-export-container");
  if (!container) return;

  const groups = {};
  students.forEach(s => {
    const block = s.dormBlock || "Unassigned";
    const room = s.dormRoom || "Unassigned";
    const key = `${block} - Rm ${room}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  let html = "";

  Object.keys(groups).sort().forEach(key => {
    const roomStudents = groups[key];
    
    roomStudents.sort((a, b) => {
      const batchA = a.batch || "";
      const batchB = b.batch || "";
      if (batchA !== batchB) return batchA.localeCompare(batchB);
      
      const classA = a.classSection || "";
      const classB = b.classSection || "";
      return classA.localeCompare(classB);
    });

    html += `
      <div style="margin-bottom: 2rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
        <div style="background: var(--bg-tertiary); padding: 1rem; border-bottom: 1px solid var(--border-color);">
          <h5 style="margin: 0; color: var(--accent-primary);"><i class="fas fa-door-closed"></i> ${key}</h5>
        </div>
        <div class="table-responsive">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; background: var(--bg-secondary);">
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Student Name</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Student ID</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Batch</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Class Section</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Bed Number</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">Items Issued</th>
                <th style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);" class="no-export">Action</th>
              </tr>
            </thead>
            <tbody>
              ${roomStudents.map(s => {
                const items = [];
                if (s.hasMattress) items.push("Mattress");
                if (s.hasPillow) items.push("Pillow");
                if (s.hasBlanket) items.push("Blanket");
                const itemsStr = items.length > 0 ? items.join(", ") : "None";

                return `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.75rem;">${s.name}</td>
                    <td style="padding: 0.75rem;"><code>${s.id}</code></td>
                    <td style="padding: 0.75rem;">${s.batch || 'N/A'}</td>
                    <td style="padding: 0.75rem;">${s.classSection || 'N/A'}</td>
                    <td style="padding: 0.75rem;">${s.bedNumber ? 'Bed #' + s.bedNumber : 'Unassigned'}</td>
                    <td style="padding: 0.75rem;"><span class="badge badge-info">${itemsStr}</span></td>
                    <td style="padding: 0.75rem;" class="no-export">
                      <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.editDormAllocation('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
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

  container.innerHTML = html;
};

window.editDormAllocation = async (id) => {
  const students = await db.get("users").filter(u => u.role === "Student");
  const s = students.find(user => user.id === id);
  if (!s) return;

  document.getElementById("alloc-student-id").value = s.id;
  document.getElementById("alloc-student-name").value = s.name;
  document.getElementById("alloc-block").value = s.dormBlock || "";
  document.getElementById("alloc-room").value = s.dormRoom || "";
  document.getElementById("alloc-bed").value = s.bedNumber || "";
  document.getElementById("alloc-mattress").checked = !!s.hasMattress;
  document.getElementById("alloc-pillow").checked = !!s.hasPillow;
  document.getElementById("alloc-blanket").checked = !!s.hasBlanket;

  window.showPortalModal("dorm-alloc-modal");

  document.getElementById("dorm-alloc-form").onsubmit = async (e) => {
    e.preventDefault();
    const users = await db.get("users");
    const updated = users.map(u => {
      if (u.id === s.id) {
        u.dormBlock = document.getElementById("alloc-block").value;
        u.dormRoom = document.getElementById("alloc-room").value;
        u.bedNumber = document.getElementById("alloc-bed").value;
        u.hasMattress = document.getElementById("alloc-mattress").checked;
        u.hasPillow = document.getElementById("alloc-pillow").checked;
        u.hasBlanket = document.getElementById("alloc-blanket").checked;
      }
      return u;
    });
    await db.set("users", updated);
    window.hidePortalModal("dorm-alloc-modal");
    alert("Dormitory allocation updated.");
    window.loadDormAllocationsTable();
  };
};

function renderDormAssets(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Dormitory Properties & Asset Tracking</h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 0.3rem;">Ensure returns, log beds, foams, blankets, and pillows in your block.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-primary" id="btn-add-dorm-asset"><i class="fas fa-plus"></i> Add / Update Asset</button>
          <button class="btn-secondary" onclick="window.exportDormAssetsPrint()"><i class="fas fa-print"></i> Print</button>
          <button class="btn-secondary" onclick="window.exportDormAssetsCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportDormAssetsWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      
      <div class="table-responsive" id="dorm-assets-export-container">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Asset Category</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Total Count</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Good Condition</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Requires Maintenance</th>
              <th style="border: 1px solid #ccc; padding: 8px;" class="no-export">Actions</th>
            </tr>
          </thead>
          <tbody id="dorm-assets-table-body">
            <!-- Dynamically Loaded -->
          </tbody>
        </table>
      </div>
      <button class="btn-primary" style="margin-top: 1.5rem;" onclick="alert('Asset inventory details dispatched to managers. They can view it live.')">Send Inventory Check to Manager</button>
    </div>
  `;

  window.loadDormAssetsTable = async () => {
    const assets = await db.get("dorm_assets") || [];
    const tbody = document.getElementById("dorm-assets-table-body");
    if (!tbody) return;

    if (assets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No assets recorded.</td></tr>`;
      return;
    }

    tbody.innerHTML = assets.map(a => `
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;"><strong>${a.category}</strong></td>
        <td style="border: 1px solid #ccc; padding: 8px;">${a.totalCount}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${a.goodCondition}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${a.requiresMaintenance}</td>
        <td style="border: 1px solid #ccc; padding: 8px;" class="no-export">
          <button class="btn-icon-sm" style="color: var(--accent-primary);" onclick="window.editDormAsset('${a.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteDormAsset('${a.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join("");
  };

  window.loadDormAssetsTable();

  const addBtn = document.getElementById("btn-add-dorm-asset");
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      document.getElementById("dorm-asset-form").reset();
      document.getElementById("dorm-asset-id").value = "";
      document.getElementById("dorm-asset-modal-title").innerText = "Record New Dorm Asset";
      window.showPortalModal("dorm-asset-modal");
    });
  }

  // Handle Dorm Asset Form Submit
  const assetForm = document.getElementById("dorm-asset-form");
  if (assetForm) {
    const newForm = assetForm.cloneNode(true);
    assetForm.replaceWith(newForm);
    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("dorm-asset-id").value;
      const category = document.getElementById("dorm-asset-category").value;
      const totalCount = parseInt(document.getElementById("dorm-asset-total").value);
      const goodCondition = parseInt(document.getElementById("dorm-asset-good").value);
      const requiresMaintenance = parseInt(document.getElementById("dorm-asset-maintenance").value);

      const assets = await db.get("dorm_assets") || [];
      if (id) {
        const idx = assets.findIndex(a => a.id === id);
        if (idx !== -1) {
          assets[idx].category = category;
          assets[idx].totalCount = totalCount;
          assets[idx].goodCondition = goodCondition;
          assets[idx].requiresMaintenance = requiresMaintenance;
          assets[idx].lastUpdated = new Date().toISOString();
        }
      } else {
        assets.push({
          id: 'ast-' + Date.now(),
          category,
          totalCount,
          goodCondition,
          requiresMaintenance,
          lastUpdated: new Date().toISOString()
        });
      }
      await db.set("dorm_assets", assets);
      window.hidePortalModal("dorm-asset-modal");
      window.loadDormAssetsTable();
      alert("Dorm asset recorded successfully.");
    });
  }
}

window.editDormAsset = async (id) => {
  const assets = await db.get("dorm_assets") || [];
  const a = assets.find(x => x.id === id);
  if (!a) return;
  
  document.getElementById("dorm-asset-id").value = a.id;
  document.getElementById("dorm-asset-category").value = a.category;
  document.getElementById("dorm-asset-total").value = a.totalCount;
  document.getElementById("dorm-asset-good").value = a.goodCondition;
  document.getElementById("dorm-asset-maintenance").value = a.requiresMaintenance;
  
  document.getElementById("dorm-asset-modal-title").innerText = "Update Dorm Asset";
  window.showPortalModal("dorm-asset-modal");
};

window.deleteDormAsset = async (id) => {
  if (!confirm("Are you sure you want to delete this asset record?")) return;
  const assets = await db.get("dorm_assets") || [];
  const updated = assets.filter(x => x.id !== id);
  await db.set("dorm_assets", updated);
  if (window.loadDormAssetsTable) window.loadDormAssetsTable();
};

async function renderDormAttendance(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const students = await db.get("users").filter(u => u.role === "Student");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4>Dormitory Student Night Roll Call</h4>
        <button class="btn-primary" onclick="alert('Roll call submitted successfully.')">Submit Attendance to Manager</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Report Conduct Issue</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td><code>${s.id}</code></td>
                <td>${s.name}</td>
                <td>
                  <select class="form-control" style="width: 120px; padding: 0.25rem 0.5rem; height: auto;">
                    <option value="in">Present in Bed</option>
                    <option value="out">Absent (Dormitory Out)</option>
                    <option value="sick">Sickbay</option>
                  </select>
                </td>
                <td>
                  <button class="btn-secondary" style="padding: 0.35rem 0.6rem; font-size: 0.8rem;" onclick="reportConduct('${s.id}')"><i class="fas fa-exclamation-triangle" style="color: var(--accent-danger);"></i> File Report</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.reportConduct = (studentId) => {
  document.getElementById("disciplinary-student-id").value = studentId;
  document.getElementById("disciplinary-display-id").value = studentId;
  document.getElementById("disciplinary-issue").value = "";
  window.showPortalModal("disciplinary-modal");

  document.getElementById("disciplinary-form").onsubmit = async (e) => {
    e.preventDefault();
    const issue = document.getElementById("disciplinary-issue").value.trim();
    if (issue) {
      window.hidePortalModal("disciplinary-modal");
      alert("Report filed. Dispatched to the School Manager's office.");
    }
  };
};

// ---------------- BOOKSTORE MANAGERS ----------------
async function renderBookstoreProfile(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const users = await db.get("users") || [];
  const currentDbUser = users.find(u => u.id === user.id) || user;
  const editAllowed = currentDbUser.rights && currentDbUser.rights.includes("edit_books");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px; margin-bottom: 2rem;">
      <h3 style="color: var(--accent-primary); margin-bottom: 1.5rem;"><i class="fas fa-user-circle"></i> Bookstore Manager Profile</h3>
      <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
        <img src="${user.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-primary);">
        <div>
          <h4 style="margin: 0;">${user.name}</h4>
          <p style="color: var(--text-secondary); margin: 0.25rem 0;">Bookstore Operations Manager</p>
          <span class="badge ${editAllowed ? 'badge-success' : 'badge-danger'}">
            <i class="fas ${editAllowed ? 'fa-lock-open' : 'fa-lock'}"></i> ${editAllowed ? 'Edit Rights: Granted by Manager' : 'Edit Rights: Locked by Manager'}
          </span>
        </div>
      </div>
      
      <div class="grid-2" style="margin-top: 2rem; font-size: 0.9rem;">
        <div><strong>Username / ID:</strong><br><code style="font-size: 0.95rem;">${user.id}</code></div>
        <div><strong>Gender:</strong><br>${user.gender}</div>
        <div><strong>Shift Schedule:</strong><br>${user.shiftSchedule || 'General Shift (8:00 AM - 5:00 PM)'}</div>
        <div><strong>Authorization Type:</strong><br>${user.privileges === 'full' ? 'Full Administrator' : 'Staff Supervisor'}</div>
      </div>
      
      <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
        <h4 style="margin-bottom: 1rem;">My Manager-Assigned Shifts</h4>
        ${getAssignedShiftsHtml(user)}
      </div>
    </div>
  `;
}

async function renderBookStore(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const users = await db.get("users") || [];
  const currentDbUser = users.find(u => u.id === user.id) || user;
  const editAllowed = currentDbUser.rights && currentDbUser.rights.includes("edit_books");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Bookstore Inventory Manager</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0;">Display, search and modify textbooks, guide books, or exam resources.</p>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <input type="text" id="bk-search" class="form-control" placeholder="Search title or course..." style="width: 200px;">
          <select id="bk-type-filter" class="form-control" style="width: 130px;">
            <option value="all">All Types</option>
            <option value="textbook">Textbooks Only</option>
            <option value="guide book">Guides Only</option>
            <option value="exam book">Exam Books Only</option>
          </select>
          ${editAllowed 
            ? `<button class="btn-primary" id="btn-add-book" style="height: 38px;"><i class="fas fa-plus"></i> Catalogue Book</button>` 
            : `<span style="font-size: 0.82rem; color: var(--accent-danger); font-weight: 500;"><i class="fas fa-lock"></i> Edit locked by Manager</span>`
          }
        </div>
      </div>

      <!-- Advanced Counters by Book Type -->
      <div class="stats-grid" style="margin-bottom: 2rem;">
        <div class="glass-card stat-card" style="padding: 1rem;">
          <div class="stat-info">
            <h3 id="stat-total-books">0</h3>
            <p>Unique Titles</p>
          </div>
        </div>
        <div class="glass-card stat-card" style="padding: 1rem;">
          <div class="stat-info">
            <h3 id="stat-textbooks-count">0</h3>
            <p>Textbooks (Copies)</p>
          </div>
        </div>
        <div class="glass-card stat-card" style="padding: 1rem;">
          <div class="stat-info">
            <h3 id="stat-guides-count">0</h3>
            <p>Guide Books (Copies)</p>
          </div>
        </div>
        <div class="glass-card stat-card" style="padding: 1rem;">
          <div class="stat-info">
            <h3 id="stat-exams-count">0</h3>
            <p>Exam Books (Copies)</p>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title / Author</th>
              <th>Grade Level</th>
              <th>Category</th>
              <th>Book Type</th>
              <th>Copies</th>
              <th>Donor/Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="bookstore-table-body">
            <!-- Dynamically Rendered -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  window.loadBookstoreTable(editAllowed);

  document.getElementById("bk-search").addEventListener("input", async () => window.loadBookstoreTable(editAllowed));
  document.getElementById("bk-type-filter").addEventListener("change", async () => window.loadBookstoreTable(editAllowed));

  if (editAllowed) {
    document.getElementById("btn-add-book").addEventListener("click", async () => {
      document.getElementById("book-form").reset();
      document.getElementById("book-id").value = "";
      document.getElementById("book-modal-title").innerText = "Catalogue New Book";
      window.showPortalModal("book-modal");
    });

    const bookForm = document.getElementById("book-form");
    if (bookForm) {
      const newForm = bookForm.cloneNode(true);
      bookForm.replaceWith(newForm);
      newForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("book-id").value;
        const title = document.getElementById("book-title").value.trim();
        const author = document.getElementById("book-author").value.trim();
        const category = document.getElementById("book-category").value.trim();
        const grade = parseInt(document.getElementById("book-grade").value);
        const type = document.getElementById("book-type").value;
        const copies = parseInt(document.getElementById("book-copies").value);
        const donor = document.getElementById("book-donor").value.trim() || "School Board";

        if (title && author && category && grade && type && copies) {
          const books = await db.get("books") || [];
          if (id) {
            // Edit Mode
            const updated = books.map(b => {
              if (b.id === id) {
                return { id, title, author, category, grade, type, copies, donor };
              }
              return b;
            });
            await db.set("books", updated);
            alert("Book details updated successfully.");
          } else {
            // Add Mode
            const newId = "BK-" + Math.floor(1000 + Math.random() * 9000);
            books.push({ id: newId, title, author, category, grade, type, copies, donor });
            await db.set("books", books);
            alert("New book catalogued successfully.");
          }
          window.hidePortalModal("book-modal");
          renderBookStore(user);
        }
      });
    }
  }
}

window.loadBookstoreTable = async (editAllowed) => {
  const query = document.getElementById("bk-search").value.toLowerCase();
  const typeFilter = document.getElementById("bk-type-filter").value;
  const books = await db.get("books") || [];
  const tbody = document.getElementById("bookstore-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = books.filter(b => {
    const matchesQuery = b.title.toLowerCase().includes(query) || b.category.toLowerCase().includes(query);
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    return matchesQuery && matchesType;
  });

  // Calculate dynamic type counters
  let textCopies = 0, guideCopies = 0, examCopies = 0;
  books.forEach(b => {
    if (b.type === "textbook") textCopies += b.copies;
    else if (b.type === "guide book") guideCopies += b.copies;
    else if (b.type === "exam book") examCopies += b.copies;
  });

  document.getElementById("stat-total-books").innerText = books.length;
  document.getElementById("stat-textbooks-count").innerText = textCopies;
  document.getElementById("stat-guides-count").innerText = guideCopies;
  document.getElementById("stat-exams-count").innerText = examCopies;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No books found matching criteria.</td></tr>`;
    return;
  }

  filtered.forEach(async b => {
    tbody.innerHTML += `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
        <td>
          <strong>${b.title}</strong><br>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">by ${b.author}</span>
        </td>
        <td>Grade ${b.grade || 9}</td>
        <td>${b.category}</td>
        <td><span class="badge badge-info">${b.type}</span></td>
        <td>${b.copies}</td>
        <td>${b.donor || "School Board"}</td>
        <td>
          <div style="display: flex; gap: 0.25rem;">
            ${editAllowed ? `
              <button class="btn-icon-sm" onclick="window.editBookstoreBook('${b.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteBookstoreBook('${b.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
            ` : `<button class="btn-icon-sm" style="opacity: 0.5; cursor: not-allowed;" title="Edit Access Locked" disabled><i class="fas fa-lock"></i></button>`}
          </div>
        </td>
      </tr>
    `;
  });
};

window.editBookstoreBook = async (id) => {
  const books = await db.get("books") || [];
  const b = books.find(book => book.id === id);
  if (!b) return;

  document.getElementById("book-id").value = b.id;
  document.getElementById("book-title").value = b.title;
  document.getElementById("book-author").value = b.author;
  document.getElementById("book-category").value = b.category;
  document.getElementById("book-grade").value = b.grade || 9;
  document.getElementById("book-type").value = b.type;
  document.getElementById("book-copies").value = b.copies;
  document.getElementById("book-donor").value = b.donor || "School Board";

  document.getElementById("book-modal-title").innerText = "Edit Book Details";
  window.showPortalModal("book-modal");
};

window.deleteBookstoreBook = async (id) => {
  if (!confirm("Are you sure you want to delete this book from catalog?")) return;
  const books = await db.get("books") || [];
  await db.set("books", books.filter(b => b.id !== id));
  alert("Book deleted successfully.");
  
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  renderBookStore(currentUser);
};

async function renderBookstoreExport(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const books = await db.get("books") || [];

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Print & Export Book Catalog</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Export Bookstore inventory as CSV, PDF (Print) or Word file.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-primary" onclick="window.printBookstoreCatalog()"><i class="fas fa-print"></i> Print (Save to PDF)</button>
          <button class="btn-secondary" onclick="window.exportBookstoreCSV()"><i class="fas fa-file-csv"></i> Export CSV</button>
          <button class="btn-secondary" style="color: var(--accent-primary);" onclick="window.exportBookstoreWord()"><i class="fas fa-file-word"></i> Export Word (.doc)</button>
        </div>
      </div>

      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
              <th style="padding: 0.5rem 0.75rem;">Title</th>
              <th style="padding: 0.5rem 0.75rem;">Author</th>
              <th style="padding: 0.5rem 0.75rem;">Category</th>
              <th style="padding: 0.5rem 0.75rem;">Type</th>
              <th style="padding: 0.5rem 0.75rem;">Grade</th>
              <th style="padding: 0.5rem 0.75rem;">Copies</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(b => `
              <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                <td style="padding: 0.5rem 0.75rem;"><strong>${b.title}</strong></td>
                <td style="padding: 0.5rem 0.75rem;">${b.author}</td>
                <td style="padding: 0.5rem 0.75rem;">${b.category}</td>
                <td style="padding: 0.5rem 0.75rem;"><span class="badge badge-info">${b.type}</span></td>
                <td style="padding: 0.5rem 0.75rem;">Grade ${b.grade || 9}</td>
                <td style="padding: 0.5rem 0.75rem;">${b.copies}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.printBookstoreCatalog = async () => {
  const books = await db.get("books") || [];
  const printWin = window.open("", "_blank");
  printWin.document.write(`
    <html>
      <head>
        <title>Bookstore Inventory Catalog</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; color: #333; }
          h2 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Bookstore Inventory Catalog</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Grade</th>
              <th>Type</th>
              <th>Copies</th>
              <th>Donor/Source</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(b => `
              <tr>
                <td><strong>${b.title}</strong></td>
                <td>${b.author}</td>
                <td>${b.category}</td>
                <td>Grade ${b.grade || 9}</td>
                <td>${b.type}</td>
                <td>${b.copies}</td>
                <td>${b.donor || "School Board"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
};

window.exportBookstoreCSV = async () => {
  const books = await db.get("books") || [];
  let csv = "ID,Book Title,Author,Category,Grade,Book Type,Copies,Donor/Source\n";
  books.forEach(b => {
    csv += `"${b.id}","${b.title}","${b.author}","${b.category}","Grade ${b.grade || 9}","${b.type}","${b.copies}","${b.donor || 'School Board'}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "bookstore_inventory.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportBookstoreWord = async () => {
  const books = await db.get("books") || [];
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>Bookstore Inventory Catalog</title>
    <style>
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #f0f0f0; }
    </style>
    </head>
    <body>
      <h2>Bookstore Inventory Catalog</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Grade</th>
            <th>Type</th>
            <th>Copies</th>
            <th>Donor</th>
          </tr>
        </thead>
        <tbody>
          ${books.map(b => `
            <tr>
              <td>${b.title}</td>
              <td>${b.author}</td>
              <td>${b.category}</td>
              <td>Grade ${b.grade || 9}</td>
              <td>${b.type}</td>
              <td>${b.copies}</td>
              <td>${b.donor || "School Board"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "bookstore_catalog.doc");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ---------------- IT TECHNICIANS ----------------
async function renderITLab(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const properties = await db.get("properties").filter(p => p.category === "it_equipment");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4>IT Computer Lab Equipment</h4>
        <button class="btn-primary" onclick="alert('Properties list updated.')">Save Changes</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Equipment Brand</th>
              <th>Computer No.</th>
              <th>Keyboards</th>
              <th>Mice</th>
              <th>Cases</th>
              <th>Status: Working</th>
              <th>Status: To Maintain</th>
              <th>Status: Maintained</th>
            </tr>
          </thead>
          <tbody>
            ${properties.map(p => `
              <tr>
                <td><strong>${p.name_brand}</strong></td>
                <td>${p.computer_no}</td>
                <td>${p.keyboards}</td>
                <td>${p.mouse}</td>
                <td>${p.cases}</td>
                <td><span class="badge badge-success">${p.working}</span></td>
                <td><span class="badge badge-danger">${p.to_maintain}</span></td>
                <td><span class="badge badge-warning">${p.maintained}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function renderITGrades(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const students = await db.get("users").filter(u => u.role === "Student");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h4>Log Student IT Lab Session Grades</h4>
      <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">Input students scores for IT lab practical exercises.</p>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Practical Lab Score (Max 15)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td>${s.name}</td>
                <td><code>${s.id}</code></td>
                <td><input type="number" class="form-control" style="width: 100px;" value="14" min="0" max="15"></td>
                <td><button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="alert('Grades updated.')">Save</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------- LAB TECHNICIANS (CHEM/PHYSICS/DRAWING) ----------------
async function renderLabChemicals(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const chemicals = await db.get("chemicals");

  let headerText = "Science Laboratory Chemical Stock";
  let nameLabel = "Chemical / Item";
  let specLabel = "Dose / Container";
  let regBtnText = "Register Stock";

  if (user.role === "PhysicsLab") {
    headerText = "Physics Lab Equipment Inventory";
    nameLabel = "Equipment Name";
    specLabel = "Specifications";
    regBtnText = "Register Equipment";
  } else if (user.role === "Drawing") {
    headerText = "Technical Drawing Drafting Instruments Inventory";
    nameLabel = "Instrument/Sheet Name";
    specLabel = "Size / Specs";
    regBtnText = "Register Instrument";
  }

  const filtered = chemicals.filter(c => {
    if (user.role === "ChemistryLab") return c.id.startsWith("CHEM-LAB-") || c.category.toLowerCase().includes("acid") || c.category.toLowerCase().includes("base") || c.category.toLowerCase().includes("chemical");
    if (user.role === "PhysicsLab") return c.id.startsWith("PHYS-LAB-") || c.category.toLowerCase().includes("physics") || c.category.toLowerCase().includes("lens") || c.category.toLowerCase().includes("circuit");
    if (user.role === "Drawing") return c.id.startsWith("DRAW-LAB-") || c.category.toLowerCase().includes("drawing") || c.category.toLowerCase().includes("compass") || c.category.toLowerCase().includes("board");
    return true;
  });

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4>${headerText}</h4>
        <button class="btn-primary" id="btn-add-chemical"><i class="fas fa-plus"></i> ${regBtnText}</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>${nameLabel}</th>
              <th>${specLabel}</th>
              <th>Category</th>
              <th>Type</th>
              <th>Available Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length > 0 ? filtered.map(c => `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.dose}</td>
                <td>${c.category}</td>
                <td>${c.type}</td>
                <td><strong>${c.stock}</strong> items</td>
                <td>
                  <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="deleteChemical('${c.id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `).join("") : `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No inventory logged. Click Register to add one.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("btn-add-chemical").addEventListener("click", async () => {
    const modalForm = document.getElementById("chemical-form");
    if (modalForm) {
      modalForm.reset();
      const firstLabel = modalForm.querySelector(".form-group:nth-child(1) label");
      const secondLabel = modalForm.querySelector(".form-group:nth-child(2) label");
      const titleEl = document.querySelector("#chemical-modal h4");

      if (firstLabel) firstLabel.innerText = nameLabel;
      if (secondLabel) secondLabel.innerText = specLabel;
      if (titleEl) titleEl.innerText = regBtnText;
    }

    window.showPortalModal("chemical-modal");

    document.getElementById("chemical-form").onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById("chemical-name").value.trim();
      const dose = document.getElementById("chemical-dose").value.trim();
      const category = document.getElementById("chemical-category").value.trim();
      const stock = parseInt(document.getElementById("chemical-stock").value);

      if (name && dose && category && !isNaN(stock)) {
        const allChems = await db.get("chemicals");
        let prefix = "CHEM-LAB-";
        if (user.role === "PhysicsLab") prefix = "PHYS-LAB-";
        if (user.role === "Drawing") prefix = "DRAW-LAB-";

        allChems.push({
          id: prefix + Date.now(),
          name,
          dose,
          category,
          type: "Standard",
          stock: stock,
          required: 0
        });
        await db.set("chemicals", allChems);
        window.hidePortalModal("chemical-modal");
        alert("Inventory saved successfully.");
        renderLabChemicals(user);
      }
    };
  });
}

window.deleteChemical = async (id) => {
  if (!await window.showConfirmModal("Confirm Item Deletion", `Are you sure you want to delete inventory item ${id}?`)) return;
  const allChems = await db.get("chemicals");
  await db.set("chemicals", allChems.filter(c => c.id !== id));
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  renderLabChemicals(currentUser);
};

async function renderLabGrades(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const students = await db.get("users").filter(u => u.role === "Student");

  let headerText = "Submit Laboratory Session Grades";
  let fieldLabel = "Lab Marks (Max 10)";

  if (user.role === "PhysicsLab") {
    headerText = "Submit Physics Lab Practical Grades";
    fieldLabel = "Physics Lab Score (Max 10)";
  } else if (user.role === "Drawing") {
    headerText = "Submit Technical Drawing Grades";
    fieldLabel = "Drawing Assignment Score (Max 10)";
  }

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h4>${headerText}</h4>
      <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">Input marks for laboratory procedures and assignments.</p>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>${fieldLabel}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td>${s.name}</td>
                <td><code>${s.id}</code></td>
                <td><input type="number" class="form-control" style="width: 100px;" value="9" min="0" max="10"></td>
                <td><button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="alert('Session grades registered successfully.')">Submit</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function renderLabReports(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const chemicals = await db.get("chemicals");
  const filteredChems = chemicals.filter(c => {
    if (user.role === "ChemistryLab") return c.id.startsWith("CHEM-LAB-") || c.category.toLowerCase().includes("acid") || c.category.toLowerCase().includes("base") || c.category.toLowerCase().includes("chemical");
    if (user.role === "PhysicsLab") return c.id.startsWith("PHYS-LAB-") || c.category.toLowerCase().includes("physics") || c.category.toLowerCase().includes("lens") || c.category.toLowerCase().includes("circuit");
    if (user.role === "Drawing") return c.id.startsWith("DRAW-LAB-") || c.category.toLowerCase().includes("drawing") || c.category.toLowerCase().includes("compass") || c.category.toLowerCase().includes("board");
    return true;
  });

  let titleText = "Create Restock Requirements Report";
  let itemLabel = "Chemical/Equipment Needed";
  let forwardBtnText = "Forward Restock Request to Principals";

  if (user.role === "PhysicsLab") {
    titleText = "Create Physics Equipment Procurement Report";
    itemLabel = "Equipment Needed";
    forwardBtnText = "Forward Procurement Request to Principals";
  } else if (user.role === "Drawing") {
    titleText = "Create Drawing Drafting Materials Report";
    itemLabel = "Drafting Supplies Needed";
    forwardBtnText = "Forward Materials Request to Principals";
  }

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px;">
      <h4>${titleText}</h4>
      <p style="color: var(--text-secondary); margin-bottom: 2.0rem;">Log items running low or requiring additional quantities.</p>
      <form id="lab-restock-form">
        <div class="form-group">
          <label>${itemLabel}</label>
          <select id="req-item" class="form-control">
            ${filteredChems.length > 0 
              ? filteredChems.map(c => `<option value="${c.name}">${c.name} (Current: ${c.stock})</option>`).join("") 
              : `<option value="General Instruments">General Instruments</option>`
            }
          </select>
        </div>
        <div class="form-group">
          <label>Additional Quantities Required</label>
          <input type="number" id="req-qty" class="form-control" min="1" required>
        </div>
        <button type="submit" class="btn-primary">${forwardBtnText}</button>
      </form>
    </div>
  `;

  document.getElementById("lab-restock-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const item = document.getElementById("req-item").value;
    const qty = document.getElementById("req-qty").value;
    alert(`Request for ${qty}x "${item}" forwarded to the Principal Office.`);
    e.target.reset();
  });
}

// Global Export Functions for Dormitory Assets
window.exportDormAssetsPrint = () => {
  const htmlContent = document.getElementById("dorm-assets-export-container").innerHTML;
  const printWin = window.open("", "_blank");
  printWin.document.write(`
    <html>
      <head>
        <title>Dormitory Assets Report</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .no-export { display: none !important; }
        </style>
      </head>
      <body>
        <h2>Dormitory Assets Inventory Report</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        ${htmlContent}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.print();
};

window.exportDormAssetsCSV = async () => {
  const assets = await db.get("dorm_assets") || [];
  let csv = "Asset Category,Total Count,Good Condition,Requires Maintenance,Last Updated\n";
  assets.forEach(a => {
    csv += `"${a.category}","${a.totalCount}","${a.goodCondition}","${a.requiresMaintenance}","${new Date(a.lastUpdated).toLocaleString()}"\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Dorm_Assets_Report_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportDormAssetsWord = () => {
  const htmlContent = document.getElementById("dorm-assets-export-container").innerHTML;
  
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>Dorm Assets Export</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .no-export { display: none; }
  </style>
  </head><body>
  <h2>Dormitory Assets Inventory Report</h2>
  <p>Date: ${new Date().toLocaleDateString()}</p>
  `;
  const footer = "</body></html>";
  const sourceHTML = header + htmlContent + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Dorm_Assets_Report_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};
// ---------------- SCHOOL STORE ADMIN ----------------
function renderSchoolStoreMain(user) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const canEdit = user.rights && user.rights.includes("edit_store");

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>School Store Inventory</h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Manage all school properties: chairs, tables, beds, meal items, etc.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${canEdit ? `<button class="btn-primary" onclick="window.showPortalModal('store-item-modal')"><i class="fas fa-plus"></i> Add Item</button>` : ''}
          <button class="btn-primary" onclick="window.sendStoreReportToManager()"><i class="fas fa-paper-plane"></i> Post to Manager</button>
          <button class="btn-secondary" onclick="window.printStoreInventory()"><i class="fas fa-print"></i> Print</button>
          <button class="btn-secondary" onclick="window.exportStoreInventoryCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportStoreInventoryWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      
      <div class="table-responsive">
        <table id="store-inventory-table">
          <thead>
            <tr>
              <th>Tag / ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Total Amount</th>
              <th>Healthy Amount</th>
              <th>Defected Amount</th>
              ${canEdit ? `<th class="no-export">Actions</th>` : ''}
            </tr>
          </thead>
          <tbody id="store-inventory-body">
            <!-- Dynamically populated -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Store Item Modal -->
    <div id="store-item-modal" class="glass-card" style="display: none; position: fixed; top: 10%; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px; z-index: 1200; padding: 2rem; max-height: 80vh; overflow-y: auto;">
      <h4 id="store-modal-title">Add New Store Item</h4>
      <form id="store-item-form" style="margin-top: 1.5rem;">
        <input type="hidden" id="store-is-edit" value="false">
        
        <div class="form-group">
          <label>Item Tag / ID</label>
          <input type="text" id="store-id" class="form-control" placeholder="e.g. PROP-010" required>
        </div>
        <div class="form-group">
          <label>Item Name</label>
          <input type="text" id="store-name" class="form-control" placeholder="e.g. Student Chairs" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="store-category" class="form-control" required>
            <option value="chairs">Chairs</option>
            <option value="tables">Tables</option>
            <option value="desks">Desks</option>
            <option value="beds">Beds</option>
            <option value="pillows">Pillows</option>
            <option value="blankets">Blankets</option>
            <option value="meal_items">Meal Items</option>
            <option value="other_staffs">Other Staffs/Items</option>
          </select>
        </div>
        <div class="form-group">
          <label>Type / Material</label>
          <input type="text" id="store-type" class="form-control" placeholder="e.g. Wooden, Metal, Plastic" required>
        </div>
        <div class="form-group">
          <label>Total Quantity</label>
          <input type="number" id="store-quantity" class="form-control" min="0" required>
        </div>
        <div class="form-group">
          <label>Healthy Amount (Working)</label>
          <input type="number" id="store-working" class="form-control" min="0" required>
        </div>
        <div class="form-group">
          <label>Defected Amount</label>
          <input type="number" id="store-defected" class="form-control" min="0" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-secondary" onclick="window.hidePortalModal('store-item-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Save Item</button>
        </div>
      </form>
    </div>
  `;

  window.loadStoreInventoryTable(canEdit);

  document.getElementById("store-item-form").onsubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    const isEdit = document.getElementById("store-is-edit").value === "true";
    const id = document.getElementById("store-id").value.trim();
    const name = document.getElementById("store-name").value.trim();
    const category = document.getElementById("store-category").value;
    const type = document.getElementById("store-type").value.trim();
    const quantity = parseInt(document.getElementById("store-quantity").value) || 0;
    const working = parseInt(document.getElementById("store-working").value) || 0;
    const to_maintain = parseInt(document.getElementById("store-defected").value) || 0;

    let props = await db.get("properties") || [];
    
    if (isEdit) {
      props = props.map(p => {
        if (p.id === id) {
          return { ...p, name, category, type, quantity, working, to_maintain };
        }
        return p;
      });
    } else {
      if (props.find(p => p.id === id)) {
        alert("An item with this Tag/ID already exists!");
        return;
      }
      props.push({ id, name, category, type, quantity, working, to_maintain, maintained: 0 });
    }
    
    await db.set("properties", props);
    window.hidePortalModal('store-item-modal');
    window.loadStoreInventoryTable(canEdit);
    alert(isEdit ? "Item updated successfully." : "Item added successfully.");
  };
}

window.loadStoreInventoryTable = async (canEdit) => {
  const tbody = document.getElementById("store-inventory-body");
  if (!tbody) return;

  const props = await db.get("properties") || [];
  
  tbody.innerHTML = props.map(p => {
    return `
      <tr>
        <td><code>${p.id}</code></td>
        <td>${p.name}</td>
        <td><span class="badge badge-info">${p.category}</span></td>
        <td>${p.type || 'N/A'}</td>
        <td>${p.quantity}</td>
        <td><span style="color: var(--success); font-weight: 500;">${p.working || 0}</span></td>
        <td><span style="color: var(--danger); font-weight: 500;">${p.to_maintain || 0}</span></td>
        ${canEdit ? `
        <td class="no-export">
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.editStoreItem('${p.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.deleteStoreItem('${p.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
        ` : ''}
      </tr>
    `;
  }).join("");
};

window.editStoreItem = async (id) => {
  const props = await db.get("properties") || [];
  const p = props.find(x => x.id === id);
  if (!p) return;

  document.getElementById("store-is-edit").value = "true";
  document.getElementById("store-modal-title").innerText = "Edit Store Item";
  
  const idInput = document.getElementById("store-id");
  idInput.value = p.id;
  idInput.readOnly = true;
  
  document.getElementById("store-name").value = p.name;
  
  // Set category if it exists in options, else fallback
  const catSelect = document.getElementById("store-category");
  let found = false;
  for(let i=0; i<catSelect.options.length; i++) {
    if(catSelect.options[i].value === p.category) found = true;
  }
  if (!found && p.category) {
    catSelect.innerHTML += `<option value="${p.category}">${p.category}</option>`;
  }
  catSelect.value = p.category || "other_staffs";
  
  document.getElementById("store-type").value = p.type || "";
  document.getElementById("store-quantity").value = p.quantity || 0;
  document.getElementById("store-working").value = p.working || 0;
  document.getElementById("store-defected").value = p.to_maintain || 0;

  window.showPortalModal("store-item-modal");
};

window.deleteStoreItem = async (id) => {
  if (!confirm("Are you sure you want to delete this store item?")) return;
  const props = await db.get("properties") || [];
  const updated = props.filter(p => p.id !== id);
  await db.set("properties", updated);
  
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  const canEdit = currentUser.rights && currentUser.rights.includes("edit_store");
  window.loadStoreInventoryTable(canEdit);
};

window.printStoreInventory = () => {
  const originalContents = document.body.innerHTML;
  
  // Clone table to remove action column
  const tableWrap = document.createElement("div");
  tableWrap.innerHTML = document.getElementById("store-inventory-table").outerHTML;
  const noExportNodes = tableWrap.querySelectorAll(".no-export");
  noExportNodes.forEach(n => n.remove());

  document.body.innerHTML = `
    <div style="padding: 2rem; background: white; color: black;">
      <h2>School Store Inventory Report</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <div class="table-responsive">
        ${tableWrap.innerHTML}
      </div>
    </div>
  `;
  
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload();
};

window.exportStoreInventoryCSV = async () => {
  const props = await db.get("properties") || [];
  let csv = "Tag/ID,Item Name,Category,Type,Total Amount,Healthy Amount,Defected Amount\n";
  props.forEach(p => {
    csv += `"${p.id}","${p.name}","${p.category}","${p.type || ''}",${p.quantity},${p.working || 0},${p.to_maintain || 0}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `Store_Inventory_${new Date().getTime()}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.exportStoreInventoryWord = () => {
  const tableWrap = document.createElement("div");
  tableWrap.innerHTML = document.getElementById("store-inventory-table").outerHTML;
  const noExportNodes = tableWrap.querySelectorAll(".no-export");
  noExportNodes.forEach(n => n.remove());

  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>Store Inventory Export</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
  </head><body>
  <h2>School Store Inventory Report</h2>
  <p>Date: ${new Date().toLocaleDateString()}</p>
  `;
  const footer = "</body></html>";
  
  const sourceHTML = header + tableWrap.innerHTML + footer;
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Store_Inventory_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

window.sendStoreReportToManager = async () => {
  const props = await db.get("properties") || [];
  let csv = "Tag/ID,Item Name,Category,Type,Total Amount,Healthy Amount,Defected Amount\n";
  props.forEach(async p => {
    csv += `"${p.id}","${p.name}","${p.category}","${p.type || ''}",${p.quantity},${p.working || 0},${p.to_maintain || 0}\n`;
  });

  const messages = await db.get("messages") || [];
  const currentUser = JSON.parse(localStorage.getItem("higa_current_user"));
  
  messages.push({
    id: 'msg-' + Date.now(),
    sender_id: currentUser ? currentUser.id : 'unknown',
    receiver_role: 'Manager',
    title: `School Store Inventory Update`,
    content: `Please find attached the latest School Store Inventory report. Generated automatically by the Store Admin.`,
    attachment_type: 'text/csv',
    attachment_data: csv,
    is_read: false,
    created_at: new Date().toISOString()
  });
  
  await db.set("messages", messages);
  alert("Successfully posted the store inventory report to the Manager's inbox.");
};
