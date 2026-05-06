import { type ReactNode } from 'react'
import styles from './ScreenTransition.module.css'

interface ScreenTransitionProps {
  direction: 'push' | 'pop' | 'none'
  children: ReactNode
}

export function ScreenTransition({ direction, children }: ScreenTransitionProps) {
  const animationClass =
    direction === 'push'
      ? styles.slideInRight
      : direction === 'pop'
        ? styles.slideInLeft
        : styles.noAnimation

  return (
    <div
      className={`${styles.screenWrapper} ${animationClass}`}
      aria-live="polite"
    >
      {children}
    </div>
  )
}
