const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');
const yearEl = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.dataset.visible = (!isExpanded).toString();
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.dataset.visible = 'false';
    }
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll('[data-reveal]');

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const hero = document.querySelector('.hero');

if (hero && !prefersReducedMotion.matches) {
  const updatePointer = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--pointer-x', `${x}%`);
    hero.style.setProperty('--pointer-y', `${y}%`);
  };

  const resetPointer = () => {
    hero.style.setProperty('--pointer-x', '50%');
    hero.style.setProperty('--pointer-y', '50%');
  };

  hero.addEventListener('pointermove', updatePointer);
  hero.addEventListener('pointerleave', resetPointer);
}

const tiltElements = document.querySelectorAll('[data-tilt]');

if (tiltElements.length && !prefersReducedMotion.matches) {
  const maxRotation = 10;

  const applyTilt = (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * maxRotation).toFixed(2);
    const rotateY = (x * maxRotation).toFixed(2);

    target.style.setProperty('--rotateX', `${rotateX}deg`);
    target.style.setProperty('--rotateY', `${rotateY}deg`);
    target.style.setProperty('--translateY', '-10px');
  };

  const resetTilt = (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    target.style.removeProperty('--rotateX');
    target.style.removeProperty('--rotateY');
    target.style.removeProperty('--translateY');
  };

  tiltElements.forEach((element) => {
    element.addEventListener('pointermove', applyTilt);
    element.addEventListener('pointerleave', resetTilt);
    element.addEventListener('pointerup', resetTilt);
    element.addEventListener('pointercancel', resetTilt);
    element.addEventListener('blur', resetTilt);
    element.addEventListener('focus', () => {
      if (element instanceof HTMLElement) {
        element.style.setProperty('--translateY', '-10px');
      }
    });
  });
}

const navLinks = Array.from(document.querySelectorAll('.nav__menu a'));
const sectionElements = Array.from(document.querySelectorAll('section[id], [data-section]'));

if (navLinks.length && sectionElements.length) {
  const linkMap = new Map(
    navLinks
      .filter((link) => link.hash)
      .map((link) => [link.hash.replace('#', ''), link])
  );

  const setActiveLink = (id) => {
    navLinks.forEach((link) => link.classList.remove('is-active'));
    const activeLink = linkMap.get(id);
    if (activeLink) {
      activeLink.classList.add('is-active');
    }
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const id = target.getAttribute('id') || target.getAttribute('data-section');
        if (id === 'home') {
          navLinks.forEach((link) => link.classList.remove('is-active'));
          return;
        }
        if (id) {
          setActiveLink(id);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '-20% 0px -40% 0px',
    }
  );

  sectionElements.forEach((section) => sectionObserver.observe(section));
}
