/**
 * Footnote Popover Script
 * Adds hover popovers to footnote references that display the footnote content.
 */

interface FootnotePopover {
  popover: HTMLElement;
  currentRef: HTMLElement | null;
}

function initFootnotePopovers(): void {
  const footnoteRefs = document.querySelectorAll<HTMLAnchorElement>(
    'a[data-footnote-ref]'
  );

  if (footnoteRefs.length === 0) return;

  // Create a single popover element to reuse
  const popover = createPopoverElement();
  document.body.appendChild(popover);

  const state: FootnotePopover = {
    popover,
    currentRef: null,
  };

  // Add event listeners to each footnote reference
  footnoteRefs.forEach((ref) => {
    ref.addEventListener('mouseenter', (e) => handleMouseEnter(e, state));
    ref.addEventListener('mouseleave', (e) => handleMouseLeave(e, state));
    ref.addEventListener('focus', (e) => handleMouseEnter(e, state));
    ref.addEventListener('blur', (e) => handleMouseLeave(e, state));
  });

  // Also hide popover when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target as Node) && state.currentRef !== e.target) {
      hidePopover(state);
    }
  });

  // Hide popover on scroll for better UX
  window.addEventListener('scroll', () => hidePopover(state), { passive: true });
}

function createPopoverElement(): HTMLElement {
  const popover = document.createElement('div');
  popover.className = 'footnote-popover';
  popover.setAttribute('role', 'tooltip');
  popover.setAttribute('aria-hidden', 'true');
  return popover;
}

function handleMouseEnter(e: Event, state: FootnotePopover): void {
  const target = e.currentTarget as HTMLAnchorElement;
  const href = target.getAttribute('href');

  if (!href) return;

  // Extract the footnote ID from the href
  const footnoteId = href.replace('#', '');
  const footnoteContent = document.getElementById(footnoteId);

  if (!footnoteContent) return;

  state.currentRef = target;

  // Clone the footnote content and clean it up
  const content = getFootnoteContent(footnoteContent);

  if (!content) return;

  state.popover.innerHTML = content;
  state.popover.setAttribute('aria-hidden', 'false');

  // Position and show the popover
  positionPopover(target, state.popover);
  state.popover.classList.add('visible');
}

function handleMouseLeave(_e: Event, state: FootnotePopover): void {
  hidePopover(state);
}

function hidePopover(state: FootnotePopover): void {
  state.popover.classList.remove('visible');
  state.popover.setAttribute('aria-hidden', 'true');
  state.currentRef = null;
}

function getFootnoteContent(footnoteElement: Element): string {
  // Clone the footnote content
  const clone = footnoteElement.cloneNode(true) as HTMLElement;

  // Remove the back-reference links (the ↩ links)
  const backRefs = clone.querySelectorAll('.data-footnote-backref, [data-footnote-backref]');
  backRefs.forEach((ref) => ref.remove());

  // Remove the id from the clone to avoid duplicate IDs in the DOM
  clone.removeAttribute('id');

  // Remove any nested footnote references to avoid confusion
  const nestedRefs = clone.querySelectorAll('[data-footnote-ref]');
  nestedRefs.forEach((ref) => {
    // Replace with just the text content
    const text = document.createTextNode(ref.textContent || '');
    ref.parentNode?.replaceChild(text, ref);
  });

  // Get the inner HTML content - keep all of it including lists, paragraphs, etc.
  return clone.innerHTML.trim();
}

function positionPopover(reference: HTMLElement, popover: HTMLElement): void {
  const refRect = reference.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate initial position (above the reference by default)
  let top = refRect.top - 8; // 8px gap
  let left = refRect.left + refRect.width / 2;

  // Check if popover would go off the top of the viewport
  const popoverHeight = popover.offsetHeight || 100; // Estimate if not yet rendered
  if (top - popoverHeight < 10) {
    // Position below instead
    top = refRect.bottom + 8;
    popover.classList.add('below');
    popover.classList.remove('above');
  } else {
    popover.classList.add('above');
    popover.classList.remove('below');
  }

  // Ensure popover doesn't go off the left or right edges
  const popoverWidth = popover.offsetWidth || 300; // Estimate if not yet rendered
  const halfWidth = popoverWidth / 2;

  if (left - halfWidth < 10) {
    left = halfWidth + 10;
  } else if (left + halfWidth > viewportWidth - 10) {
    left = viewportWidth - halfWidth - 10;
  }

  popover.style.setProperty('--popover-top', `${top}px`);
  popover.style.setProperty('--popover-left', `${left}px`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFootnotePopovers);
} else {
  initFootnotePopovers();
}

// Re-initialize on view transitions (for Astro client-side routing)
document.addEventListener('astro:page-load', initFootnotePopovers);
