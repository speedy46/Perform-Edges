/**
 * Performedges - Core Frontend Interactive Logic
 * Fully debugged, validated, and hardened
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCounters();
    initScrollAnimations();
    initCookieConsent();
    initSmoothScroll();
});

/* ==========================================================================
   Navigation & Dropdown Controllers
   ========================================================================== */
function initNavigation() {
    // Outside click closes active dropdowns
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            closeAllDropdowns();
        }
    });

    // Escape key closes menus & modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            closeAllModals();
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
    });
    document.querySelectorAll('.dropdown-container.active').forEach(container => {
        container.classList.remove('active');
    });
}

// Global handler called via onclick="toggleDropdown(event)"
window.toggleDropdown = function (event) {
    event.stopPropagation();
    const container = event.currentTarget.closest('.dropdown-container');
    if (!container) return;

    const menu = container.querySelector('.dropdown-menu');
    const isCurrentlyOpen = menu.classList.contains('show');

    // Close all other open dropdowns first
    closeAllDropdowns();

    // Toggle current dropdown
    if (!isCurrentlyOpen) {
        menu.classList.add('show');
        container.classList.add('active');
    }
};

// Global mobile menu toggle
window.toggleMobileMenu = function () {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
};

/* ==========================================================================
   Tab Navigation System
   ========================================================================== */
window.showTab = function (tabName, event) {
    if (event) event.preventDefault();

    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // Deactivate all tab buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Activate selected content and button
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
};

/* ==========================================================================
   Animated Number Counters (Solved P0 Bug)
   ========================================================================== */
function animateCounter(element) {
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';

    const target = parseInt(element.getAttribute('data-target'), 10) || 0;
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic calculation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        element.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
    }

    requestAnimationFrame(update);
}

function initCounters() {
    const counterElements = document.querySelectorAll('.counter[data-target]');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -40px 0px'
    });

    counterElements.forEach(el => counterObserver.observe(el));
}

/* ==========================================================================
   Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .scale-in');
    if (!animatedElements.length) return;

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animObserver.observe(el));
}

/* ==========================================================================
   Smooth Scrolling for Anchors
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

/* ==========================================================================
   Modals System (Advertiser & Publisher Inquiries)
   ========================================================================== */
window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

function closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Global Form Submissions
window.handleFormSubmit = function (e, formType) {
    e.preventDefault();
    const form = e.target;
    
    // Simple validation check
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });

    if (!isValid) {
        showToast('Please complete all required fields.', 'error');
        return;
    }

    // Success response simulation
    showToast(`Thank you! Your ${formType} application has been received. Our team will contact you within 24 hours.`, 'success');
    form.reset();
    closeAllModals();
};

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
window.showToast = function (message, type = 'info') {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotice';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }

    const icon = type === 'success' ? '✓' : (type === 'error' ? '⚠' : 'ℹ');
    toast.innerHTML = `<span style="font-weight:bold;color:${type === 'success' ? '#3EB489' : '#f87171'}">${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
};

/* ==========================================================================
   Cookie Consent (GDPR/ePrivacy Mandate)
   ========================================================================== */
function initCookieConsent() {
    const consentGiven = localStorage.getItem('performedges_cookie_consent');
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    if (!consentGiven) {
        setTimeout(() => {
            banner.style.display = 'block';
        }, 1200);
    }
}

window.acceptCookies = function () {
    localStorage.setItem('performedges_cookie_consent', 'accepted');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
    showToast('Cookie preferences saved.', 'success');
};

window.declineCookies = function () {
    localStorage.setItem('performedges_cookie_consent', 'declined');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
    showToast('Essential cookies only enabled.', 'info');
};
