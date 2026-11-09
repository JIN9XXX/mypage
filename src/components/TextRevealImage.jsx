import { forwardRef, useState } from 'react'

const TextRevealImage = forwardRef(function TextRevealImage(
  { alt, className = '', hint = '移入查看原图 · 点击固定', imageSrc, textSrc, ...imageProps },
  ref,
) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const revealed = hovered || focused || pinned

  const setRevealOrigin = (element, x, y) => {
    const width = element.offsetWidth
    const height = element.offsetHeight
    if (!width || !height) return

    const localX = Math.max(0, Math.min(width, x))
    const localY = Math.max(0, Math.min(height, y))
    const radius = Math.ceil(Math.hypot(Math.max(localX, width - localX), Math.max(localY, height - localY)))

    element.style.setProperty('--reveal-x', `${localX}px`)
    element.style.setProperty('--reveal-y', `${localY}px`)
    element.style.setProperty('--reveal-radius', `${radius}px`)
  }

  const onPointerEnter = (event) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const scaleX = bounds.width / event.currentTarget.offsetWidth || 1
    const scaleY = bounds.height / event.currentTarget.offsetHeight || 1
    setRevealOrigin(
      event.currentTarget,
      (event.clientX - bounds.left) / scaleX,
      (event.clientY - bounds.top) / scaleY,
    )
    setHovered(true)
  }

  const setCenteredOrigin = (element) => {
    setRevealOrigin(element, element.offsetWidth / 2, element.offsetHeight / 2)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`text-reveal-image ${className} ${revealed ? 'is-revealed' : ''}`.trim()}
      aria-label={`${alt}，点击切换原图显示`}
      aria-pressed={pinned}
      onPointerEnter={onPointerEnter}
      onPointerDown={(event) => {
        if (event.pointerType !== 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        setRevealOrigin(
          event.currentTarget,
          (event.clientX - bounds.left) * event.currentTarget.offsetWidth / bounds.width,
          (event.clientY - bounds.top) * event.currentTarget.offsetHeight / bounds.height,
        )
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') setHovered(false)
      }}
      onClick={() => {
        setPinned((value) => !value)
        setFocused(false)
      }}
      onFocus={(event) => {
        const keyboardFocus = event.currentTarget.matches(':focus-visible')
        if (keyboardFocus) setCenteredOrigin(event.currentTarget)
        setFocused(keyboardFocus)
      }}
      onBlur={() => setFocused(false)}
    >
      <img className="text-reveal-image-text" src={textSrc} alt="" aria-hidden="true" draggable="false" {...imageProps} />
      <img className="text-reveal-image-original" src={imageSrc} alt="" aria-hidden="true" draggable="false" {...imageProps} />
      {hint && <span className="text-reveal-image-hint" aria-hidden="true">{hint}</span>}
    </button>
  )
})

export default TextRevealImage
