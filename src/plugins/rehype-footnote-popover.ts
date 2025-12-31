/**
 * Rehype plugin to add popover functionality to footnote references.
 *
 * This plugin finds footnote references and adds popover elements containing
 * the footnote content. It uses the HTML Popover API for displaying the
 * footnotes on hover/focus.
 */
import type { Root, Element, ElementContent } from 'hast';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';
import type { Plugin } from 'unified';

interface FootnoteDefinition {
  id: string;
  content: ElementContent[];
}

/**
 * Finds all footnote definitions in the document.
 * Footnote definitions are `<li>` elements with IDs starting with "user-content-fn-".
 */
function findFootnoteDefinitions(tree: Root): Map<string, FootnoteDefinition> {
  const definitions = new Map<string, FootnoteDefinition>();

  visit(tree, 'element', (node: Element) => {
    if (
      node.tagName === 'li' &&
      typeof node.properties?.id === 'string' &&
      node.properties.id.startsWith('user-content-fn-')
    ) {
      const id = node.properties.id;
      // Clone the children, excluding the back-reference link
      const content = node.children.filter((child) => {
        if (child.type === 'element' && child.tagName === 'a') {
          const href = child.properties?.href;
          if (typeof href === 'string' && href.includes('fnref')) {
            return false;
          }
        }
        return true;
      });

      // Also filter out back-reference links nested within paragraphs
      const filteredContent = content.map((child) => {
        if (child.type === 'element' && child.tagName === 'p') {
          return {
            ...child,
            children: child.children.filter((c) => {
              if (c.type === 'element' && c.tagName === 'a') {
                const href = c.properties?.href;
                if (typeof href === 'string' && href.includes('fnref')) {
                  return false;
                }
              }
              return true;
            }),
          } as Element;
        }
        return child;
      });

      definitions.set(id, { id, content: filteredContent });
    }
  });

  return definitions;
}

/**
 * Rehype plugin to add popover content to footnote references.
 */
const rehypeFootnotePopover: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const definitions = findFootnoteDefinitions(tree);

    visit(tree, 'element', (node: Element, index, parent) => {
      // Find <sup> elements containing footnote reference links
      if (node.tagName === 'sup' && parent) {
        const link = node.children.find(
          (child): child is Element =>
            child.type === 'element' &&
            child.tagName === 'a' &&
            typeof child.properties?.href === 'string' &&
            child.properties.href.startsWith('#user-content-fn-')
        );

        if (link && typeof link.properties?.href === 'string') {
          // Extract the footnote ID from the href
          const footnoteId = link.properties.href.slice(1); // Remove the leading #
          const definition = definitions.get(footnoteId);

          if (definition) {
            // Generate unique popover ID
            const popoverId = `footnote-popover-${footnoteId.replace('user-content-fn-', '')}`;

            // Create the popover element with the footnote content
            // Using CSS-only approach without popover API for hover interaction
            const popoverElement: Element = {
              type: 'element',
              tagName: 'div',
              properties: {
                id: popoverId,
                className: ['footnote-popover'],
                role: 'tooltip',
              },
              children: definition.content as ElementContent[],
            };

            // Wrap the sup and popover in a container for positioning
            const wrapper: Element = {
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['footnote-ref-wrapper'],
              },
              children: [{ ...node }, popoverElement],
            };

            // Replace the sup element with the wrapper
            if (parent.type === 'element' && typeof index === 'number') {
              parent.children.splice(index, 1, wrapper);
            }
          }
        }
      }
    });
  };
};

export default rehypeFootnotePopover;
