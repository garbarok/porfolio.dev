/**
 * Mobile Menu Manager
 * Handles mobile menu toggle functionality
 * following Single Responsibility Principle
 */

interface MobileMenuElements {
  button: HTMLElement;
  menu: HTMLElement;
  menuIcon: HTMLElement;
  closeIcon: HTMLElement;
}

/**
 * Manages mobile menu state and interactions
 */
export class MobileMenuManager {
  private button: HTMLElement;
  private menu: HTMLElement;
  private menuIcon: HTMLElement;
  private closeIcon: HTMLElement;

  constructor(elements: MobileMenuElements) {
    this.button = elements.button;
    this.menu = elements.menu;
    this.menuIcon = elements.menuIcon;
    this.closeIcon = elements.closeIcon;
  }

  /**
   * Toggles the mobile menu open/closed state
   */
  private toggle = (): void => {
    const isHidden = this.menu.classList.contains("hidden");

    this.menu.classList.toggle("hidden");
    this.menuIcon.classList.toggle("hidden");
    this.closeIcon.classList.toggle("hidden");
    this.button.setAttribute("aria-expanded", isHidden ? "true" : "false");
  };

  /**
   * Initializes event listeners
   */
  public init(): void {
    this.button.addEventListener("click", this.toggle);
  }

  /**
   * Cleans up event listeners
   */
  public destroy(): void {
    this.button.removeEventListener("click", this.toggle);
  }
}

/**
 * Factory function to safely create a mobile menu manager
 * Returns null if required elements are not found
 */
export function createMobileMenuManager(
  buttonId: string = "mobile-menu-button",
  menuId: string = "mobile-menu",
  menuIconId: string = "menu-icon",
  closeIconId: string = "close-icon"
): MobileMenuManager | null {
  const button = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);
  const menuIcon = document.getElementById(menuIconId);
  const closeIcon = document.getElementById(closeIconId);

  if (!button || !menu || !menuIcon || !closeIcon) {
    console.warn("Mobile menu elements not found");
    return null;
  }

  const manager = new MobileMenuManager({
    button: button as HTMLElement,
    menu: menu as HTMLElement,
    menuIcon: menuIcon as HTMLElement,
    closeIcon: closeIcon as HTMLElement,
  });

  manager.init();
  return manager;
}
