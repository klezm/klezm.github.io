// Footnote popover functionality
// Shows footnote content in a popover when hovering over footnote references

interface PopoverState {
  popover: HTMLDivElement | null;
  currentRef: HTMLAnchorElement | null;
  hideTimer: NodeJS.Timeout | null;
  isMouseOverPopover: boolean;
  isMouseOverRef: boolean;
}

const state: PopoverState = {
  popover: null,
  currentRef: null,
  hideTimer: null,
  isMouseOverPopover: false,
  isMouseOverRef: false,
};

// Delay before hiding popover (ms)
const HIDE_DELAY = 300;

function createPopover(): HTMLDivElement {
  const popover = document.createElement('div');
  popover.className = 'footnote-popover';
  popover.setAttribute('role', 'tooltip');
  document.body.appendChild(popover);
  return popover;
}

function getFootnoteContent(ref: HTMLAnchorElement): HTMLElement | null {
  const href = ref.getAttribute('href');
  if (!href) return null;
  
  const footnoteId = href.slice(1); // Remove the # from href
  const footnoteElement = document.getElementById(footnoteId);
  
  return footnoteElement;
}

function positionPopover(popover: HTMLDivElement, ref: HTMLAnchorElement): void {
  const rect = ref.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  
  // Calculate position - place below the reference by default
  let top = rect.bottom + window.scrollY + 8;
  let left = rect.left + window.scrollX;
  
  // Adjust if popover would go off-screen
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Check if popover would go off right side
  if (left + popoverRect.width > viewportWidth + window.scrollX) {
    left = viewportWidth + window.scrollX - popoverRect.width - 16;
  }
  
  // Check if popover would go off bottom
  if (rect.bottom + popoverRect.height + 8 > viewportHeight + window.scrollY) {
    // Place above instead
    top = rect.top + window.scrollY - popoverRect.height - 8;
  }
  
  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;
}

function showPopover(ref: HTMLAnchorElement): void {
  // Clear any pending hide timer
  if (state.hideTimer) {
    clearTimeout(state.hideTimer);
    state.hideTimer = null;
  }
  
  // Create popover if it doesn't exist
  if (!state.popover) {
    state.popover = createPopover();
    
    // Add mouse events to popover to keep it visible
    state.popover.addEventListener('mouseenter', () => {
      state.isMouseOverPopover = true;
      if (state.hideTimer) {
        clearTimeout(state.hideTimer);
        state.hideTimer = null;
      }
    });
    
    state.popover.addEventListener('mouseleave', () => {
      state.isMouseOverPopover = false;
      scheduleHidePopover();
    });
  }
  
  // If already showing the same reference, don't rebuild
  if (state.currentRef === ref && state.popover.classList.contains('visible')) {
    return;
  }
  
  state.currentRef = ref;
  
  // Get footnote content
  const footnoteElement = getFootnoteContent(ref);
  if (!footnoteElement) return;
  
  // Clone the footnote content (excluding the back reference link)
  const content = footnoteElement.cloneNode(true) as HTMLElement;
  
  // Remove the back reference link (↩)
  const backRef = content.querySelector('[data-footnote-backref]');
  if (backRef) {
    backRef.remove();
  }
  
  // Clear and set popover content
  state.popover.innerHTML = '';
  state.popover.appendChild(content);
  
  // Position and show popover
  state.popover.classList.add('visible');
  
  // Position after adding visible class so dimensions are calculated correctly
  requestAnimationFrame(() => {
    if (state.popover) {
      positionPopover(state.popover, ref);
    }
  });
}

function scheduleHidePopover(): void {
  // Only hide if mouse is not over either the reference or the popover
  if (!state.isMouseOverRef && !state.isMouseOverPopover) {
    state.hideTimer = setTimeout(() => {
      hidePopover();
    }, HIDE_DELAY);
  }
}

function hidePopover(): void {
  if (state.popover) {
    state.popover.classList.remove('visible');
    state.currentRef = null;
  }
  if (state.hideTimer) {
    clearTimeout(state.hideTimer);
    state.hideTimer = null;
  }
}

function initializeFootnotePopovers(): void {
  // Find all footnote references
  const footnoteRefs = document.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]');
  
  footnoteRefs.forEach((ref) => {
    ref.addEventListener('mouseenter', () => {
      state.isMouseOverRef = true;
      showPopover(ref);
    });
    
    ref.addEventListener('mouseleave', () => {
      state.isMouseOverRef = false;
      scheduleHidePopover();
    });
    
    // Prevent default navigation on click - let the popover handle it
    ref.addEventListener('click', (e) => {
      // Allow default behavior (scroll to footnote)
      // but keep popover visible
      e.preventDefault();
      const href = ref.getAttribute('href');
      if (href) {
        const footnoteElement = document.getElementById(href.slice(1));
        if (footnoteElement) {
          footnoteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFootnotePopovers);
} else {
  initializeFootnotePopovers();
}
