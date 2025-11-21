/**
 * Section Highlight Manager
 * Handles active section detection and navigation item highlighting
 * following Single Responsibility Principle
 */

interface SectionHighlightConfig {
  sections: NodeListOf<Element>;
  navItems: NodeListOf<Element>;
  headerOffset?: number;
  bottomOffset?: number;
}

interface SectionHighlightClasses {
  active: string[];
  inactive: string[];
}

const DEFAULT_CLASSES: SectionHighlightClasses = {
  active: ["bg-gray-950/50", "text-white"],
  inactive: ["text-gray-300", "hover:bg-white/5", "hover:text-white"],
};

/**
 * Updates navigation items to reflect the active section
 */
export class SectionHighlightManager {
  private sections: NodeListOf<Element>;
  private navItems: NodeListOf<Element>;
  private headerOffset: number;
  private bottomOffset: number;
  private classes: SectionHighlightClasses;
  private scrollTimeout: number | null = null;

  constructor(
    config: SectionHighlightConfig,
    classes: SectionHighlightClasses = DEFAULT_CLASSES
  ) {
    this.sections = config.sections;
    this.navItems = config.navItems;
    this.headerOffset = config.headerOffset ?? 100;
    this.bottomOffset = config.bottomOffset ?? 100;
    this.classes = classes;
  }

  /**
   * Updates the active state of navigation items
   */
  private updateActiveNavItem(sectionId: string): void {
    this.navItems.forEach((item) => {
      const isActive = item.getAttribute("aria-label") === sectionId;

      if (isActive) {
        item.classList.add(...this.classes.active);
        item.classList.remove(...this.classes.inactive);
      } else {
        item.classList.remove(...this.classes.active);
        item.classList.add(...this.classes.inactive);
      }
    });
  }

  /**
   * Finds the currently active section based on scroll position
   */
  private findActiveSection(): void {
    let activeSection: Element | null = null;
    let largestTop = -Infinity;

    // Find the section that's currently most prominent in the viewport
    // We want the section whose top has most recently passed the header threshold
    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;

      // A section is "active" if its top is at or above our threshold (headerOffset)
      // Among sections that meet this criteria, pick the one with the largest top value
      // (closest to the threshold = most recently scrolled past)
      if (sectionTop <= this.headerOffset && sectionTop > largestTop) {
        largestTop = sectionTop;
        activeSection = section;
      }
    });

    // Edge case: at the very top (no section has reached the threshold yet)
    if (!activeSection && this.sections.length > 0) {
      activeSection = this.sections[0];
    }

    // Edge case: at the very bottom
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - this.bottomOffset;
    if (isAtBottom && this.sections.length > 0) {
      activeSection = this.sections[this.sections.length - 1];
    }

    if (activeSection?.id) {
      this.updateActiveNavItem(activeSection.id);
    }
  }

  /**
   * Handles scroll events with requestAnimationFrame for performance
   */
  private handleScroll = (): void => {
    if (this.scrollTimeout) {
      window.cancelAnimationFrame(this.scrollTimeout);
    }
    this.scrollTimeout = window.requestAnimationFrame(() =>
      this.findActiveSection()
    );
  };

  /**
   * Initializes the section highlight manager
   */
  public init(): void {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.findActiveSection(); // Initial check
  }

  /**
   * Cleans up event listeners
   */
  public destroy(): void {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.scrollTimeout) {
      window.cancelAnimationFrame(this.scrollTimeout);
    }
  }
}

/**
 * Factory function to create and initialize a section highlight manager
 */
export function createSectionHighlighter(
  config: SectionHighlightConfig,
  classes?: SectionHighlightClasses,
  excludeSections: string[] = []
): SectionHighlightManager {
  // Filter out sections that should not be highlighted on scroll
  const filteredSections = Array.from(config.sections).filter(
    (section) => !excludeSections.includes(section.id)
  );

  // Convert back to NodeList-like structure
  const sectionsToObserve = {
    length: filteredSections.length,
    item: (index: number) => filteredSections[index],
    forEach: (callback: (section: Element, index: number) => void) => {
      filteredSections.forEach(callback);
    },
    [Symbol.iterator]: () => filteredSections[Symbol.iterator](),
  } as unknown as NodeListOf<Element>;

  const manager = new SectionHighlightManager(
    { ...config, sections: sectionsToObserve },
    classes
  );
  manager.init();
  return manager;
}

/**
 * Check if current page is a home page (for conditional initialization)
 */
export function isHomePage(pathname: string): boolean {
  return pathname === "/" || pathname === "/en" || pathname === "/en/";
}
