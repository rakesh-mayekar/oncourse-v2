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
  initEmpiricalDashboard();
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
    const isRequestConsultation = text === 'request a consultation' || text === 'request consultation' || text.includes('request a consultation') || text.includes('request consultation');

    if (isStickyBtn || hasModalAttr || isRequestConsultation) {
      e.preventDefault();
      openModal();
    }
  });

  // If modal exists on page load, bind events immediately
  const existingModal = document.getElementById('consultation-modal');
  if (existingModal) {
    setupModalEvents(existingModal);
  }
}

// 9. Interactive Empirical Verification Dashboard (OnCourse Architectural Theme)
function initEmpiricalDashboard() {
  const container = document.getElementById('results');
  if (!container) return;

  // --- A. Student Spotlight Data & Controller ---
  const students = [
    {
      name: 'Advait M.',
      uni: 'Harvard College &bull; Class of 2028',
      major: 'Computer Science &amp; Robotics Spike',
      stat: '98%',
      label: 'Top-5 Placement Rate for Dual-Mentor UG Candidates',
      quote: '“Having two mentors meant my robotics research spike had technical academic credibility while my deadlines never slipped.”',
      badge: 'UG Pathway',
      admits: ['Harvard', 'MIT', 'Stanford']
    },
    {
      name: 'Tanya K.',
      uni: 'University of Oxford &bull; Class of 2028',
      major: 'Philosophy, Politics &amp; Economics (PPE)',
      stat: '39.2%',
      label: 'Oxbridge Offer Rate vs 14.5% Global Average (2.7x)',
      quote: '“Rigorous TSA admissions prep and Oxford collegiate mock interviews with alumni mentors gave me unmatched clarity and composure.”',
      badge: 'Oxbridge Pathway',
      admits: ['Oxford', 'LSE', 'UCL']
    },
    {
      name: 'Rohan S.',
      uni: 'The Wharton School &bull; Class of 2027',
      major: 'MBA &bull; $40K Merit Fellowship',
      stat: '$40K',
      label: 'Merit Fellowship Secured with M7 Dual-Admit',
      quote: '“My mentors reframed 6 years in emerging-market fintech into an airtight leadership thesis that secured Wharton and Columbia admits.”',
      badge: 'MBA Executive',
      admits: ['Wharton', 'Columbia', 'INSEAD']
    }
  ];

  const studentTabs = container.querySelectorAll('.spotlight-tab-btn');
  const spotlightName = document.getElementById('spotlight-name');
  const spotlightUni = document.getElementById('spotlight-uni');
  const spotlightMajor = document.getElementById('spotlight-major');
  const spotlightStat = document.getElementById('spotlight-stat');
  const spotlightLabel = document.getElementById('spotlight-label');
  const spotlightQuote = document.getElementById('spotlight-quote');
  const spotlightBadge = document.getElementById('spotlight-badge');
  const spotlightAdmits = document.getElementById('spotlight-admits');

  function renderStudent(index) {
    const s = students[index];
    if (!s) return;

    studentTabs.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active', 'bg-white', 'text-black', 'shadow-xs');
        btn.classList.remove('text-gray-600');
      } else {
        btn.classList.remove('active', 'bg-white', 'text-black', 'shadow-xs');
        btn.classList.add('text-gray-600');
      }
    });

    if (spotlightName) spotlightName.textContent = s.name;
    if (spotlightUni) spotlightUni.innerHTML = s.uni;
    if (spotlightMajor) spotlightMajor.innerHTML = s.major;
    if (spotlightStat) spotlightStat.textContent = s.stat;
    if (spotlightLabel) spotlightLabel.textContent = s.label;
    if (spotlightQuote) spotlightQuote.innerHTML = `&ldquo;${s.quote.replace(/[“”"]/g, '')}&rdquo;`;
    if (spotlightBadge) spotlightBadge.textContent = s.badge;

    if (spotlightAdmits) {
      spotlightAdmits.innerHTML = s.admits.map(a => `<span class="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono border border-white/20">${a}</span>`).join('') + '<span class="text-[10px] text-emerald-400 font-mono font-bold ml-auto">&check; Verified</span>';
    }
  }

  studentTabs.forEach((btn, idx) => {
    btn.addEventListener('click', () => renderStudent(idx));
  });

  // --- B. Dynamic Multiplier Cohort Switcher ---
  const multiplierData = {
    ivy: {
      stat: '6.9x',
      title: 'Ivy League Admit Advantage',
      desc: 'OnCourse Ivy admit rate of 28.6% versus the 4.1% global baseline average.'
    },
    oxbridge: {
      stat: '2.7x',
      title: 'Oxbridge Offer Multiplier',
      desc: 'OnCourse Oxbridge offer rate of 39.2% versus the 14.5% global average.'
    },
    mba: {
      stat: '4.2x',
      title: 'Global M7 MBA Admit Advantage',
      desc: 'OnCourse MBA candidates achieve 48.6% admit rates across Wharton, Columbia & INSEAD.'
    }
  };

  const multiplierBtns = container.querySelectorAll('.multiplier-btn');
  const multiplierStat = document.getElementById('multiplier-stat');
  const multiplierTitle = document.getElementById('multiplier-title');
  const multiplierDesc = document.getElementById('multiplier-desc');

  multiplierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-multiplier');
      const data = multiplierData[type];
      if (!data) return;

      multiplierBtns.forEach(b => {
        b.classList.remove('active', 'bg-black', 'text-white');
        b.classList.add('text-gray-600');
      });
      btn.classList.add('active', 'bg-black', 'text-white');
      btn.classList.remove('text-gray-600');

      if (multiplierStat) {
        multiplierStat.classList.add('scale-105', 'transition-transform');
        multiplierStat.textContent = data.stat;
        setTimeout(() => multiplierStat.classList.remove('scale-105'), 180);
      }
      if (multiplierTitle) multiplierTitle.textContent = data.title;
      if (multiplierDesc) multiplierDesc.textContent = data.desc;
    });
  });

  // --- C. Audited Acceptance Comparison Engine (Bar Chart) ---
  const cohortData = {
    all: [
      { name: 'Harvard University', global: 3.4, oncourse: 28.6, mult: '8.4x', spike: 'Robotics & Bio-Policy Spike' },
      { name: 'Univ. of Pennsylvania (Wharton)', global: 4.9, oncourse: 40.3, mult: '8.2x', spike: 'Fintech & Applied Math Spike' },
      { name: 'Stanford University', global: 3.6, oncourse: 31.1, mult: '8.6x', spike: 'AI Ethics & Civic Research' },
      { name: 'Columbia University', global: 4.2, oncourse: 31.0, mult: '7.4x', spike: 'Data Science & Journalism' },
      { name: 'University of Oxford', global: 14.5, oncourse: 39.2, mult: '2.7x', spike: 'PPE & TSA Masterclass' },
      { name: 'Cornell University', global: 7.0, oncourse: 54.1, mult: '7.7x', spike: 'Early Decision Alignment' },
      { name: 'MIT', global: 4.6, oncourse: 27.6, mult: '6.0x', spike: 'Hardware Olympiad Track' },
      { name: 'University of Cambridge', global: 15.8, oncourse: 42.1, mult: '2.7x', spike: 'Natural Sciences & STEP Math' },
      { name: 'Yale University', global: 4.2, oncourse: 23.6, mult: '5.6x', spike: 'International Diplomacy' }
    ],
    ivy: [
      { name: 'Harvard University', global: 3.4, oncourse: 28.6, mult: '8.4x', spike: 'Robotics & Bio-Policy Spike' },
      { name: 'Univ. of Pennsylvania', global: 4.9, oncourse: 40.3, mult: '8.2x', spike: 'Fintech & Applied Math' },
      { name: 'Columbia University', global: 4.2, oncourse: 31.0, mult: '7.4x', spike: 'Data Science & Journalism' },
      { name: 'Cornell University', global: 7.0, oncourse: 54.1, mult: '7.7x', spike: 'ED Strategy & Operations' },
      { name: 'Yale University', global: 4.2, oncourse: 23.6, mult: '5.6x', spike: 'International Diplomacy' },
      { name: 'Dartmouth College', global: 5.8, oncourse: 28.4, mult: '4.9x', spike: 'Environmental Economics' },
      { name: 'Princeton University', global: 4.3, oncourse: 23.4, mult: '5.4x', spike: 'Theoretical Physics Spike' },
      { name: 'Brown University', global: 5.1, oncourse: 26.8, mult: '5.3x', spike: 'Open Curriculum & Neuro' }
    ],
    uk: [
      { name: 'University of Oxford', global: 14.5, oncourse: 39.2, mult: '2.7x', spike: 'PPE & TSA Masterclass' },
      { name: 'University of Cambridge', global: 15.8, oncourse: 42.1, mult: '2.7x', spike: 'Natural Sciences & STEP Math' },
      { name: 'Imperial College London', global: 11.2, oncourse: 46.5, mult: '4.2x', spike: 'Aero & Mechanical Engineering' },
      { name: 'London School of Economics', global: 8.9, oncourse: 38.0, mult: '4.3x', spike: 'TMUA Prep & Economics' },
      { name: 'University College London', global: 12.0, oncourse: 49.3, mult: '4.1x', spike: 'Architecture & Urban Planning' }
    ],
    mba: [
      { name: 'The Wharton School (Penn)', global: 11.5, oncourse: 48.6, mult: '4.2x', spike: 'Fintech Venture Thesis' },
      { name: 'Columbia Business School', global: 13.6, oncourse: 52.4, mult: '3.9x', spike: 'PE & Corporate Turnaround' },
      { name: 'INSEAD (Global MBA)', global: 28.0, oncourse: 74.2, mult: '2.7x', spike: 'Multinational Operator' },
      { name: 'Stanford GSB', global: 6.2, oncourse: 21.8, mult: '3.5x', spike: 'Venture & Social Impact' },
      { name: 'Harvard Business School', global: 9.5, oncourse: 32.0, mult: '3.4x', spike: 'Healthtech Scaling' }
    ]
  };

  const barsContainer = document.getElementById('cohort-bars-container');
  const cohortFilterBtns = container.querySelectorAll('.cohort-filter-btn');

  function renderBars(category) {
    if (!barsContainer) return;
    const list = cohortData[category] || cohortData.all;
    const maxScale = 60;

    barsContainer.innerHTML = list.map((item) => {
      const gWidth = Math.max(3.5, (item.global / maxScale) * 100);
      const ocWidth = Math.min(96, (item.oncourse / maxScale) * 100);

      return `
        <div class="group/bar p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between text-xs font-semibold mb-1">
            <span class="text-gray-900 font-bold tracking-tight">${item.name}</span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono text-gray-500 hidden sm:inline opacity-0 group-hover/bar:opacity-100 transition-opacity">Spike: ${item.spike}</span>
              <span class="px-1.5 py-0.5 rounded bg-black text-white text-[10px] font-mono font-bold">${item.mult} Advantage</span>
            </div>
          </div>
          
          <div class="space-y-1">
            <!-- Global Baseline Bar -->
            <div class="flex items-center gap-2">
              <div class="h-2 rounded bg-gray-200 transition-all duration-500 ease-out" style="width: ${gWidth.toFixed(1)}%;"></div>
              <span class="text-[10px] font-mono text-gray-400 font-semibold leading-none">${item.global}%</span>
            </div>
            <!-- OnCourse Audited Bar -->
            <div class="flex items-center gap-2">
              <div class="h-3 rounded bg-black transition-all duration-500 ease-out" style="width: ${ocWidth.toFixed(1)}%;"></div>
              <span class="text-[11px] font-mono font-black text-black leading-none">${item.oncourse}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  cohortFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cohort');
      cohortFilterBtns.forEach(b => {
        b.classList.remove('active', 'bg-black', 'text-white');
        b.classList.add('text-gray-600');
      });
      btn.classList.add('active', 'bg-black', 'text-white');
      btn.classList.remove('text-gray-600');
      renderBars(cat);
    });
  });

  // Initial render
  renderBars('all');

  // --- D. Audit Methodology Modal Controller ---
  const auditModal = document.getElementById('audit-methodology-modal');
  const btnOpenModal = document.getElementById('btn-open-audit-modal');
  const btnCloseModal = document.getElementById('btn-close-audit-modal');
  const btnDismissModal = document.getElementById('btn-dismiss-audit-modal');

  if (auditModal) {
    const openAudit = () => auditModal.classList.remove('hidden');
    const closeAudit = () => auditModal.classList.add('hidden');

    if (btnOpenModal) btnOpenModal.addEventListener('click', openAudit);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeAudit);
    if (btnDismissModal) btnDismissModal.addEventListener('click', closeAudit);
    auditModal.addEventListener('click', (e) => {
      if (e.target === auditModal) closeAudit();
    });
  }
}
