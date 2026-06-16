const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    verifyToken();
  }

  // Event listeners
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('uploadForm').addEventListener('submit', handleUpload);
  document.getElementById('navHome').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthSection();
  });
  document.getElementById('navLogout').addEventListener('click', handleLogout);
  document.getElementById('navDocs').addEventListener('click', (e) => {
    e.preventDefault();
    if (authToken) showDashboard();
  });
});

// Toggle between login and register forms
function toggleForms() {
  document.getElementById('loginForm').classList.toggle('active');
  document.getElementById('registerForm').classList.toggle('active');
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      showAlert('Login successful!', 'success');
      showDashboard();
      loadDocuments();
    } else {
      showAlert(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    showAlert('Error: ' + error.message, 'error');
  }
}

// Handle Register
async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Registration successful! Please login.', 'success');
      toggleForms();
      document.getElementById('loginEmail').value = email;
      document.getElementById('registerForm').reset();
    } else {
      showAlert(data.error || 'Registration failed', 'error');
    }
  } catch (error) {
    showAlert('Error: ' + error.message, 'error');
  }
}

// Handle Upload
async function handleUpload(e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    showAlert('Please select a file', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('document', file);

  try {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Document uploaded successfully!', 'success');
      fileInput.value = '';
      loadDocuments();
    } else {
      showAlert(data.error || 'Upload failed', 'error');
    }
  } catch (error) {
    showAlert('Error: ' + error.message, 'error');
  }
}

// Load Documents
async function loadDocuments() {
  if (!authToken) return;

  try {
    const response = await fetch(`${API_URL}/documents`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();

    if (response.ok) {
      displayDocuments(data.documents);
    } else {
      showAlert(data.error || 'Failed to load documents', 'error');
    }
  } catch (error) {
    showAlert('Error: ' + error.message, 'error');
  }
}

// Display Documents
function displayDocuments(documents) {
  const list = document.getElementById('documentsList');

  if (documents.length === 0) {
    list.innerHTML = '<p class="empty-state">No documents yet. Upload one to get started.</p>';
    return;
  }

  list.innerHTML = documents.map(doc => `
    <div class="document-card">
      <h4>📄 ${doc.fileName}</h4>
      <div class="document-info">
        <p>Size: ${(doc.fileSize / 1024).toFixed(2)} KB</p>
        <p>Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}</p>
      </div>
      <div class="document-actions">
        <button class="btn btn-secondary" onclick="downloadDocument('${doc.id}')">Download</button>
        <button class="btn btn-danger" onclick="deleteDocument('${doc.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Delete Document
async function deleteDocument(docId) {
  if (!confirm('Are you sure you want to delete this document?')) return;

  try {
    const response = await fetch(`${API_URL}/documents/${docId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      showAlert('Document deleted successfully', 'success');
      loadDocuments();
    } else {
      showAlert('Failed to delete document', 'error');
    }
  } catch (error) {
    showAlert('Error: ' + error.message, 'error');
  }
}

// Download Document (placeholder)
function downloadDocument(docId) {
  showAlert('Download feature coming soon!', 'info');
}

// Verify Token
async function verifyToken() {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      showDashboard();
      loadDocuments();
    } else {
      logout();
    }
  } catch (error) {
    logout();
  }
}

// Show Dashboard
function showDashboard() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'block';
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.email || 'User';
  }
}

// Show Auth Section
function showAuthSection() {
  if (!authToken) {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
  }
}

// Handle Logout
function handleLogout(e) {
  e.preventDefault();
  logout();
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  showAuthSection();
  document.getElementById('loginForm').reset();
  document.getElementById('registerForm').reset();
  showAlert('Logged out successfully', 'success');
}

// Show Alert
function showAlert(message, type = 'info') {
  const alertBox = document.getElementById('alertBox');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alertBox.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}
