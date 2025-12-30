interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Blog',
    description: `Articles about computer science and other university related topics.`,
    imgSrc: '/data/logo.svg',
    href: 'https://klezm.github.io',
  },
]

export default projectsData
