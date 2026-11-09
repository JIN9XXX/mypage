import { useEffect, useRef } from 'react'

const GLYPHS = '01ABCDEF23456789!@#$%&*+-=<>/\\|{}[]();:~?'

export default function TextFlowTransition({ phase }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!phase || !canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const started = performance.now()
    let frame = 0
    let lastTick = -1
    const draw = (now) => {
      const tick = Math.floor((now - started) / 40)
      if (tick !== lastTick) {
        lastTick = tick
        const width = window.innerWidth
        const height = window.innerHeight
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
          canvas.width = Math.round(width * pixelRatio)
          canvas.height = Math.round(height * pixelRatio)
        }
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        context.clearRect(0, 0, width, height)
        const progress = Math.min(1, (now - started) / (phase === 'covering' ? 440 : 760))
        const coverage = phase === 'covering' ? progress : 1 - progress
        const cellWidth = width < 760 ? 8 : 10
        const cellHeight = 16
        context.font = '13px Consolas, monospace'
        context.textBaseline = 'top'
        for (let y = 0, row = 0; y < height; y += cellHeight, row++) {
          for (let x = 0, column = 0; x < width; x += cellWidth, column++) {
            // Broad waves create connected islands, with a small amount of cell noise at their edges.
            const wave = (Math.sin(column * 0.075 + row * 0.11) + Math.cos(column * 0.12 - row * 0.045) + 2) / 4
            const grain = ((column * 31 + row * 17) % 29) / 29
            const field = wave * 0.84 + grain * 0.16
            if (coverage <= 0 || (coverage < 1 && field > coverage * 1.3 - 0.15)) continue
            context.fillStyle = '#0b0b0b'
            context.fillRect(x, y, cellWidth + 1, cellHeight + 1)
            let seed = (column * 73856093 ^ row * 19349663 ^ tick * 83492791) >>> 0
            seed ^= seed << 13
            seed ^= seed >>> 17
            seed ^= seed << 5
            seed >>>= 0
            context.fillStyle = `rgba(232,230,224,${0.35 + (seed % 7) * 0.08})`
            context.fillText(GLYPHS[seed % GLYPHS.length], x, y)
          }
        }
      }
      frame = requestAnimationFrame(draw)
    }
    draw(started)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  return <canvas ref={canvasRef} className={`page-transition-flow ${phase ? `is-${phase}` : ''}`} aria-hidden="true" />
}
