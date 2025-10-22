// auth.js — login/register modal + client validation
document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('authModal');
  const openLogin = document.getElementById('openLogin');
  const closeAuth = document.getElementById('closeAuth');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const authMsg = document.getElementById('authMsg');

  function showModal(show) {
    authModal.setAttribute('aria-hidden', String(!show));
  }

  openLogin.addEventListener('click', () => showModal(true));
  closeAuth.addEventListener('click', () => showModal(false));
  authModal.addEventListener('click', (e) => { if(e.target === authModal) showModal(false); });

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });
  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  // Basic JS validation + simulated async submit
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(formLogin);
    const payload = Object.fromEntries(fd.entries());
    // simple validation
    if(!payload.email || !payload.password) { authMsg.textContent = 'Fill all fields'; return; }
    authMsg.textContent = 'Logging in...';
    fakePost('/auth/login', payload).then(() => {
      authMsg.textContent = 'Logged in (demo).';
      setTimeout(() => showModal(false), 700);
    }).catch(() => authMsg.textContent = 'Login failed');
  });

  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(formRegister);
    const payload = Object.fromEntries(fd.entries());
    if(!payload.name || !payload.email || !payload.password || !payload.confirm) { authMsg.textContent = 'Fill all fields'; return; }
    if(payload.password.length < 6) { authMsg.textContent = 'Password min 6 chars'; return; }
    if(payload.password !== payload.confirm) { authMsg.textContent = 'Passwords do not match'; return; }
    authMsg.textContent = 'Registering...';
    fakePost('/auth/register', payload).then(() => {
      authMsg.textContent = 'Registered (demo). You can login now.';
      tabLogin.click();
    }).catch(() => authMsg.textContent = 'Register failed');
  });

  function fakePost(url, payload) {
    return new Promise((resolve) => {
      console.log('FAKE POST', url, payload);
      setTimeout(resolve, 600);
    });
  }
});
