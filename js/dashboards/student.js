// js/dashboards/student.js
import { db } from '../db.js';

export function initDashboard(user) {
  renderSidebar();
  renderMainView("home");
}

function renderSidebar() {
  const list = document.getElementById("sidebar-nav-list");
  if (!list) return;

  list.innerHTML = `
    <li class="active"><a href="#" id="stud-side-home"><i class="fas fa-home"></i> Student Home</a></li>
    
    <!-- Hover drop downs simulated in sidebar -->
    <li style="position: relative;" class="dropdown">
      <a href="#" class="sidebar-dropdown-toggle"><i class="fas fa-user-edit"></i> Admission Portal <i class="fas fa-chevron-down" style="font-size: 0.7rem; margin-left: auto;"></i></a>
      <ul class="dropdown-menu" style="left: 0; top: 100%; width: 100%; border-radius: 0; background: var(--bg-tertiary);">
        <li><a href="#" id="stud-side-basic-info">Basic Information</a></li>
        <li><a href="#" id="stud-side-full-profile">My Full Profile</a></li>
      </ul>
    </li>

    <li><a href="#" id="stud-side-placement"><i class="fas fa-map-marker-alt"></i> Section Placement</a></li>
    <li><a href="#" id="stud-side-curriculum"><i class="fas fa-book-reader"></i> My Curriculum</a></li>
    <li><a href="#" id="stud-side-registration"><i class="fas fa-user-plus"></i> Register Courses</a></li>
    <li><a href="#" id="stud-side-grades"><i class="fas fa-poll"></i> Grades & Results</a></li>
    <li><a href="#" id="stud-side-instructors"><i class="fas fa-id-card-alt"></i> Assigned Instructors</a></li>
    <li><a href="#" id="stud-side-calendar"><i class="fas fa-calendar-alt"></i> Academic Calendar</a></li>
    <li><a href="#" id="stud-side-cafe-menu"><i class="fas fa-utensils"></i> Cafeteria Menu</a></li>
  `;

  // Bind clicks
  document.getElementById("stud-side-home").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-home");
    renderMainView("home");
  });
  document.getElementById("stud-side-basic-info").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-basic-info");
    renderMainView("basic-info");
  });
  document.getElementById("stud-side-full-profile").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-full-profile");
    renderMainView("full-profile");
  });
  document.getElementById("stud-side-placement").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-placement");
    renderMainView("placement");
  });
  document.getElementById("stud-side-curriculum").addEventListener("click", async (e) => {
    e.preventDefault();
    toggleCurriculumDrawer(true);
  });
  document.getElementById("stud-side-registration").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-registration");
    renderMainView("registration");
  });
  document.getElementById("stud-side-grades").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-grades");
    renderMainView("grades");
  });
  document.getElementById("stud-side-instructors").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-instructors");
    renderMainView("instructors");
  });
  document.getElementById("stud-side-calendar").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-calendar");
    renderMainView("calendar");
  });
  document.getElementById("stud-side-cafe-menu").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("stud-side-cafe-menu");
    renderMainView("cafe-menu");
  });
}

async function setActiveLink(id) {
  document.querySelectorAll("#sidebar-nav-list li").forEach(li => li.classList.remove("active"));
  const link = document.getElementById(id);
  if (link) {
    if (link.parentElement.classList.contains("dropdown")) {
      link.parentElement.classList.add("active");
    } else {
      link.parentElement.classList.add("active");
    }
  }
}

async function renderMainView(view) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const currentStudent = JSON.parse(localStorage.getItem("higa_current_user"));
  
  // Real-time security deactivation check (Requirement 8)
  const users = await db.get("users");
  const dbUser = users.find(u => u.id === currentStudent.id);
  if (!dbUser || dbUser.isActive === false || dbUser.is_active === false) {
    alert("Session invalidated. Your account has been deactivated.");
    localStorage.removeItem("higa_current_user");
    window.location.reload();
    return;
  }

  if (view === "home") {
    const calendar = await db.get("calendar");
    container.innerHTML = `
      <div class="grid-2" style="margin-bottom: 2rem;">
        <!-- Profile Container -->
        <div class="glass-card" style="padding: 2rem; display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
          <img src="${currentStudent.photo || 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=120'}" style="width: 120px; height: 120px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--accent-primary);">
          <div style="flex: 1;">
            <span class="badge badge-success" style="margin-bottom: 0.5rem;">Student Portal</span>
            <h3 style="margin-bottom: 0.25rem;">${currentStudent.name}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.2rem;">ID: <code>${currentStudent.id}</code></p>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.2rem;">Class & Section: <strong>${currentStudent.classSection || 'Unassigned'}</strong></p>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Batch Year: <strong>${currentStudent.batch || 'N/A'}</strong></p>
          </div>
        </div>

        <!-- Academic Calendar Container -->
        <div class="glass-card" style="padding: 2rem;">
          <h4>Dynamic School Calendar</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.25rem;">Adjusted in real-time by the Registrar Office.</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${calendar.map(item => `
              <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem;">
                <span class="badge ${item.type === 'exam' ? 'badge-danger' : item.type === 'holiday' ? 'badge-warning' : 'badge-info'}" style="width: 80px; justify-content: center;">${item.date}</span>
                <span style="color: var(--text-secondary);">${item.event}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Dormitory Allocation Card -->
      <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem; display: flex; gap: 1.5rem; align-items: center;">
        <div style="font-size: 2.5rem; color: var(--accent-primary);">
          <i class="fas fa-bed"></i>
        </div>
        <div>
          <h4 style="margin-bottom: 0.5rem;">Dormitory Allocation</h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 0;">
            Block: <strong>${currentStudent.dormBlock || 'Unassigned'}</strong> &nbsp;|&nbsp; 
            Room: <strong>${currentStudent.dormRoom || 'Unassigned'}</strong> &nbsp;|&nbsp; 
            Bed: <strong>${currentStudent.bedNumber || 'Unassigned'}</strong>
          </p>
        </div>
      </div>

      <!-- Notice Board -->
      <div class="glass-card" style="padding: 2rem;">
        <h4>Notice Board & Schedule Updates</h4>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">See updates posted by Registrar and School Principals.</p>
        <div id="notice-board-container" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Dynamically Loaded notices -->
        </div>
      </div>
    `;
    loadNotices();
  }

  else if (view === "basic-info") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 600px;">
        <h3>Update Basic Admission Information</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Update core details and save to submit registration changes.</p>
        <form id="student-basic-form">
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
            <img id="basic-img-preview" src="${currentStudent.photo || 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=120'}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            <div style="flex: 1; display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" id="basic-photo" class="form-control" value="${currentStudent.photo || ''}" placeholder="Paste URL or upload file..." style="flex: 1;">
              <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0; height: 38px;">
                <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
                <input type="file" id="basic-photo-file" accept="image/*" style="display: none;">
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Nationality</label>
            <input type="text" id="basic-nationality" class="form-control" value="${currentStudent.nationality || ''}" required>
          </div>
          <div class="form-group">
            <label>Telephone</label>
            <input type="text" id="basic-tel" class="form-control" value="${currentStudent.telephone || ''}" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="basic-email" class="form-control" value="${currentStudent.email || ''}" required>
          </div>
          <div class="form-group">
            <label>Date of Birth (Gregorian Calendar - G.C.)</label>
            <input type="date" id="basic-dob-gc" class="form-control" value="${currentStudent.dobGC || ''}" required>
          </div>
          <div class="form-group">
            <label>Date of Birth (Ethiopian Calendar - E.C.)</label>
            <input type="text" id="basic-dob-ec" class="form-control" placeholder="e.g. 1999-05-12" value="${currentStudent.dobEC || ''}" required>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 1.5rem;">Submit Details</button>
        </form>
      </div>
    `;

    document.getElementById("basic-photo").addEventListener("input", async (e) => {
      document.getElementById("basic-img-preview").src = e.target.value || "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=120";
    });

    document.getElementById("student-basic-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const updatedPhoto = document.getElementById("basic-photo").value;
      const nationality = document.getElementById("basic-nationality").value;
      const telephone = document.getElementById("basic-tel").value;
      const email = document.getElementById("basic-email").value;
      const dobGC = document.getElementById("basic-dob-gc").value;
      const dobEC = document.getElementById("basic-dob-ec").value;

      const users = await db.get("users");
      const updatedUsers = users.map(u => {
        if (u.id === currentStudent.id) {
          u.photo = updatedPhoto;
          u.nationality = nationality;
          u.telephone = telephone;
          u.email = email;
          u.dobGC = dobGC;
          u.dobEC = dobEC;
        }
        return u;
      });
      await db.set("users", updatedUsers);

      currentStudent.photo = updatedPhoto;
      currentStudent.nationality = nationality;
      currentStudent.telephone = telephone;
      currentStudent.email = email;
      currentStudent.dobGC = dobGC;
      currentStudent.dobEC = dobEC;
      localStorage.setItem("higa_current_user", JSON.stringify(currentStudent));

      // Reload sidebar user elements
      document.getElementById("sidebar-user-photo").src = updatedPhoto;

      alert("Basic registration details updated successfully!");
    });
  }

  else if (view === "full-profile") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 700px;">
        <h3>My Complete Profile Details</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Overview of personal details, mother info, high school records, and guardian info.</p>
        <div class="grid-2" style="font-size: 0.92rem;">
          <div>
            <h5 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Personal Details</h5>
            <p><strong>Full Name:</strong> ${currentStudent.name}</p>
            <p><strong>ID Number:</strong> ${currentStudent.id}</p>
            <p><strong>Gender:</strong> ${currentStudent.gender || 'Male'}</p>
            <p><strong>Email:</strong> ${currentStudent.email || 'N/A'}</p>
          </div>
          <div>
            <h5 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Family & Guardian Info</h5>
            <p><strong>Mother's Name:</strong> ${currentStudent.motherName || 'Tigist Demeke'}</p>
            <p><strong>Guardian's Name:</strong> ${currentStudent.guardianName || 'Ato Hailu Assefa'}</p>
            <p><strong>Guardian Phone:</strong> ${currentStudent.guardianPhone || '+251911998877'}</p>
          </div>
          <div style="grid-column: span 2;">
            <h5 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Academic Background</h5>
            <p><strong>Previous High School:</strong> ${currentStudent.highSchool || 'Higa Junior School'}</p>
            <p><strong>Class Section:</strong> ${currentStudent.classSection || 'Grade 9-A'}</p>
            <p><strong>Admitted Batch Year:</strong> ${currentStudent.batch || '2024'}</p>
          </div>
          <div style="grid-column: span 2;">
            <h5 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Dormitory Details</h5>
            <p><strong>Block:</strong> ${currentStudent.dormBlock || 'Unassigned'}</p>
            <p><strong>Room:</strong> ${currentStudent.dormRoom || 'Unassigned'}</p>
            <p><strong>Bed Number:</strong> ${currentStudent.bedNumber || 'Unassigned'}</p>
            <p><strong>Assigned Items:</strong> ${[
              currentStudent.hasMattress ? 'Mattress' : '',
              currentStudent.hasPillow ? 'Pillow' : '',
              currentStudent.hasBlanket ? 'Blanket' : ''
            ].filter(Boolean).join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    `;
  }

  else if (view === "cafe-menu") {
    const menu = await db.get("meal_menu") || [];
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h4>Weekly Cafeteria Menu</h4>
          <span class="badge badge-info">Latest Menu</span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Check the daily breakfast, lunch, and dinner plans updated by the Cafeteria Manager.</p>
        
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Day / Title</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              ${menu.length > 0 ? menu.map(m => `
                <tr>
                  <td><strong>${m.day}</strong></td>
                  <td>${m.breakfast}</td>
                  <td>${m.lunch}</td>
                  <td>${m.dinner}</td>
                </tr>
              `).join("") : '<tr><td colspan="4" style="text-align:center;">No menu available.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  else if (view === "placement") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 600px;">
        <h3>Section & Academics Placement</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Enter academic year and semester to query historical section placements and grades.</p>
        
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
          <input type="number" id="place-year" class="form-control" placeholder="Enter Year (e.g. 2024)" value="${currentStudent.placedYear || '2024'}" style="width: 150px;">
          <select id="place-semester" class="form-control" style="width: 180px;">
            <option value="1">Semester One</option>
            <option value="2">Semester Two</option>
          </select>
          <button class="btn-primary" id="btn-search-placement">Find Placement</button>
        </div>

        <div id="placement-result-card" style="display: none;" class="glass-card">
          <div style="padding: 1.5rem; background: var(--bg-tertiary); border-radius: var(--radius-md) var(--radius-md) 0 0;">
            <h5 style="margin: 0;">Placement Query Results</h5>
          </div>
          <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <p>Placed Section: <strong id="place-res-section">Grade 9-A</strong></p>
            <p>Semester Average Point: <strong id="place-res-avg">88.5%</strong></p>
            <p>Overall Class Rank: <strong id="place-res-rank">3rd</strong></p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-search-placement").addEventListener("click", async () => {
      const year = document.getElementById("place-year").value;
      const sem = document.getElementById("place-semester").value;

      if (year === currentStudent.placedYear && sem === currentStudent.placedSemester) {
        document.getElementById("place-res-section").innerText = currentStudent.placementSection || "Grade 9-A";
        document.getElementById("place-res-avg").innerText = currentStudent.placementAverage + "%" || "88.5%";
        document.getElementById("place-res-rank").innerText = currentStudent.placementRank + " Rank" || "3rd";
        document.getElementById("placement-result-card").style.display = "block";
      } else {
        alert("No placement recorded found for this year and semester combination.");
        document.getElementById("placement-result-card").style.display = "none";
      }
    });
  }

  else if (view === "registration") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <h3>Course Registration</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Select classes to complete your annual curriculum registration.</p>
        <div id="registration-checklist-area">
          <!-- Populated Dynamically -->
        </div>
        <button class="btn-primary" id="btn-submit-registration" style="margin-top: 1.5rem;">Register Courses</button>
      </div>
    `;
    loadRegistrationOptions();
  }

  else if (view === "grades") {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3>Official Academic Transcript</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">Consecutive grade report records semester-after-semester.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary" onclick="window.printStudentTranscript()"><i class="fas fa-print"></i> Print / PDF</button>
          <button class="btn-secondary" onclick="window.exportStudentTranscriptCSV()"><i class="fas fa-file-excel"></i> Export CSV</button>
          <button class="btn-secondary" onclick="window.exportStudentTranscriptWord()"><i class="fas fa-file-word"></i> Export Word</button>
        </div>
      </div>
      
      <div id="student-transcript-container">
        <!-- Rendered Dynamically Semester-after-Semester -->
      </div>

      <div class="glass-card" style="padding: 2rem; margin-top: 2rem;">
        <h3>Course Checklist Progress</h3>
        <div id="checklist-progress-bar" style="height: 10px; background: var(--bg-tertiary); border-radius: var(--radius-sm); overflow: hidden; margin-top: 1rem; margin-bottom: 1.5rem;">
          <div id="checklist-pct" style="height: 100%; background: var(--accent-primary); width: 0%;"></div>
        </div>
        <p id="checklist-summary" style="font-size: 0.9rem; color: var(--text-secondary);"></p>
      </div>
    `;
    loadStudentGrades();
  }

  else if (view === "calendar") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <h3>Academic Calendar</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Official school calendar events, schedules, exams, and holidays.</p>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Event Title / Description</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody id="student-calendar-table">
              <!-- Dynamically Loaded -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    const events = await db.get("calendar").sort((a, b) => new Date(a.date) - new Date(b.date));
    const tbody = document.getElementById("student-calendar-table");
    if (tbody) {
      if (events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-secondary);">No calendar events scheduled yet.</td></tr>`;
      } else {
        tbody.innerHTML = events.map(e => `
          <tr>
            <td><strong>${new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
            <td>${e.event}</td>
            <td><span class="badge badge-${e.type === 'holiday' ? 'warning' : (e.type === 'exam' ? 'danger' : 'info')}">${e.type.toUpperCase()}</span></td>
          </tr>
        `).join("");
      }
    }
  }

  else if (view === "instructors") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <h3>Assigned Instructors</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2.0rem;">Below are the profiles of teachers allocated to lead your courses this year.</p>
        <div class="grid-3" id="instructors-cards-container">
          <!-- Loaded Dynamically -->
        </div>
      </div>
    `;
    loadInstructors();
  }
}

async function loadNotices() {
  const container = document.getElementById("notice-board-container");
  if (!container) return;

  const announcements = await db.get("announcements").filter(a => a.target === "all" || a.target === "students");
  container.innerHTML = "";

  if (announcements.length === 0) {
    container.innerHTML = `<p style="color: var(--text-tertiary);">No notices posted.</p>`;
    return;
  }

  const nowStr = new Date().toISOString().split("T")[0];
  const activeAnn = announcements.filter(a => {
    const expiry = a.expiryDate || a.expiry_date || "2099-12-31";
    return expiry >= nowStr;
  });

  if (activeAnn.length === 0) {
    container.innerHTML = `<p style="color: var(--text-tertiary);">No active notices posted.</p>`;
    return;
  }

  activeAnn.forEach(async a => {
    container.innerHTML += `
      <div style="border-left: 4px solid var(--accent-primary); padding-left: 1rem; margin-bottom: 0.5rem;">
        <h5 style="margin-bottom: 0.2rem;">${a.title}</h5>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">${a.content}</p>
        <span style="font-size: 0.75rem; color: var(--text-tertiary); display: block; margin-top: 0.3rem;">Posted Date: ${a.date}</span>
      </div>
    `;
  });
}

async function loadRegistrationOptions() {
  const container = document.getElementById("registration-checklist-area");
  const courses = await db.get("courses");
  if (!container) return;

  const currentStudent = JSON.parse(localStorage.getItem("higa_current_user"));
  const registered = currentStudent.registeredCourses || [];

  const classStr = currentStudent.classSection || "";
  const match = classStr.match(/\d+/);
  const studentGrade = match ? parseInt(match[0]) : null;

  if (!studentGrade) {
    container.innerHTML = `<div class="badge badge-warning" style="width: 100%; padding: 1rem; font-size: 0.95rem;">You are currently not assigned to any class section. Please contact the Registrar Office.</div>`;
    const submitBtn = document.getElementById("btn-submit-registration");
    if (submitBtn) submitBtn.style.display = "none";
    return;
  }

  const classCourses = await db.get("class_courses") || [];
  const studentClassCourses = classCourses.filter(cc => cc.class_name === currentStudent.classSection);

  let filteredCourses = [];
  if (studentClassCourses.length > 0) {
    filteredCourses = courses.filter(c => studentClassCourses.some(cc => cc.course_code === c.code));
    filteredCourses = filteredCourses.map(c => {
      const assignment = studentClassCourses.find(cc => cc.course_code === c.code);
      return {
        ...c,
        semester: assignment ? assignment.semester : c.semester
      };
    });
  } else {
    filteredCourses = courses.filter(c => c.grade === studentGrade);
  }

  container.innerHTML = "";
  if (filteredCourses.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary);">No courses available for Grade ${studentGrade} registration at this time.</p>`;
    return;
  }

  let sem1Html = `<h5 style="color: var(--accent-primary); margin-top: 1rem; margin-bottom: 0.5rem;"><i class="fas fa-calendar-alt"></i> Semester 1 Offerings</h5>`;
  let sem2Html = `<h5 style="color: var(--accent-secondary); margin-top: 1.5rem; margin-bottom: 0.5rem;"><i class="fas fa-calendar-alt"></i> Semester 2 Offerings</h5>`;
  
  let sem1Count = 0;
  let sem2Count = 0;

  filteredCourses.forEach(c => {
    const isChecked = registered.includes(c.code) ? "checked" : "";
    const html = `
      <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
        <input type="checkbox" id="reg-${c.code}" class="registration-checkbox" value="${c.code}" ${isChecked} style="width: 18px; height: 18px; cursor: pointer;">
        <label for="reg-${c.code}" style="cursor: pointer; font-size: 0.95rem; margin-bottom: 0; display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
          <strong>${c.code}</strong> - ${c.name} (${c.credits} Credits)
        </label>
      </div>
    `;
    if (c.semester === 2) {
      sem2Html += html;
      sem2Count++;
    } else {
      sem1Html += html;
      sem1Count++;
    }
  });

  container.innerHTML = "";
  if (sem1Count > 0) container.innerHTML += sem1Html;
  if (sem2Count > 0) container.innerHTML += sem2Html;

  const submitBtn = document.getElementById("btn-submit-registration");
  if (submitBtn) {
    submitBtn.style.display = "inline-block";
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.replaceWith(newSubmitBtn);

    newSubmitBtn.addEventListener("click", async () => {
      const selected = [];
      document.querySelectorAll(".registration-checkbox").forEach(async chk => {
        if (chk.checked) selected.push(chk.value);
      });

      const users = await db.get("users");
      const updatedUsers = users.map(u => {
        if (u.id === currentStudent.id) {
          u.registeredCourses = selected;
        }
        return u;
      });
      await db.set("users", updatedUsers);

      currentStudent.registeredCourses = selected;
      localStorage.setItem("higa_current_user", JSON.stringify(currentStudent));

      alert(`Successfully registered for ${selected.length} courses online. Course registrations updated in database.`);
    });
  }
}

async function loadStudentGrades() {
  const localStudent = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!localStudent) return;

  // Always fetch latest student profile and compute live section ranks & averages
  const users = await db.get("users") || [];
  const courses = await db.get("courses") || [];
  const classCourses = await db.get("class_courses") || [];
  const allGrades = await db.get("grades") || [];

  let student = users.find(u => String(u.id) === String(localStudent.id)) || localStudent;

  if (window.calculateStudentAveragesAndRanks) {
    window.calculateStudentAveragesAndRanks(users, allGrades, courses, classCourses);
    student = users.find(u => String(u.id) === String(localStudent.id)) || student;
  }

  const container = document.getElementById("student-transcript-container");
  if (!container) return;

  container.innerHTML = "";

  // 1. Render Rank & Academic Standing Summary Card at the top of Grades view
  const rankSummaryCardHtml = `
    <div class="glass-card" style="padding: 1.75rem; margin-bottom: 2rem; border-left: 5px solid var(--accent-primary);">
      <h4 style="margin-bottom: 1rem; color: var(--accent-primary); display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-trophy" style="color: #f59e0b;"></i> Academic Standing & Section Rank Summary
      </h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
        <div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: var(--radius-sm);">
          <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">SEMESTER 1</span>
          <div style="font-size: 1.1rem; font-weight: bold; margin-top: 0.3rem;">
            Average: ${student.sem1_avg !== undefined && student.sem1_avg !== null ? student.sem1_avg + '%' : 'N/A'}
          </div>
          <div style="margin-top: 0.25rem;">
            ${student.sem1_rank ? `<span class="badge badge-info"><i class="fas fa-medal"></i> Section Rank ${student.sem1_rank}</span>` : '<span style="color:var(--text-tertiary); font-size: 0.85rem;">Rank Pending</span>'}
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: var(--radius-sm);">
          <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">SEMESTER 2</span>
          <div style="font-size: 1.1rem; font-weight: bold; margin-top: 0.3rem;">
            Average: ${student.sem2_avg !== undefined && student.sem2_avg !== null ? student.sem2_avg + '%' : 'N/A'}
          </div>
          <div style="margin-top: 0.25rem;">
            ${student.sem2_rank ? `<span class="badge badge-info"><i class="fas fa-medal"></i> Section Rank ${student.sem2_rank}</span>` : '<span style="color:var(--text-tertiary); font-size: 0.85rem;">Rank Pending</span>'}
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--accent-success);">
          <span style="font-size: 0.8rem; color: var(--accent-success); font-weight: bold;">YEARLY OVERALL</span>
          <div style="font-size: 1.1rem; font-weight: bold; margin-top: 0.3rem; color: var(--accent-success);">
            Average: ${student.yearly_avg !== undefined && student.yearly_avg !== null ? student.yearly_avg + '%' : 'N/A'}
          </div>
          <div style="margin-top: 0.25rem;">
            ${student.yearly_rank ? `<span class="badge badge-success"><i class="fas fa-trophy"></i> Yearly Rank ${student.yearly_rank}</span>` : '<span style="color:var(--text-tertiary); font-size: 0.85rem;">Rank Pending</span>'}
          </div>
        </div>
      </div>
    </div>
  `;

  // Flexible Student ID matching
  const stIds = [
    String(student.id || "").trim().toLowerCase(),
    String(student.studentId || "").trim().toLowerCase(),
    String(student.student_id || "").trim().toLowerCase(),
    String(student.username || "").trim().toLowerCase()
  ].filter(Boolean);

  const grades = allGrades.filter(g => {
    const gStudentId = String(g.student_id || "").trim().toLowerCase();
    const isMatchStudent = stIds.includes(gStudentId);
    const isApprovedOrReleased = !g.status || g.status === "released" || g.status === "approved" || g.status === "submitted";
    return isMatchStudent && isApprovedOrReleased;
  });

  if (grades.length === 0) {
    container.innerHTML = rankSummaryCardHtml + `
      <div class="glass-card" style="padding: 2rem; text-align: center; color: var(--text-secondary);">
        <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 0.75rem; color: var(--accent-primary);"></i>
        <p style="margin: 0;">No individual course grade details have been posted for your account yet.</p>
      </div>
    `;
    const summaryText = document.getElementById("checklist-summary");
    const progressBar = document.getElementById("checklist-pct");
    if (summaryText) summaryText.innerText = "Completed: 0 Course Requirements (0%)";
    if (progressBar) progressBar.style.width = "0%";
    return;
  }

  // Group by semesters
  const semesters = {};
  grades.forEach(g => {
    const sem = g.semester || 1;
    if (!semesters[sem]) semesters[sem] = [];
    semesters[sem].push(g);
  });

  let transcriptHtml = rankSummaryCardHtml;

  Object.entries(semesters).sort(([a], [b]) => parseInt(a) - parseInt(b)).forEach(([sem, list]) => {
    let semTotal = 0;
    let semCount = 0;

    const rows = list.map(g => {
      const cCode = g.course_code || g.course_id;
      const cDetails = courses.find(c => c.code === cCode) || {};
      const credits = cDetails.credits || 3;
      const scoreTotal = parseFloat(g.total) || (parseFloat(g.assessment_score || 0) + parseFloat(g.exam_score || 0));
      semTotal += scoreTotal;
      semCount++;

      return `
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
          <td style="padding: 0.6rem 0.75rem;"><strong>${cCode}</strong></td>
          <td style="padding: 0.6rem 0.75rem;">${cDetails.name || g.course_name || 'General Course'}</td>
          <td style="padding: 0.6rem 0.75rem;">${credits}</td>
          <td style="padding: 0.6rem 0.75rem;">${g.assessment_score !== undefined ? g.assessment_score : '-'}</td>
          <td style="padding: 0.6rem 0.75rem;">${g.exam_score !== undefined ? g.exam_score : '-'}</td>
          <td style="padding: 0.6rem 0.75rem; font-weight: 600; color: var(--accent-primary);">${scoreTotal}</td>
        </tr>
      `;
    }).join("");

    const semInt = parseInt(sem);
    const semAvg = semInt === 1 ? (student.sem1_avg !== undefined && student.sem1_avg !== null ? student.sem1_avg : (semCount > 0 ? (semTotal / semCount).toFixed(2) : "0.00")) : (student.sem2_avg !== undefined && student.sem2_avg !== null ? student.sem2_avg : (semCount > 0 ? (semTotal / semCount).toFixed(2) : "0.00"));
    const semRank = semInt === 1 ? student.sem1_rank : (semInt === 2 ? student.sem2_rank : null);
    const rankHtml = semRank ? `<span style="margin-left: 10px; padding: 0.2rem 0.5rem; background: var(--accent-success); color: white; border-radius: var(--radius-sm); font-size: 0.8rem;"><i class="fas fa-medal"></i> Section Rank: ${semRank}</span>` : '<span style="margin-left: 10px; padding: 0.2rem 0.5rem; background: var(--bg-tertiary); color: var(--text-tertiary); border-radius: var(--radius-sm); font-size: 0.8rem;">Rank Pending</span>';

    transcriptHtml += `
      <div class="glass-card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
        <h5 style="color: var(--accent-primary); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span><i class="fas fa-graduation-cap"></i> Semester ${sem} Grade Transcript</span>
          <span style="font-size: 0.88rem; color: var(--text-secondary);">Semester Average: <strong>${semAvg}%</strong> ${rankHtml}</span>
        </h5>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                <th style="padding: 0.5rem 0.75rem;">Course Code</th>
                <th style="padding: 0.5rem 0.75rem;">Course Name</th>
                <th style="padding: 0.5rem 0.75rem;">Credits</th>
                <th style="padding: 0.5rem 0.75rem;">Assessment</th>
                <th style="padding: 0.5rem 0.75rem;">Final Exam</th>
                <th style="padding: 0.5rem 0.75rem;">Total (100)</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  container.innerHTML = transcriptHtml;

  // Checklist updates
  const totalCoursesCount = 8;
  const completedCount = grades.length;
  const pct = Math.round((completedCount / totalCoursesCount) * 100);
  const progressBar = document.getElementById("checklist-pct");
  const summaryText = document.getElementById("checklist-summary");
  if (progressBar) progressBar.style.width = `${pct}%`;
  if (summaryText) summaryText.innerText = `Completed: ${completedCount} / ${totalCoursesCount} Course Requirements (${pct}%)`;
}

async function loadInstructors() {
  const student = JSON.parse(localStorage.getItem("higa_current_user"));
  const section = student.classSection || "";
  const allUsers = await db.get("users");
  
  // Requirement 1: Load academic instructors assigned to student's section
  const instructors = allUsers.filter(u => 
    (u.role === "Teacher" || u.role === "ChemistryLab" || u.role === "PhysicsLab" || u.role === "Drawing" || u.role === "IT_Technician") && 
    u.assignedSections && 
    u.assignedSections.includes(section)
  );

  const container = document.getElementById("instructors-cards-container");
  if (!container) return;

  container.innerHTML = "";
  if (instructors.length === 0) {
    container.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--text-secondary); padding: 2rem;">No instructors have been assigned to your section (${section}) yet.</div>`;
    return;
  }

  instructors.forEach(t => {
    const roleDisplay = t.role.replace(/([A-Z])/g, ' $1').trim();
    const sectionsText = t.assignedSections ? t.assignedSections.join(", ") : "None";
    container.innerHTML += `
      <div class="glass-card" style="padding: 1.5rem; text-align: center;">
        <img src="${t.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-primary); margin-bottom: 1rem;">
        <h5 style="margin-bottom: 0.25rem;">${t.name}</h5>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.2rem;">Role: <strong>${roleDisplay}</strong></p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Teaches: <strong>${t.assignedSubject || 'General'}</strong></p>
        <span class="badge badge-info" style="font-size: 0.75rem;">Assigned Section: ${sectionsText}</span>
      </div>
    `;
  });
}

// Curriculum left side drawer management
export async function toggleCurriculumDrawer(open) {
  const drawer = document.getElementById("student-curriculum-drawer");
  if (!drawer) return;

  if (open) {
    const tbody = document.getElementById("curriculum-drawer-body");
    const courses = await db.get("courses");
    const student = JSON.parse(localStorage.getItem("higa_current_user"));
    const registered = student.registeredCourses || [];

    const classStr = student.classSection || "";
    const match = classStr.match(/\d+/);
    const studentGrade = match ? parseInt(match[0]) : null;
    const filteredCourses = studentGrade ? courses.filter(c => c.grade === studentGrade) : [];

    if (tbody) {
      if (filteredCourses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--text-secondary);">No curriculum records for your grade level.</td></tr>`;
      } else {
        tbody.innerHTML = filteredCourses.map(c => {
          const isReg = registered.includes(c.code);
          const badge = isReg 
            ? `<span class="badge badge-success" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">Registered</span>` 
            : `<span class="badge badge-secondary" style="font-size: 0.75rem; padding: 0.2rem 0.5rem; opacity: 0.6;">Not Registered</span>`;
          return `
            <tr>
              <td><code>${c.code}</code></td>
              <td>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%;">
                  <span>${c.name}</span>
                  ${badge}
                </div>
              </td>
            </tr>
          `;
        }).join("");
      }
    }
    drawer.classList.add("open");
  } else {
    drawer.classList.remove("open");
  }
}

// Attach drawer trigger to window
window.closeCurriculumDrawer = () => toggleCurriculumDrawer(false);

window.printStudentTranscript = async () => {
  const student = JSON.parse(localStorage.getItem("higa_current_user"));
  const registered = student.registeredCourses || [];
  const grades = await db.get("grades").filter(g => g.student_id === student.id && g.status === "released" && registered.includes(g.course_id));
  const courses = await db.get("courses");

  let transcriptHtml = `
    <html>
      <head>
        <title>Student Transcript - ${student.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; color: #333; }
          .header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #333; padding-bottom: 1rem; }
          .sem-title { color: #4f46e5; margin-top: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .avg { text-align: right; font-weight: bold; margin-top: 0.5rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Higa Model Boarding School</h2>
          <h3>Official Student Academic Transcript</h3>
          <p><strong>Student Name:</strong> ${student.name} | <strong>ID:</strong> ${student.id}</p>
          <p><strong>Class Section:</strong> ${student.classSection || 'N/A'} | <strong>Batch:</strong> ${student.batch || 'N/A'}</p>
        </div>
  `;

  // Group by semesters
  const semesters = {};
  grades.forEach(g => {
    const sem = g.semester || 1;
    if (!semesters[sem]) semesters[sem] = [];
    semesters[sem].push(g);
  });

  Object.entries(semesters).sort(([a], [b]) => a - b).forEach(([sem, list]) => {
    let semTotal = 0;
    let semCount = 0;

    let rows = list.map(g => {
      const cDetails = courses.find(c => c.code === g.course_id) || {};
      semTotal += g.total;
      semCount++;
      return `
        <tr>
          <td><strong>${g.course_id}</strong></td>
          <td>${cDetails.name || 'General Course'}</td>
          <td>${cDetails.credits || 3}</td>
          <td>${g.assessment_score}</td>
          <td>${g.exam_score}</td>
          <td><strong>${g.total}</strong></td>
        </tr>
      `;
    }).join("");

    const semAvg = semCount > 0 ? (semTotal / semCount).toFixed(2) : "0.00";

    transcriptHtml += `
      <h3 class="sem-title">Semester ${sem} Grade Record</h3>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Assessment (30)</th>
            <th>Final Exam (70)</th>
            <th>Total (100)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p class="avg">Semester Average: ${semAvg}%</p>
    `;
  });

  transcriptHtml += `
      </body>
    </html>
  `;

  const printWin = window.open("", "_blank");
  printWin.document.write(transcriptHtml);
  printWin.document.close();
  printWin.print();
};

window.printStudentTranscript = async () => {
  const localStudent = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!localStudent) return;
  const users = await db.get("users") || [];
  const student = users.find(u => String(u.id) === String(localStudent.id)) || localStudent;
  const container = document.getElementById("student-transcript-container");
  if (!container) return;

  const printWin = window.open("", "_blank", "width=900,height=700");
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Academic Grade Report - ${student.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 25px; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #1e3a8a; font-size: 22px; }
        .header h3 { margin: 5px 0 0 0; color: #4b5563; font-size: 14px; font-weight: normal; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 13px; font-weight: bold; background: #f3f4f6; padding: 10px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
        th, td { border: 1px solid #9ca3af; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; color: #1f2937; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .badge { font-weight: bold; padding: 2px 6px; border-radius: 3px; }
        @media print {
          @page { size: auto; margin: 15mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HIGA MODEL BOARDING SCHOOL</h1>
        <h3>Official Student Academic Transcript & Grade Report</h3>
      </div>
      <div class="meta">
        <div>Student Name: <strong>${student.name}</strong> (${student.id})</div>
        <div>Class Section: <strong>${student.classSection || student.class_section || 'Unassigned'}</strong></div>
        <div>Date: <strong>${new Date().toLocaleDateString()}</strong></div>
      </div>
      ${container.innerHTML}
      <div style="margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
        <div>Registrar Signature: _______________________</div>
        <div>Principal Stamp & Seal: _______________________</div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
};

window.exportStudentTranscriptCSV = async () => {
  const localStudent = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!localStudent) return;
  const users = await db.get("users") || [];
  const student = users.find(u => String(u.id) === String(localStudent.id)) || localStudent;

  const stIds = [
    String(student.id || "").trim().toLowerCase(),
    String(student.studentId || "").trim().toLowerCase(),
    String(student.username || "").trim().toLowerCase()
  ].filter(Boolean);

  const allGrades = await db.get("grades") || [];
  const grades = allGrades.filter(g => stIds.includes(String(g.student_id || "").trim().toLowerCase()));

  if (grades.length === 0) {
    alert("No grade entries found to export.");
    return;
  }

  const courses = await db.get("courses") || [];
  let csv = `Higa Model Boarding School - Official Student Academic Transcript\n`;
  csv += `Student Name: ${student.name}, Student ID: ${student.id}, Class Section: ${student.classSection || 'Unassigned'}, Date: ${new Date().toLocaleDateString()}\n`;
  csv += `Semester 1 Avg: ${student.sem1_avg || 'N/A'}, Sem 1 Rank: ${student.sem1_rank || 'N/A'}, Semester 2 Avg: ${student.sem2_avg || 'N/A'}, Sem 2 Rank: ${student.sem2_rank || 'N/A'}, Yearly Avg: ${student.yearly_avg || 'N/A'}, Yearly Rank: ${student.yearly_rank || 'N/A'}\n\n`;

  csv += `"Semester","Course Code","Course Name","Credits","Assessment Score","Final Exam Score","Total Score","Status"\n`;
  grades.forEach(g => {
    const cCode = g.course_code || g.course_id;
    const cDetails = courses.find(c => c.code === cCode) || {};
    const total = parseFloat(g.total) || (parseFloat(g.assessment_score || 0) + parseFloat(g.exam_score || 0));
    csv += `"${g.semester || 1}","${cCode}","${cDetails.name || g.course_name || 'General Course'}","${cDetails.credits || 3}","${g.assessment_score || 0}","${g.exam_score || 0}","${total}","${g.status || 'approved'}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Student_Transcript_${student.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.exportStudentTranscriptWord = async () => {
  const localStudent = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!localStudent) return;
  const users = await db.get("users") || [];
  const student = users.find(u => String(u.id) === String(localStudent.id)) || localStudent;

  const container = document.getElementById("student-transcript-container");
  if (!container) return;

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Student Academic Transcript</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { color: #1e3a8a; text-align: center; }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; }
      </style>
    </head>
    <body>
      <h2>HIGA MODEL BOARDING SCHOOL</h2>
      <h3>Official Student Academic Transcript</h3>
      <p><b>Student:</b> ${student.name} (${student.id}) | <b>Section:</b> ${student.classSection || 'Unassigned'} | <b>Date:</b> ${new Date().toLocaleDateString()}</p>
      ${container.innerHTML}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `Student_Transcript_${student.id}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
