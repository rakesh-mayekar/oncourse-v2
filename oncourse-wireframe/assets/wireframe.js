/**
 * OnCourse Global — UX Wireframe Interactive Controller
 * Vanilla JS behaviors for Sticky CTA, Segment-aware Form, Contextual Popups,
 * FAQ Accordion, and Carousel Sliders.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyCTA();
  initSegmentPopup();
  initLeadFormSwitcher();
  initFAQAccordion();
  initCarouselSlider();
  initHeroSlider();
  initConsultationModal();
  initInstagramFeed();
  initTimelineDownloadModal();
  initEventsController();
});

// 1. Mobile Menu Toggle
function initMobileMenu() {
  const toggleButtons = [
    document.getElementById('mobile-menu-toggle'),
    document.getElementById('mobile-menu-toggle-sm'),
    document.getElementById('mobile-menu-toggle-lg')
  ].filter(Boolean);

  const mobileNav = document.getElementById('mobile-nav-drawer');
  if (!mobileNav) return;

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('hidden');
    });
  });

  // Close drawer if clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.classList.contains('hidden') && !mobileNav.contains(e.target) && !toggleButtons.some(b => b.contains(e.target))) {
      mobileNav.classList.add('hidden');
      toggleButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });
}

// 2. Sticky CTA
function initStickyCTA() {
  const stickyBar = document.getElementById('sticky-cta-bar');
  const dismissBtn = document.getElementById('sticky-cta-dismiss');
  if (!stickyBar) return;

  let isDismissed = false;

  window.addEventListener('scroll', () => {
    if (isDismissed) return;

    if (window.scrollY > 280) {
      stickyBar.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none', 'hidden');
      stickyBar.classList.add('translate-y-0', 'opacity-100');
    } else {
      stickyBar.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
      stickyBar.classList.remove('translate-y-0', 'opacity-100');
    }
  }, { passive: true });

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      isDismissed = true;
      stickyBar.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
    });
  }
}

// 3. Segment Contextual Pop-up
function initSegmentPopup() {
  const popup = document.getElementById('segment-popup');
  if (!popup) return;

  const pageSegment = popup.getAttribute('data-segment') || 'undergraduate';
  const dismissKey = `oncourse_popup_dismissed_${pageSegment}`;

  // Toggle active variant content
  const ugContent = popup.querySelector('.popup-content-ug');
  const mbaContent = popup.querySelector('.popup-content-mba');
  const genContent = popup.querySelector('.popup-content-gen');
  const ugBadge = popup.querySelector('.popup-badge-ug');
  const mbaBadge = popup.querySelector('.popup-badge-mba');
  const genBadge = popup.querySelector('.popup-badge-gen');

  if (pageSegment === 'mba' || pageSegment === 'masters') {
    if (ugContent) ugContent.classList.add('hidden');
    if (mbaContent) mbaContent.classList.remove('hidden');
    if (genContent) genContent.classList.add('hidden');
    if (ugBadge) ugBadge.classList.add('hidden');
    if (mbaBadge) mbaBadge.classList.remove('hidden');
    if (genBadge) genBadge.classList.add('hidden');
  } else if (pageSegment === 'undergraduate') {
    if (ugContent) ugContent.classList.remove('hidden');
    if (mbaContent) mbaContent.classList.add('hidden');
    if (genContent) genContent.classList.add('hidden');
    if (ugBadge) ugBadge.classList.remove('hidden');
    if (mbaBadge) mbaBadge.classList.add('hidden');
    if (genBadge) genBadge.classList.add('hidden');
  } else {
    if (ugContent) ugContent.classList.add('hidden');
    if (mbaContent) mbaContent.classList.add('hidden');
    if (genContent) genContent.classList.remove('hidden');
    if (ugBadge) ugBadge.classList.add('hidden');
    if (mbaBadge) mbaBadge.classList.add('hidden');
    if (genBadge) genBadge.classList.remove('hidden');
  }

  if (sessionStorage.getItem(dismissKey) === 'true') {
    return;
  }

  const closeBtn = document.getElementById('segment-popup-close');
  let triggered = false;

  const showPopup = () => {
    if (triggered || sessionStorage.getItem(dismissKey) === 'true') return;
    triggered = true;
    popup.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
    popup.classList.add('translate-y-0', 'opacity-100');
  };

  // Trigger on scroll depth > 35% or fallback timer (4.5s)
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 35) {
      showPopup();
    }
  }, { passive: true });

  setTimeout(showPopup, 4500);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
      popup.classList.remove('translate-y-0', 'opacity-100');
      sessionStorage.setItem(dismissKey, 'true');
    });
  }
}

// 4. Lead Form Segment Field Switcher
function initLeadFormSwitcher() {
  const segmentSelect = document.getElementById('form-segment-selector');
  const ugFields = document.getElementById('segment-fields-undergraduate');
  const pgFields = document.getElementById('segment-fields-pg-mba');
  const testPrepFields = document.getElementById('segment-fields-testprep');
  const formElement = document.getElementById('oncourse-lead-form');
  const successMessage = document.getElementById('form-success-message');

  const updateFields = (val) => {
    if (ugFields) ugFields.classList.toggle('hidden', val !== 'undergraduate');
    if (pgFields) pgFields.classList.toggle('hidden', val !== 'mba' && val !== 'masters');
    if (testPrepFields) testPrepFields.classList.toggle('hidden', val !== 'test-prep');
  };

  if (segmentSelect) {
    segmentSelect.addEventListener('change', (e) => {
      updateFields(e.target.value);
    });
    // Set initial
    updateFields(segmentSelect.value);
  }

  if (formElement) {
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successMessage) {
        formElement.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }
    });
  }
}

// 5. FAQ Accordion Toggle
function initFAQAccordion() {
  const accordionButtons = document.querySelectorAll('.faq-accordion-btn');
  accordionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', !isExpanded);
      if (panel) {
        panel.classList.toggle('hidden');
      }
      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    });
  });
}

// 6. Success Stories Carousel
function initCarouselSlider() {
  const slider = document.getElementById('success-stories-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentIndex = 0;

  const updateSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('hidden', i !== index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-black', i === index);
      dot.classList.toggle('bg-gray-300', i !== index);
    });
    currentIndex = index;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlide(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      updateSlide(newIndex);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => updateSlide(i));
  });

  updateSlide(0);
}

// 7. Hero Master Slider (Homepage Video Replacement)
function initHeroSlider() {
  const slider = document.getElementById('hero-master-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slider-slide');
  const prevBtn = document.getElementById('hero-slider-prev');
  const nextBtn = document.getElementById('hero-slider-next');
  const tabs = slider.querySelectorAll('.hero-slider-tab');
  const dots = slider.querySelectorAll('.hero-slider-dot');
  const counter = document.getElementById('hero-slide-counter');
  let currentIndex = 0;
  let autoplayTimer = null;

  const updateSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('hidden', i !== index);
    });
    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('border-black', 'bg-white', 'text-black', 'font-bold');
        tab.classList.remove('border-transparent', 'text-gray-500');
      } else {
        tab.classList.remove('border-black', 'bg-white', 'text-black', 'font-bold');
        tab.classList.add('border-transparent', 'text-gray-500');
      }
    });
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-black', 'w-6');
        dot.classList.remove('bg-gray-300', 'w-2');
      } else {
        dot.classList.remove('bg-black', 'w-6');
        dot.classList.add('bg-gray-300', 'w-2');
      }
    });
    if (counter) {
      counter.textContent = `0${index + 1} / 0${slides.length}`;
    }
    currentIndex = index;
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    updateSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(newIndex);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { updateSlide(i); resetTimer(); });
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { updateSlide(i); resetTimer(); });
  });

  const startTimer = () => {
    autoplayTimer = setInterval(nextSlide, 5500);
  };

  const resetTimer = () => {
    clearInterval(autoplayTimer);
    startTimer();
  };

  slider.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  slider.addEventListener('mouseleave', () => startTimer());

  updateSlide(0);
  startTimer();
}

// 8. Consultation Request Popup Modal Controller
function initConsultationModal() {
  function ensureModal() {
    let modal = document.getElementById('consultation-modal');
    if (!modal) {
      const modalWrapper = document.createElement('div');
      modalWrapper.innerHTML = `
<div id="consultation-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto hidden opacity-0 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <!-- Backdrop -->
  <div id="consultation-modal-backdrop" class="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity cursor-pointer"></div>

  <!-- Modal Dialog Window -->
  <div class="relative bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 max-w-lg w-full p-6 sm:p-8 transform transition-transform duration-300 scale-95 overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
    
    <!-- Top Bar with Monogram & Close Button -->
    <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs tracking-tighter shadow-sm">
          OG
        </div>
        <div>
          <span class="text-xs font-black tracking-tight text-neutral-900 uppercase block">OnCourse Global</span>
          <span class="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Endless Possibility • Dual Mentors</span>
        </div>
      </div>
      <button id="consultation-modal-close" type="button" class="w-8 h-8 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer" aria-label="Close dialog">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Modal Header -->
    <div class="mt-4 mb-5">
      <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-neutral-100 text-neutral-800 border border-neutral-200 mb-2">
        Diagnostic Consultation
      </span>
      <h3 id="modal-title" class="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight leading-snug">
        Request a Consultation
      </h3>
      <p class="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
        Speak with our senior admissions leadership in Mumbai, Delhi, Gurgaon, Dubai, or via secure video advisory.
      </p>
    </div>

    <!-- Consultation Form -->
    <form id="consultation-popup-form" class="space-y-4">
      
      <!-- Area of Interest -->
      <div>
        <label for="popup-segment" class="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
          Admissions Pathway *
        </label>
        <select id="popup-segment" name="pathway" required class="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white text-xs sm:text-sm text-neutral-900 focus:ring-2 focus:ring-black focus:border-black transition-all font-medium">
          <option value="undergraduate" selected>Undergraduate Admissions (Class 8–12)</option>
          <option value="masters">Master’s &amp; Postgraduate Degrees</option>
          <option value="mba">MBA &amp; Executive Degrees (M7 / European)</option>
          <option value="test-prep">Test Prep (SAT / ACT / GRE / GMAT)</option>
          <option value="parent-advisory">Parent &amp; Strategic Family Advisory</option>
        </select>
      </div>

      <!-- Applicant Name & Phone -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label for="popup-name" class="block text-xs font-semibold text-neutral-700 mb-1">
            Applicant Name *
          </label>
          <input type="text" id="popup-name" name="applicant_name" required placeholder="e.g. Aarav Sharma" class="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black focus:border-black">
        </div>
        <div>
          <label for="popup-phone" class="block text-xs font-semibold text-neutral-700 mb-1">
            Phone / WhatsApp *
          </label>
          <input type="tel" id="popup-phone" name="phone" required placeholder="+91 98765 43210" class="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black focus:border-black">
        </div>
      </div>

      <!-- Email & Preferred Hub -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label for="popup-email" class="block text-xs font-semibold text-neutral-700 mb-1">
            Email Address *
          </label>
          <input type="email" id="popup-email" name="email" required placeholder="name@example.com" class="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black focus:border-black">
        </div>
        <div>
          <label for="popup-hub" class="block text-xs font-semibold text-neutral-700 mb-1">
            Preferred Hub *
          </label>
          <select id="popup-hub" name="hub" required class="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-black focus:border-black font-medium">
            <option value="mumbai">Mumbai (HQ - Nariman Pt / Bandra)</option>
            <option value="delhi">New Delhi (Connaught Place)</option>
            <option value="gurgaon">Gurgaon (DLF Cyber City)</option>
            <option value="dubai">Dubai (DIFC / Downtown)</option>
            <option value="online" selected>Online / Virtual Advisory</option>
          </select>
        </div>
      </div>

      <!-- Current Grade / Work Exp (Optional Context) -->
      <div>
        <label for="popup-context" class="block text-xs font-semibold text-neutral-700 mb-1">
          Current Grade / College / Work Experience (Optional)
        </label>
        <input type="text" id="popup-context" name="academic_context" placeholder="e.g. Class 11 IBDP or 3 yrs tech consulting" class="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black focus:border-black">
      </div>

      <!-- Submit CTA -->
      <div class="pt-2">
        <button type="submit" class="w-full py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer">
          <span>Schedule Diagnostic Consultation</span>
          <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
        </button>
      </div>

      <!-- Trust Footer -->
      <div class="pt-1 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono text-center">
        <span>🔒 Confidential Profile Diagnostic</span>
        <span>&bull;</span>
        <span>2 Dedicated Mentors</span>
        <span>&bull;</span>
        <span>Response &lt; 24h</span>
      </div>

    </form>

    <!-- Success Confirmation State (Hidden initially) -->
    <div id="consultation-popup-success" class="hidden text-center py-8 space-y-4">
      <div class="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-lg">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div>
        <h4 class="text-xl font-black text-neutral-900">Consultation Request Received</h4>
        <p class="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto mt-1 leading-relaxed">
          Thank you! Our senior admissions advisory team will review your profile details and reach out within 24 business hours to confirm your diagnostic slot.
        </p>
      </div>
      <div class="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] font-mono text-neutral-600 max-w-xs mx-auto text-left space-y-1">
        <div><strong>Mentors:</strong> Senior Counsellor + Dedicated Mentor</div>
        <div><strong>Hub:</strong> Active in Mumbai, Delhi, Gurgaon &amp; Dubai</div>
      </div>
      <div class="pt-2">
        <button id="consultation-success-close" type="button" class="px-6 py-2.5 rounded-lg bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer">
          Close Window
        </button>
      </div>
    </div>

  </div>
</div>`;
      document.body.appendChild(modalWrapper.firstElementChild);
      modal = document.getElementById('consultation-modal');
      setupModalEvents(modal);
    }
    return modal;
  }

  function setupModalEvents(modal) {
    if (!modal || modal.dataset.eventsBound === 'true') return;
    modal.dataset.eventsBound = 'true';

    const dialogWin = modal.querySelector('.relative.bg-white');
    const closeBtn = document.getElementById('consultation-modal-close');
    const backdrop = document.getElementById('consultation-modal-backdrop');
    const form = document.getElementById('consultation-popup-form');
    const successState = document.getElementById('consultation-popup-success');
    const successClose = document.getElementById('consultation-success-close');

    function closeModal() {
      modal.classList.add('opacity-0');
      if (dialogWin) {
        dialogWin.classList.remove('scale-100');
        dialogWin.classList.add('scale-95');
      }
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (form) {
          form.reset();
          form.classList.remove('hidden');
        }
        if (successState) {
          successState.classList.add('hidden');
        }
      }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (successClose) successClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Processing...</span>';
        }
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Schedule Diagnostic Consultation</span> <span class=\"transition-transform group-hover:translate-x-1\">&rarr;</span>';
          }
          form.classList.add('hidden');
          if (successState) {
            successState.classList.remove('hidden');
          }
        }, 400);
      });
    }
  }

  function openModal() {
    const modal = ensureModal();
    setupModalEvents(modal);
    const dialogWin = modal.querySelector('.relative.bg-white');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      if (dialogWin) {
        dialogWin.classList.remove('scale-95');
        dialogWin.classList.add('scale-100');
      }
    });
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input:not([type="hidden"]), select');
    if (firstInput) setTimeout(() => firstInput.focus(), 120);
  }

  // Bind delegated click listener for triggers
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;

    const text = target.textContent ? target.textContent.trim().toLowerCase() : '';
    const isStickyBtn = target.id === 'sticky-cta-btn' || target.closest('#sticky-cta-bar a');
    const hasModalAttr = target.matches('[data-open-consultation-modal], [data-open-modal="consultation"]');
    const isRequestConsultation = text === 'request a consultation' || text === 'request consultation' || text.includes('request a consultation') || text.includes('request consultation') || text.includes('book a parent consultation') || text.includes('book consultation') || text.includes('parent consultation');
    const isReserveOrRecording = text.includes('reserve seat') || text.includes('request recording') || text.includes('watch recording');

    if (isStickyBtn || hasModalAttr || isRequestConsultation || isReserveOrRecording) {
      e.preventDefault();
      const card = target.closest('[data-category]');
      const dataSeg = target.getAttribute('data-segment') || (card ? card.getAttribute('data-category') : null);
      const modalEl = document.getElementById('consultation-modal') || ensureModal();
      const segmentSelect = modalEl ? modalEl.querySelector('#popup-segment') : null;
      if (segmentSelect && dataSeg) {
        if (dataSeg === 'parent-advisory' || dataSeg.includes('parent')) segmentSelect.value = 'parent-advisory';
        else if (dataSeg === 'ug' || dataSeg === 'undergraduate') segmentSelect.value = 'undergraduate';
        else if (dataSeg === 'mba') segmentSelect.value = 'mba';
        else if (dataSeg === 'masters') segmentSelect.value = 'masters';
        else if (dataSeg === 'test-prep') segmentSelect.value = 'test-prep';
      }
      openModal();
    }
  });

  // If modal exists on page load, bind events immediately
  const existingModal = document.getElementById('consultation-modal');
  if (existingModal) {
    setupModalEvents(existingModal);
  }
}

// 9. Instagram Reels & Posts API Controller
function initInstagramFeed() {
  const feedGrids = document.querySelectorAll('#instagram-feed-grid, [data-instagram-feed]');
  if (!feedGrids.length) return;

  feedGrids.forEach(grid => {
    // Optional: If an API endpoint is configured via window or data-attribute
    const apiEndpoint = grid.getAttribute('data-api-endpoint') || (window.ONCOURSE_CONFIG && window.ONCOURSE_CONFIG.instagramApiEndpoint);
    
    if (apiEndpoint) {
      fetch(apiEndpoint)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            renderInstagramCards(grid, data.items);
          }
        })
        .catch(err => {
          console.warn('Instagram API sync fallback to pre-rendered reels:', err);
        });
    }

    // Add interactive click/hover enhancements
    const cards = grid.querySelectorAll('a');
    cards.forEach(card => {
      // Like button interaction
      const heartEl = card.querySelector('.text-neutral-300 span:last-child');
      if (heartEl) {
        heartEl.style.cursor = 'pointer';
        heartEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const current = heartEl.textContent.trim();
          if (!heartEl.classList.contains('liked')) {
            heartEl.classList.add('liked', 'text-pink-400');
            heartEl.innerHTML = '❤️ Liked!';
            setTimeout(() => {
              heartEl.innerHTML = current;
              heartEl.classList.add('text-pink-400');
            }, 1500);
          }
        });
      }
    });
  });

  function renderInstagramCards(container, items) {
    container.innerHTML = '';
    items.slice(0, 6).forEach(item => {
      const a = document.createElement('a');
      a.href = item.permalink || 'https://www.instagram.com/oncoursevantage/';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-pink-500/70 transition-all duration-300 flex flex-col justify-between aspect-[9/14] shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1 block';

      const mediaUrl = item.media_url || item.thumbnail_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
      const isVideo = item.media_type === 'VIDEO';
      const caption = item.caption || '@oncoursevantage reel';
      const views = item.views_count ? `▶ ${(item.views_count / 1000).toFixed(1)}K` : '▶ Reel';
      const likes = item.like_count ? `❤️ ${item.like_count}` : '❤️ OnCourse';

      a.innerHTML = `
        <img src="${mediaUrl}" alt="${caption}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30"></div>
        <div class="relative z-10 p-2.5 flex items-center justify-between">
          <span class="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-mono font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1">
            <svg class="w-2.5 h-2.5 fill-pink-400" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M10 8v8l6-4-6-4z"/></svg>
            <span>${isVideo ? 'REEL' : 'POST'}</span>
          </span>
          <span class="text-[10px] font-mono font-bold text-white/90 drop-shadow">${views}</span>
        </div>
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <div class="w-10 h-10 rounded-full bg-white/95 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform pl-0.5">
            ▶
          </div>
        </div>
        <div class="relative z-10 p-2.5 bg-gradient-to-t from-black via-black/90 to-transparent">
          <p class="text-[11px] font-bold text-white leading-snug line-clamp-2 drop-shadow">
            ${caption}
          </p>
          <div class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/10 text-[9px] font-mono text-neutral-300">
            <span class="text-pink-400 font-bold">@oncoursevantage</span>
            <span>${likes}</span>
          </div>
        </div>
      `;
      container.appendChild(a);
    });
  }
}

// 10. Timeline PDF Download Gated Modal Controller
function initTimelineDownloadModal() {
  const modal = document.getElementById('timeline-download-modal');
  if (!modal) return;

  const backdrop = document.getElementById('timeline-modal-backdrop');
  const closeBtn = document.getElementById('timeline-modal-close');
  const successCloseBtn = document.getElementById('timeline-success-close');
  const form = document.getElementById('timeline-download-form');
  const successBox = document.getElementById('timeline-download-success');
  const dialogWin = modal.querySelector('.relative.bg-white');

  function openModal() {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      if (dialogWin) {
        dialogWin.classList.remove('scale-95');
        dialogWin.classList.add('scale-100');
      }
    });
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 120);
  }

  function closeModal() {
    modal.classList.add('opacity-0');
    if (dialogWin) {
      dialogWin.classList.remove('scale-100');
      dialogWin.classList.add('scale-95');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }

  // Delegated trigger click
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-timeline-pdf], [data-open-download-modal="timeline-pdf"]');
    if (!trigger) return;
    e.preventDefault();
    openModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Hide form and show success
      form.classList.add('hidden');
      if (successBox) successBox.classList.remove('hidden');

      // Trigger automatic PDF download
      const downloadUrl = '../assets/docs/OnCourse-Class-8-to-12-Timelines-Guide.pdf';
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = 'OnCourse-Class-8-to-12-Timelines-Guide.pdf';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    });
  }
}

// 11. Events Filtering, Search & Countdown Controller
function initEventsController() {
  const cards = document.querySelectorAll('.event-card');
  const countdownEl = document.getElementById('event-countdown');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('event-search');
  const statusFilter = document.getElementById('status-filter');
  const noResults = document.getElementById('no-results');
  const resetBtn = document.getElementById('reset-filter-btn');

  if (cards.length > 0) {
    let currentCategory = 'all';
    let currentStatus = 'all';
    let currentQuery = '';

    function applyFilters() {
      let visibleCount = 0;
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardStatus = card.getAttribute('data-status') || 'upcoming';
        const cardText = card.innerText.toLowerCase();

        const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory);
        const matchesStatus = (currentStatus === 'all') || (cardStatus === currentStatus);
        const matchesQuery = !currentQuery || cardText.includes(currentQuery);

        if (matchesCategory && matchesStatus && matchesQuery) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (noResults) {
        if (visibleCount === 0) {
          noResults.classList.remove('hidden');
        } else {
          noResults.classList.add('hidden');
        }
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-black', 'text-white');
          b.classList.add('bg-gray-100', 'text-gray-700');
        });
        btn.classList.add('active', 'bg-black', 'text-white');
        btn.classList.remove('bg-gray-100', 'text-gray-700');
        currentCategory = btn.getAttribute('data-category') || 'all';
        applyFilters();
      });
    });

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        currentStatus = e.target.value;
        applyFilters();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value.toLowerCase().trim();
        applyFilters();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentQuery = '';
        if (statusFilter) statusFilter.value = 'all';
        currentStatus = 'all';
        const allBtn = document.querySelector('.filter-btn[data-category="all"]');
        if (allBtn) {
          filterBtns.forEach(b => {
            b.classList.remove('active', 'bg-black', 'text-white');
            b.classList.add('bg-gray-100', 'text-gray-700');
          });
          allBtn.classList.add('active', 'bg-black', 'text-white');
          allBtn.classList.remove('bg-gray-100', 'text-gray-700');
          currentCategory = 'all';
        }
        applyFilters();
      });
    }
  }

  // Live Countdown Timer
  if (countdownEl) {
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');
    if (daysEl && hoursEl && minsEl && secsEl) {
      const now = new Date();
      const target = new Date();
      const day = now.getDay();
      let daysUntilSat = (6 - day + 7) % 7;
      if (daysUntilSat === 0 && now.getHours() >= 17) {
        daysUntilSat = 7;
      }
      target.setDate(now.getDate() + daysUntilSat);
      target.setHours(17, 0, 0, 0);

      if (target.getTime() - now.getTime() < 12 * 3600 * 1000) {
        target.setDate(target.getDate() + 7);
      }

      function update() {
        const currentTime = new Date().getTime();
        const diff = Math.max(0, target.getTime() - currentTime);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent = String(m).padStart(2, '0');
        secsEl.textContent = String(s).padStart(2, '0');
      }

      update();
      setInterval(update, 1000);
    }
  }
}

