// Guard for protected pages - redirect to login if no valid-looking session.
function requireLogin() {
  const token = localStorage.getItem('emcor_token');
  if (!token) {
    window.location.href = 'index.html';
    return null;
  }
  return {
    token: token,
    role: localStorage.getItem('emcor_role'),
    username: localStorage.getItem('emcor_username')
  };
}

function requireAdmin(user) {
  if (user.role !== 'admin') {
    alert('Administrator access only.');
    window.location.href = 'dashboard.html';
  }
}

async function doLogout() {
  await apiCall('logout', {});
  localStorage.removeItem('emcor_token');
  localStorage.removeItem('emcor_role');
  localStorage.removeItem('emcor_username');
  window.location.href = 'index.html';
}
