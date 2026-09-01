let currentCaptchaId = null;

async function loadCaptcha() {
  const res = await apiCall('getCaptcha', {});
  currentCaptchaId = res.captchaId;
  document.getElementById('captchaQuestion').textContent = res.question;
  document.getElementById('captchaAnswer').value = '';
}

function showMsg(text, type) {
  document.getElementById('msgBox').innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // if already logged in, skip straight to dashboard
  if (localStorage.getItem('emcor_token')) {
    window.location.href = 'dashboard.html';
    return;
  }
  loadCaptcha();

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'CHECKING...';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const captchaAnswer = document.getElementById('captchaAnswer').value.trim();

    const res = await apiCall('login', {
      username, password,
      captchaId: currentCaptchaId,
      captchaAnswer
    });

    btn.disabled = false;
    btn.textContent = 'LOGIN';

    if (res.error) {
      const messages = {
        invalid_credentials: 'Incorrect username or password.',
        invalid_captcha: 'Captcha answer is incorrect.',
        account_locked: 'Account temporarily locked due to failed attempts. Try again later.',
        account_inactive: 'This account has been deactivated.'
      };
      showMsg(messages[res.error] || 'Login failed. Please try again.', 'error');
      loadCaptcha();
      return;
    }

    if (res.status === 'otp_required') {
      sessionStorage.setItem('emcor_pending_userid', res.userId);
      window.location.href = '2fa.html';
    }
  });
});
