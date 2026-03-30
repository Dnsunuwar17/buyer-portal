if (localStorage.getItem('token')) window.location.href = '/dashboard.html';

function showTab(tab) {
  const isLogin = tab === 'login';

  // Form switch case
  document.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
  document.getElementById('register-form').style.display = isLogin ? 'none' : 'block';

  // button styles switch case
  document.getElementById('tab-login').style.background = isLogin ? '#4f46e5' : '#f1f5f9';
  document.getElementById('tab-login').style.color = isLogin ? 'white' : '#333';
  document.getElementById('tab-register').style.background = isLogin ? '#f1f5f9' : '#4f46e5';
  document.getElementById('tab-register').style.color = isLogin ? '#333' : 'white';

  // Form title switch case
  document.getElementById('page-heading').textContent = isLogin
    ? 'Welcome back'
    : 'Create an account';

  // Value and error reset
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('reg-name').value = '';
  document.getElementById('reg-email').value = '';
  document.getElementById('reg-password').value = '';
  document.getElementById('login-error').textContent = '';
  document.getElementById('register-error').textContent = '';
}

// event listeners for buttons operating the tabs
document.getElementById('tab-login').addEventListener('click', () => showTab('login'));
document.getElementById('tab-register').addEventListener('click', () => showTab('register'));

// Login form handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');
  errorEl.textContent = '';

  // Form submitted state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Loading Please wait...';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'Login failed.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Log in';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('role', data.role);
    window.location.href = '/dashboard.html';

  } catch (err) {
    errorEl.textContent = 'Could not connect to server.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log in';
  }
});

// Register form handler
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('register-error');
  const submitBtn = document.getElementById('register-submit');
  errorEl.textContent = '';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Loading Please wait...';

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      const msg = data.errors ? data.errors[0].msg : data.error;
      errorEl.textContent = msg || 'Registration failed.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create account';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('role', data.role);
    window.location.href = '/dashboard.html';

  } catch (err) {
    errorEl.textContent = 'Could not connect to server.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create account';
  }
});