// ========================================================================= //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBLfX6feh4cRVTxHXxlX6Rk932ekQWnuA",
  authDomain: "skillswap-fc17b.firebaseapp.com",
  projectId: "skillswap-fc17b",
  storageBucket: "skillswap-fc17b.firebasestorage.app",
  messagingSenderId: "697849253640",
  appId: "1:697849253640:web:3b7e2886b6c8623c5aa6bd",
  measurementId: "G-LDY6RG9VN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("Firebase Connected");

// SkillSwap Dynamic Client Application Script                               //
// ========================================================================= //

// --------------------------------------------------------- //
// 1. Initial State & Context Dataset                        //
// --------------------------------------------------------- //

let currentUser = {
  name: [],
  email: "jagaa.swap@skillswap.org",
  experience: "5+ Years in Creative Design & UI/UX",
  bio: "Passionate UI developer matching digital graphics, prototyping, and brand animations. Eager to swapping programming logic with language learning or piano classes!",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  rating: 4.8,
  skillsOffered: ["UI/UX Design", "Figma", "HTML/CSS", "Wireframing"],
  skillsWanted: ["French Speaking", "React.js", "Video Editing", "Piano Playing"],
  matchesCount: 3
};

const recommendedUsers = [
  {
    id: 1,
    name: "Elena Vance",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    experience: "Native Speaker",
    rating: 4.9,
    bio: "Native French speaker based in Boston. Looking to learn web design layouts and spacing grids to design a custom cooking blog.",
    offered: ["French Speaking", "Spanish Translation"],
    wanted: ["UI/UX Design", "Figma Prototyping"]
  },
  {
    id: 2,
    name: "Marcus Miller",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
    experience: "3+ Years Web Dev",
    rating: 4.7,
    bio: "Fullstack developer interested in improving visual styling and polished design interfaces. Let's swap frontend development training for wireframes!.",
    offered: ["React.js", "Node.js Developer"],
    wanted: ["HTML/CSS", "Wireframing"]
  },
  {
    id: 3,
    name: "Chloe Zhao",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
    experience: "Film Editor & Producer",
    rating: 5.0,
    bio: "Indie filmmaker swapping production tricks and colour grading tips for translation help and UI mockup grids.",
    offered: ["Video Editing", "DaVinci Resolve"],
    wanted: ["UI/UX Design", "French Speaking"]
  },
  {
    id: 4,
    name: "Raj Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    experience: "10+ Years Musician",
    rating: 4.9,
    bio: "Classically trained pianist hoping to build a web page portfolio. Happy to teach harmonies, scales, and song sheets.",
    offered: ["Piano Playing", "Music Theory"],
    wanted: ["React.js", "Figma"]
  }
];

let notifications = [
  { id: 1, text: "Elena Vance accepted your match request for French tutoring!", time: "5 mins ago" },
  { id: 2, text: "Marcus Miller liked your Figma configuration portfolio.", time: "1 hour ago" }
];

let bookingSessions = [
  {
    id: 101,
    partnerName: "Elena Vance",
    partnerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    skill: "French Speaking & Conversation",
    date: "2026-07-26",
    time: "10:30 AM",
    duration: "60 mins",
    platform: "Zoom Meeting",
    notes: "Focus on conversational phrases and grammar basics.",
    status: "confirmed"
  },
  {
    id: 102,
    partnerName: "Marcus Miller",
    partnerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
    skill: "React Hooks & Architecture",
    date: "2026-07-28",
    time: "02:00 PM",
    duration: "60 mins",
    platform: "Google Meet",
    notes: "Swapping wireframe layout reviews for React state practice.",
    status: "confirmed"
  },
  {
    id: 103,
    partnerName: "Chloe Zhao",
    partnerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
    skill: "Video Editing & Transitions",
    date: "2026-07-20",
    time: "04:30 PM",
    duration: "90 mins",
    platform: "Zoom Meeting",
    notes: "Learned DaVinci Resolve color wheels and timeline setup.",
    status: "completed"
  }
];

// --------------------------------------------------------- //
// 2. View Routing System (Single Page App Layout)           //
// --------------------------------------------------------- //

function switchDashboardView(viewId) {
  // Hide all views inside dashboard
  document.querySelectorAll('.dashboard-view').forEach(view => {
    view.classList.remove('active-view');
  });

  // Show selected view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active-view');
  }

  // Deactivate all sidebar items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Activate specific sidebar button
  const activeMenu = document.getElementById(`menu-${viewId}`);
  if (activeMenu) {
    activeMenu.classList.add('active');
  }

  // Reset search box if leaving search directory
  if (viewId !== 'search' && viewId !== 'home') {
    document.getElementById('navbar-search').value = '';
    renderRecommendedUsers(recommendedUsers);
  }

  // Smooth scroll main content to top
  const wrapper = document.querySelector('.content-wrapper');
  if (wrapper) wrapper.scrollTop = 0;

  // Auto-close sidebar on mobile after clicking item
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
  }
}

// Switches Pre-Login Portal tabs between Login & Sign Up
function switchPortalTab(tabType) {
if (typeof closePortalAlert=="function"){
  closePortalAlert();
}
  
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const footerSwitch = document.getElementById('portal-switch-text');

  if (tabType === 'signup') {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    tabLogin.classList.remove('active');
    tabSignup.classList.add('active');
    footerSwitch.innerHTML = 'Already have an account? <a href="#" onclick="switchPortalTab(\'login\'); return false;">Log in here</a>';
  } else {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    tabSignup.classList.remove('active');
    tabLogin.classList.add('active');
    footerSwitch.innerHTML = 'New to SkillSwap? <a href="#" onclick="switchPortalTab(\'signup\'); return false;">Create an account</a>';
  }
}

// Collapsible Mobile Sidebar Sidebar Toggles
function toggleSidebarMenu() {
  document.querySelector('.sidebar').classList.toggle('active');
}

// Close portal warning notifications
function closePortalAlert() {
  const alertBox =
    document.getElementById('portal-alert');
  if (alertBox){
    alertBox.classList.add('hide');
  }
}

function showPortalAlert(message, type = 'error') {
  const alertBox = document.getElementById('portal-alert');
  const msgSpan = alertBox.querySelector('.alert-message');
  
  msgSpan.textContent = message;
  alertBox.className = 'alert-box'; // reset class
  if (type === 'success') {
    alertBox.classList.add('success');
  }
  alertBox.classList.remove('hide');
}

// --------------------------------------------------------- //
// 3. User Authentication Controls (Mock Logic)              //
// --------------------------------------------------------- //
async function handleLoginSubmit(event) {
  event.preventDefault();
  closePortalAlert();

  const emailInput = document.getElementById('login-email').value.trim();
  const passwordInput = document.getElementById('login-password').value.trim();

  if (!emailInput || !passwordInput) {
    showPortalAlert("All fields are required.");
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      emailInput,
      passwordInput
    );

    showPortalAlert("Login successful! Redirecting...", "success");

    setTimeout(() => {

      document.getElementById('portal-view')
      .classList.remove('active-view');

      document.getElementById('dashboard-frame')
      .classList.remove('hide');

      updateDashboardUI();
      switchDashboardView('home');

    },800);

  } catch(error) {

    showPortalAlert(error.message);

  }
}
async function handleSignupSubmit(event) {
  event.preventDefault();
  closePortalAlert();

  const nameInput = document.getElementById('signup-name').value.trim();
  const emailInput = document.getElementById('signup-email').value.trim();
  const passwordInput = document.getElementById('signup-password').value;

  if (!nameInput || !emailInput || !passwordInput) {
    showPortalAlert("All fields are required.");
    return;
  }

  if (passwordInput.length < 6) {
    showPortalAlert("Password must be at least 6 characters.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
  auth,
  emailInput,
  passwordInput
);

const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  name: nameInput,
  email: emailInput,
  experience: "",
  bio: "",
  skillsOffered: [],
  skillsWanted: [],
  rating: 0,
  matchesCount: 0,
  createdAt: new Date()
});

currentUser.name = nameInput;
currentUser.email = emailInput;

    showPortalAlert(
      "Account created successfully! Please login.",
      "success"
    );

    setTimeout(() => {
      switchPortalTab('login');

      document.getElementById('login-email').value = emailInput;
      document.getElementById('login-password').value = "";
    }, 1000);

  } catch (error) {
    showPortalAlert(error.message);
  }
}
// --------------------------------------------------------- //
// 4. Dynamic Data Rendering Mechanics                       //
// --------------------------------------------------------- //

function updateDashboardUI() {
  // Update header/nav displays
  document.querySelectorAll('.user-first-name').forEach(el => {
    el.textContent = currentUser.name.split(' ')[0];
  });
  document.querySelectorAll('.header-username').forEach(el => {
    el.textContent = currentUser.name;
  });
  
  // Update profile displays
  document.getElementById('profile-name-display').textContent = currentUser.name;
  document.getElementById('profile-experience-display').textContent = currentUser.experience;
  document.getElementById('profile-bio-display').textContent = currentUser.bio;
  document.getElementById('profile-rating-display').textContent = currentUser.rating;
  document.getElementById('nav-avatar').src = currentUser.avatar;
  document.getElementById('profile-picture-display').src = currentUser.avatar;

  // Update Statistics metrics
  document.getElementById('stats-offered').textContent = currentUser.skillsOffered.length;
  document.getElementById('stats-wanted').textContent = currentUser.skillsWanted.length;
  document.getElementById('stats-matches').textContent = currentUser.matchesCount;
  document.getElementById('stats-rating').textContent = currentUser.rating;

  // Render arrays
  renderProfileTags();
  renderRecommendedUsers(recommendedUsers);
  renderNotifications();
  renderBookingSessions();
}

function renderProfileTags() {
  const offeredContainer = document.getElementById('profile-offered-tags');
  const wantedContainer = document.getElementById('profile-wanted-tags');
  
  offeredContainer.innerHTML = '';
  wantedContainer.innerHTML = '';

  currentUser.skillsOffered.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'tag offered';
    span.textContent = skill;
    offeredContainer.appendChild(span);
  });

  currentUser.skillsWanted.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'tag wanted';
    span.textContent = skill;
    wantedContainer.appendChild(span);
  });
}

function renderRecommendedUsers(usersList) {
  const grid = document.getElementById('recommended-users-grid');
  grid.innerHTML = '';

  if (usersList.length === 0) {
    grid.innerHTML = `
      <div class="wip-container" style="grid-column: 1 / -1; padding: 40px 0;">
        <svg class="wip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <h3>No matching SkillSwap partners</h3>
        <p>Try searching for different active terms like 'React', 'French', or design titles.</p>
      </div>
    `;
    return;
  }

  usersList.forEach(user => {
    const card = document.createElement('article');
    card.className = 'user-card';

    // Offered Skills tags HTML
    const offeredTags = user.offered.map(tag => `<span class="tag offered">${tag}</span>`).join('');
    // Wanted Skills tags HTML
    const wantedTags = user.wanted.map(tag => `<span class="tag wanted">${tag}</span>`).join('');

    card.innerHTML = `
      <div class="user-card-body-section">
        <div class="user-card-meta">
          <img class="user-card-avatar" src="${user.avatar}" alt="${user.name}">
          <div class="user-details">
            <h4>${user.name}</h4>
            <span class="user-exp">${user.experience}</span>
          </div>
        </div>
        <p class="user-card-bio" style="margin-top: 12px; margin-bottom: 12px;">${user.bio}</p>
        <div class="user-card-skills" style="margin-bottom: 12px;">
          <div class="skill-tag-header">Offers:</div>
          <div class="tag-list">${offeredTags}</div>
        </div>
        <div class="user-card-skills">
          <div class="skill-tag-header">Wants:</div>
          <div class="tag-list">${wantedTags}</div>
        </div>
      </div>
      <div class="user-card-footer">
        <div class="user-rating-row">
          <svg class="star-mini" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <span>${user.rating}</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="connectUser('${user.name}')">Connect</button>
          <button class="btn btn-primary btn-sm" onclick="openBookingModal('${user.name}')">Book</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --------------------------------------------------------- //
// 5. Connect and Notification Systems                       //
// --------------------------------------------------------- //

function connectUser(name) {
  // Push Notification message
  notifications.unshift({
    id: Date.now(),
    text: `You sent a connection match request to ${name}!`,
    time: "Just now"
  });
  
  // Trigger update
  renderNotifications();
  
  // Visual indication
  const indicator = document.querySelector('.notification-indicator');
  if (indicator) indicator.style.display = 'block';

  alert(`Connection request sent to ${name}! Keep an eye on your Inbox bookings.`);
}

function toggleNotificationDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('notification-dropdown');
  dropdown.classList.toggle('active');
}

function renderNotifications() {
  const list = document.getElementById('notification-list');
  const indicator = document.querySelector('.notification-indicator');
  
  list.innerHTML = '';
  
  if (notifications.length === 0) {
    list.innerHTML = `<li class="dropdown-item" style="text-align: center; color: var(--light-gray);">No alerts</li>`;
    if (indicator) indicator.style.display = 'none';
    return;
  }

  if (indicator) indicator.style.display = 'block';

  notifications.forEach(item => {
    const li = document.createElement('li');
    li.className = 'dropdown-item';
    li.innerHTML = `
      <p>${item.text}</p>
      <span>${item.time}</span>
    `;
    list.appendChild(li);
  });
}

function clearNotifications() {
  notifications = [];
  renderNotifications();
}

// --------------------------------------------------------- //
// 6. Profile Customization Form Controls                    //
// --------------------------------------------------------- //

function toggleEditProfileModal(show) {
  const modal = document.getElementById('modal-edit-profile');
  if (show) {
    // Populate form with current user data
    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-experience').value = currentUser.experience;
    document.getElementById('edit-bio').value = currentUser.bio;
    document.getElementById('edit-offered').value = currentUser.skillsOffered.join(', ');
    document.getElementById('edit-wanted').value = currentUser.skillsWanted.join(', ');
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
  }
}

function handleProfileSave(event) {
  event.preventDefault();

  // Retrieve inputs
  const editName = document.getElementById('edit-name').value.trim();
  const editExp = document.getElementById('edit-experience').value.trim();
  const editBio = document.getElementById('edit-bio').value.trim();
  const editOfferedStr = document.getElementById('edit-offered').value.trim();
  const editWantedStr = document.getElementById('edit-wanted').value.trim();

  // Convert comma separated strings to arrays
  const newOffered = editOfferedStr ? editOfferedStr.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
  const newWanted = editWantedStr ? editWantedStr.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

  // Update object state
  currentUser.name = editName;
  currentUser.experience = editExp;
  currentUser.bio = editBio;
  currentUser.skillsOffered = newOffered;
  currentUser.skillsWanted = newWanted;

  // Save updates in LocalStorage / memory display
  updateDashboardUI();
  toggleEditProfileModal(false);

  // Send feedback notification
  notifications.unshift({
    id: Date.now(),
    text: "Your SkillSwap profile details were updated successfully.",
    time: "Just now"
  });
  renderNotifications();
}

// --------------------------------------------------------- //
// 7. Search Directory Filters                               //
// --------------------------------------------------------- //

function handleSearchFilter(event) {
  const query = event.target.value.toLowerCase().trim();
  
  // Route user automatically to Search directory view of results if writing queries in Dashboard
  // This keeps the user experience clean
  const homeView = document.getElementById('view-home');
  const searchView = document.getElementById('view-search');
  
  if (query.length > 0 && homeView.classList.contains('active-view')) {
    switchDashboardView('search');
    // Maintain input focus
    document.getElementById('navbar-search').focus();
    // Keep typed content
    document.getElementById('navbar-search').value = query;
  }

  // Filter recommended list elements
  const filtered = recommendedUsers.filter(user => {
    const matchesName = user.name.toLowerCase().includes(query);
    const matchesBio = user.bio.toLowerCase().includes(query);
    const matchesOffered = user.offered.some(s => s.toLowerCase().includes(query));
    const matchesWanted = user.wanted.some(s => s.toLowerCase().includes(query));
    
    return matchesName || matchesBio || matchesOffered || matchesWanted;
  });

  renderRecommendedUsers(filtered);
}

// Close Dropdowns if clicking outside page
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('notification-dropdown');
  const bellBtn = document.querySelector('.nav-action-btn');
  
  if (dropdown && dropdown.classList.contains('active') && !dropdown.contains(event.target) && !bellBtn.contains(event.target)) {
    dropdown.classList.remove('active');
  }
});

// --------------------------------------------------------- //
// 8. Dark Mode Theme Controller                             //
// --------------------------------------------------------- //

function initTheme() {
  const savedTheme = localStorage.getItem('skillswap_theme') || 'light';
  applyTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-icon-sun')?.classList.remove('hide');
    document.getElementById('theme-icon-moon')?.classList.add('hide');
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-icon-sun')?.classList.add('hide');
    document.getElementById('theme-icon-moon')?.classList.remove('hide');
  }
  localStorage.setItem('skillswap_theme', theme);
}

// --------------------------------------------------------- //
// 9. Skill Swap Booking System Mechanics                    //
// --------------------------------------------------------- //

let currentBookingFilter = 'all';

function renderBookingSessions(filterType = currentBookingFilter) {
  const container = document.getElementById('booking-sessions-list');
  if (!container) return;

  container.innerHTML = '';
  currentBookingFilter = filterType;

  // Calculate statistics metrics
  const upcomingCount = bookingSessions.filter(s => s.status === 'confirmed' || s.status === 'pending').length;
  const completedCount = bookingSessions.filter(s => s.status === 'completed').length;
  
  // Calculate total hours
  let totalMinutes = 0;
  bookingSessions.forEach(s => {
    const mins = parseInt(s.duration) || 60;
    totalMinutes += mins;
  });
  const totalHours = (totalMinutes / 60).toFixed(1);

  const upcomingEl = document.getElementById('booking-upcoming-count');
  const completedEl = document.getElementById('booking-completed-count');
  const hoursEl = document.getElementById('booking-hours-count');

  if (upcomingEl) upcomingEl.textContent = upcomingCount;
  if (completedEl) completedEl.textContent = completedCount;
  if (hoursEl) hoursEl.textContent = `${totalHours} hrs`;

  // Filter list
  let filtered = bookingSessions;
  if (filterType === 'upcoming') {
    filtered = bookingSessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
  } else if (filterType === 'completed') {
    filtered = bookingSessions.filter(s => s.status === 'completed');
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="wip-container" style="grid-column: 1 / -1; padding: 40px 0;">
        <svg class="wip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <h3>No sessions found</h3>
        <p>Click 'Book New Session' above to schedule your next skill swap!</p>
      </div>
    `;
    return;
  }

  filtered.forEach(session => {
    const card = document.createElement('article');
    card.className = 'booking-session-card';

    const statusClass = session.status === 'confirmed' ? 'status-confirmed' : session.status === 'completed' ? 'status-completed' : 'status-pending';

    card.innerHTML = `
      <div class="session-card-header">
        <div class="session-partner-info">
          <img class="session-avatar" src="${session.partnerAvatar}" alt="${session.partnerName}">
          <div>
            <h4>${session.partnerName}</h4>
            <span>${session.platform}</span>
          </div>
        </div>
        <span class="session-status-badge ${statusClass}">${session.status}</span>
      </div>

      <div class="session-card-body">
        <div class="session-topic">
          <svg class="session-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          <span>${session.skill}</span>
        </div>
        <div class="session-meta-row">
          <div class="session-meta-item">
            <svg class="session-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>${session.date}</span>
          </div>
          <div class="session-meta-item">
            <svg class="session-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${session.time} (${session.duration})</span>
          </div>
        </div>
        ${session.notes ? `<div class="session-notes-box">${session.notes}</div>` : ''}
      </div>

      <div class="session-card-actions">
        ${session.status === 'confirmed' ? `
          <button class="btn btn-primary btn-sm" onclick="joinSessionCall('${session.partnerName}')">Join Call</button>
          <button class="btn btn-outline btn-sm" onclick="cancelBookingSession(${session.id})">Cancel</button>
        ` : `
          <button class="btn btn-outline btn-sm" onclick="cancelBookingSession(${session.id})">Remove</button>
        `}
      </div>
    `;

    container.appendChild(card);
  });
}

function filterBookingSessions(type, event) {
  document.querySelectorAll('.booking-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
  renderBookingSessions(type);
}

function openBookingModal(partnerName = '') {
  const modal = document.getElementById('modal-book-session');
  if (!modal) return;

  const partnerSelect = document.getElementById('booking-partner');
  if (partnerSelect && partnerName) {
    partnerSelect.value = partnerName;
  }

  // Pre-fill tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];
  const dateInput = document.getElementById('booking-date');
  if (dateInput) dateInput.value = dateStr;

  modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('modal-book-session');
  if (modal) modal.classList.remove('active');
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const partnerName = document.getElementById('booking-partner').value;
  const skill = document.getElementById('booking-skill').value.trim();
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  const duration = document.getElementById('booking-duration').value;
  const platform = document.getElementById('booking-platform').value;
  const notes = document.getElementById('booking-notes').value.trim();

  if (!partnerName || !skill || !date) return;

  // Find partner avatar
  const matchedUser = recommendedUsers.find(u => u.name === partnerName);
  const avatar = matchedUser ? matchedUser.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";

  const newSession = {
    id: Date.now(),
    partnerName,
    partnerAvatar: avatar,
    skill,
    date,
    time,
    duration,
    platform,
    notes,
    status: "confirmed"
  };

  bookingSessions.unshift(newSession);
  closeBookingModal();

  // Route automatically to Booking view
  switchDashboardView('booking');
  renderBookingSessions('all');

  // Push notification alert
  notifications.unshift({
    id: Date.now(),
    text: `Booking confirmed with ${partnerName} for ${skill} on ${date} at ${time}!`,
    time: "Just now"
  });
  renderNotifications();

  alert(`Skill swap session with ${partnerName} successfully booked for ${date} at ${time}!`);
}

function cancelBookingSession(id) {
  if (confirm("Are you sure you want to cancel or remove this skill swap session?")) {
    bookingSessions = bookingSessions.filter(s => s.id !== id);
    renderBookingSessions(currentBookingFilter);
  }
}

function joinSessionCall(partnerName) {
  alert(`Connecting to live video call session with ${partnerName}... Room is active!`);
}

// Initial load setup
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateDashboardUI();

  document.getElementById('form-login')
    ?.addEventListener('submit', handleLoginSubmit);

  document.getElementById('form-signup')
    ?.addEventListener('submit', handleSignupSubmit);
});

window.switchPortalTab = switchPortalTab;
window.handleLoginSubmit = handleLoginSubmit;
window.handleSignupSubmit = handleSignupSubmit;

window.switchDashboardView = switchDashboardView;
window.toggleSidebarMenu = toggleSidebarMenu;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.clearNotifications = clearNotifications;
window.toggleTheme = toggleTheme;

window.connectUser = connectUser;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.handleBookingSubmit = handleBookingSubmit;
window.cancelBookingSession = cancelBookingSession;
window.joinSessionCall = joinSessionCall;
window.filterBookingSessions = filterBookingSessions;

window.toggleEditProfileModal = toggleEditProfileModal;
window.handleProfileSave = handleProfileSave;
window.handleSearchFilter = handleSearchFilter;
