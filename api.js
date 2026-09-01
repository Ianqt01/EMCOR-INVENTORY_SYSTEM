// ====== SET THIS AFTER YOU DEPLOY THE APPS SCRIPT WEB APP ======
const API_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
// e.g. "https://script.google.com/macros/s/AKfycb.../exec"

async function apiCall(action, payload = {}) {
  const token = localStorage.getItem('emcor_token');
  const body = JSON.stringify(Object.assign({ action, token }, payload));

  const res = await fetch(API_URL, {
    method: 'POST',
    // text/plain avoids a CORS preflight (OPTIONS) request, which Apps Script can't handle.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: body
  });

  const data = await res.json();

  if (data.error === 'invalid_session') {
    localStorage.removeItem('emcor_token');
    localStorage.removeItem('emcor_role');
    localStorage.removeItem('emcor_username');
    window.location.href = 'index.html';
  }
  return data;
}
