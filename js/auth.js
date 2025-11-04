document.addEventListener("DOMContentLoaded", () => {
  // === LOGIN VALIDATION ===
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!email || !password) {
        showError(loginError, "Please fill in all fields.");
        return;
      }

      if (!validateEmail(email)) {
        showError(loginError, "Invalid email format.");
        return;
      }

      if (password.length < 6) {
        showError(loginError, "Password must be at least 6 characters long.");
        return;
      }

      showError(loginError, "", false);
      alert("Login successful (demo mode)");
      loginForm.reset();
    });
  }

  // === REGISTER VALIDATION ===
  const registerForm = document.getElementById("register-form");
  const registerError = document.getElementById("register-error");

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const confirm = document.getElementById("reg-confirm").value.trim();

      if (!name || !email || !password || !confirm) {
        showError(registerError, "Please fill in all fields.");
        return;
      }

      if (!validateEmail(email)) {
        showError(registerError, "Invalid email address.");
        return;
      }

      if (password.length < 6) {
        showError(registerError, "Password must be at least 6 characters.");
        return;
      }

      if (password !== confirm) {
        showError(registerError, "Passwords do not match.");
        return;
      }

      showError(registerError, "", false);
      alert("Registration successful (demo mode)");
      registerForm.reset();
    });
  }

  // === HELPERS ===
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(el, msg, show = true) {
    el.style.display = show ? "block" : "none";
    el.textContent = msg;
  }
});
