// js/auth.js
import { db } from './db.js';
import { app } from './app.js';

class Auth {
  constructor() {
    this.currentUser = null;
  }

  // Handle User Login
  async login(username, password) {
    const rawUsername = String(username || "").trim();
    const rawPassword = String(password || "").trim();

    if (!rawUsername || !rawPassword) {
      if (window.showBootstrapAlert) window.showBootstrapAlert("Please enter both Username / ID and Password.", "warning");
      else alert("Please enter both Username / ID and Password.");
      return;
    }

    // Always fetch fresh users list from database to ensure cross-device consistency
    const users = await db.get("users") || [];
    const cleanUsername = rawUsername.toLowerCase();

    // Match case-insensitively against username or ID
    const user = users.find(u => {
      const uName = u.username ? String(u.username).trim().toLowerCase() : "";
      const uId = u.id ? String(u.id).trim().toLowerCase() : "";
      return uName === cleanUsername || uId === cleanUsername;
    });

    if (!user) {
      if (window.showBootstrapAlert) window.showBootstrapAlert("Invalid ID / Username. Please try again.", "danger");
      else alert("Invalid ID / Username. Please try again.");
      return;
    }

    if (user.isActive === false || user.is_active === false) {
      if (window.showBootstrapAlert) window.showBootstrapAlert("This account is currently inactive/disabled. Please contact Main Registrar.", "warning");
      else alert("This account is currently inactive/disabled. Please contact the Main Registrar.");
      return;
    }

    const dbPassword = String(user.password || "").trim();
    const defaultPassword = String(user.defaultPassword || user.default_password || "").trim();

    // Check if password matches active password OR default password
    const isPassMatch = dbPassword === rawPassword || (defaultPassword && defaultPassword === rawPassword);

    if (!isPassMatch) {
      if (window.showBootstrapAlert) window.showBootstrapAlert("Incorrect password. Please try again or visit the Registrar.", "danger");
      else alert("Incorrect password. Please try again or visit the Registrar.");
      return;
    }

    this.currentUser = user;
    localStorage.setItem("higa_current_user", JSON.stringify(user));

    // Force default password reset if logging in with the default password or default password flag
    if (rawPassword === defaultPassword || (dbPassword && defaultPassword && dbPassword === defaultPassword)) {
      this.promptPasswordChange(user);
    } else {
      this.loadUserDashboard(user);
    }
  }

  // Handle Logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem("higa_current_user");
    app.routeTo("landing-page");
  }

  // Check if session exists on load
  async checkSession() {
    const savedUser = localStorage.getItem("higa_current_user");
    if (savedUser) {
      const cached = JSON.parse(savedUser);
      const users = await db.get("users");
      const user = users.find(u => u.id === cached.id);
      if (user) {
        if (user.isActive === false || user.is_active === false) {
          if (window.showBootstrapAlert) window.showBootstrapAlert("Your account has been deactivated. Logging out.", "warning");
          else alert("Your account has been deactivated. Logging out.");
          this.logout();
          return;
        }
        this.currentUser = user;
        localStorage.setItem("higa_current_user", JSON.stringify(user));
        this.loadUserDashboard(user);
      } else {
        this.logout();
      }
    }
  }

  promptPasswordChange(user) {
    // Show the custom modal and reset its inputs
    window.showPortalModal("password-reset-modal");
    document.getElementById("reset-new-password").value = "";
    document.getElementById("reset-confirm-password").value = "";

    // Cancel / Logout handler
    const cancelBtn = document.getElementById("btn-cancel-password-reset");
    cancelBtn.onclick = async () => {
      window.hidePortalModal("password-reset-modal");
      this.logout();
    };

    // Form submit handler
    const form = document.getElementById("password-reset-form");
    form.onsubmit = async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("reset-new-password").value.trim();
      const confirmPassword = document.getElementById("reset-confirm-password").value.trim();

      if (!newPassword || newPassword === user.defaultPassword) {
        alert("You must set a valid new password different from your default password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please verify.");
        return;
      }

      // Update password in DB universally
      user.password = newPassword;
      await db.updateUser(user);
      const users = await db.get("users");
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          u.password = newPassword;
        }
        return u;
      });
      await db.set("users", updatedUsers);

      // Update current session user
      this.currentUser = user;
      localStorage.setItem("higa_current_user", JSON.stringify(user));

      window.hidePortalModal("password-reset-modal");
      if (window.showBootstrapAlert) window.showBootstrapAlert("Password updated successfully! Welcome to your dashboard.", "success");
      else alert("Password updated successfully! Welcome to your dashboard.");
      this.loadUserDashboard(user);
    };
  }

  // Handle password reset request from user to Registrar
  async requestPasswordReset(username, notes) {
    if (!username) {
      alert("Please enter your User ID or Username.");
      return;
    }
    const users = await db.get("users");
    const user = users.find(u => u.username === username || u.id === username);
    if (!user) {
      alert("User ID / Username not found in the system. Please check your ID and try again.");
      return;
    }

    user.passwordResetRequested = true;
    user.resetRequestDate = new Date().toISOString();
    user.resetRequestNotes = notes || "Password reset requested by user.";

    await db.updateUser(user);
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, passwordResetRequested: true, resetRequestDate: user.resetRequestDate, resetRequestNotes: user.resetRequestNotes } : u);
    await db.set("users", updatedUsers);

    window.hidePortalModal("forgot-password-modal");
    if (window.showBootstrapAlert) {
      window.showBootstrapAlert("Password reset request sent to the Registrar successfully! The Registrar will process your request.", "success");
    } else {
      alert("Password reset request sent to the Registrar successfully! The Registrar will process your request.");
    }
  }

  // Toggle see / unsee password icon
  async togglePasswordVisibility(inputId, iconRef) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let icon = typeof iconRef === 'string' ? document.getElementById(iconRef) : iconRef;
    if (icon && (icon.tagName === 'BUTTON' || icon.classList.contains('password-toggle-btn'))) {
      icon = icon.querySelector('i') || icon;
    }
    if (!icon && typeof iconRef === 'string') {
      const btn = document.getElementById(iconRef);
      if (btn) icon = btn.querySelector('i') || btn;
    }

    if (input.type === "password") {
      input.type = "text";
      if (icon && icon.tagName === 'I') icon.className = "fas fa-eye-slash";
    } else {
      input.type = "password";
      if (icon && icon.tagName === 'I') icon.className = "fas fa-eye";
    }
  }

  // Render and activate the dashboard based on user role
  async loadUserDashboard(user) {
    const users = await db.get("users");
    const freshUser = users.find(u => u.id === user.id) || user;
    user = freshUser;
    
    localStorage.setItem("higa_current_user", JSON.stringify(user));

    app.routeTo("dashboard-page");
    
    // Set user profile in Topbar & Sidebar
    const sidePhoto = document.getElementById("sidebar-user-photo");
    const sideName = document.getElementById("sidebar-user-name");
    const sideRole = document.getElementById("sidebar-user-role");
    
    if (sidePhoto) sidePhoto.src = user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
    if (sideName) sideName.innerText = user.name;
    if (sideRole) {
      // Human-readable role formatting
      const displayRole = user.role.replace(/([A-Z])/g, ' $1').trim();
      sideRole.innerText = displayRole;
    }

    // Load custom navigation sidebar links & render dashboard content based on roles
    const sidebarNav = document.getElementById("sidebar-nav-list");
    if (!sidebarNav) return;

    sidebarNav.innerHTML = ""; // Clear existing links
    
    // Depending on the role, import and call its rendering routine
    let loadModule;
    switch (user.role) {
      case "MainRegistrar":
      case "AcademicRegistrar":
        loadModule = () => import('./dashboards/registrar.js');
        break;
      case "Student":
        loadModule = () => import('./dashboards/student.js');
        break;
      case "Teacher":
        loadModule = () => import('./dashboards/teacher.js');
        break;
      case "Principal":
      case "VicePrincipal":
        loadModule = () => import('./dashboards/principal.js');
        break;
      case "Manager":
      case "ViceManager":
        loadModule = () => import('./dashboards/manager.js');
        break;
      default:
        // Guardian, Librarian, Dormitory, BookStore, IT_Technician, ChemistryLab, PhysicsLab, Drawing, Cafeteria
        loadModule = () => import('./dashboards/staff.js');
        break;
    }

    try {
      const module = await loadModule();
      module.initDashboard(user);
    } catch (err) {
      console.error("Failed to load dashboard module", err);
    }
  }
}

export const auth = new Auth();
if (typeof window !== "undefined") {
  window.auth = auth;

  // Global bindings for HTML triggers
  window.submitLogin = (e) => {
    if (e) e.preventDefault();
    const userIn = document.getElementById("login-username").value;
    const passIn = document.getElementById("login-password").value;
    auth.login(userIn, passIn);
  };

  window.togglePasswordVisibility = (inputId, iconRef) => {
    auth.togglePasswordVisibility(inputId, iconRef);
  };

  window.toggleLoginPassword = () => {
    auth.togglePasswordVisibility("login-password", "login-password-icon");
  };

  window.submitPasswordResetRequest = (e) => {
    if (e) e.preventDefault();
    const username = document.getElementById("forgot-username").value.trim();
    const notes = document.getElementById("forgot-notes") ? document.getElementById("forgot-notes").value.trim() : "";
    auth.requestPasswordReset(username, notes);
  };
}
