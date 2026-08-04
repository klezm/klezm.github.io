/**
 * Cleans up KaTeX markup inside headings so the table of contents reads
 * properly.
 *
 * KaTeX renders every expression twice: a `.katex-mathml` subtree for
 * assistive technology, which also carries the raw TeX in an `<annotation>`,
 * and an `aria-hidden` `.katex-html` subtree with the visible glyphs.
 * Starlight builds table-of-contents labels from a heading's text content, so
 * it concatenates all three — `$γ$` came out as "γγγ", and
 * `$({\color{OrangeRed}f} \; {\color{YellowGreen}g})$` dumped its raw TeX into
 * the sidebar.
 *
 * Inside headings only, this drops the MathML subtree and unhides the visible
 * one, so the heading still renders identically, stays readable to screen
 * readers, and contributes its glyphs exactly once to the label.
 *
 * Must be registered after `rehype-katex` — user rehype plugins run in array
 * order, and all of them run before Starlight collects headings.
 */

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const hasClass = (node, name) => {
  const className = node.properties?.className;
  return Array.isArray(className) && className.includes(name);
};

function cleanKatex(node) {
  if (!node.children) return;

  for (const child of node.children) {
    if (child.type !== 'element') continue;

    if (hasClass(child, 'katex')) {
      child.children = child.children.filter(
        (grandchild) =>
          !(
            grandchild.type === 'element' &&
            hasClass(grandchild, 'katex-mathml')
          ),
      );

      for (const grandchild of child.children) {
        if (
          grandchild.type === 'element' &&
          hasClass(grandchild, 'katex-html')
        ) {
          delete grandchild.properties['aria-hidden'];
        }
      }
      continue;
    }

    cleanKatex(child);
  }
}

export function rehypeMathHeadings() {
  return function transformer(tree) {
    const walk = (node) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (HEADINGS.has(child.tagName)) cleanKatex(child);
        else walk(child);
      }
    };
    walk(tree);
  };
}
