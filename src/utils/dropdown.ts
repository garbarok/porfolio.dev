/**
 * Dropdown Manager
 * Handles dropdown menu toggle functionality with keyboard navigation
 * following Single Responsibility Principle
 */

interface DropdownElements {
  button: HTMLElement;
  menu: HTMLElement;
  icon?: HTMLElement;
  container: HTMLElement;
}

/**
 * Manages dropdown state and interactions
 */
export class DropdownManager {
  private button: HTMLElement;
  private menu: HTMLElement;
  private icon?: HTMLElement;
  private container: HTMLElement;
  private isOpen: boolean = false;
  private menuItems: NodeListOf<HTMLElement>;

  constructor(elements: DropdownElements) {
    this.button = elements.button;
    this.menu = elements.menu;
    this.icon = elements.icon;
    this.container = elements.container;
    this.menuItems = this.menu.querySelectorAll('[role="menuitem"]');
  }

  /**
   * Opens the dropdown menu
   */
  private open = (): void => {
    this.isOpen = true;
    this.menu.classList.remove('hidden', 'closing');
    this.menu.classList.add('open');
    this.icon?.classList.add('open');
    this.button.setAttribute('aria-expanded', 'true');

    // Focus first menu item
    if (this.menuItems.length > 0) {
      (this.menuItems[0] as HTMLElement).focus();
    }
  };

  /**
   * Closes the dropdown menu with animation
   */
  private close = (): void => {
    this.isOpen = false;
    this.menu.classList.remove('open');
    this.menu.classList.add('closing');
    this.icon?.classList.remove('open');
    this.button.setAttribute('aria-expanded', 'false');

    // Hide after animation completes
    setTimeout(() => {
      this.menu.classList.add('hidden');
      this.menu.classList.remove('closing');
    }, 75);
  };

  /**
   * Toggles the dropdown open/closed state
   */
  private toggle = (): void => {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  /**
   * Handles click outside to close dropdown
   */
  private handleClickOutside = (event: MouseEvent): void => {
    if (this.isOpen && !this.container.contains(event.target as Node)) {
      this.close();
    }
  };

  /**
   * Handles keyboard navigation
   */
  private handleKeydown = (event: KeyboardEvent): void => {
    if (!this.isOpen) {
      // Open on Enter or Space when button is focused
      if ((event.key === 'Enter' || event.key === ' ') && event.target === this.button) {
        event.preventDefault();
        this.open();
      }
      return;
    }

    const focusedIndex = Array.from(this.menuItems).indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        this.button.focus();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (focusedIndex < this.menuItems.length - 1) {
          (this.menuItems[focusedIndex + 1] as HTMLElement).focus();
        } else {
          (this.menuItems[0] as HTMLElement).focus();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (focusedIndex > 0) {
          (this.menuItems[focusedIndex - 1] as HTMLElement).focus();
        } else {
          (this.menuItems[this.menuItems.length - 1] as HTMLElement).focus();
        }
        break;

      case 'Home':
        event.preventDefault();
        (this.menuItems[0] as HTMLElement).focus();
        break;

      case 'End':
        event.preventDefault();
        (this.menuItems[this.menuItems.length - 1] as HTMLElement).focus();
        break;

      case 'Tab':
        this.close();
        break;
    }
  };

  /**
   * Handles clicks on menu items
   */
  private handleMenuItemClick = (): void => {
    // Close dropdown when menu item is clicked
    this.close();
  };

  /**
   * Initializes event listeners
   */
  public init(): void {
    this.button.addEventListener('click', this.toggle);
    document.addEventListener('click', this.handleClickOutside);
    this.container.addEventListener('keydown', this.handleKeydown);

    this.menuItems.forEach(item => {
      item.addEventListener('click', this.handleMenuItemClick);
    });
  }

  /**
   * Cleans up event listeners
   */
  public destroy(): void {
    this.button.removeEventListener('click', this.toggle);
    document.removeEventListener('click', this.handleClickOutside);
    this.container.removeEventListener('keydown', this.handleKeydown);

    this.menuItems.forEach(item => {
      item.removeEventListener('click', this.handleMenuItemClick);
    });
  }
}

/**
 * Factory function to safely create a dropdown manager
 * Returns null if required elements are not found
 */
export function createDropdownManager(
  container: HTMLElement
): DropdownManager | null {
  const button = container.querySelector('[data-dropdown-button]') as HTMLElement;
  const menu = container.querySelector('[data-dropdown-menu]') as HTMLElement;
  const icon = container.querySelector('[data-dropdown-icon]') as HTMLElement;

  if (!button || !menu) {
    console.warn('Dropdown elements not found');
    return null;
  }

  const manager = new DropdownManager({
    button,
    menu,
    icon,
    container,
  });

  manager.init();
  return manager;
}
