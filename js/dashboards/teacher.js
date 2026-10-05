// js/dashboards/teacher.js
import { db } from '../db.js';

export function initDashboard(user) {
  renderSidebar();
  renderMainView("profile");
}

function renderSidebar() {
  const list = document.getElementById("sidebar-nav-list");
  if (!list) return;

  list.innerHTML = `
    <li class="active"><a href="#" id="side-profile"><i class="fas fa-user-circle"></i> Profile Info</a></li>
    <li><a href="#" id="side-assessments"><i class="fas fa-pencil-alt"></i> Create Assessments</a></li>
    <li><a href="#" id="side-grades"><i class="fas fa-file-invoice"></i> Post & Submit Grades</a></li>
    <li><a href="#" id="side-lessons"><i class="fas fa-file-upload"></i> Send Lesson Plans</a></li>
    <li><a href="#" id="side-attendance"><i class="fas fa-clipboard-check"></i> Class Attendance</a></li>
    <li><a href="#" id="side-calendar"><i class="fas fa-calendar-alt"></i> Academic Calendar</a></li>
  `;

  document.getElementById("side-profile").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-profile");
    renderMainView("profile");
  });
  document.getElementById("side-assessments").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-assessments");
    renderMainView("assessments");
  });
  document.getElementById("side-grades").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-grades");
    renderMainView("grades");
  });
  document.getElementById("side-lessons").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-lessons");
    renderMainView("lessons");
  });
  document.getElementById("side-attendance").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-attendance");
    renderMainView("attendance");
  });
  document.getElementById("side-calendar").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveLink("side-calendar");
    renderMainView("calendar");
  });
}

function setActiveLink(id) {
  document.querySelectorAll("#sidebar-nav-list li").forEach(li => li.classList.remove("active"));
  const link = document.getElementById(id);
  if (link) link.parentElement.classList.add("active");
}

function getTeacherCourses(teacher, allCourses) {
  if (!allCourses || allCourses.length === 0) return [];
  const assigned = teacher ? (teacher.assignedSubject || teacher.assigned_subject || "") : "";
  const registered = teacher ? (teacher.registeredCourses || teacher.registered_courses || []) : [];

  if (!assigned && registered.length === 0) {
    return allCourses;
  }

  const assignedLower = assigned.trim().toLowerCase();
  const matched = allCourses.filter(c => {
    const codeLower = c.code.toLowerCase();
    const nameLower = c.name.toLowerCase();

    if (assignedLower && codeLower === assignedLower) return true;
    if (assignedLower && (nameLower.includes(assignedLower) || assignedLower.includes(nameLower))) return true;
    if (registered.some(r => r.toLowerCase() === codeLower || r.toLowerCase() === nameLower)) return true;

    return false;
  });

  return matched.length > 0 ? matched : allCourses;
}

function getTeacherSections(teacher, allClasses) {
  const assigned = teacher ? (teacher.assignedSections || teacher.assigned_sections || []) : [];
  if (Array.isArray(assigned) && assigned.length > 0) {
    return assigned;
  }
  if (allClasses && allClasses.length > 0) {
    return allClasses.map(c => c.name);
  }
  return ["Grade 9-A", "Grade 9-B", "Grade 10-A", "Grade 10-B", "Grade 11-A", "Grade 11-B", "Grade 12-A", "Grade 12-B"];
}

async function renderMainView(view) {
  const container = document.getElementById("dashboard-main-content");
  if (!container) return;

  const currentTeacher = JSON.parse(localStorage.getItem("higa_current_user"));

  // Real-time security deactivation check (Requirement 8)
  const users = await db.get("users");
  const dbUser = users.find(u => u.id === currentTeacher.id);
  if (!dbUser || dbUser.isActive === false || dbUser.is_active === false) {
    alert("Session invalidated. Your account has been deactivated.");
    localStorage.removeItem("higa_current_user");
    window.location.reload();
    return;
  }

  if (view === "profile") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 600px;">
        <h3>Update Profile Information</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Modify your profile details and click submit to apply changes.</p>
        <form id="teacher-profile-form">
          <div class="form-group" style="text-align: center; margin-bottom: 2rem;">
            <img id="prof-img-preview" src="${currentTeacher.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-primary); margin-bottom: 1rem;">
            <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center; max-width: 450px; margin: 0 auto;">
              <input type="text" id="prof-photo" class="form-control" value="${currentTeacher.photo || ''}" placeholder="Paste URL or upload file..." style="flex: 1;">
              <label class="btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; margin-bottom: 0; height: 38px;">
                <i class="fas fa-upload" style="margin-right: 5px;"></i> Browse...
                <input type="file" id="prof-photo-file" accept="image/*" style="display: none;">
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="prof-name" class="form-control" value="${currentTeacher.name}" required>
          </div>
          <div class="form-group">
            <label>Assigned Subject</label>
            <input type="text" id="prof-subject" class="form-control" value="${currentTeacher.assignedSubject || 'Mathematics'}" readonly>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-check"></i> Save Profile Details</button>
        </form>
      </div>

      <div class="glass-card" style="padding: 2rem; max-width: 600px; margin-top: 2rem;">
        <h4><i class="fas fa-file-download"></i> Course Materials Shared by Principal</h4>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">Download outlines, reference guides, or worksheets shared by the Principal office.</p>
        <div id="teacher-materials-list-container">
          <!-- Loaded Dynamically -->
        </div>
      </div>
    `;

    const loadSharedMaterials = async () => {
      const listContainer = document.getElementById("teacher-materials-list-container");
      if (!listContainer) return;

      const materials = await db.get("course_materials") || [];
      const teacherMaterials = materials.filter(m => m.teacher_id === currentTeacher.id);

      if (teacherMaterials.length === 0) {
        listContainer.innerHTML = `<p style="color: var(--text-tertiary); font-style: italic;">No course materials shared by the Principal yet.</p>`;
        return;
      }

      listContainer.innerHTML = `
        <div class="table-responsive">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.8rem; color: var(--text-secondary);">
                <th style="padding: 0.5rem 0.75rem;">Material Details</th>
                <th style="padding: 0.5rem 0.75rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${teacherMaterials.map(m => `
                <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.88rem;">
                  <td style="padding: 0.5rem 0.75rem;">
                    <strong>${m.name}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-file"></i> ${m.file_name} (${new Date(m.uploaded_at).toLocaleDateString()})</span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem; text-align: right;">
                    <a href="${m.file_data}" download="${m.file_name}" class="btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.78rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem;">
                      <i class="fas fa-download"></i> Download
                    </a>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    };
    loadSharedMaterials();

    document.getElementById("prof-photo").addEventListener("input", async (e) => {
      document.getElementById("prof-img-preview").src = e.target.value || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
    });

    document.getElementById("teacher-profile-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const updatedName = document.getElementById("prof-name").value;
      const updatedPhoto = document.getElementById("prof-photo").value;

      const users = await db.get("users");
      const updatedUsers = users.map(u => {
        if (u.id === currentTeacher.id) {
          u.name = updatedName;
          u.photo = updatedPhoto;
        }
        return u;
      });
      await db.set("users", updatedUsers);

      currentTeacher.name = updatedName;
      currentTeacher.photo = updatedPhoto;
      localStorage.setItem("higa_current_user", JSON.stringify(currentTeacher));

      // Reload topbar info
      document.getElementById("sidebar-user-name").innerText = updatedName;
      document.getElementById("sidebar-user-photo").src = updatedPhoto;

      alert("Profile updated successfully!");
    });
  }

  else if (view === "assessments") {
    const allCourses = await db.get("courses") || [];
    const teacherCourses = getTeacherCourses(currentTeacher, allCourses);
    const allClasses = await db.get("classes") || [];
    const teacherSections = getTeacherSections(currentTeacher, allClasses);

    const courseOptionsHtml = teacherCourses.length > 0 
      ? teacherCourses.map(c => `<option value="${c.code}">${c.code} (${c.name})</option>`).join("")
      : `<option value="">No assigned courses found</option>`;

    const sectionOptionsHtml = teacherSections.length > 0
      ? teacherSections.map(s => `<option value="${s}">${s}</option>`).join("")
      : `<option value="">No assigned sections found</option>`;

    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
        <h3>Define Course Grading Scheme</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Create dynamic assessment types (e.g., Continuous Assessments, Quizzes, Lab Exercises) specifically for your course and assigned class section.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div class="form-group">
            <label>Course Code</label>
            <select id="scheme-course" class="form-control">
              ${courseOptionsHtml}
            </select>
          </div>
          <div class="form-group">
            <label>Class Section</label>
            <select id="scheme-section" class="form-control">
              ${sectionOptionsHtml}
            </select>
          </div>
        </div>
        <form id="grading-scheme-form">
          <div id="dynamic-scheme-components-list" style="margin-bottom: 1.5rem;">
             <!-- Rendered Dynamically -->
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="button" class="btn-secondary" id="btn-add-scheme-comp"><i class="fas fa-plus"></i> Add Component</button>
            <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Scheme</button>
          </div>
        </form>
      </div>
    `;

    const renderSchemeComponentsBuilder = async () => {
      const courseSelect = document.getElementById("scheme-course");
      const sectionSelect = document.getElementById("scheme-section");
      if (!courseSelect || !courseSelect.value) return;
      
      const courseCode = courseSelect.value;
      const classSection = sectionSelect ? sectionSelect.value : "";
      const container = document.getElementById("dynamic-scheme-components-list");
      if (!container) return;
      
      const schemes = await db.get("grading_schemes") || [];
      const schemeObj = schemes.find(s => 
        (s.id === `${courseCode}_${classSection}`) || 
        ((s.course_code === courseCode || s.course_id === courseCode) && (s.class_section === classSection || s.section === classSection)) ||
        (s.id === courseCode) ||
        (s.course_code === courseCode || s.course_id === courseCode)
      );
      const scheme = schemeObj ? schemeObj.components : [];
      
      container.innerHTML = "";
      if (!scheme || scheme.length === 0) {
        // Default example template
        addComponentToBuilder(container, "Continuous Assessment", 30);
        addComponentToBuilder(container, "Final Exam", 70);
      } else {
        scheme.forEach((c) => {
          addComponentToBuilder(container, c.name, c.max);
        });
      }
    };

    const addComponentToBuilder = (container, name = "", max = "") => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.gap = "1rem";
      div.style.marginBottom = "0.75rem";
      div.className = "scheme-builder-row";
      
      div.innerHTML = `
        <input type="text" class="form-control comp-name-input" placeholder="Assessment Type (e.g. Quiz)" value="${name}" required style="flex: 2;">
        <input type="number" class="form-control comp-max-input" placeholder="Max Limit" value="${max}" required style="flex: 1;" min="1" step="0.1">
        <button type="button" class="btn-icon-sm" style="color: var(--accent-danger);" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
      `;
      container.appendChild(div);
    };

    const schemeCourseEl = document.getElementById("scheme-course");
    const schemeSectionEl = document.getElementById("scheme-section");
    if (schemeCourseEl) schemeCourseEl.addEventListener("change", renderSchemeComponentsBuilder);
    if (schemeSectionEl) schemeSectionEl.addEventListener("change", renderSchemeComponentsBuilder);
    
    document.getElementById("btn-add-scheme-comp").addEventListener("click", async () => {
      addComponentToBuilder(document.getElementById("dynamic-scheme-components-list"));
    });

    renderSchemeComponentsBuilder();

    document.getElementById("grading-scheme-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const courseSelect = document.getElementById("scheme-course");
      const sectionSelect = document.getElementById("scheme-section");
      if (!courseSelect || !courseSelect.value || !sectionSelect || !sectionSelect.value) {
        alert("Please select a valid course and class section.");
        return;
      }
      const courseCode = courseSelect.value;
      const classSection = sectionSelect.value;
      const schemeId = `${courseCode}_${classSection}`;

      const rows = document.querySelectorAll(".scheme-builder-row");
      
      const components = [];
      let totalMax = 0;
      rows.forEach(row => {
        const name = row.querySelector(".comp-name-input").value.trim();
        const max = parseFloat(row.querySelector(".comp-max-input").value);
        if (name && !isNaN(max)) {
          components.push({ name, max });
          totalMax += max;
        }
      });
      
      if (components.length === 0) {
        alert("Please add at least one component.");
        return;
      }
      
      const schemes = await db.get("grading_schemes") || [];

      const schemeItem = {
        id: schemeId,
        course_code: courseCode,
        course_id: courseCode,
        class_section: classSection,
        section: classSection,
        components: components,
        teacher_id: currentTeacher ? currentTeacher.id : null
      };

      const index = schemes.findIndex(s => 
        s.id === schemeId || 
        ((s.course_code === courseCode || s.course_id === courseCode) && (s.class_section === classSection || s.section === classSection))
      );

      if (index > -1) {
        schemes[index] = schemeItem;
      } else {
        schemes.push(schemeItem);
      }
      
      await db.set("grading_schemes", schemes);
      alert(`Grading scheme for ${courseCode} (${classSection}) saved successfully! Total maximum marks: ${totalMax}`);
    });
  }

  else if (view === "grades") {
    const allCourses = await db.get("courses") || [];
    const teacherCourses = getTeacherCourses(currentTeacher, allCourses);
    const allClasses = await db.get("classes") || [];
    const teacherSections = getTeacherSections(currentTeacher, allClasses);
    const users = await db.get("users") || [];
    const allStudents = users.filter(u => u.role === "Student");

    const courseOptionsHtml = teacherCourses.length > 0 
      ? teacherCourses.map(c => `<option value="${c.code}">${c.code} (${c.name})</option>`).join("")
      : `<option value="">No assigned courses found</option>`;

    const sectionOptionsHtml = teacherSections.length > 0
      ? teacherSections.map(s => `<option value="${s}">${s}</option>`).join("")
      : `<option value="">No assigned sections found</option>`;

    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
        <h3>Post Grades (Semi-Annual basis)</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Select semester, section, course, and student. Assessment input fields automatically adapt to the specific scheme defined for that section.</p>
        
        <form id="grade-entry-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div class="form-group">
              <label>Semester</label>
              <select id="grade-semester" class="form-control">
                <option value="1">Semester One</option>
                <option value="2">Semester Two</option>
              </select>
            </div>
            <div class="form-group">
              <label>Class Section</label>
              <select id="grade-section" class="form-control">
                ${sectionOptionsHtml}
              </select>
            </div>
            <div class="form-group">
              <label>Course Code</label>
              <select id="grade-course" class="form-control">
                ${courseOptionsHtml}
              </select>
            </div>
            <div class="form-group">
              <label>Student</label>
              <select id="grade-student" class="form-control">
                <!-- Dynamically Filtered -->
              </select>
            </div>
          </div>

          <div id="dynamic-scheme-fields" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <!-- Rendered Dynamically -->
          </div>

          <button type="submit" class="btn-primary" style="min-width: 180px; height: 46px;"><i class="fas fa-plus"></i> Post Grade</button>
        </form>
      </div>

      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h4>Active Grades Table</h4>
          <button class="btn-secondary" id="btn-submit-grades"><i class="fas fa-paper-plane" style="color: var(--accent-primary);"></i> Submit Grades to Principal</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Assessment (Sum)</th>
                <th>Exam (Sum)</th>
                <th>Total</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="teacher-grades-body">
              <!-- Dynamically Filled -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    loadTeacherGrades();

    const filterStudentsBySection = () => {
      const sectionSelect = document.getElementById("grade-section");
      const studentSelect = document.getElementById("grade-student");
      if (!sectionSelect || !studentSelect) return;

      const selectedSection = sectionSelect.value;
      const sectionStudents = allStudents.filter(s => 
        !selectedSection || s.classSection === selectedSection || s.class_section === selectedSection
      );

      if (sectionStudents.length > 0) {
        studentSelect.innerHTML = sectionStudents.map(s => `<option value="${s.id}">${s.name} (${s.id}) - ${s.classSection || 'No Section'}</option>`).join("");
      } else {
        studentSelect.innerHTML = `<option value="">No students in ${selectedSection || 'section'}</option>`;
      }
    };

    const updateGradeEntryFields = async () => {
      const courseSelect = document.getElementById("grade-course");
      const sectionSelect = document.getElementById("grade-section");
      if (!courseSelect || !courseSelect.value) return;
      const courseCode = courseSelect.value;
      const classSection = sectionSelect ? sectionSelect.value : "";
      const container = document.getElementById("dynamic-scheme-fields");
      if (!container) return;

      const schemes = await db.get("grading_schemes") || [];
      const schemeObj = schemes.find(s => 
        (s.id === `${courseCode}_${classSection}`) ||
        (s.id === courseCode) ||
        ((s.course_code === courseCode || s.course_id === courseCode) && (s.class_section === classSection || s.section === classSection)) ||
        ((s.course_code === courseCode || s.course_id === courseCode) && s.teacher_id === currentTeacher.id) ||
        (s.course_code === courseCode || s.course_id === courseCode)
      );
      const scheme = schemeObj ? schemeObj.components : null;

      container.innerHTML = "";
      if (scheme && scheme.length > 0) {
        scheme.forEach(c => {
          container.innerHTML += `
            <div class="form-group">
              <label>${c.name} (Max ${c.max})</label>
              <input type="number" class="form-control scheme-component-input" data-name="${c.name}" data-max="${c.max}" min="0" max="${c.max}" required>
            </div>
          `;
        });
      } else {
        container.innerHTML = `
          <div class="form-group">
            <label>Assessment Mark (Max 30)</label>
            <input type="number" id="grade-ass" class="form-control" min="0" max="30" required>
          </div>
          <div class="form-group">
            <label>Final Exam (Max 70)</label>
            <input type="number" id="grade-exam" class="form-control" min="0" max="70" required>
          </div>
        `;
      }
    };

    const gradeCourseEl = document.getElementById("grade-course");
    const gradeSectionEl = document.getElementById("grade-section");

    if (gradeSectionEl) {
      gradeSectionEl.addEventListener("change", () => {
        filterStudentsBySection();
        updateGradeEntryFields();
      });
    }

    if (gradeCourseEl) {
      gradeCourseEl.addEventListener("change", updateGradeEntryFields);
    }

    filterStudentsBySection();
    updateGradeEntryFields();

    document.getElementById("grade-entry-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      postGrade();
    });

    document.getElementById("btn-submit-grades").addEventListener("click", async () => {
      submitGradesToPrincipal();
    });
  }

  else if (view === "lessons") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 600px;">
        <h3>Upload Lesson Plans</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2.0rem;">Submit your lesson plans for Semester One or Semester Two.</p>
        <form id="lesson-plan-form">
          <div class="form-group">
            <label>Semester</label>
            <select id="lesson-sem" class="form-control">
              <option value="1">Semester One</option>
              <option value="2">Semester Two</option>
            </select>
          </div>
          <div class="form-group">
            <label>Topic / Description</label>
            <input type="text" id="lesson-topic" class="form-control" placeholder="e.g. Chapter 3 - Quadratic Functions Outline" required>
          </div>
          <div class="form-group">
            <label>Select File Outline (Mock Upload)</label>
            <input type="file" class="form-control">
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 1rem;">Send Lesson Plan</button>
        </form>
      </div>
    `;

    document.getElementById("lesson-plan-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      alert(`Lesson plan for Semester ${document.getElementById("lesson-sem").value} on "${document.getElementById("lesson-topic").value}" has been submitted.`);
      document.getElementById("lesson-plan-form").reset();
    });
  }

  else if (view === "attendance") {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h3>Class Attendance Evaluator</h3>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Review and check off student daily records to dispatch to school principals.</p>
          </div>
          <button class="btn-primary" id="btn-export-attendance"><i class="fas fa-file-pdf"></i> Export PDF / Word Table</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Section</th>
                <th>Status (Today)</th>
                <th>Attendance Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>HIGA/Student/4001/2024</code></td>
                <td>Biruk Hailu</td>
                <td>Grade 9-A</td>
                <td>
                  <select class="form-control" style="width: 120px; padding: 0.25rem 0.5rem; height: auto;">
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
                <td>96% (32/33 Days)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("btn-export-attendance").addEventListener("click", async () => {
      alert("Attendance exported as PDF format and dispatched to the Principals Office.");
    });
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
            <tbody id="teacher-calendar-table">
              <!-- Dynamically Loaded -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    const events = await db.get("calendar").sort((a, b) => new Date(a.date) - new Date(b.date));
    const tbody = document.getElementById("teacher-calendar-table");
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
}

async function loadTeacherGrades() {
  const currentTeacher = JSON.parse(localStorage.getItem("higa_current_user"));
  if (!currentTeacher) return;

  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];
  const allCourses = await db.get("courses") || [];
  
  const teacherCourses = getTeacherCourses(currentTeacher, allCourses);
  const teacherCourseCodes = teacherCourses.map(c => (c.code || "").toLowerCase());
  const assignedSections = (currentTeacher.assignedSections || currentTeacher.assigned_sections || []).map(s => String(s).toLowerCase());
  const teacherIdStr = String(currentTeacher.id || "").toLowerCase();
  const teacherNameStr = String(currentTeacher.name || "").toLowerCase();

  const tbody = document.getElementById("teacher-grades-body");
  if (!tbody) return;

  // STRICT FILTER: Only show grades posted by THIS teacher or for THIS teacher's assigned section & course
  const filteredGrades = grades.filter(g => {
    if (!g) return false;
    const cCode = (g.course_id || g.course_code || "").toLowerCase();
    const gTeacherId = String(g.teacher_id || "").toLowerCase();
    const gTeacherName = String(g.teacher_name || "").toLowerCase();

    // 1. Primary Check: Matches teacher ID or teacher Name exactly
    if (gTeacherId && gTeacherId === teacherIdStr) return true;
    if (gTeacherName && gTeacherName === teacherNameStr) return true;

    // 2. Secondary Check for unassigned legacy grades: Match assigned course code AND student's assigned section
    if (!g.teacher_id && teacherCourseCodes.includes(cCode)) {
      const student = users.find(u => String(u.id).toLowerCase() === String(g.student_id).toLowerCase());
      if (student) {
        const studentSec = String(student.classSection || student.class_section || "").toLowerCase();
        if (assignedSections.length === 0 || assignedSections.includes(studentSec)) {
          return true;
        }
      }
    }

    return false;
  });

  tbody.innerHTML = "";
  if (filteredGrades.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-secondary); padding: 1rem;">No grade records posted yet. Enter student marks above and click "Post Grade".</td></tr>`;
    return;
  }

  filteredGrades.forEach(g => {
    const student = users.find(u => String(u.id) === String(g.student_id));
    const courseCode = g.course_id || g.course_code;
    const statusBadge = g.status === 'released' ? 'badge-success' 
      : g.status === 'approved' ? 'badge-success' 
      : g.status === 'submitted' ? 'badge-info' 
      : 'badge-warning';

    const updatedAtStr = g.updated_at 
      ? new Date(g.updated_at).toLocaleDateString() + ' ' + new Date(g.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : 'N/A';

    tbody.innerHTML += `
      <tr>
        <td>${student ? student.name : g.student_id}</td>
        <td><code>${courseCode}</code></td>
        <td>Semester ${g.semester}</td>
        <td>${g.assessment_score}</td>
        <td>${g.exam_score}</td>
        <td><strong>${g.total}</strong></td>
        <td>
          <span class="badge ${statusBadge}">
            ${(g.status || 'pending').toUpperCase()}
          </span>
          ${g.is_revision ? '<span class="badge badge-warning" style="margin-left: 3px;" title="Revised grade"><i class="fas fa-history"></i> Revised</span>' : ''}
        </td>
        <td style="font-size: 0.78rem; color: var(--text-secondary);">${updatedAtStr}</td>
        <td>
          <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.editTeacherGrade('${g.student_id}', '${courseCode}', '${g.semester}')">
            <i class="fas fa-edit"></i> Edit & Resend
          </button>
        </td>
      </tr>
    `;
  });
}

window.editTeacherGrade = async (studentId, courseCode, semester) => {
  const currentTeacher = JSON.parse(localStorage.getItem("higa_current_user"));
  const grades = await db.get("grades") || [];
  const semNum = parseInt(semester);

  const gradeIndex = grades.findIndex(g => 
    String(g.student_id).toLowerCase() === String(studentId).toLowerCase() &&
    (g.course_id === courseCode || g.course_code === courseCode) &&
    parseInt(g.semester) === semNum
  );

  if (gradeIndex === -1) {
    alert("Grade record not found.");
    return;
  }

  const g = grades[gradeIndex];
  const users = await db.get("users") || [];
  const student = users.find(u => String(u.id) === String(studentId)) || { name: studentId };

  // Populate dedicated modal form
  document.getElementById("edit-grade-student-id").value = studentId;
  document.getElementById("edit-grade-course-code").value = courseCode;
  document.getElementById("edit-grade-semester").value = semNum;

  document.getElementById("edit-grade-student-name").value = `${student.name} (${studentId})`;
  document.getElementById("edit-grade-course-display").value = courseCode;
  document.getElementById("edit-grade-semester-display").value = `Semester ${semNum}`;

  document.getElementById("edit-grade-ass-score").value = g.assessment_score;
  document.getElementById("edit-grade-exam-score").value = g.exam_score;
  document.getElementById("edit-grade-reason").value = "";

  window.showPortalModal("edit-grade-modal");
};

window.saveEditedTeacherGrade = async (e) => {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }

  const studentId = document.getElementById("edit-grade-student-id").value;
  const courseCode = document.getElementById("edit-grade-course-code").value;
  const semester = parseInt(document.getElementById("edit-grade-semester").value);

  const assScoreInput = document.getElementById("edit-grade-ass-score");
  const examScoreInput = document.getElementById("edit-grade-exam-score");

  const assScore = parseFloat(assScoreInput.value) || 0;
  const examScore = parseFloat(examScoreInput.value) || 0;
  const reason = document.getElementById("edit-grade-reason").value.trim();

  if (isNaN(assScore) || assScore < 0 || assScore > 30) {
    alert("Invalid Assessment Score! Must be a number between 0 and 30.");
    return;
  }
  if (isNaN(examScore) || examScore < 0 || examScore > 70) {
    alert("Invalid Final Exam Score! Must be a number between 0 and 70.");
    return;
  }

  const currentTeacher = JSON.parse(localStorage.getItem("higa_current_user"));
  const grades = await db.get("grades") || [];
  const users = await db.get("users") || [];

  const gradeIndex = grades.findIndex(g => 
    String(g.student_id).toLowerCase() === String(studentId).toLowerCase() &&
    (g.course_id === courseCode || g.course_code === courseCode) &&
    parseInt(g.semester) === semester
  );

  if (gradeIndex === -1) {
    alert("Error: Grade entry not found.");
    return;
  }

  const g = grades[gradeIndex];
  const updatedGrade = {
    ...g,
    assessment_score: assScore,
    exam_score: examScore,
    total: assScore + examScore,
    status: "submitted",
    updated_at: new Date().toISOString(),
    is_revision: true,
    revision_reason: reason || "Corrected mark entry error",
    revision_count: (g.revision_count || 0) + 1,
    teacher_id: currentTeacher ? String(currentTeacher.id) : g.teacher_id,
    teacher_name: currentTeacher ? currentTeacher.name : g.teacher_name
  };

  grades[gradeIndex] = updatedGrade;
  await db.set("grades", grades);

  // Recalculate ranks & averages across portal immediately
  if (window.calculateStudentAveragesAndRanks) {
    const courses = await db.get("courses") || [];
    const classCourses = await db.get("class_courses") || [];
    window.calculateStudentAveragesAndRanks(users, grades, courses, classCourses);
  }

  window.hidePortalModal("edit-grade-modal");
  alert(`Revised grade (${updatedGrade.total}%) saved and submitted to Principal for approval!`);
  loadTeacherGrades();
};

async function postGrade() {
  const currentTeacher = JSON.parse(localStorage.getItem("higa_current_user"));
  const semester = parseInt(document.getElementById("grade-semester").value);
  const course = document.getElementById("grade-course") ? document.getElementById("grade-course").value : "";
  const section = document.getElementById("grade-section") ? document.getElementById("grade-section").value : "";
  const student_id = document.getElementById("grade-student") ? document.getElementById("grade-student").value : "";

  if (!course) {
    alert("Please select a course.");
    return;
  }
  if (!student_id) {
    alert("Please select a student.");
    return;
  }

  const schemes = await db.get("grading_schemes") || [];
  const schemeObj = schemes.find(s => 
    (s.id === `${course}_${section}`) || 
    (s.id === course) ||
    ((s.course_code === course || s.course_id === course) && (s.class_section === section || s.section === section)) ||
    ((s.course_code === course || s.course_id === course) && s.teacher_id === currentTeacher.id) ||
    (s.course_code === course || s.course_id === course)
  );
  const scheme = schemeObj ? schemeObj.components : null;

  let ass = 0;
  let exam = 0;
  const breakdown = {};

  if (scheme && scheme.length > 0) {
    const inputs = document.querySelectorAll(".scheme-component-input");
    inputs.forEach(input => {
      const name = input.getAttribute("data-name");
      const val = parseFloat(input.value) || 0;
      breakdown[name] = val;
      
      const nameLower = name.toLowerCase();
      if (nameLower.includes("final") || nameLower.includes("exam")) {
        exam += val;
      } else {
        ass += val;
      }
    });
  } else {
    ass = parseFloat(document.getElementById("grade-ass").value) || 0;
    exam = parseFloat(document.getElementById("grade-exam").value) || 0;
  }

  const total = ass + exam;
  const grades = await db.get("grades") || [];
  const existingIndex = grades.findIndex(g => String(g.student_id) === String(student_id) && (g.course_id === course || g.course_code === course) && parseInt(g.semester) === semester);

  const gradeItem = {
    student_id,
    course_id: course,
    course_code: course,
    semester,
    assessment_score: ass,
    exam_score: exam,
    total,
    status: "pending",
    breakdown,
    updated_at: new Date().toISOString(),
    teacher_id: currentTeacher ? String(currentTeacher.id) : null,
    teacher_name: currentTeacher ? currentTeacher.name : null
  };

  if (existingIndex > -1) {
    grades[existingIndex] = gradeItem;
  } else {
    grades.push(gradeItem);
  }

  await db.set("grades", grades);
  alert("Grade saved to system draft! Click 'Submit Grades to Principal' to send them to the principal.");
  loadTeacherGrades();
  document.getElementById("grade-entry-form").reset();
  
  const courseSelect = document.getElementById("grade-course");
  if (courseSelect) {
    const event = new Event("change");
    courseSelect.dispatchEvent(event);
  }
}

async function submitGradesToPrincipal() {
  const currentTeacher = JSON.parse(localStorage.getItem("higa_current_user"));
  const grades = await db.get("grades") || [];
  const allCourses = await db.get("courses") || [];
  const teacherCourses = getTeacherCourses(currentTeacher, allCourses);
  const teacherCourseCodes = teacherCourses.map(c => (c.code || "").toLowerCase());

  let modified = false;
  const updated = grades.map(g => {
    const cCode = (g.course_id || g.course_code || "").toLowerCase();
    const isMyGrade = currentTeacher && (
      String(g.teacher_id) === String(currentTeacher.id) ||
      (g.teacher_name && g.teacher_name.toLowerCase() === currentTeacher.name.toLowerCase()) ||
      (teacherCourseCodes.length > 0 && teacherCourseCodes.includes(cCode))
    );

    if (isMyGrade && (g.status === "pending" || !g.status)) {
      g.status = "submitted";
      modified = true;
    }
    return g;
  });

  if (!modified) {
    alert("No pending grade reports found to submit.");
    return;
  }

  await db.set("grades", updated);
  alert("Grade reports successfully dispatched to the Principal!");
  loadTeacherGrades();
}
