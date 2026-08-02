import { dirname } from 'node:path';
import rehypeCitation from 'rehype-citation';

/**
 * `rehype-citation` takes `bibliography` as a single global plugin option and
 * skips entirely when it is absent — it reads `csl` and `noCite` from
 * frontmatter, but not the bibliography path. This blog wants it per post, so
 * that each post can point at its own `.bib` file and posts without one are
 * untouched.
 *
 * The wrapper reads `bibliography` from the page's frontmatter and builds the
 * real transformer per file, resolving the path relative to the Markdown file
 * rather than the working directory.
 *
 * @param {Record<string, unknown>} [baseOptions] Options shared by every post.
 */
export function rehypeCitationFrontmatter(baseOptions = {}) {
  return async function transformer(tree, file) {
    const bibliography = file?.data?.astro?.frontmatter?.bibliography;
    if (!bibliography || !file.path) return;

    // `rehypeCitation(options)` returns a plain `async (tree, file)` function,
    // so it can be invoked directly without a unified `this` binding.
    await rehypeCitation({
      ...baseOptions,
      bibliography,
      path: dirname(file.path),
    })(tree, file);
  };
}
