// js/dashboards/manager.js
import { db } from '../db.js';

export function initDashboard(user) {
  renderSidebar();
  renderMainView("dashboard");
}

function renderSidebar() {
  const list = document.getElementById("sidebar-nav-list");
  if (!list) return;

  list.innerHTML = `
    <li class="active"><a href="#" id="side-dashboard"><i class="fas fa-chart-pie"></i> Statistics Dashboard</a></li>
    <li><a href="#" id="side-guardians"><i class="fas fa-shield-alt"></i> Guardians</a></li>
    <li><a href="#" id="side-cafeteria"><i class="fas fa-utensils"></i> Cafeteria Staff</a></li>
    <li><a href="#" id="side-cafe-reports"><i class="fas fa-clipboard-check"></i> Cafeteria Reports</a></li>
    <li><a href="#" id="side-librarians"><i class="fas fa-book-reader"></i> Librarians</a></li>
    <li><a href="#" id="side-dorm-managers"><i class="fas fa-hotel"></i> Dormitory Managers</a></li>
    <li><a href="#" id="side-dorm-assets"><i class="fas fa-bed"></i> Dormitory Assets</a></li>
    <li><a href="#" id="side-bookstore-managers"><i class="fas fa-store"></i> Bookstore Managers</a></li>
    <li><a href="#" id="side-shifts"><i class="fas fa-calendar-alt"></i> Shift Management</a></li>
    <li><a href="#" id="side-rights"><i class="fas fa-user-lock"></i> Rights Management</a></li>
    <li><a href="#" id="side-announcements"><i class="fas fa-bullhorn"></i> Announcements</a></li>
    <li><a href="#" id="side-gallery"><i class="fas fa-images"></i> Gallery & Events</a></li>
    <li><a href="#" id="side-inbox"><i class="fas fa-inbox"></i> Inbox</a></li>
    <li><a href="#" id="side-profile"><i class="fas fa-user-circle"></i> My Profile</a></li>
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
    ["side-dashboard", "dashboard"], ["side-guardians", "guardians"], ["side-cafeteria", "cafeteria"],
    ["side-cafe-reports", "cafe-reports"], ["side-librarians", "librarians"], ["side-dorm-managers", "dorm-managers"],
    ["side-dorm-assets", "dorm-assets"], ["side-inbox", "inbox"], ["side-bookstore-managers", "bookstore-managers"],
    ["side-shifts", "shifts"], ["side-rights", "rights"], ["side-announcements", "announcements"],
    ["side-gallery", "gallery"], ["side-profile", "profile"]
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

  const currentManager = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!currentManager) return;

  const allUsers = await db.get("users") || [];
  const dbUser = allUsers.find(u => u.id === currentManager.id);
  if (dbUser && (dbUser.isActive === false || dbUser.is_active === false)) {
    alert("Session invalidated. Your account has been deactivated.");
    localStorage.removeItem("higa_current_user");
    window.location.reload();
    return;
  }

  switch (view) {
    case "dashboard":
      renderDashboardView(container, allUsers);
      break;
    case "inbox":
      await renderInboxView(container, allUsers);
      break;
    case "profile":
      renderProfileView(container, currentManager);
      break;
    case "cafe-reports":
      await renderCafeReportsView(container, allUsers);
      break;
    case "dorm-assets":
      await renderDormAssetsView(container);
      break;
    case "shifts":
      renderShiftsView(container);
      break;
    case "announcements":
      await renderAnnouncementsView(container, allUsers);
      break;
    case "rights":
      renderRightsView(container);
      break;
    case "gallery":
      renderGalleryView(container);
      break;
    default:
      renderStaffView(container, view);
      break;
  }
}

// --- View Renderers ---

function renderDashboardView(container, allUsers) {
  const countRole = (role) => allUsers.filter(u => u.role === role).length;
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h3>Manager Statistics Dashboard</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Overview of all staff members managed under your department.</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem;">
        ${[
          ["Guardians", countRole("Guardian"), "var(--accent-primary)"],
          ["Cafeteria Staff", countRole("Cafeteria"), "var(--accent-secondary)"],
          ["Librarians", countRole("Librarian"), "var(--accent-success)"],
          ["Dormitory Managers", countRole("Dormitory"), "var(--accent-warning)"],
          ["Bookstore Managers", countRole("BookStore"), "var(--accent-danger)"]
        ].map(([title, val, col]) => `
          <div class="glass-card card-body" style="text-align: center;">
            <h2 style="color: ${col}; font-size: 2.5rem; margin-bottom: 0.5rem;">${val}</h2>
            <p style="color: var(--text-secondary); font-weight: 600;">${title}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function renderInboxView(container, allUsers) {
  const messages = await db.get("messages") || [];
  const myMessages = messages.filter(m => m.receiver_role === 'Manager')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h3>Inbox / Messages</h3>
          <p style="color: var(--text-secondary); margin-top: 0.3rem;">View reports and messages forwarded by staff members.</p>
        </div>
      </div>
      <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Date</th>
              <th style="border: 1px solid #ccc; padding: 8px;">From (Role)</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Title</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Status</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${myMessages.length > 0 ? myMessages.map(m => {
              const sender = allUsers.find(u => u.id === m.sender_id);
              const senderName = sender ? `${sender.name} (${sender.role})` : 'System';
              return `
                <tr style="${!m.is_read ? 'background: rgba(var(--accent-primary-rgb), 0.05); font-weight: 500;' : ''}">
                  <td style="border: 1px solid #ccc; padding: 8px;">${new Date(m.created_at).toLocaleString()}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${senderName}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${m.title}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">
                    <span class="badge ${m.is_read ? 'badge-success' : 'badge-warning'}">${m.is_read ? 'Read' : 'Unread'}</span>
                  </td>
                  <td style="border: 1px solid #ccc; padding: 8px; display: flex; gap: 0.5rem;">
                    <button class="btn-icon-sm" style="color: var(--accent-primary);" onclick="window.viewManagerMessage('${m.id}')" title="View Message"><i class="fas fa-eye"></i></button>
                    ${m.attachment_data ? `<button class="btn-icon-sm" style="color: green;" onclick="window.downloadManagerAttachment('${m.id}')" title="Download Attachment"><i class="fas fa-file-download"></i></button>` : ''}
                  </td>
                </tr>
              `;
            }).join("") : '<tr><td colspan="5" style="text-align: center; padding: 1rem; border: 1px solid #ccc;">Your inbox is empty.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
    <div id="manager-msg-modal" class="portal-modal">
      <h4 id="manager-msg-title" style="margin-bottom: 1rem;"></h4>
      <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
        <strong>From:</strong> <span id="manager-msg-from"></span><br>
        <strong>Date:</strong> <span id="manager-msg-date"></span>
      </div>
      <div id="manager-msg-content" style="padding: 1rem; background: rgba(0,0,0,0.02); border: 1px solid var(--border-color); border-radius: 4px; min-height: 100px; margin-bottom: 1.5rem; white-space: pre-wrap;"></div>
      <div style="display: flex; justify-content: flex-end;">
        <button class="btn-secondary" onclick="window.hidePortalModal('manager-msg-modal')">Close</button>
      </div>
    </div>
  `;
}

function renderProfileView(container, currentUser) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem; max-width: 600px;">
      <h3>Update Profile Information</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Modify your profile details and save changes.</p>
      <form id="manager-profile-form">
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

  const profileFormEl = document.getElementById("manager-profile-form");
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

async function renderCafeReportsView(container, allUsers) {
  const shifts = await db.get("cafe_shifts") || [];
  const attendances = await db.get("cafe_attendances") || [];

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Cafeteria Manager Reports</h4>
          <p style="color: var(--text-secondary); margin-top: 0.3rem;">Review shifts and attendance submitted by the Cafeteria Manager.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary" onclick="window.exportCafeReportsPrint()"><i class="fas fa-print"></i> Print</button>
          <button class="btn-secondary" onclick="window.exportCafeReportsCSV()"><i class="fas fa-file-excel"></i> CSV</button>
          <button class="btn-secondary" onclick="window.exportCafeReportsWord()"><i class="fas fa-file-word"></i> Word</button>
        </div>
      </div>
      
      <div id="cafe-reports-export-container">
        <h5 style="margin-bottom: 1rem;">Posted Shifts</h5>
        <div class="table-responsive" style="margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px;">Assigned Workers</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Date</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Time</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Duty</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                const grouped = {};
                shifts.forEach(s => {
                  const wk = s.week_start || s.date;
                  const daysStr = (s.days || []).join(", ");
                  const key = `${wk}|${daysStr}|${s.time}|${s.duty}`;
                  if (!grouped[key]) grouped[key] = { week_start: wk, days: daysStr, time: s.time, duty: s.duty, remarks: s.remarks, items: [] };
                  grouped[key].items.push(s);
                });
                if (Object.keys(grouped).length === 0) return '<tr><td colspan="5" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No weekly shifts recorded.</td></tr>';

                return Object.keys(grouped).sort((a, b) => new Date(grouped[b].week_start) - new Date(grouped[a].week_start)).map(key => {
                  const g = grouped[key];
                  const workersHtml = g.items.map(shf => {
                    const u = allUsers.find(user => user.id === (shf.worker_ids ? shf.worker_ids[0] : null));
                    return `<span class="badge badge-info">${u ? u.name : "Unknown"}</span>`;
                  }).join(" ");
                  return `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">${workersHtml}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${g.week_start} ${g.days ? `<b>(${g.days})</b>` : ''}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${g.time}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${g.duty}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${g.remarks || '-'}</td>
                    </tr>
                  `;
                }).join("");
              })()}
            </tbody>
          </table>
        </div>

        <h5 style="margin-bottom: 1rem;">Attendance Logs</h5>
        <div class="table-responsive">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px;">Staff Name</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Date</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Status</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Remarks</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Log Time</th>
                <th style="border: 1px solid #ccc; padding: 8px;">Review Status</th>
                <th style="border: 1px solid #ccc; padding: 8px;" class="no-export">Action</th>
              </tr>
            </thead>
            <tbody>
              ${attendances.filter(a => a.is_forwarded !== false).length > 0 ? attendances.filter(a => a.is_forwarded !== false).sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => {
                const staffUser = allUsers.find(u => u.id === a.userId);
                const name = staffUser ? staffUser.name : a.userId;
                const revStatus = a.review_status || 'Pending';
                return `
                  <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">${name}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${a.date}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;"><span class="badge ${a.status === 'Present' ? 'badge-success' : (a.status === 'Absent' ? 'badge-danger' : 'badge-warning')}">${a.status}</span></td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${a.remarks || '-'}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${new Date(a.timestamp).toLocaleString()}</td>
                    <td style="border: 1px solid #ccc; padding: 8px;"><span class="badge ${revStatus === 'Reviewed' ? 'badge-success' : 'badge-warning'}">${revStatus}</span></td>
                    <td style="border: 1px solid #ccc; padding: 8px;" class="no-export">
                      ${revStatus !== 'Reviewed' ? `<button class="btn-icon-sm" style="color: var(--accent-primary);" onclick="window.reviewCafeAttendance('${a.id}')" title="Mark as Reviewed"><i class="fas fa-check-circle"></i></button>` : `<i class="fas fa-check" style="color: green;"></i>`}
                    </td>
                  </tr>
                `;
              }).join("") : '<tr><td colspan="7" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No attendance logged.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

async function renderDormAssetsView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3>Dormitory Assets Tracking</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Review the latest inventory submitted by dormitory personnel.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
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
              <th style="border: 1px solid #ccc; padding: 8px;">Last Logged By Personnel</th>
            </tr>
          </thead>
          <tbody id="manager-dorm-assets-body"></tbody>
        </table>
      </div>
    </div>
  `;

  const assets = await db.get("dorm_assets") || [];
  const tbody = document.getElementById("manager-dorm-assets-body");
  if (!tbody) return;

  if (assets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; border: 1px solid #ccc; padding: 8px;">No assets recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = assets.map(a => `
    <tr>
      <td style="border: 1px solid #ccc; padding: 8px;"><strong>${a.category}</strong></td>
      <td style="border: 1px solid #ccc; padding: 8px;">${a.totalCount}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${a.goodCondition}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${a.requiresMaintenance}</td>
      <td style="border: 1px solid #ccc; padding: 8px;"><span class="badge badge-info">${new Date(a.lastUpdated).toLocaleString()}</span></td>
    </tr>
  `).join("");
}

function renderShiftsView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3>Shift Management</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Create and post periodic shifts. Staff will be notified automatically.</p>
        </div>
        <button class="btn-primary" id="btn-add-shift"><i class="fas fa-plus"></i> Post Shift</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title / Description</th>
              <th>Target Group</th>
              <th>Date / Period</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="shifts-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Shift Modal -->
    <div id="shift-modal" class="glass-card portal-modal">
      <h4>Post New Shift</h4>
      <form id="shift-form" style="margin-top: 1.5rem;">
        <div class="form-group">
          <label>Target Role</label>
          <select id="shift-target" class="form-control" required>
            <option value="" disabled selected>Select target role...</option>
            <option value="Guardian">Guardians</option>
            <option value="Cafeteria">Cafeteria Staff</option>
            <option value="Dormitory">Dormitory Managers</option>
            <option value="Librarian">Librarians</option>
            <option value="BookStore">Bookstore Managers</option>
          </select>
        </div>
        <div class="form-group">
          <label>Week Starting Date</label>
          <input type="date" id="shift-date" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Days of the Week</label>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="shift-days-container">
            ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => `<label><input type="checkbox" name="mng_shift_days" value="${d}"> ${d}</label>`).join(" ")}
          </div>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div class="form-group" style="flex: 1;">
            <label>Start Time</label>
            <input type="time" id="shift-time-start" class="form-control" required>
          </div>
          <div class="form-group" style="flex: 1;">
            <label>End Time</label>
            <input type="time" id="shift-time-end" class="form-control" required>
          </div>
        </div>
        <div class="form-group">
          <label>Select Staff Members</label>
          <div id="shift-workers-list" style="max-height: 150px; overflow-y: auto; border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 4px; background: rgba(0,0,0,0.02);">
            <em style="color: var(--text-secondary); font-size: 0.85rem;">Select a Target Role first to see available staff.</em>
          </div>
        </div>
        <div class="form-group">
          <label>Shift Title / Duty</label>
          <input type="text" id="shift-duty" class="form-control" placeholder="e.g. Front Gate Security" required>
        </div>
        <div class="form-group">
          <label>Additional Remarks</label>
          <input type="text" id="shift-remarks" class="form-control" placeholder="Optional notes...">
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-secondary" onclick="window.hidePortalModal('shift-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Post Shift</button>
        </div>
      </form>
    </div>
  `;

  window.loadShiftsTable();

  const btnAddShift = document.getElementById("btn-add-shift");
  if (btnAddShift) {
    btnAddShift.addEventListener("click", () => {
      const formEl = document.getElementById("shift-form");
      if (formEl) formEl.reset();
      window.showPortalModal("shift-modal");
    });
  }

  const shiftTargetEl = document.getElementById("shift-target");
  if (shiftTargetEl) {
    shiftTargetEl.addEventListener("change", async (e) => {
      const role = e.target.value;
      const users = await db.get("users") || [];
      const roleUsers = users.filter(u => u.role === role);
      const list = document.getElementById("shift-workers-list");
      if (!list) return;
      if (roleUsers.length === 0) {
        list.innerHTML = `<em style="color: var(--text-secondary); font-size: 0.85rem;">No staff found for this role.</em>`;
        return;
      }
      list.innerHTML = roleUsers.map(u => `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <input type="checkbox" id="mng-sw-${u.id}" value="${u.id}" class="mng-shift-worker-checkbox">
          <label for="mng-sw-${u.id}" style="margin: 0; flex-grow: 1;">${u.name} <span class="badge badge-info" style="font-size:0.7rem;">${u.role}</span></label>
        </div>
      `).join("");
    });
  }

  const shiftFormEl = document.getElementById("shift-form");
  if (shiftFormEl) {
    shiftFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = document.getElementById("shift-target").value;
      const week_start = document.getElementById("shift-date").value;
      const timeStart = document.getElementById("shift-time-start").value;
      const timeEnd = document.getElementById("shift-time-end").value;
      const duty = document.getElementById("shift-duty").value.trim();
      const remarks = document.getElementById("shift-remarks").value.trim();

      const dayCheckboxes = document.querySelectorAll('input[name="mng_shift_days"]:checked');
      const selectedDays = Array.from(dayCheckboxes).map(cb => cb.value);
      if (selectedDays.length === 0) {
        alert("Please select at least one day for this shift.");
        return;
      }

      const workerCheckboxes = document.querySelectorAll('.mng-shift-worker-checkbox:checked');
      const worker_ids = Array.from(workerCheckboxes).map(cb => cb.value);
      if (worker_ids.length === 0) {
        alert("Please select at least one staff member.");
        return;
      }

      const formatTime = (timeStr) => {
        if (!timeStr) return "";
        let [h, m] = timeStr.split(':');
        h = parseInt(h);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
      };
      const time = `${formatTime(timeStart)} - ${formatTime(timeEnd)}`;
      const shifts = await db.get("shifts") || [];

      worker_ids.forEach(wid => {
        shifts.push({
          id: "shift-" + Date.now() + "-" + wid,
          worker_ids: [wid],
          target,
          week_start,
          days: selectedDays,
          time,
          duty,
          remarks,
          postedAt: new Date().toISOString()
        });
      });
      await db.set("shifts", shifts);

      const announcements = await db.get("announcements") || [];
      announcements.push({
        id: "ann-" + Date.now(),
        title: `New Shift Assigned: ${duty}`,
        target: target,
        content: `A new shift has been assigned starting ${week_start}. Check your dashboard.`,
        date: new Date().toISOString().split("T")[0],
        expiryDate: "2099-12-31",
        author: "manager"
      });
      await db.set("announcements", announcements);

      alert("Shift saved and posted!");
      window.hidePortalModal("shift-modal");
      window.loadShiftsTable();
    });
  }
}

async function renderAnnouncementsView(container, allUsers) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3>Announcements & Meetings</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Post urgent updates or schedule meetings for staff.</p>
        </div>
        <button class="btn-primary" id="btn-add-mng-ann"><i class="fas fa-plus"></i> Create Post</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title / Type</th>
              <th>Target Audience</th>
              <th>Urgency</th>
              <th>Date / Meeting Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="mng-ann-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Announcement Modal -->
    <div id="mng-ann-modal" class="glass-card portal-modal">
      <h4>Create Announcement / Meeting</h4>
      <form id="mng-ann-form" style="margin-top: 1.5rem;">
        <input type="hidden" id="mng-ann-id">
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div class="form-group" style="flex: 1;">
            <label>Post Type</label>
            <select id="mng-ann-type" class="form-control" required>
              <option value="announcement">Announcement</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
          <div class="form-group" style="flex: 1;">
            <label>Urgency Level</label>
            <select id="mng-ann-urgency" class="form-control" required>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Target Audience (Role or Specific Person)</label>
          <select id="mng-ann-target" class="form-control" required>
            <optgroup label="Roles">
              <option value="all">All Managed Staff</option>
              <option value="Guardian">All Guardians</option>
              <option value="Cafeteria">All Cafeteria Staff</option>
              <option value="Librarian">All Librarians</option>
              <option value="Dormitory">All Dormitory Managers</option>
              <option value="BookStore">All Bookstore Managers</option>
            </optgroup>
            <optgroup label="Specific Individuals" id="mng-ann-individuals"></optgroup>
          </select>
        </div>

        <div class="form-group" id="mng-meeting-time-group" style="display: none;">
          <label>Meeting Date & Time</label>
          <input type="datetime-local" id="mng-ann-meeting-time" class="form-control">
        </div>

        <div class="form-group">
          <label>Title</label>
          <input type="text" id="mng-ann-title" class="form-control" required>
        </div>
        
        <div class="form-group">
          <label>Message Content</label>
          <textarea id="mng-ann-content" class="form-control" style="height: 100px;" required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-secondary" onclick="window.hidePortalModal('mng-ann-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Publish Post</button>
        </div>
      </form>
    </div>
  `;

  const managedRoles = ["Guardian", "Cafeteria", "Librarian", "Dormitory", "BookStore"];
  const managedUsers = allUsers.filter(u => managedRoles.includes(u.role));
  const individualsGroup = document.getElementById("mng-ann-individuals");
  if (individualsGroup) {
    individualsGroup.innerHTML = managedUsers.map(u => `<option value="USER:${u.id}">${u.name} (${u.role})</option>`).join("");
  }

  const mngAnnTypeEl = document.getElementById("mng-ann-type");
  if (mngAnnTypeEl) {
    mngAnnTypeEl.addEventListener("change", (e) => {
      const groupEl = document.getElementById("mng-meeting-time-group");
      const timeEl = document.getElementById("mng-ann-meeting-time");
      if (groupEl) groupEl.style.display = e.target.value === "meeting" ? "block" : "none";
      if (timeEl) timeEl.required = e.target.value === "meeting";
    });
  }

  window.loadMngAnnouncementsTable();

  const btnAddMngAnn = document.getElementById("btn-add-mng-ann");
  if (btnAddMngAnn) {
    btnAddMngAnn.addEventListener("click", () => {
      const formEl = document.getElementById("mng-ann-form");
      const idEl = document.getElementById("mng-ann-id");
      const groupEl = document.getElementById("mng-meeting-time-group");
      if (formEl) formEl.reset();
      if (idEl) idEl.value = "";
      if (groupEl) groupEl.style.display = "none";
      window.showPortalModal("mng-ann-modal");
    });
  }

  const mngAnnFormEl = document.getElementById("mng-ann-form");
  if (mngAnnFormEl) {
    mngAnnFormEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("mng-ann-id").value;
      const type = document.getElementById("mng-ann-type").value;
      const urgency = document.getElementById("mng-ann-urgency").value;
      const target = document.getElementById("mng-ann-target").value;
      const meetingTime = document.getElementById("mng-ann-meeting-time").value;
      const title = document.getElementById("mng-ann-title").value.trim();
      const content = document.getElementById("mng-ann-content").value.trim();

      const anns = await db.get("announcements") || [];
      if (id) {
        const updated = anns.map(a => {
          if (a.id === id) {
            a.postType = type; a.urgency = urgency; a.target = target; a.meetingTime = meetingTime; a.title = title; a.content = content;
          }
          return a;
        });
        await db.set("announcements", updated);
      } else {
        anns.push({
          id: "mng-ann-" + Date.now(),
          postType: type,
          urgency,
          target,
          meetingTime,
          title,
          content,
          date: new Date().toISOString().split("T")[0],
          author: "manager"
        });
        await db.set("announcements", anns);
      }
      alert("Post published successfully!");
      window.hidePortalModal("mng-ann-modal");
      window.loadMngAnnouncementsTable();
    });
  }
}

function renderRightsView(container) {
  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <h3>Centralized Rights Management</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Toggle specific functional permissions and account statuses for managed staff.</p>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Role</th>
              <th>Account Status</th>
              <th>Functional Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="manager-rights-table-body"></tbody>
        </table>
      </div>
    </div>
  `;
  window.loadManagerRightsTable();
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
            <tr>
              <th>Title & Category</th>
              <th>Description</th>
              <th>Author</th>
              <th>Date Posted</th>
              <th>Actions</th>
            </tr>
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

function renderStaffView(container, view) {
  const roleMap = {
    "guardians": { title: "Guardians", role: "Guardian" },
    "cafeteria": { title: "Cafeteria Workers", role: "Cafeteria", isCafeteria: true },
    "librarians": { title: "Librarians", role: "Librarian" },
    "dorm-managers": { title: "Dormitory Managers", role: "Dormitory", isDorm: true },
    "bookstore-managers": { title: "Bookstore Managers", role: "BookStore" }
  };
  const config = roleMap[view] || { title: "Staff", role: view };

  container.innerHTML = `
    <div class="glass-card" style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h3>${config.title} Registry</h3>
        <button class="btn-primary" id="btn-add-staff"><i class="fas fa-plus"></i> Add ${config.title.slice(0, -1)}</button>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Username ID</th>
              <th>Gender</th>
              ${config.isCafeteria ? `<th>Cafeteria Role</th>` : ""}
              ${config.isDorm ? `<th>Assigned Dorm Block</th><th>Dorm Category</th>` : ""}
              ${view === "guardians" ? `<th>Contact Address</th><th>Shift</th>` : ""}
              ${view === "bookstore-managers" ? `<th>Book Edit Privilege</th>` : ""}
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="staff-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Manager Add Staff Modal -->
    <div id="staff-modal" class="glass-card portal-modal">
      <h4 id="staff-modal-title">Add Staff Member</h4>
      <form id="staff-form" style="margin-top: 1.5rem;">
        <input type="hidden" id="staff-id">
        <input type="hidden" id="staff-role" value="${config.role}">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="staff-name" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select id="staff-gender" class="form-control">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label>Profile Photo (URL or Upload File)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="staff-photo" class="form-control" placeholder="Paste URL or upload file..." style="flex: 1;">
            <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0;">
              <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
              <input type="file" id="staff-photo-file" accept="image/*" style="display: none;">
            </label>
          </div>
        </div>

        ${config.isCafeteria ? `
          <div class="form-group">
            <label>Cafeteria Assignment</label>
            <select id="staff-cafe-role" class="form-control">
              <option value="manager of the staff">Manager of the Staff</option>
              <option value="ticker">Ticker</option>
              <option value="cook">Cook</option>
            </select>
          </div>
        ` : ""}

        ${config.isDorm ? `
          <div class="form-group">
            <label>Assigned Dorm Room/Block</label>
            <input type="text" id="staff-dorm-no" class="form-control" placeholder="e.g. Block B - Room 204" required>
          </div>
          <div class="form-group">
            <label>Dormitory Category</label>
            <select id="staff-dorm-type" class="form-control">
              <option value="male">Male Dormitory Table</option>
              <option value="female">Female Dormitory Table</option>
            </select>
          </div>
        ` : ""}

        ${view === "guardians" ? `
          <div class="form-group">
            <label>Contact Address</label>
            <input type="text" id="staff-address" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Shift Schedule</label>
            <select id="staff-shift" class="form-control">
              <option value="Day Shift">Day Shift</option>
              <option value="Night Shift">Night Shift</option>
            </select>
          </div>
        ` : ""}

        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-secondary" id="btn-close-staff-modal">Cancel</button>
          <button type="submit" class="btn-primary">Save Member</button>
        </div>
      </form>
    </div>
  `;

  loadStaffTable(config.role, view);

  const btnAddStaff = document.getElementById("btn-add-staff");
  if (btnAddStaff) {
    btnAddStaff.addEventListener("click", () => {
      const formEl = document.getElementById("staff-form");
      const idEl = document.getElementById("staff-id");
      const roleEl = document.getElementById("staff-role");
      const titleEl = document.getElementById("staff-modal-title");
      if (formEl) formEl.reset();
      if (idEl) idEl.value = "";
      if (roleEl) roleEl.value = config.role;
      if (titleEl) titleEl.innerText = `Add ${config.title.slice(0, -1)}`;
      window.showPortalModal("staff-modal");
    });
  }

  const btnCloseStaff = document.getElementById("btn-close-staff-modal");
  if (btnCloseStaff) {
    btnCloseStaff.addEventListener("click", () => {
      window.hidePortalModal("staff-modal");
    });
  }

  const staffFormEl = document.getElementById("staff-form");
  if (staffFormEl) {
    staffFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      saveStaff(config.role, view);
    });

    staffFormEl.addEventListener("change", (e) => {
      if (e.target && e.target.id === "staff-photo-file") {
        const file = e.target.files[0];
        if (file && window.compressImage) {
          window.compressImage(file, 200, (compressedBase64) => {
            const photoEl = document.getElementById("staff-photo");
            if (photoEl) photoEl.value = compressedBase64;
          });
        }
      }
    });
  }
}

// --- Table Loaders & Data Helpers ---

async function loadStaffTable(role, view) {
  const users = await db.get("users") || [];
  const filtered = users.filter(u => u.role === role);
  const tbody = document.getElementById("staff-table-body");
  if (!tbody) return;

  tbody.innerHTML = filtered.map(s => {
    const createdDate = new Date(s.created_at).toLocaleDateString();
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${s.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 32px; height: 32px; border-radius: 50%;">
            <span>${s.name}</span>
          </div>
        </td>
        <td><code>${s.id}</code></td>
        <td>${s.gender}</td>
        ${role === "Cafeteria" ? `<td><span class="badge badge-info">${s.cafeteriaRole || 'Staff'}</span></td>` : ""}
        ${role === "Dormitory" ? `<td>${s.dormNumber || ""}</td><td><span class="badge ${s.dormType === 'male' ? 'badge-info' : 'badge-success'}">${s.dormType === 'male' ? 'Male Dorm' : 'Female Dorm'}</span></td>` : ""}
        ${role === "Guardian" ? `<td>${s.address || ""}</td><td><span class="badge badge-warning">${s.shiftSchedule || ""}</span></td>` : ""}
        ${role === "BookStore" ? `<td><span class="badge ${s.rights && s.rights.includes('edit_books') ? 'badge-success' : 'badge-danger'}">${s.rights && s.rights.includes('edit_books') ? 'Allowed' : 'Locked / Read-Only'}</span></td>` : ""}
        <td>${createdDate}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            ${role === "BookStore" ? `
              <button class="btn-icon-sm" style="color: ${s.rights && s.rights.includes('edit_books') ? 'var(--accent-danger)' : 'var(--accent-primary)'};" onclick="window.toggleBookstoreEditRight('${s.id}')" title="${s.rights && s.rights.includes('edit_books') ? 'Lock Edit Access' : 'Unlock Edit Access'}">
                <i class="fas ${s.rights && s.rights.includes('edit_books') ? 'fa-lock-open' : 'fa-lock'}"></i>
              </button>
            ` : ""}
            <button class="btn-icon-sm" onclick="window.editStaff('${s.id}', '${view}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteStaff('${s.id}', '${view}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function saveStaff(role, view) {
  const editId = document.getElementById("staff-id").value;
  const name = document.getElementById("staff-name").value;
  const gender = document.getElementById("staff-gender").value;
  const photo = document.getElementById("staff-photo").value || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
  const users = await db.get("users") || [];

  if (editId) {
    const updated = users.map(u => {
      if (u.id === editId) {
        u.name = name;
        u.gender = gender;
        u.photo = photo;
        if (role === "Cafeteria") u.cafeteriaRole = document.getElementById("staff-cafe-role").value;
        if (role === "Dormitory") {
          u.dormNumber = document.getElementById("staff-dorm-no").value;
          u.dormType = document.getElementById("staff-dorm-type").value;
        }
        if (role === "Guardian") {
          u.address = document.getElementById("staff-address").value;
          u.shiftSchedule = document.getElementById("staff-shift").value;
        }
      }
      return u;
    });
    await db.set("users", updated);
    alert("Staff member details updated.");
  } else {
    const currentYear = new Date().getFullYear();
    const fourDigit = Math.floor(1000 + Math.random() * 9000);
    const code = role === "BookStore" ? "Book Store" : role;
    const username = `HIGA/${code}/${fourDigit}/${currentYear}`;
    const autoPassword = Math.floor(1000 + Math.random() * 9000).toString();

    const newStaff = {
      id: username, username, password: autoPassword, defaultPassword: autoPassword,
      name, role, gender, photo, created_at: new Date().toISOString()
    };
    if (role === "Cafeteria") newStaff.cafeteriaRole = document.getElementById("staff-cafe-role").value;
    if (role === "Dormitory") {
      newStaff.dormNumber = document.getElementById("staff-dorm-no").value;
      newStaff.dormType = document.getElementById("staff-dorm-type").value;
    }
    if (role === "Guardian") {
      newStaff.address = document.getElementById("staff-address").value;
      newStaff.shiftSchedule = document.getElementById("staff-shift").value;
    }
    users.push(newStaff);
    await db.set("users", users);
    alert(`Staff Added!\nUsername: ${username}\nDefault Password: ${autoPassword}`);
  }

  window.hidePortalModal("staff-modal");
  renderMainView(view);
}

// --- Window Method Attachments ---

window.editStaff = async (id, view) => {
  const users = await db.get("users") || [];
  const s = users.find(u => u.id === id);
  if (!s) return;

  document.getElementById("staff-id").value = s.id;
  document.getElementById("staff-name").value = s.name;
  document.getElementById("staff-gender").value = s.gender;
  document.getElementById("staff-photo").value = s.photo || "";

  if (s.role === "Cafeteria" && document.getElementById("staff-cafe-role")) document.getElementById("staff-cafe-role").value = s.cafeteriaRole || "cook";
  if (s.role === "Dormitory") {
    if (document.getElementById("staff-dorm-no")) document.getElementById("staff-dorm-no").value = s.dormNumber || "";
    if (document.getElementById("staff-dorm-type")) document.getElementById("staff-dorm-type").value = s.dormType || "male";
  }
  if (s.role === "Guardian") {
    if (document.getElementById("staff-address")) document.getElementById("staff-address").value = s.address || "";
    if (document.getElementById("staff-shift")) document.getElementById("staff-shift").value = s.shiftSchedule || "Day Shift";
  }

  document.getElementById("staff-modal-title").innerText = `Edit Details`;
  window.showPortalModal("staff-modal");
};

window.deleteStaff = async (id, view) => {
  if (!await window.showConfirmModal("Confirm Staff Removal", `Are you sure you want to remove staff member ${id}?`)) return;
  const users = await db.get("users") || [];
  await db.set("users", users.filter(u => u.id !== id));
  renderMainView(view);
};

window.toggleBookstoreEditRight = async (id) => {
  const users = await db.get("users") || [];
  const u = users.find(user => user.id === id);
  if (!u) return;

  if (!u.rights) u.rights = [];
  let isGranted = false;
  if (u.rights.includes("edit_books")) {
    u.rights = u.rights.filter(r => r !== "edit_books");
  } else {
    u.rights.push("edit_books");
    isGranted = true;
  }
  await db.set("users", users);
  alert(`Successfully ${isGranted ? 'granted' : 'revoked'} book edit rights for ${u.name}.`);
  loadStaffTable("BookStore", "bookstore-managers");
};

window.loadShiftsTable = async () => {
  const tbody = document.getElementById("shifts-table-body");
  if (!tbody) return;

  const shifts = await db.get("shifts") || [];
  const users = await db.get("users") || [];
  if (shifts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No shifts created.</td></tr>`;
    return;
  }

  const grouped = {};
  const legacyShifts = [];

  shifts.forEach(s => {
    if (s.week_start && s.days) {
      const key = `${s.week_start}|${s.days.join(',')}|${s.time}|${s.duty}|${s.target}`;
      if (!grouped[key]) grouped[key] = { ...s, workers: [] };
      if (s.worker_ids && s.worker_ids.length > 0) grouped[key].workers.push(s.worker_ids[0]);
    } else {
      legacyShifts.push(s);
    }
  });

  const groupedArray = Object.values(grouped).sort((a, b) => new Date(b.week_start) - new Date(a.week_start));
  let html = groupedArray.map(group => {
    const workerNames = group.workers.map(wid => {
      const u = users.find(x => x.id === wid);
      return u ? u.name : "Unknown";
    }).join(", ");
    return `
      <tr>
        <td><strong>${group.duty}</strong><br><span style="font-size:0.8rem; color:var(--text-secondary);">${workerNames || 'No staff assigned'}</span></td>
        <td><span class="badge badge-info">${group.target}</span></td>
        <td>Week of: ${group.week_start}<br><span style="font-size:0.8rem; font-weight:bold;">(${group.days.join(", ")})</span><br><span style="font-size:0.8rem;">${group.time}</span></td>
        <td><span class="badge badge-success">Posted</span></td>
        <td><button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteGroupedShifts('${group.week_start}', '${group.days.join(',')}', '${group.time}', '${group.duty}', '${group.target}')" title="Delete Group"><i class="fas fa-trash-alt"></i></button></td>
      </tr>
    `;
  }).join("");

  legacyShifts.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).forEach(s => {
    html += `
      <tr style="background: rgba(0,0,0,0.02);">
        <td><strong>${s.title || s.duty}</strong> (Legacy)<br><span style="font-size:0.8rem; color:var(--text-secondary);">${s.details || s.remarks || ''}</span></td>
        <td><span class="badge badge-warning">${s.target}</span></td>
        <td>${s.date || s.week_start || ''}</td>
        <td><span class="badge badge-success">Posted</span></td>
        <td><button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteShift('${s.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
};

window.deleteGroupedShifts = async (week_start, daysStr, time, duty, target) => {
  if (!await window.showConfirmModal("Delete Shift Group", "Are you sure you want to delete all shifts in this group?")) return;
  const shifts = await db.get("shifts") || [];
  const updated = shifts.filter(s => {
    if (s.week_start) {
      return !(s.week_start === week_start && s.days.join(',') === daysStr && s.time === time && s.duty === duty && s.target === target);
    }
    return true;
  });
  await db.set("shifts", updated);
  window.loadShiftsTable();
};

window.deleteShift = async (id) => {
  if (!await window.showConfirmModal("Delete Shift", "Are you sure you want to delete this shift?")) return;
  const shifts = await db.get("shifts") || [];
  await db.set("shifts", shifts.filter(s => s.id !== id));
  window.loadShiftsTable();
};

window.loadManagerRightsTable = async () => {
  const managedRoles = ["Guardian", "Cafeteria", "Librarian", "Dormitory", "BookStore", "SchoolStore"];
  const allUsers = await db.get("users") || [];
  const users = allUsers.filter(u => managedRoles.includes(u.role));
  const tbody = document.getElementById("manager-rights-table-body");
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No managed staff found.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const isActive = u.isActive !== false;
    const activeBadge = isActive ? `<span class="badge badge-success">Active</span>` : `<span class="badge badge-danger">Disabled</span>`;
    const toggleStatusBtn = isActive ? `<button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--accent-danger);" onclick="window.toggleStaffStatus('${u.id}')"><i class="fas fa-ban"></i> Disable</button>`
      : `<button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--accent-success);" onclick="window.toggleStaffStatus('${u.id}')"><i class="fas fa-check"></i> Enable</button>`;

    let rightsDisplay = `<span style="color: var(--text-tertiary); font-size: 0.8rem;">Standard Role Permissions</span>`;
    let toggleRightsBtn = "";
    if (u.role === "BookStore") {
      const hasEdit = u.rights && u.rights.includes("edit_books");
      rightsDisplay = hasEdit ? `<span class="badge badge-info">Edit Books (Unlocked)</span>` : `<span class="badge badge-warning">Read-Only (Locked)</span>`;
      toggleRightsBtn = `<button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="window.toggleStaffRight('${u.id}', 'edit_books')"><i class="fas fa-lock"></i> Toggle Rights</button>`;
    } else if (u.role === "SchoolStore") {
      const hasEdit = u.rights && u.rights.includes("edit_store");
      rightsDisplay = hasEdit ? `<span class="badge badge-info">Edit Store (Unlocked)</span>` : `<span class="badge badge-warning">Read-Only (Locked)</span>`;
      toggleRightsBtn = `<button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="window.toggleStaffRight('${u.id}', 'edit_store')"><i class="fas fa-lock"></i> Toggle Rights</button>`;
    }

    return `
      <tr>
        <td><strong>${u.name}</strong><br><small style="color: var(--text-tertiary);">${u.id}</small></td>
        <td>${u.role}</td>
        <td>${activeBadge}</td>
        <td>${rightsDisplay}</td>
        <td><div style="display: flex; gap: 0.5rem; align-items: center;">${toggleRightsBtn}${toggleStatusBtn}</div></td>
      </tr>
    `;
  }).join("");
};

window.toggleStaffStatus = async (id) => {
  const users = await db.get("users") || [];
  const updated = users.map(u => {
    if (u.id === id) u.isActive = u.isActive === false ? true : false;
    return u;
  });
  await db.set("users", updated);
  renderMainView("rights");
};

window.toggleStaffRight = async (id, rightName) => {
  const users = await db.get("users") || [];
  const updated = users.map(u => {
    if (u.id === id) {
      if (!u.rights) u.rights = [];
      if (u.rights.includes(rightName)) u.rights = u.rights.filter(r => r !== rightName);
      else u.rights.push(rightName);
    }
    return u;
  });
  await db.set("users", updated);
  window.loadManagerRightsTable();
};

window.viewManagerMessage = async (id) => {
  const messages = await db.get("messages") || [];
  const msg = messages.find(m => m.id === id);
  if (!msg) return;

  if (!msg.is_read) {
    msg.is_read = true;
    await db.set("messages", messages);
    renderMainView("inbox");
  }

  const users = await db.get("users") || [];
  const sender = users.find(u => u.id === msg.sender_id);
  const senderName = sender ? `${sender.name} (${sender.role})` : 'System';

  const tEl = document.getElementById("manager-msg-title");
  const fEl = document.getElementById("manager-msg-from");
  const dEl = document.getElementById("manager-msg-date");
  const cEl = document.getElementById("manager-msg-content");

  if (tEl) tEl.innerText = msg.title;
  if (fEl) fEl.innerText = senderName;
  if (dEl) dEl.innerText = new Date(msg.created_at).toLocaleString();
  if (cEl) cEl.innerText = msg.content;

  window.showPortalModal("manager-msg-modal");
};

window.downloadManagerAttachment = async (id) => {
  const messages = await db.get("messages") || [];
  const msg = messages.find(m => m.id === id);
  if (!msg || !msg.attachment_data) return alert("Attachment not found.");

  const isCsv = msg.attachment_type === 'text/csv';
  const blob = new Blob([msg.attachment_data], { type: isCsv ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;' });
  const filename = `Attachment_${id}${isCsv ? '.csv' : '.txt'}`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.reviewCafeAttendance = async (id) => {
  if (!confirm("Mark this attendance log as reviewed?")) return;
  const atts = await db.get("cafe_attendances") || [];
  const updated = atts.map(a => {
    if (a.id === id) a.review_status = 'Reviewed';
    return a;
  });
  await db.set("cafe_attendances", updated);
  renderMainView('cafe-reports');
};

window.loadMngAnnouncementsTable = async () => {
  const tbody = document.getElementById("mng-ann-table-body");
  if (!tbody) return;

  const anns = await db.get("announcements") || [];
  const users = await db.get("users") || [];
  const myAnns = anns.filter(a => a.author === "manager" && a.id && a.id.startsWith("mng-ann-"));

  if (myAnns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No announcements or meetings posted.</td></tr>`;
    return;
  }

  const getTargetName = (target) => {
    if (target.startsWith("USER:")) {
      const u = users.find(x => x.id === target.split(":")[1]);
      return u ? `<i class="fas fa-user"></i> ${u.name}` : target;
    }
    return target === "all" ? "All Managed Staff" : `${target}s`;
  };

  const getUrgencyBadge = (u) => {
    if (u === "urgent") return `<span class="badge badge-danger">Urgent</span>`;
    if (u === "high") return `<span class="badge badge-warning">High</span>`;
    return `<span class="badge badge-info">Normal</span>`;
  };

  tbody.innerHTML = myAnns.sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => `
    <tr>
      <td>
        <strong>${a.title}</strong><br>
        <span style="font-size:0.8rem; color:var(--text-secondary); text-transform:capitalize;">
          <i class="fas ${a.postType === 'meeting' ? 'fa-handshake' : 'fa-bullhorn'}"></i> ${a.postType || 'Announcement'}
        </span>
      </td>
      <td>${getTargetName(a.target)}</td>
      <td>${getUrgencyBadge(a.urgency || 'normal')}</td>
      <td>${a.postType === 'meeting' ? `<strong style="color:var(--accent-primary);">${new Date(a.meetingTime).toLocaleString()}</strong>` : a.date}</td>
      <td><button class="btn-icon-sm" style="color: var(--accent-danger);" onclick="window.deleteMngAnn('${a.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button></td>
    </tr>
  `).join("");
};

window.deleteMngAnn = async (id) => {
  if (!confirm("Delete this post?")) return;
  const anns = await db.get("announcements") || [];
  await db.set("announcements", anns.filter(a => a.id !== id));
  window.loadMngAnnouncementsTable();
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

window.exportCafeReportsPrint = () => {
  const el = document.getElementById("cafe-reports-export-container");
  if (!el) return;
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>Cafeteria Reports</title><style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;}</style></head><body><h2>Cafeteria Reports</h2><p>Date: ${new Date().toLocaleString()}</p>${el.innerHTML}</body></html>`);
  win.document.close();
  win.print();
};

window.exportCafeReportsCSV = async () => {
  const shifts = await db.get("cafe_shifts") || [];
  const attendances = await db.get("cafe_attendances") || [];
  const users = await db.get("users") || [];

  const getName = (ids) => Array.isArray(ids) ? ids.map(id => (users.find(u => u.id === id) || {}).name || "Unknown").join(" & ") : "N/A";
  let csv = "--- POSTED SHIFTS ---\nAssigned Workers,Date,Time,Duty,Remarks\n";
  shifts.forEach(s => csv += `"${getName(s.worker_ids)}","${s.date}","${s.time}","${s.duty}","${s.remarks || ''}"\n`);
  csv += "\n--- ATTENDANCE LOGS ---\nStaff Name,Date,Status,Remarks,Logged At\n";
  attendances.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(a => {
    const u = users.find(x => x.id === a.userId);
    csv += `"${u ? u.name : a.userId}","${a.date}","${a.status}","${a.remarks || ''}","${new Date(a.timestamp).toLocaleString()}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Cafeteria_Reports_${Date.now()}.csv`;
  a.click();
};

window.exportCafeReportsWord = () => {
  const el = document.getElementById("cafe-reports-export-container");
  if (!el) return;
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><style>body{font-family:sans-serif;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}</style></head><body><h2>Cafeteria Reports</h2>${el.innerHTML}</body></html>`;
  const a = document.createElement("a");
  a.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  a.download = `Cafeteria_Reports_${Date.now()}.doc`;
  a.click();
};

window.exportDormAssetsPrint = () => {
  const el = document.getElementById("dorm-assets-export-container");
  if (!el) return;
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>Dorm Assets Report</title><style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;}</style></head><body><h2>Dorm Assets Report</h2><p>Date: ${new Date().toLocaleString()}</p>${el.innerHTML}</body></html>`);
  win.document.close();
  win.print();
};

window.exportDormAssetsCSV = async () => {
  const assets = await db.get("dorm_assets") || [];
  let csv = "Category,Total Count,Good Condition,Requires Maintenance,Last Updated\n";
  assets.forEach(a => csv += `"${a.category}",${a.totalCount},${a.goodCondition},${a.requiresMaintenance},"${new Date(a.lastUpdated).toLocaleString()}"\n`);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Dorm_Assets_${Date.now()}.csv`;
  a.click();
};

window.exportDormAssetsWord = () => {
  const el = document.getElementById("dorm-assets-export-container");
  if (!el) return;
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><style>body{font-family:sans-serif;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}</style></head><body><h2>Dorm Assets Report</h2>${el.innerHTML}</body></html>`;
  const a = document.createElement("a");
  a.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  a.download = `Dorm_Assets_${Date.now()}.doc`;
  a.click();
};
