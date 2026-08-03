import { fileURLToPath } from 'node:url';
import rehypeCitation from 'rehype-citation';

/**
 * Per-post bibliographies for rehype-citation.
 *
 * The stock plugin takes a single `bibliography` path for the whole site. This
 * wrapper instead reads the path from each post's `bibliography` frontmatter
 * key, so posts can carry their own `.bib` file and posts without one skip
 * citation processing entirely.
 *
 * Frontmatter paths are resolved relative to `src/content/docs/`.
 *
 * Caveat inherited from rehype-citation: it cannot parse `%` comments or
 * `\url{}` macros in `.bib` files — either one aborts the whole build.
 */
const CONTENT_DIR = fileURLToPath(new URL('../content/docs/', import.meta.url));

/**
 * @type {import('unified').Plugin<[Record<string, unknown>?], import('hast').Root>}
 */
export function rehypeCitationFrontmatter(options = {}) {
  return async function transformer(tree, file) {
    const bibliography = file?.data?.astro?.frontmatter?.bibliography;

    // No bibliography declared: leave the tree untouched. Running the citation
    // plugin here would be wasted work on every non-citing page.
    if (!bibliography) return;

    // Calling the attacher to obtain its transformer is correct *here* — we are
    // deliberately building a transformer at run time. It is only wrong when
    // registering a plugin with unified, which wants `[plugin, options]`.
    const run = rehypeCitation({
      ...options,
      bibliography,
      path: CONTENT_DIR,
    });

    // Awaited rather than returned: rehype-citation mutates the tree in place
    // and never returns one, and returning its `void | Error` result would not
    // satisfy Astro's RehypePlugin type.
    await run(tree, file);
  };
}
