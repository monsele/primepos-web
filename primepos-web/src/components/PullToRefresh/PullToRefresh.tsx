import { useRef, useState, useCallback, type ReactNode, type TouchEvent } from 'react'
import styles from './PullToRefresh.module.css'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => void | Promise<void>
  threshold?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [indicatorVisible, setIndicatorVisible] = useState(false)
  const startYRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    if (container.scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (startYRef.current === null || isRefreshing) return

      const container = containerRef.current
      if (!container || container.scrollTop > 0) return

      const deltaY = e.touches[0].clientY - startYRef.current

      if (deltaY > 0) {
        setIndicatorVisible(true)
      }
    },
    [isRefreshing]
  )

  const handleTouchEnd = useCallback(() => {
    if (startYRef.current === null) return

    const container = containerRef.current
    if (!container) {
      startYRef.current = null
      setIndicatorVisible(false)
      return
    }

    // We can't reliably get the final touch position from the event here
    // because touchend doesn't have touches. We estimate based on scroll
    // position or use a simpler heuristic: if the user pulled down
    // and we showed the indicator, we check if they've scrolled past threshold.
    // For simplicity, we'll track last touch position in a ref.

    startYRef.current = null
    setIndicatorVisible(false)
  }, [])

  // Track last known touch position to determine threshold on touchend
  const lastYRef = useRef<number | null>(null)

  const handleTouchMoveWithTracking = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      lastYRef.current = e.touches[0].clientY
      handleTouchMove(e)
    },
    [handleTouchMove]
  )

  const handleTouchEndWithThreshold = useCallback(() => {
    if (startYRef.current === null || lastYRef.current === null || isRefreshing) {
      startYRef.current = null
      lastYRef.current = null
      setIndicatorVisible(false)
      return
    }

    const deltaY = lastYRef.current - startYRef.current
    startYRef.current = null
    lastYRef.current = null

    if (deltaY >= threshold) {
      setIsRefreshing(true)
      Promise.resolve(onRefresh()).finally(() => {
        setIsRefreshing(false)
        setIndicatorVisible(false)
      })
    } else {
      setIndicatorVisible(false)
    }
  }, [isRefreshing, onRefresh, threshold])

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMoveWithTracking}
      onTouchEnd={handleTouchEndWithThreshold}
      data-testid="pull-to-refresh"
    >
      <div
        className={`${styles.indicator} ${indicatorVisible || isRefreshing ? styles.indicatorVisible : ''}`}
        data-testid="ptr-indicator"
      >
        <div className={styles.spinner} />
      </div>
      {children}
    </div>
  )
}
