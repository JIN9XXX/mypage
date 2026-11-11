import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, X } from 'lucide-react'
import TextRevealImage from './components/TextRevealImage'
import TextFlowTransition from './components/TextFlowTransition'
import PageIndex from './components/PageIndex'
import SectionFlowEdge from './components/SectionFlowEdge'
import portraitSource from './assets/portrait.webp'
import portraitType from './assets/portrait-type.png'
import agentSource from './assets/projects/agent-harness-source.png'
import agentText from './assets/projects/agent-harness-type.png'
import commerceSource from './assets/projects/commerce-architecture-source.png'
import commerceText from './assets/projects/commerce-architecture-type.png'

const NAV = [
  { label: '关于', en: 'ABOUT', href: '#story' },
  { label: '经历', en: 'EXPERIENCE', href: '#work' },
  { label: '教育', en: 'EDUCATION', href: '#education' },
  { label: '项目', en: 'PROJECTS', href: '#projects' },
  { label: '技能', en: 'STACK', href: '#skills' },
  { label: '联系', en: 'CONTACT', href: '#contact' },
]

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/JIN9XXX', external: true },
  { label: 'Email', href: 'mailto:2319297414@qq.com' },
]

const EDUCATION = [
  {
    school: '武汉大学',
    school_en: 'Wuhan University',
    dept: '国家网络安全学院 · 电子信息硕士',
    date: '2025.09 — 2027.06',
  },
  {
    school: '湖北经济学院',
    school_en: 'Hubei University of Economics',
    dept: '统计与数学学院 · 统计学学士',
    date: '2020.09 — 2024.06',
  },
]

const EXPERIENCE = [
  {
    org: '中国信息通信研究院',
    org_en: 'CAICT',
    role: 'AI 应用 / 智能体开发实习生',
    date: '2026.10 — 至今',
    points: ['AI 应用开发与技术研究'],
  },
  {
    org: '深圳天源迪科',
    org_en: 'Tianyuan DIC',
    role: 'Agent 工程师',
    date: '2026.07 — 2026.08',
    points: [
      '开发通用任务执行 Agent（Agent Harness），覆盖任务规划、虚拟文件系统、子 Agent 委派与上下文管理',
      '实现可插拔中间件、Skills 技能系统、记忆管理、安全沙箱与链路追踪',
    ],
    stack: 'LangGraph · FastAPI · Redis · Milvus · Kafka',
  },
]

const PROJECTS = [
  {
    no: '001',
    name: '通用任务执行 Agent',
    name_en: 'Multi-Agent Runtime',
    kind: 'AGENT SYSTEM',
    stack: 'LangGraph · FastAPI · Redis · Milvus · Kafka',
    image: agentSource,
    textImage: agentText,
    sections: [
      {
        k: '任务',
        v: '让模型面对开放式任务时能够自行规划、调用工具并产出文件，而不只回答单轮问题。',
      },
      {
        k: '实现',
        v: '负责任务规划、虚拟文件系统、子 Agent 委派和上下文管理，并实现可插拔中间件、Skills、记忆、安全沙箱与链路追踪。',
      },
      {
        k: '工程重点',
        v: '长任务产生的完整工具结果和日志存入虚拟文件系统；上下文保留阶段摘要、文件引用和下一步计划，便于继续执行与回看。',
      },
      {
        k: '状态',
        v: '形成覆盖规划、委派、工具执行、文件管理与状态追踪的运行框架。',
      },
    ],
  },
  {
    no: '002',
    name: '谷粒商城',
    name_en: 'Distributed Commerce',
    kind: 'LEARNING PROJECT',
    stack: 'Spring Cloud Alibaba · Redis · RabbitMQ · Elasticsearch',
    image: commerceSource,
    textImage: commerceText,
    sections: [
      {
        k: '任务',
        v: '基于尚硅谷教学项目的微服务电商练习，用于理解商品、订单、库存等服务如何协作。',
      },
      {
        k: '技术栈',
        v: 'Spring Cloud Alibaba、Redis、RabbitMQ 与 Elasticsearch。',
      },
      {
        k: '学习重点',
        v: '梳理服务拆分、模块间调用与消息队列在电商链路中的作用。',
      },
      {
        k: '状态',
        v: '教学项目学习记录，围绕微服务架构与电商业务链路展开。',
      },
    ],
  },
]

const SKILLS = [
  {
    group: 'AI AGENT / LLM',
    items: ['LangGraph', 'ReAct', 'RAG', 'FastAPI', 'MCP'],
  },
  {
    group: 'BACKEND',
    items: ['Spring Cloud Alibaba', 'Java', 'Python', 'Redis', 'RabbitMQ', 'Elasticsearch'],
  },
  {
    group: 'CERTIFICATIONS',
    items: [
      '网络安全人才能力认证（优秀）',
      'CCP 证书',
      '全国大学生数学建模竞赛 省二等奖',
      '美国大学生数学建模竞赛 S 奖',
    ],
  },
]

function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    const sections = document.querySelectorAll('.site-section')
    if (!('IntersectionObserver' in window)) {
      ;[...targets, ...sections].forEach((target) => target.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const section = entry.target
        const bounds = section.getBoundingClientRect()
        const originY = Math.max(0, Math.min(bounds.height, window.innerHeight / 2 - bounds.top))
        const radius = Math.hypot(bounds.width / 2, Math.max(originY, bounds.height - originY)) + 2
        section.style.setProperty('--section-open-y', `${originY}px`)
        section.style.setProperty('--section-open-size', `${radius}px`)
        section.classList.add('is-visible')
        sectionObserver.unobserve(section)
      })
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0 })
    targets.forEach((target) => observer.observe(target))
    sections.forEach((section) => sectionObserver.observe(section))
    const story = document.getElementById('story')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let storyFrame = 0
    const updateStoryOpening = () => {
      storyFrame = 0
      if (!story || motion.matches) return
      const bounds = story.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight * 0.9)))
      const maximum = Math.hypot(window.innerWidth / 2, window.innerHeight / 2) + 2
      story.style.setProperty('--portal-active', bounds.top < window.innerHeight && progress < 1 ? '1' : '0')
      story.style.setProperty('--story-content-offset', `${-Math.max(0, bounds.top)}px`)
      story.style.setProperty('--scroll-open-radius', `${maximum * progress * progress}px`)
    }
    const scheduleStoryOpening = () => {
      if (!storyFrame) storyFrame = requestAnimationFrame(updateStoryOpening)
    }
    updateStoryOpening()
    window.addEventListener('scroll', scheduleStoryOpening, { passive: true })
    window.addEventListener('resize', scheduleStoryOpening, { passive: true })
    return () => {
      observer.disconnect()
      sectionObserver.disconnect()
      cancelAnimationFrame(storyFrame)
      window.removeEventListener('scroll', scheduleStoryOpening)
      window.removeEventListener('resize', scheduleStoryOpening)
    }
  }, [])
}

function Section({ id, index, label, description, title, children }) {
  return (
    <section id={id} className={`site-section section-${id}`} data-section-index={index} aria-labelledby={`${id}-title`}>
      <SectionFlowEdge />
      <div className="page-frame">
        <header className="section-header reveal">
          <div className="section-file">
            <span className="section-index">{index}</span>
            <span className="section-file-name">/{label.toLowerCase().replaceAll(' ', '-')}</span>
          </div>
          <h2 id={`${id}-title`} className="section-heading">{title}</h2>
          <p className="section-description">{description}</p>
        </header>
        <div className="section-content">{children}</div>
      </div>
    </section>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeNav, setActiveNav] = useState('story')
  const [navigationTransition, setNavigationTransition] = useState('idle')
  const introTrackRef = useRef(null)
  const heroStageRef = useRef(null)
  const portraitRef = useRef(null)
  const navigationTimersRef = useRef([])

  useReveal()

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const clearNavigationTimers = () => {
      navigationTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      navigationTimersRef.current = []
    }

    const findTarget = (hash) => {
      if (!hash || hash === '#') return null
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)))
      } catch {
        return null
      }
    }

    const moveToTarget = (target) => {
      const root = document.documentElement
      let targetTop = 0
      // A sticky element's offset changes while pinned; its track stays in document flow.
      let node = target.id === 'top' ? introTrackRef.current : target
      while (node && node !== document.body) {
        targetTop += node.offsetTop
        node = node.offsetParent
      }
      const topPadding = Number.parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0
      const topMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0
      const previousBehavior = root.style.getPropertyValue('scroll-behavior')
      const previousPriority = root.style.getPropertyPriority('scroll-behavior')
      root.style.setProperty('scroll-behavior', 'auto', 'important')
      window.scrollTo(window.scrollX, Math.max(0, targetTop - topPadding - topMargin))
      if (previousBehavior) {
        root.style.setProperty('scroll-behavior', previousBehavior, previousPriority)
      } else {
        root.style.removeProperty('scroll-behavior')
      }
    }

    const navigateToHash = (hash, updateHistory = false) => {
      const target = findTarget(hash)
      if (!target) return false

      if (updateHistory && window.location.hash !== hash) {
        window.history.pushState(null, '', hash)
      }

      clearNavigationTimers()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setNavigationTransition('idle')
        moveToTarget(target)
        return true
      }

      setNavigationTransition('covering')
      navigationTimersRef.current.push(window.setTimeout(() => {
        moveToTarget(target)
        setNavigationTransition('revealing')
      }, 500))
      navigationTimersRef.current.push(window.setTimeout(() => {
        setNavigationTransition('idle')
      }, 1320))
      return true
    }

    const onDocumentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href]')
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return

      const url = new URL(link.href, window.location.href)
      if (
        !url.hash ||
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
      ) return

      if (!findTarget(url.hash)) return
      event.preventDefault()
      navigateToHash(url.hash, true)
    }

    const onPopState = () => {
      navigateToHash(window.location.hash || '#top')
    }

    document.addEventListener('click', onDocumentClick)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onDocumentClick)
      window.removeEventListener('popstate', onPopState)
      clearNavigationTimers()
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const anchor = window.innerHeight * 0.34
      const current = [...document.querySelectorAll('.site-section')].find((section) => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= anchor && bounds.bottom > anchor
      })
      setActiveNav(current?.id ?? 'top')
    }
    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const track = introTrackRef.current
    const stage = heroStageRef.current
    const portrait = portraitRef.current
    if (!track || !stage || !portrait) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const clamp01 = (value) => Math.max(0, Math.min(1, value))
    const ease = (value) => {
      const progress = clamp01(value)
      return progress * progress * (3 - 2 * progress)
    }

    const update = () => {
      frame = 0
      const trackRect = track.getBoundingClientRect()
      const distance = Math.max(track.offsetHeight - stage.offsetHeight, 1)
      const progress = reducedMotion.matches ? 0 : clamp01(-trackRect.top / distance)
      const eased = ease(progress)
      const imageWidth = portrait.offsetWidth
      const imageHeight = portrait.offsetHeight
      // The left pupil in the supplied 1086 x 1448 portrait, measured in source coordinates.
      const eyeX = portrait.offsetLeft + imageWidth * (0.448 - 0.5)
      const eyeY = portrait.offsetTop + imageHeight * (0.439 - 0.5)
      const panX = window.innerWidth / 2 - eyeX
      const panY = window.innerHeight / 2 - eyeY
      const zoom = reducedMotion.matches ? 1 : 1 + eased * 7 + ease((progress - 0.58) / 0.42) * 11
      const copyOpacity = reducedMotion.matches ? 1 : 1 - ease(progress / 0.42)

      stage.style.setProperty('--intro-progress', progress.toFixed(4))
      stage.style.setProperty('--portrait-zoom', zoom.toFixed(3))
      stage.style.setProperty('--portrait-open', (reducedMotion.matches ? 0 : ease((progress - 0.08) / 0.4)).toFixed(4))
      stage.style.setProperty('--intro-black', (reducedMotion.matches ? 0 : ease((progress - 0.91) / 0.09)).toFixed(4))
      stage.style.setProperty('--portrait-pan-x', `${(panX * eased).toFixed(1)}px`)
      stage.style.setProperty('--portrait-pan-y', `${(panY * eased).toFixed(1)}px`)
      stage.style.setProperty('--hero-copy-opacity', copyOpacity.toFixed(3))
      setScrolled(window.scrollY > 32)
      setScrollProgress(Math.round((window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          <a href="#top" className="wordmark" aria-label="阮靖，回到首页">
            <span className="wordmark-mark">RJ</span>
            <span className="wordmark-copy">RUAN JING <small>PERSONAL SYSTEM</small></span>
          </a>
          <nav className="desktop-nav" aria-label="主导航">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={activeNav === item.href.slice(1) ? 'is-active' : undefined} aria-current={activeNav === item.href.slice(1) ? 'location' : undefined}>
                <span className="nav-roll" aria-label={item.label}>
                  {[...item.label].map((letter, index) => (
                    <span className="nav-roll-letter" key={index} style={{ '--letter-order': index }} aria-hidden="true">
                      <span>{letter}</span><span>{letter}</span>
                    </span>
                  ))}
                </span><small>{item.en}</small>
              </a>
            ))}
          </nav>
          <a className="header-contact" href="https://github.com/JIN9XXX" target="_blank" rel="noreferrer">
            GITHUB <ArrowUpRight size={14} strokeWidth={1.7} />
          </a>
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        <div className="header-marquee" aria-hidden="true">
          <div>
            <span>RUAN JING&nbsp; / &nbsp;AI APPLICATIONS&nbsp; / &nbsp;AGENT SYSTEMS&nbsp; / &nbsp;BACKEND ENGINEERING&nbsp; / &nbsp;</span>
            <span>RUAN JING&nbsp; / &nbsp;AI APPLICATIONS&nbsp; / &nbsp;AGENT SYSTEMS&nbsp; / &nbsp;BACKEND ENGINEERING&nbsp; / &nbsp;</span>
          </div>
        </div>
        <div className="page-progress" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress / 100})` }} /></div>
      </header>

      <div className="intro-track" ref={introTrackRef}>
        <section id="top" className="hero-stage" ref={heroStageRef} aria-label="个人简介">
          <div className="hero-grid-overlay" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true">
            <svg viewBox="0 0 760 760" focusable="false">
              <defs>
                {[100, 145, 190, 235, 280, 325, 370].map((radius, index) => (
                  <path key={radius} id={`portrait-orbit-${index}`} d={`M380 380m-${radius} 0a${radius} ${radius} 0 1 1 ${radius * 2} 0a${radius} ${radius} 0 1 1-${radius * 2} 0`} />
                ))}
              </defs>
              {[100, 145, 190, 235, 280, 325, 370].map((radius, index) => (
                <g key={radius} className="hero-orbit-ring" style={{ '--orbit-order': index }}>
                  <circle cx="380" cy="380" r={radius} />
                  <text><textPath href={`#portrait-orbit-${index}`} textLength={Math.PI * radius * 2} lengthAdjust="spacing">{'RUAN JING · AGENT SYSTEMS · CONTEXT · TOOLING · RUNTIME · '.repeat(index > 3 ? 3 : index > 0 ? 2 : 1)}</textPath></text>
                </g>
              ))}
            </svg>
          </div>
          <div className="hero-coordinate coordinate-top" aria-hidden="true">SYS://RJ.PORTFOLIO <span>V.2026.11</span></div>

          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> PERSONAL PROFILE <span className="eyebrow-slash">/</span> 001</p>
            <h1>把复杂任务<br /><span>做成可靠系统。</span></h1>
            <p className="hero-summary">你好，我是阮靖。武汉大学电子信息硕士在读，关注 AI 应用、Agent 系统与后端工程。</p>
            <div className="hero-meta" aria-label="个人方向">
              <span>WUHAN UNIVERSITY</span><i />
              <span>AI × AGENT × BACKEND</span>
            </div>
            <div className="hero-actions">
              <a className="hero-cta" href="#projects">查看精选项目 <ArrowDown size={15} /></a>
              <a className="hero-cta hero-cta-secondary" href="#contact">联系我 <ArrowUpRight size={15} /></a>
            </div>
          </div>

          <figure className="portrait-window" aria-label="文字构成的个人肖像">
            <div className="portrait-window-bar"><span>portrait.render</span><span>1086 × 1448 PX</span></div>
            <TextRevealImage
              ref={portraitRef}
              imageSrc={portraitSource}
              textSrc={portraitType}
              alt="阮靖的个人肖像"
              hint="移入查看原图 · 点击固定"
              className="portrait-window-image"
              fetchPriority="high"
            />
            <figcaption><span>FIG. 001</span><span>SCROLL TO FOCUS</span></figcaption>
          </figure>

          <div className="hero-coordinate coordinate-bottom" aria-hidden="true">
            <span><i /> SYSTEM ONLINE</span><span>SCROLL_Y <b>{String(Math.round(scrollProgress)).padStart(3, '0')}%</b></span>
          </div>
          <a className="scroll-cue" href="#story" aria-label="向下滚动，进入个人简介"><span>SCROLL TO EXPLORE</span><i><ArrowDown size={14} /></i></a>
        </section>
      </div>

      <main>
        <Section id="story" index="001" label="Profile" description="从模型能力出发，走向能实际交付的应用与系统。" title="关于我">
          <div className="profile-grid reveal">
            <p className="profile-lead">我关注的不只是模型能不能回答，<br /><span>而是系统能否把任务完整做完。</span></p>
            <div className="profile-copy">
              <p>武汉大学国家网络安全学院电子信息硕士在读，方向是 AI 应用与 Agent 系统。在深圳天源迪科参与开发通用任务执行 Agent，从任务规划一路做到沙箱与链路追踪。</p>
              <p>也做后端工程。微服务、缓存与消息队列，是让智能体应用稳定运行的基础。我关注上下文、工具、状态管理和失败恢复这些真正影响交付的工程问题。</p>
              <div className="profile-tags"><span>AI 应用</span><span>Agent 工程</span><span>后端系统</span><span>多模态检索</span></div>
            </div>
          </div>
        </Section>

        <Section id="work" index="002" label="Experience" description="在真实任务中理解需求，把规划、工具与执行连接起来。" title="经历">
          <img className="experience-type-field" src={agentText} alt="" aria-hidden="true" loading="lazy" />
          <div className="timeline-list">
            {EXPERIENCE.map((job, index) => (
              <article key={job.org} className="timeline-entry reveal" style={{ '--reveal-order': index }}>
                <div className="timeline-gutter"><span>{String(index + 1).padStart(3, '0')}</span><i /></div>
                <div className="timeline-main">
                  <div className="timeline-title-row">
                    <div><h3>{job.org}</h3><span className="org-en">{job.org_en}</span></div>
                    <time>{job.date}</time>
                  </div>
                  <p className="role-label">{job.role}</p>
                  <ul className="experience-points">{job.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  {job.stack && <p className="stack-line"><span>STACK</span>{job.stack}</p>}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="education" index="003" label="Education" description="从统计学到电子信息，持续探索数据、模型与工程之间的联系。" title="学习经历">
          <div className="education-list">
            {EDUCATION.map((edu, index) => (
              <article key={edu.school} className="education-card reveal" style={{ '--reveal-order': index }}>
                <span className="education-year" aria-hidden="true">{edu.date.slice(0, 4)}</span>
                <div className="education-card-top"><span>ENTRY_{String(index + 1).padStart(2, '0')}</span><time>{edu.date}</time></div>
                <h3>{edu.school}</h3>
                <p className="education-en">{edu.school_en}</p>
                <p className="education-dept">{edu.dept}</p>
                <span className="education-corner" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" index="004" label="Selected Projects" description="从任务出发，记录系统如何设计、实现与协作。" title="项目">
          <div className="project-list">
            {PROJECTS.map((project) => (
              <article key={project.no} className="project-card reveal">
                <div className="project-bar"><span><i />{project.kind}</span><span>PROJECT_{project.no}</span></div>
                <figure className="project-visual">
                  <TextRevealImage
                    imageSrc={project.image}
                    textSrc={project.textImage}
                    alt={`${project.name}架构与执行流程示意图`}
                    hint="移入查看原图 · 点击固定"
                    loading="lazy"
                  />
                  <figcaption><span>ARCHITECTURE MAP</span><span>STRUCTURE / FLOW / STATE</span></figcaption>
                  <i className="project-scanline" aria-hidden="true" />
                </figure>
                <div className="project-copy">
                  <header className="project-title-row">
                    <div><span className="project-number">{project.no} //</span><h3>{project.name}</h3><p>{project.name_en}</p></div>
                    <span className="project-state"><i /> DOCUMENTED</span>
                  </header>
                  <p className="project-stack"><span>STACK</span>{project.stack}</p>
                  <dl className="project-details">
                    {project.sections.map((item) => (
                      <Fragment key={item.k}><dt>{item.k}</dt><dd>{item.v}</dd></Fragment>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
          <a className="repo-link" href="https://github.com/JIN9XXX" target="_blank" rel="noreferrer">浏览 GitHub 仓库 <ArrowUpRight size={15} /></a>
        </Section>

        <Section id="skills" index="005" label="Tech Stack" description="围绕 AI 应用与后端系统，逐步积累可组合的工程能力。" title="技术栈">
          <div className="skill-list">
            {SKILLS.map((group, index) => (
              <article key={group.group} className="skill-group reveal" style={{ '--reveal-order': index }}>
                <h3><span>{String(index + 1).padStart(3, '0')} /</span>{group.group}</h3>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="contact" index="006" label="Contact" description="关于 AI 应用、Agent 工程或新的合作机会，欢迎交流。" title="保持联系">
          <div className="contact-terminal reveal">
            <p className="contact-output">有 Agent / 后端方向的岗位或合作，欢迎直接联系。</p>
            <a className="contact-email" href="mailto:2319297414@qq.com"><span>mailto:</span>2319297414@qq.com<ArrowUpRight size={20} /></a>
            <div className="contact-footer"><span>AVAILABLE FOR CONVERSATION <i /></span><div>{SOCIAL.map((item) => <a key={item.label} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>{item.label}<ArrowUpRight size={13} /></a>)}</div></div>
          </div>
        </Section>
      </main>

      <footer className="site-footer">
        <div className="page-frame footer-inner">
          <a href="#top" className="footer-mark">RJ<span> / RUAN JING</span></a>
          <span>© 2026 · PERSONAL SYSTEM</span>
          <a href="#top" className="back-top">回到顶部 <ArrowUpRight size={13} /></a>
        </div>
      </footer>

      <button
        type="button"
        className={`mobile-nav-backdrop ${open ? 'is-open' : ''}`}
        aria-label="关闭导航菜单"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <aside className={`mobile-nav-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <p className="mobile-nav-label">~/site-index</p>
        <nav aria-label="移动端主导航">
          {NAV.map((item, index) => (
            <a key={item.href} href={item.href} className={activeNav === item.href.slice(1) ? 'is-active' : undefined} aria-current={activeNav === item.href.slice(1) ? 'location' : undefined} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item.label}<small>{item.en}</small><ArrowUpRight size={15} />
            </a>
          ))}
        </nav>
        <div className="mobile-nav-status"><i /> SYSTEM ONLINE</div>
      </aside>
      <PageIndex items={NAV} activeSection={activeNav} progress={scrollProgress} />
      <TextFlowTransition phase={navigationTransition === 'idle' ? '' : navigationTransition} />
    </div>
  )
}
