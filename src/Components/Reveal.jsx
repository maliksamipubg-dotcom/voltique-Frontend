import { useEffect, useRef, useState } from 'react'

// Shared, dependency-free scroll-reveal primitives.
// Uses IntersectionObserver and only animates `transform` / `opacity`, so the
// work stays on the compositor. If the API is unavailable (or the visitor
// prefers reduced motion) content is simply shown immediately.
const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const useReveal = ({ threshold = 0.01, rootMargin = '0px 0px -48px 0px', once = true } = {}) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, visible]
}

// Reveal a single block (section, panel, heading…).
export const Reveal = ({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) => {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${visible ? 'is-visible' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Reveal a container and cascade its direct children in one after another.
// Applied to the grid/flex container itself so no extra wrappers are introduced
// and the existing layout is untouched.
export const RevealGroup = ({ as: Tag = 'div', className = '', children, ...rest }) => {
  const [ref, visible] = useReveal({ threshold: 0.01, rootMargin: '0px 0px -32px 0px' })
  return (
    <Tag
      ref={ref}
      data-reveal-group=""
      className={`${visible ? 'is-visible' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Reveal
