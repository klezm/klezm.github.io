/**
 * Strips KaTeX's MathML twin out of headings.
 *
 * KaTeX renders every expression twice: a visual `.katex-html` tree and a
 * `.katex-mathml` tree that also carries an `<annotation>` holding the original
 * LaTeX source. Both are real text nodes, so anything deriving a plain-text
 * string from a heading — the table of contents and the slug used for its
 * anchor — sees all three renderings concatenated. A heading of
 * `## Math and $e^{i\pi}+1=0$` produces the table-of-contents entry
 * `Math and eiπ+1=0e^{i\pi}+1=0eiπ+1=0` and the anchor
 * `math-and-eiπ10eipi10eiπ10`.
 *
 * Removing the MathML twin inside headings only leaves the visual rendering, so
 * the entry reads `Math and eiπ+1=0`. Body maths is left completely alone, so
 * screen readers still get the MathML everywhere it actually matters.
 *
 * Must be registered AFTER rehype-katex, and before heading ids are generated —
 * which is why it lives in the same user plugin list rather than anywhere else.
 */
const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function hasClass(node, name) {
  const className = node.properties?.className;
  if (!className) return false;
  return Array.isArray(className)
    ? className.includes(name)
    : String(className).split(/\s+/).includes(name);
}

/** Drop `.katex-mathml` descendants, in place. */
function stripMathml(node) {
  if (!Array.isArray(node.children)) return;

  node.children = node.children.filter(
    (child) => !(child.type === 'element' && hasClass(child, 'katex-mathml')),
  );

  for (const child of node.children) stripMathml(child);
}

function walk(node) {
  if (node.type === 'element' && HEADINGS.has(node.tagName)) {
    stripMathml(node);
    // Nothing below a heading needs visiting again.
    return;
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child);
  }
}

export function rehypeKatexHeadings() {
  return function transformer(tree) {
    walk(tree);
  };
}
