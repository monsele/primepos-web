import { useState, useMemo, useEffect, useRef } from 'react'
import type { Group } from '../../types/group'
import styles from './GroupSelect.module.css'

export interface GroupSelectProps {
  groups: Group[]
  isOpen: boolean
  onClose: () => void
  onSelect: (group: Group) => void
}

export function GroupSelect({ groups, isOpen, onClose, onSelect }: GroupSelectProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const backdropRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups
    const q = searchQuery.toLowerCase()
    return groups.filter(
      (g) =>
        g.groupName.toLowerCase().includes(q) ||
        g.groupCode.toLowerCase().includes(q)
    )
  }, [groups, searchQuery])

  const handleSelect = (group: Group) => {
    setSearchQuery('')
    onSelect(group)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Use pointer-events-like behavior with dedicated check
    if (e.target === backdropRef.current) {
      onClose()
    }
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      
      // Focus the sheet for keyboard navigation
      const focusable = sheetRef.current?.querySelector('input, button') as HTMLElement
      focusable?.focus()
    } else {
      document.body.style.overflow = ''
      previouslyFocusedElementRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Keyboard accessibility: Escape key to close, focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

// Reset search query when modal closes without selection
   const prevIsOpenRef = useRef(false)
   useEffect(() => {
    if (!isOpen && prevIsOpenRef.current) {
      setSearchQuery('')
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={handleBackdropClick}
      data-testid="group-select-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-select-title"
    >
      <div ref={sheetRef} className={styles.sheet} data-testid="group-select-sheet">
        <div className={styles.header}>
          <span id="group-select-title" className={styles.title}>Select Group</span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            data-testid="group-select-close"
          >
            ×
          </button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            data-testid="group-select-search"
            autoFocus
          />
        </div>

        <div className={styles.list} data-testid="group-select-list">
          {filteredGroups.length === 0 ? (
            <div className={styles.emptyState} data-testid="group-select-empty">
              No groups found
            </div>
          ) : (
            filteredGroups.map((group) => (
              <button
                key={group.id}
                className={styles.item}
                onClick={() => handleSelect(group)}
                data-testid={`group-select-item-${group.id}`}
              >
                <span className={styles.itemName}>{group.groupName}</span>
                <span className={styles.itemMeta}>
                  {group.groupCode} · {group.memberCount} members
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
