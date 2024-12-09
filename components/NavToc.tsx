'use client'

// https://webtech-note.com/posts/tocbot-contentlayer
// https://www.ichi.co.uk/blog/adding-a-table-of-contents-to-nextjs-tailwind-blog

import { useEffect } from 'react'
import tocbot from 'tocbot'

export default function NavToc() {
  useEffect(() => {
    tocbot.init({
        // https://github.com/tscanlin/tocbot
        tocSelector: '.js-toc',
        contentSelector: '.js-toc-content',
        headingSelector: 'h1, h2, h3, h4',
        hasInnerContainers: true,
        // linkClass: 'toc-link',
        // activeLinkClass: 'is-active-link',
        // listClass: 'toc-list',
        // isCollapsedClass: 'is-collapsed',
        // listItemClass: 'toc-list-item',
        // activeListItemClass: 'is-active-li',
        collapseDepth: 2,
        // scrollSmooth: true,
        // scrollSmoothDuration: 420,
        // headingsOffset: 100,
        includeHtml: true,
    })

    return () => tocbot.destroy()
  }, [])

  return (
    <div className="toc-container">
      <div className="toc-container-2">
      {/* <span>Table of Contents</span> */}
      <span>Contents</span>
      <div className="js-toc"></div>
    </div>
    </div>
  )
}
