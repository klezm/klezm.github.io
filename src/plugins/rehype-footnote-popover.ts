import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

interface Options {
  /**
   * Whether to remove the original footnotes section from the bottom of the page.
   * Default: false
   */
  removeFootnotesSection?: boolean;
}

export function rehypeFootnotePopover(options: Options = {}) {
  const { removeFootnotesSection = false } = options;

  return (tree: Root) => {
    const footnotes: Record<string, Element> = {};

    // 1. Find all footnote definitions (usually in a <section class="footnotes"> or <div class="footnotes">)
    // We look for the standard GFM pattern: <li id="fn-1">...</li>
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'li' &&
        node.properties?.id &&
        String(node.properties.id).startsWith('user-content-fn-')
      ) {
        const id = String(node.properties.id);
        // Store the content of the footnote. We strip the "backref" link (↩) usually found at the end.
        const content = filterBackrefs(node.children);
        footnotes[id] = {
          type: 'element',
          tagName: 'div',
          children: content,
          properties: {},
        };
      }
    });

    // 2. Find all footnote references (e.g. <sup id="fnref-1"><a href="#fn-1" ...>1</a></sup>)
    visit(tree, 'element', (node, index, parent) => {
      // Check for <sup> with data-footnote-ref (GFM standard) OR class "footnote-ref"
      const isFootnoteRef =
        (node.tagName === 'sup' &&
          node.properties?.dataFootnoteRef !== undefined) ||
        (node.tagName === 'a' &&
          node.properties?.className &&
          (node.properties.className as string[]).includes('footnote-ref')); // fallback for some parsers

      // We are looking for the <a> inside the <sup> usually
      let anchor: Element | undefined;
      let refId: string | undefined;

      if (node.tagName === 'sup') {
        const found = node.children.find(
          (c) => c.type === 'element' && c.tagName === 'a'
        ) as Element | undefined;
        if (found) anchor = found;
      } else if (node.tagName === 'a') {
        anchor = node;
      }

      if (!anchor) return;

      const href = String(anchor.properties?.href || '');
      // GFM refs href usually starts with #user-content-fn-
      if (!href.startsWith('#user-content-fn-')) return;

      const footnoteId = href.substring(1); // remove #
      const footnoteContent = footnotes[footnoteId];

      if (!footnoteContent) return;

      // 3. Construct DaisyUI dropdown-hover structure
      // <span class="dropdown dropdown-hover">
      //   <span tabindex="0" role="button">1</span>
      //   <span class="dropdown-content ...">...</span>
      // </span>

      const triggerSpan: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
          tabindex: '0',
          role: 'button',
          className: [
            'underline',
            'decoration-dotted',
            'underline-offset-2',
            'cursor-pointer',
            'text-primary',
          ],
          'aria-label': `View footnote ${
            anchor.children[0] && 'value' in anchor.children[0]
              ? anchor.children[0].value
              : ''
          }`,
        },
        children: anchor.children, // usually text '1'
      };

      const dropdownContent: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
          tabindex: '-1',
          className: [
            'dropdown-content',
            'block',
            'z-[10]',
            'p-4',
            'rounded-box',
            'shadow-xl',
            'bg-base-100',
            'border',
            'border-base-200',
            'w-64',
            'text-sm',
            'not-prose', // Reset prose styling inside
          ],
        },
        children: convertToInline(
          JSON.parse(JSON.stringify(footnoteContent.children))
        ),
      };

      // Replace the original reference (node) with the dropdown wrapper
      if (parent && index !== undefined) {
        const wrapper: Element = {
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['dropdown', 'dropdown-hover', 'dropdown-top'],
          },
          children: [triggerSpan, dropdownContent],
        };
        parent.children[index] = wrapper;
      }
    });

    // 4. Optionally remove the original footnotes section
    if (removeFootnotesSection) {
      visit(tree, 'element', (node, index, parent) => {
        if (
          node.tagName === 'section' &&
          node.properties?.dataFootnotes !== undefined &&
          parent &&
          index !== undefined
        ) {
          parent.children.splice(index, 1);
        }
      });
    }
  };
}

// Helper to remove the "back to content" links (↩) from the copied content
function filterBackrefs(children: any[]): any[] {
  return children
    .map((child) => {
      if (child.type === 'element') {
        // If it's a backref link, remove it
        if (
          child.tagName === 'a' &&
          child.properties?.dataFootnoteBackref !== undefined
        ) {
          return null;
        }
        // Recursive filtering
        if (child.children) {
          return { ...child, children: filterBackrefs(child.children) };
        }
      }
      return child;
    })
    .filter(Boolean);
}

// Block elements that need to be converted to inline equivalents
const BLOCK_TO_INLINE: Record<string, string> = {
  p: 'span',
  div: 'span',
  ul: 'span',
  ol: 'span',
  li: 'span',
  h1: 'span',
  h2: 'span',
  h3: 'span',
  h4: 'span',
  h5: 'span',
  h6: 'span',
  blockquote: 'span',
  pre: 'span',
  figure: 'span',
  figcaption: 'span',
};

// Convert block elements to inline equivalents for valid HTML inside <span>
function convertToInline(children: any[]): any[] {
  return children.map((child) => {
    if (child.type === 'element') {
      const inlineTag = BLOCK_TO_INLINE[child.tagName];
      if (inlineTag) {
        console.log(
          `[rehype-footnote-popover] Converting ${child.tagName} -> ${inlineTag}`
        );
      }
      const newChild = {
        ...child,
        tagName: inlineTag || child.tagName,
        properties: {
          ...child.properties,
          className: [
            ...(Array.isArray(child.properties?.className)
              ? child.properties.className
              : []),
            // Add display classes based on original tag
            child.tagName === 'li' ? 'block list-disc ml-4' : '',
            child.tagName === 'ul' || child.tagName === 'ol' ? 'block' : '',
            child.tagName === 'p' ? 'block' : '',
            child.tagName.match(/^h[1-6]$/) ? 'block font-bold' : '',
          ].filter(Boolean),
        },
      };
      if (child.children) {
        newChild.children = convertToInline(child.children);
      }
      return newChild;
    }
    return child;
  });
}
