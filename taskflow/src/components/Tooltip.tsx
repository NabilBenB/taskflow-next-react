import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import styles from './Tooltip.module.css'

/** Bonus Séance 2 — même logique que le PDF (flash useEffect vs useLayoutEffect). */
export default function Tooltip() {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [useLayout, setUseLayout] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (useLayout) return
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 8, left: rect.left })
    }
  }, [useLayout])

  useLayoutEffect(() => {
    if (!useLayout) return
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 8, left: rect.left })
    }
  }, [useLayout])

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          setPosition({ top: 0, left: 0 })
          setUseLayout((prev) => !prev)
        }}
      >
        Basculer : {useLayout ? 'useLayoutEffect' : 'useEffect'}
      </button>
      <button type="button" ref={buttonRef} className={styles.btn}>
        Survolez-moi
      </button>
      <div
        className={`${styles.bubble} ${position.top === 0 ? styles.flash : styles.ok}`}
        style={{ top: position.top, left: position.left }}
      >
        {position.top === 0 ? '⚡ FLASH (0,0)' : 'Info-bulle positionnée !'}
      </div>
    </div>
  )
}
