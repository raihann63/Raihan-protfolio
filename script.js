// ============================================
// script.js — MD Raihan Ali Portfolio
// ============================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- Hamburger menu toggle ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-links a[href="#${sec.getAttribute('id')}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
    }
  });
});

// ---- Back to top ----
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
});

// ---- Typing animation ----
const texts = ['ML Engineer', 'AI Researcher', 'AI Automation Expert', 'Data Scientist', 'Deep Learning Builder'];
let textIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = texts[textIdx];
  typedEl.textContent = deleting
    ? current.substring(0, charIdx - 1)
    : current.substring(0, charIdx + 1);
  deleting ? charIdx-- : charIdx++;
  let speed = deleting ? 60 : 110;
  if (!deleting && charIdx === current.length) { speed = 1800; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % texts.length; speed = 400; }
  setTimeout(type, speed);
}
type();

// ---- Scroll-reveal animation ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

// ⚠️ cert-card সরানো হয়েছে — renderCerts() নিজে handle করে
document.querySelectorAll(
  '.skill-card, .timeline-card, .edu-card, .achieve-card, .research-card'
).forEach(el => { el.classList.add('reveal'); observer.observe(el); });

// ---- Contact form handler ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #4ff778, #00c896)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ============================================
// Project Filter + See More System
// ============================================

const VISIBLE_COUNT = 6;
let currentFilter = 'all';
let showingAll = false;

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectsGrid .project-card');
const seeMoreBtn = document.getElementById('seeMoreBtn');
const seeMoreWrapper = document.getElementById('seeMoreWrapper');

function getFilteredCards(filter) {
  return Array.from(projectCards).filter(card => {
    if (filter === 'all') return true;
    return card.dataset.category.includes(filter);
  });
}

function renderProjects(filter, seeAll = false) {
  const filtered = getFilteredCards(filter);

  projectCards.forEach(card => {
    card.classList.add('hidden');
    card.classList.remove('fade-in');
  });

  const toShow = seeAll ? filtered : filtered.slice(0, VISIBLE_COUNT);

  toShow.forEach((card, i) => {
    card.classList.remove('hidden');
    setTimeout(() => card.classList.add('fade-in'), i * 60);
  });

  if (filtered.length > VISIBLE_COUNT) {
    seeMoreWrapper.style.display = 'block';
    if (seeAll) {
      seeMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
      seeMoreBtn.classList.add('expanded');
    } else {
      seeMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> See More Projects';
      seeMoreBtn.classList.remove('expanded');
    }
  } else {
    seeMoreWrapper.style.display = 'none';
  }

  document.querySelectorAll('#projectsGrid .project-card:not(.hidden)').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Filter tab click
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    showingAll = false;
    renderProjects(currentFilter, false);
  });
});

// See More / Show Less click
if (seeMoreBtn) {
  seeMoreBtn.addEventListener('click', () => {
    showingAll = !showingAll;
    renderProjects(currentFilter, showingAll);
    if (!showingAll) {
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Page load এ default render
renderProjects('all', false);

// ============================================
// Auto-count: Projects + Internships
// ============================================

// Auto-count total projects
const totalProjectCount = document.getElementById('totalProjectCount');
if (totalProjectCount) {
  const count = document.querySelectorAll('#projectsGrid .project-card').length;
  totalProjectCount.textContent = count + '+';
}

// Auto-count internships
const internshipCount = document.getElementById('internshipCount');
if (internshipCount) {
  const count = document.querySelectorAll('.timeline .timeline-item').length;
  internshipCount.textContent = count;
}

// ============================================
// Certifications See More System
// ============================================

const CERT_VISIBLE = 8;
let certShowingAll = false;

const certCards = document.querySelectorAll('#certGrid .cert-card');
const certSeeMoreBtn = document.getElementById('certSeeMoreBtn');
const certSeeMoreWrapper = document.getElementById('certSeeMoreWrapper');

// ✅ Updated renderCerts — cert-visible class দিয়ে control
function renderCerts(seeAll = false) {
  certCards.forEach((card, i) => {
    if (seeAll || i < CERT_VISIBLE) {
      card.classList.add('cert-visible');
      card.classList.add('reveal');
      observer.observe(card);
      setTimeout(() => card.classList.add('fade-in'), i * 50);
    } else {
      card.classList.remove('cert-visible');
      card.classList.remove('fade-in');
      card.classList.remove('reveal');
      card.classList.remove('visible');
    }
  });

  if (certCards.length > CERT_VISIBLE) {
    certSeeMoreWrapper.style.display = 'block';
    if (seeAll) {
      certSeeMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
      certSeeMoreBtn.classList.add('expanded');
    } else {
      certSeeMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> See More Certifications';
      certSeeMoreBtn.classList.remove('expanded');
    }
  } else {
    certSeeMoreWrapper.style.display = 'none';
  }
}

if (certSeeMoreBtn) {
  certSeeMoreBtn.addEventListener('click', () => {
    certShowingAll = !certShowingAll;
    renderCerts(certShowingAll);
    if (!certShowingAll) {
      document.getElementById('certifications').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Auto-count certifications
const certCount = document.getElementById('certCount');
if (certCount) {
  certCount.textContent = certCards.length + '+';
}

// Page load এ render
renderCerts(false);