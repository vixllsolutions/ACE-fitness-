(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  const body = document.body;

  function closeMenu() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
    body.classList.remove('menu-open');
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !open);
      body.classList.toggle('menu-open', !open);
    });
    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const closeLightboxButton = document.querySelector('.lightbox-close');
  const previousButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');
  const counter = document.querySelector('.lightbox-counter');
  const imageButtons = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let activeIndex = -1;
  let previousFocus = null;

  function showLightbox(index) {
    if (!lightbox || !lightboxImage || imageButtons.length === 0) return;
    activeIndex = (index + imageButtons.length) % imageButtons.length;
    const button = imageButtons[activeIndex];
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.dataset.lightboxAlt || 'ACE Fitness image';
    if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(imageButtons.length).padStart(2, '0')}`;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('lightbox-open');
    if (closeLightboxButton) closeLightboxButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    activeIndex = -1;
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
  }

  imageButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      previousFocus = button;
      showLightbox(index);
    });
  });
  if (closeLightboxButton) closeLightboxButton.addEventListener('click', closeLightbox);
  if (previousButton) previousButton.addEventListener('click', () => showLightbox(activeIndex - 1));
  if (nextButton) nextButton.addEventListener('click', () => showLightbox(activeIndex + 1));
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      if (lightbox && lightbox.classList.contains('is-open')) closeLightbox();
    } else if (lightbox && lightbox.classList.contains('is-open') && event.key === 'ArrowLeft') {
      showLightbox(activeIndex - 1);
    } else if (lightbox && lightbox.classList.contains('is-open') && event.key === 'ArrowRight') {
      showLightbox(activeIndex + 1);
    }
  });

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
