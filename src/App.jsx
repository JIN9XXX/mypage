import { Fragment, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import portrait from './assets/portrait.webp'

const NAV = [
  { label: 'Story', href: '#story' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/JIN9XXX', external: true },
  { label: 'Email', href: 'mailto:2319297414@qq.com' },
  { label: 'Phone', href: 'tel:17771744836' },
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
    no: '01',
    name: '通用任务执行 Agent',
    name_en: 'Multi-Agent Runtime',
    stack: 'LangGraph · FastAPI · Redis · Milvus · Kafka',
    // 截图到位后：import agentShot from './assets/projects/agent-harness.png' 并赋给 shot
    shot: null,
    sections: [
      {
        k: '背景',
        v: '在深圳天源迪科实习期间开发的通用任务执行 Agent，目标是让模型接到开放式任务后自行规划、调用工具、产出文件，而不是只回答单轮问题。',
      },
      {
        k: '我做了什么',
        v: '负责四条主线：任务规划与拆解、虚拟文件系统统一工具产物、子 Agent 委派、上下文管理；其上实现可插拔中间件、Skills 技能系统、记忆管理、安全沙箱与链路追踪。',
      },
      {
        k: '技术难点',
        v: '子 Agent 委派会让上下文迅速膨胀，需要在委派边界做裁剪与摘要；工具产物要在多个 Agent 之间传递且不重复生成；沙箱内执行需要明确的权限与超时边界。[待补：挑一个具体难点的现象、定位过程与解法]',
      },
      {
        k: '结果',
        v: '[待补：试用范围、任务成功率或耗时对比；无数据则改为一句定性描述]',
      },
    ],
  },
  {
    no: '02',
    name: '谷粒商城',
    name_en: 'Distributed Commerce',
    stack: 'Spring Cloud Alibaba · Redis · RabbitMQ · Elasticsearch',
    shot: null,
    sections: [
      {
        k: '背景',
        v: '微服务电商交易平台，目标是把商品、订单、支付、库存这些核心链路按领域拆开，完整走一遍分布式架构的落地过程。[待补：项目性质 —— 课程项目 / 自学项目 / 实习产出]',
      },
      {
        k: '我做了什么',
        v: '按 Spring Cloud Alibaba 体系拆分并实现商品、订单、支付、库存等核心模块，技术栈为 Spring Cloud Alibaba / Redis / RabbitMQ / Elasticsearch。[待补：具体负责的模块与个人贡献边界]',
      },
      {
        k: '技术难点',
        v: '[待补：这个项目里真正卡住你的一个点 —— 现象、定位过程、最终解法]',
      },
      {
        k: '结果',
        v: '[待补：压测数据或规模；无数据则改为一句定性描述]',
      },
    ],
  },
]

const SKILLS = [
  {
    group: 'AI Agent / LLM',
    items: ['LangGraph', 'ReAct', 'RAG', 'FastAPI', 'MCP'],
  },
  {
    group: 'Backend',
    items: [
      'Spring Cloud Alibaba',
      'Java',
      'Python',
      'Redis',
      'RabbitMQ',
      'Elasticsearch',
    ],
  },
  {
    group: 'Certifications',
    items: [
      '网络安全人才能力认证（优秀）',
      'CCP 证书',
      '全国大学生数学建模竞赛 省二等奖',
      '美国大学生数学建模竞赛 S 奖',
    ],
  },
]

/* 滚动进入视口时淡入 */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Section({ id, label, children }) {
  return (
    <section
      id={id}
      className="border-t border-cream/10 px-6 py-20 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-[10rem_1fr] sm:gap-16">
          <div className="reveal">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50">
              {label}
            </p>
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  useReveal()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative bg-ink">
      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden"
      >
        {/* ① 背景 */}
        <div className="anim-fade-in absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_38%,#1e1e1e_0%,#0d0d0d_55%,#070707_100%)]" />

        {/* ② 名字底纹：仅 md+，只活在右半屏，DOM 在人像之前 → 被人像压住 */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-[12%] z-20 hidden w-[56%] overflow-hidden md:block"
        >
          <div
            className="marquee anim-fade-up flex w-max whitespace-nowrap font-hn text-[6vh] leading-none text-cream/[0.14]"
            style={{ animationDelay: '900ms', animationDuration: '55s' }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="pr-[4vw]">
                Ruan &mdash; Jing&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ③ 奶油基线：低于人像，被身体截断 */}
        <div
          className="anim-line absolute inset-x-6 bottom-[5.5rem] z-10 h-0.5 bg-cream md:inset-x-10 md:bottom-28"
          style={{ animationDelay: '1150ms' }}
        />

        {/* ④ 人像：移动端底部居中 58%。
            md–lg（768–1023）竖屏窄视口：竖图无法同时铺满宽高，用 cover 裁两侧，
            保证头顶不被切；lg+ 有足够宽度，改 contain 右贴边，完整显示 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[58%] items-end justify-center md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-[56%] md:justify-end">
          <img
            src={portrait}
            alt="阮靖"
            className="anim-rise-in h-full w-auto max-w-full object-contain object-bottom md:w-full md:object-cover md:object-top lg:object-contain lg:object-right-bottom"
            style={{ animationDelay: '250ms' }}
          />
        </div>

        {/* ⑤ 移动端底部压暗，保证白 T 上的文字可读 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[30vh] bg-gradient-to-t from-ink via-ink/70 to-transparent md:hidden" />

        {/* ⑥ 顶部 Header：只剩品牌 + 年份 */}
        <header
          className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 pt-6 transition-colors duration-500 sm:px-10 sm:pt-8 ${
            scrolled ? 'bg-ink/85 backdrop-blur-sm' : ''
          }`}
        >
          <a
            href="#top"
            className="anim-fade-up font-hn text-lg tracking-wide text-cream"
            style={{ animationDelay: '700ms' }}
          >
            阮靖
          </a>

          <span
            className="anim-fade-up hidden font-hn text-xs tabular-nums text-cream/40 md:block"
            style={{ animationDelay: '780ms' }}
          >
            2026
          </span>

          {/* 移动端汉堡 → X（断点必须与左栏导航一致，否则 640–767 无导航可点） */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="anim-fade-up absolute right-6 top-6 z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            style={{ animationDelay: '700ms' }}
          >
            <span
              className="block h-0.5 w-6 bg-cream"
              style={{
                transition: 'transform 500ms cubic-bezier(0.76, 0, 0.24, 1)',
                transform: open
                  ? 'translateY(8px) rotate(45deg)'
                  : 'translateY(0) rotate(0deg)',
              }}
            />
            <span
              className="block h-0.5 w-6 bg-cream"
              style={{
                transition: 'opacity 300ms ease',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-6 bg-cream"
              style={{
                transition: 'transform 500ms cubic-bezier(0.76, 0, 0.24, 1)',
                transform: open
                  ? 'translateY(-8px) rotate(-45deg)'
                  : 'translateY(0) rotate(0deg)',
              }}
            />
          </button>
        </header>

        {/* ⑦ 左栏文字（md+ 占 44%），移动端上下堆叠在顶部 */}
        <div className="absolute inset-x-0 top-0 z-30 flex h-full flex-col gap-10 px-6 pt-24 md:w-[44%] md:justify-between md:gap-0 md:px-10 md:pb-[8.5rem] md:pt-[11vh]">
          <p
            className="anim-fade-up text-[11px] uppercase tracking-[0.3em] text-cream/40"
            style={{ animationDelay: '400ms' }}
          >
            阮靖 · AI Agent Developer
          </p>

          <div>
            <h1
              className="anim-fade-up whitespace-nowrap font-hn text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.92] tracking-[-0.02em] text-cream"
              style={{ animationDelay: '500ms' }}
            >
              Ruan&nbsp;&mdash;&nbsp;Jing
            </h1>
            <p
              className="anim-fade-up mt-6 max-w-[32rem] text-[15px] leading-[1.9] text-cream/55"
              style={{ animationDelay: '660ms' }}
            >
              武汉大学电子信息硕士，做 Agent
              系统架构与后端工程：任务规划、上下文管理、工具沙箱，以及让它真正上线的服务端底座。
            </p>
            <p
              className="anim-fade-up mt-5 flex items-center gap-2 font-hn text-[11px] uppercase tracking-[0.22em] text-cream/45"
              style={{ animationDelay: '760ms' }}
            >
              <span className="h-1 w-1 rounded-full bg-cream/60" />
              Open to 2027 Grad Roles
            </p>
          </div>

          {/* 导航 + 社交：md+ 才出现，与汉堡断点严格一致 */}
          <div className="hidden gap-14 md:flex">
            <nav className="flex flex-col gap-1.5 text-sm text-cream/70">
              {NAV.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="anim-fade-up flex items-baseline gap-3 transition-colors duration-300 hover:text-cream"
                  style={{ animationDelay: `${860 + i * 70}ms` }}
                >
                  <span className="font-hn text-[10px] tabular-nums text-cream/25">
                    0{i + 1}
                  </span>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-1.5 text-sm text-cream/50">
              {SOCIAL.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="anim-fade-up transition-colors duration-300 hover:text-cream"
                  style={{ animationDelay: `${1000 + i * 70}ms` }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ⑧ Hero footer：只留左三行，右侧交给人像（避免奶油字压白 T） */}
        <footer className="absolute inset-x-0 bottom-0 z-40 flex items-end justify-between px-6 pb-5 font-hn text-xs leading-relaxed text-cream sm:px-10 sm:pb-8 sm:text-sm">
          <div className="anim-fade-up" style={{ animationDelay: '1300ms' }}>
            <p>AI Agent Developer</p>
            <p>Backend Engineer</p>
            <p>武汉大学 · 电子信息硕士</p>
          </div>
        </footer>
      </section>

      {/* ================= STORY ================= */}
      <Section id="story" label="Story">
        <div className="reveal">
          <h2 className="max-w-3xl font-hn text-2xl leading-[1.35] tracking-tight text-cream sm:text-4xl">
            我在做 AI Agent<span className="text-cream/40"> 从架构到落地</span>的事。
          </h2>
          <div className="mt-10 grid max-w-3xl gap-5 text-sm leading-[1.9] text-cream/65 sm:text-base">
            <p>
              武汉大学国家网络安全学院电子信息硕士在读，方向是 AI
              应用与 Agent 系统。在深圳天源迪科做过通用任务执行 Agent
              ，从任务规划一路做到沙箱与链路追踪，把「能跑」变成「可控、可观测、可扩展」。
            </p>
            <p>
              也做后端。Spring Cloud
              微服务、缓存与消息队列这些东西，是让 Agent 真正上生产的底座。
              相信 Agent
              的工程量不在模型调用，而在上下文、工具、状态和失败恢复。
            </p>
          </div>
        </div>
      </Section>

      {/* ================= WORK ================= */}
      <Section id="work" label="Work">
        {/* 经历 */}
        <div className="reveal space-y-10">
          {EXPERIENCE.map((job) => (
            <article
              key={job.org}
              className="border-b border-cream/10 pb-10 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-hn text-xl tracking-tight text-cream sm:text-2xl">
                  {job.org}
                  <span className="ml-2 text-xs uppercase tracking-[0.15em] text-cream/30">
                    {job.org_en}
                  </span>
                </h3>
                <span className="font-hn text-xs tabular-nums text-cream/40">
                  {job.date}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-cream/50">{job.role}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cream/70">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[0.6em] h-px w-4 shrink-0 bg-cream/30" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {job.stack && (
                <p className="mt-4 font-hn text-xs tracking-wide text-cream/35">
                  {job.stack}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* ================= EDUCATION ================= */}
      <Section id="education" label="Education">
        <div className="reveal space-y-8">
          {EDUCATION.map((edu) => (
            <div
              key={edu.school}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
            >
              <div>
                <h4 className="font-hn text-base text-cream sm:text-lg">
                  {edu.school}
                  <span className="ml-2 text-[11px] uppercase tracking-[0.15em] text-cream/30">
                    {edu.school_en}
                  </span>
                </h4>
                <p className="mt-1 text-sm text-cream/55">{edu.dept}</p>
              </div>
              <span className="font-hn text-xs tabular-nums text-cream/40">
                {edu.date}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= PROJECTS ================= */}
      <Section id="projects" label="Projects">
        <div className="reveal space-y-16 sm:space-y-24">
          {PROJECTS.map((p) => (
            <article
              key={p.no}
              className="border-t border-cream/10 pt-12 first:border-t-0 first:pt-0"
            >
              <header className="flex items-baseline gap-4 sm:gap-6">
                <span className="font-hn text-[11px] tabular-nums text-cream/30">
                  {p.no}
                </span>
                <div className="min-w-0">
                  <h3 className="font-hn text-xl tracking-tight text-cream sm:text-[26px]">
                    {p.name}
                    <span className="ml-3 text-[11px] uppercase tracking-[0.15em] text-cream/30">
                      {p.name_en}
                    </span>
                  </h3>
                  {p.stack && (
                    <p className="mt-2 font-hn text-[11px] tracking-wide text-cream/40">
                      {p.stack}
                    </p>
                  )}
                </div>
              </header>

              {/* 四段式：定宽标签列 + 正文 */}
              <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-[4.5rem_1fr]">
                {p.sections.map((s) => (
                  <Fragment key={s.k}>
                    <dt className="pt-1 text-[11px] uppercase tracking-[0.22em] text-cream/35">
                      {s.k}
                    </dt>
                    <dd className="max-w-[38rem] text-[15px] leading-[1.95] text-cream/70">
                      {s.v}
                    </dd>
                  </Fragment>
                ))}
              </dl>

              {/* 截图位：未提供时渲染同尺寸占位框，切换零布局跳动 */}
              <div className="mt-10">
                {p.shot ? (
                  <img
                    src={p.shot}
                    alt={`${p.name} 界面截图`}
                    loading="lazy"
                    className="aspect-[16/10] w-full max-w-[46rem] border border-cream/10 object-cover object-top"
                  />
                ) : (
                  <div className="flex aspect-[16/10] w-full max-w-[46rem] flex-col justify-between border border-cream/10 bg-[repeating-linear-gradient(135deg,rgba(239,238,233,0.05)_0px,rgba(239,238,233,0.05)_1px,transparent_1px,transparent_9px)] p-4">
                    <span className="font-hn text-[10px] uppercase tracking-[0.22em] text-cream/20">
                      {p.name_en}
                    </span>
                    <span className="font-hn text-[10px] uppercase tracking-[0.22em] text-cream/30">
                      Screenshot pending
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}

          <p className="font-hn text-sm text-cream/40">
            更多代码在{' '}
            <a
              href="https://github.com/JIN9XXX"
              target="_blank"
              rel="noreferrer"
              className="text-cream transition-opacity duration-300 hover:opacity-60"
            >
              GitHub
            </a>
          </p>
        </div>
      </Section>

      {/* ================= SKILLS ================= */}
      <Section id="skills" label="Skills">
        <div className="reveal grid gap-10 sm:grid-cols-3 sm:gap-8">
          {SKILLS.map((s) => (
            <div key={s.group}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/35">
                {s.group}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-cream/70">
                {s.items.map((item) => (
                  <li key={item} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= CONTACT ================= */}
      <Section id="contact" label="Contact">
        <div className="reveal">
          <p className="max-w-xl text-sm leading-relaxed text-cream/55">
            有 Agent / 后端方向的岗位或合作，欢迎直接找我。
          </p>
          <a
            href="mailto:2319297414@qq.com"
            className="mt-8 block break-all font-hn text-2xl tracking-tight text-cream transition-opacity duration-300 hover:opacity-60 sm:text-4xl"
          >
            2319297414@qq.com
          </a>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-hn text-sm text-cream/60">
            {SOCIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="transition-opacity duration-300 hover:opacity-60"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-cream/10 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-hn text-[11px] uppercase tracking-[0.2em] text-cream/35">
          <span>© 2026 阮靖</span>
          <a href="#top" className="transition-opacity duration-300 hover:opacity-60">
            Back to top
          </a>
        </div>
      </footer>

      {/* ================= 移动端抽屉（断点 md，与左栏导航严格一致） ================= */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed right-0 top-0 z-[60] h-full w-[80%] max-w-sm bg-[#141414] px-8 py-10 transition-transform duration-[600ms] md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-6 top-6 z-[70] text-cream transition-all duration-500"
          style={{
            transform: open ? 'rotate(0deg)' : 'rotate(90deg)',
            opacity: open ? 1 : 0,
            transitionDelay: open ? '300ms' : '0ms',
          }}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        <p
          className="mb-8 text-[11px] uppercase tracking-[0.2em] text-cream/50 transition-all duration-500"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: open ? '250ms' : '0ms',
          }}
        >
          Site Index
        </p>

        <nav className="flex flex-col gap-2">
          {NAV.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-4xl text-cream transition-all duration-500"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: open ? `${300 + i * 80}ms` : '0ms',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p
          className="mb-5 mt-16 text-[11px] uppercase tracking-[0.2em] text-cream/50 transition-all duration-500"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: open ? '500ms' : '0ms',
          }}
        >
          Find Me
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {SOCIAL.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className="text-sm text-cream transition-all duration-500"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: open ? `${550 + i * 60}ms` : '0ms',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}