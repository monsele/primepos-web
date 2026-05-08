import { useState, useMemo } from 'react'
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
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      data-testid="group-select-backdrop"
    >
      <div className={styles.sheet} data-testid="group-select-sheet">
        <div className={styles.header}>
          <span className={styles.title}>Select Group</span>
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
