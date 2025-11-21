/**
 * Scroll to top functionality with UX best practices
 * - Shows button after scrolling down 300px
 * - Hides button when within 100px of top
 * - Smooth scroll animation
 * - Respects reduced motion preferences
 * - Throttled scroll events for performance
 */

const SCROLL_THRESHOLD_SHOW = 300; // Show button after scrolling 300px
const SCROLL_THRESHOLD_HIDE = 100; // Hide button when within 100px of top
const THROTTLE_DELAY = 50; // Throttle scroll events by 50ms (more responsive)

// Store event handlers for proper cleanup
let scrollHandler: (() => void) | null = null;
let clickHandler: (() => void) | null = null;
let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
let lastScrollTime = 0;

/**
 * Throttle function to limit the rate of function execution
 */
function throttle(func: () => void, wait: number): () => void {
  return function executedFunction() {
    const now = Date.now();

    if (now - lastScrollTime >= wait) {
      lastScrollTime = now;
      func();
    }
  };
}

/**
 * Toggle scroll-to-top button visibility based on scroll position
 */
function toggleScrollButton() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  const isVisible = scrollButton.classList.contains('show');

  // Show button when scrolled past the show threshold
  if (scrollPosition > SCROLL_THRESHOLD_SHOW && !isVisible) {
    scrollButton.classList.add('show');
  }
  // Hide button when scrolled back above the hide threshold
  else if (scrollPosition < SCROLL_THRESHOLD_HIDE && isVisible) {
    scrollButton.classList.remove('show');
  }
}

/**
 * Scroll to top with smooth animation
 */
function scrollToTop() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

/**
 * Initialize scroll-to-top functionality
 */
export function initScrollToTop() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  // Clean up any existing listeners first
  cleanupScrollToTop();

  // Create throttled scroll handler
  scrollHandler = throttle(toggleScrollButton, THROTTLE_DELAY);

  // Create click handler
  clickHandler = scrollToTop;

  // Create keyboard handler
  keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  // Add event listeners
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollButton.addEventListener('click', clickHandler);
  scrollButton.addEventListener('keydown', keydownHandler);

  // Initial check
  toggleScrollButton();
}

/**
 * Cleanup scroll-to-top functionality (useful for SPA navigation)
 */
export function cleanupScrollToTop() {
  const scrollButton = document.getElementById('scroll-to-top');

  // Remove event listeners if they exist
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }

  if (scrollButton) {
    if (clickHandler) {
      scrollButton.removeEventListener('click', clickHandler);
      clickHandler = null;
    }

    if (keydownHandler) {
      scrollButton.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
  }

  // Reset last scroll time
  lastScrollTime = 0;
}
