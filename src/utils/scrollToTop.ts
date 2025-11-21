/**
 * Scroll to top functionality with UX best practices
 * - Shows button after scrolling down 400px
 * - Smooth scroll animation
 * - Respects reduced motion preferences
 * - Debounced scroll events for performance
 */

const SCROLL_THRESHOLD = 400; // Show button after scrolling 400px
const DEBOUNCE_DELAY = 100; // Debounce scroll events by 100ms

/**
 * Debounce function to limit the rate of function execution
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Toggle scroll-to-top button visibility based on scroll position
 */
function toggleScrollButton() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (scrollPosition > SCROLL_THRESHOLD) {
    scrollButton.classList.add('show');
  } else {
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
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

/**
 * Initialize scroll-to-top functionality
 */
export function initScrollToTop() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  // Create debounced scroll handler
  const debouncedToggle = debounce(toggleScrollButton, DEBOUNCE_DELAY);

  // Add scroll event listener
  window.addEventListener('scroll', debouncedToggle, { passive: true });

  // Add click event listener
  scrollButton.addEventListener('click', scrollToTop);

  // Add keyboard support (Enter and Space)
  scrollButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  });

  // Initial check
  toggleScrollButton();
}

/**
 * Cleanup scroll-to-top functionality (useful for SPA navigation)
 */
export function cleanupScrollToTop() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  // Remove all event listeners by cloning and replacing the element
  const newButton = scrollButton.cloneNode(true);
  scrollButton.parentNode?.replaceChild(newButton, scrollButton);
}
