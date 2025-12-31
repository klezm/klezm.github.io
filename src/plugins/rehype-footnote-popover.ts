import type { Root, Element, ElementContent } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that adds popover functionality to footnote references.
 * When hovering over a footnote number, a popover shows the footnote content.
 * The popover stays visible when hovering over it, allowing users to click links.
 */
const rehypeFootnotePopover: Plugin<[], Root> = () => {
	return (tree: Root) => {
		// First, collect all footnote definitions
		const footnoteDefinitions = new Map<string, ElementContent[]>();

		visit(tree, 'element', (node: Element) => {
			// Find the footnotes section
			if (
				node.tagName === 'section' &&
				node.properties?.dataFootnotes !== undefined
			) {
				// Find all li elements with footnote content
				visit(node, 'element', (li: Element) => {
					if (li.tagName === 'li' && typeof li.properties?.id === 'string') {
						const id = li.properties.id;
						// Extract the footnote id (e.g., "user-content-fn-typingrulessources")
						if (id.startsWith('user-content-fn-')) {
							const footnoteId = id.replace('user-content-fn-', '');
							// Clone the children, but remove the back reference link
							const content = li.children.filter((child) => {
								if (
									child.type === 'element' &&
									child.tagName === 'a' &&
									child.properties?.dataFootnoteBackref !== undefined
								) {
									return false;
								}
								return true;
							});

							// Also filter out back reference links from nested elements
							const cleanContent = JSON.parse(JSON.stringify(content)) as ElementContent[];
							removeBackrefs(cleanContent);
							// Convert block elements to inline for valid HTML nesting
							convertBlockToInline(cleanContent);

							footnoteDefinitions.set(footnoteId, cleanContent);
						}
					}
				});
			}
		});

		// Now, transform footnote references to include popover
		visit(tree, 'element', (node: Element, index, parent) => {
			// Find sup elements containing footnote reference links
			if (node.tagName === 'sup' && parent && typeof index === 'number') {
				const link = node.children.find(
					(child): child is Element =>
						child.type === 'element' &&
						child.tagName === 'a' &&
						child.properties?.dataFootnoteRef !== undefined
				);

				if (link && typeof link.properties?.href === 'string') {
					// Extract footnote id from href (e.g., "#user-content-fn-typingrulessources")
					const href = link.properties.href;
					const footnoteId = href.replace('#user-content-fn-', '');
					const content = footnoteDefinitions.get(footnoteId);

					if (content && content.length > 0) {
						// Create the popover content element
						// Using span to keep everything inline-valid.
						// CSS will handle making it display as block for proper rendering.
						const popoverContent: Element = {
							type: 'element',
							tagName: 'span',
							properties: {
								className: ['footnote-popover-content'],
								role: 'tooltip',
							},
							children: content,
						};

						// Wrap the sup in a container with the popover
						// Using span to remain valid inline element.
						// CSS display:inline-block allows block positioning.
						const wrapper: Element = {
							type: 'element',
							tagName: 'span',
							properties: {
								className: ['footnote-popover-wrapper'],
							},
							children: [
								{
									...node,
									properties: {
										...node.properties,
										className: ['footnote-ref-trigger'],
										tabIndex: 0,
									},
								},
								popoverContent,
							],
						};

						// Replace the sup with the wrapper
						(parent as Element).children[index] = wrapper;
					}
				}
			}
		});
	};
};

/**
 * Recursively remove back reference links from footnote content
 */
function removeBackrefs(nodes: ElementContent[]): void {
	for (let i = nodes.length - 1; i >= 0; i--) {
		const node = nodes[i];
		if (node.type === 'element') {
			if (
				node.tagName === 'a' &&
				node.properties?.dataFootnoteBackref !== undefined
			) {
				nodes.splice(i, 1);
			} else if (node.children) {
				removeBackrefs(node.children);
			}
		}
	}
}

/**
 * Block elements that need to be converted to inline for valid HTML nesting
 */
const blockToInlineMap: Record<string, string> = {
	p: 'span',
	div: 'span',
	ul: 'span',
	ol: 'span',
	li: 'span',
	blockquote: 'span',
	pre: 'span',
	h1: 'span',
	h2: 'span',
	h3: 'span',
	h4: 'span',
	h5: 'span',
	h6: 'span',
};

/**
 * Recursively convert block elements to inline spans with appropriate classes
 * This allows the popover content to be nested inside span elements while
 * CSS handles the block-like display.
 */
function convertBlockToInline(nodes: ElementContent[]): void {
	for (const node of nodes) {
		if (node.type === 'element') {
			const inlineTag = blockToInlineMap[node.tagName];
			if (inlineTag) {
				// Add original tag as a class for CSS styling
				const existingClasses = Array.isArray(node.properties?.className)
					? node.properties.className
					: typeof node.properties?.className === 'string'
						? [node.properties.className]
						: [];
				node.properties = node.properties || {};
				node.properties.className = [...existingClasses, `fn-${node.tagName}`];
				node.tagName = inlineTag;
			}
			if (node.children) {
				convertBlockToInline(node.children);
			}
		}
	}
}

export default rehypeFootnotePopover;
