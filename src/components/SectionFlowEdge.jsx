import { useEffect, useRef } from 'react'

const WORDS = 'RUAN JING AGENT CONTEXT RUNTIME MEMORY TOOLING SYSTEMS PYTHON BACKEND '

export default function SectionFlowEdge() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    let visible = false
    let lastTick = -1
    let lastWidth = 0

    const draw = () => {
      if (!visible) return
      const scrollTop = canvas.getBoundingClientRect().top
      const tick = Math.round(scrollTop / 6)
      if (tick !== lastTick || canvas.clientWidth !== lastWidth) {
        lastTick = tick
        const width = canvas.clientWidth
        lastWidth = width
        const height = canvas.clientHeight
        const ratio = Math.min(devicePixelRatio || 1, 2)
        if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
          canvas.width = Math.round(width * ratio)
          canvas.height = Math.round(height * ratio)
        }
        const style = getComputedStyle(canvas)
        const background = style.getPropertyValue('--edge-background').trim()
        const ink = style.getPropertyValue('--edge-ink').trim()
        const scrollPhase = scrollTop * 0.004
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        context.clearRect(0, 0, width, height)
        context.font = '10px "Geist Mono Variable", monospace'
        context.textBaseline = 'top'
        for (let x = 0, column = 0; x < width; x += 8, column++) {
          const wave = 70 + Math.sin(column * 0.19 + scrollPhase) * 20
            + Math.cos(column * 0.057 - scrollPhase) * 24
          for (let y = 0, row = 0; y < height; y += 12, row++) {
            const seed = ((column * 73 + row * 137 + tick * 17) % 101) / 101
            const depth = y - wave
            if (depth < -48 || (depth < 0 && seed > (depth + 48) / 70)) continue
            context.fillStyle = background
            if (depth > seed * 30) context.fillRect(x, y, 9, 13)
            if (depth < 50 && seed > 0.18) {
              context.fillStyle = depth < 0 ? background : ink
              context.fillText(WORDS[(column + row * 11 + tick) % WORDS.length], x, y)
            }
          }
        }
      }
      frame = requestAnimationFrame(draw)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(draw)
    })
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={ref} className="section-flow-edge" aria-hidden="true" />
}
