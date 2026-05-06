import styles from './Avatar.module.css'

const AVATAR_PALETTE = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#ef4444',
]

function hashStringToIndex(str: string, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % max
}

function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

interface AvatarProps {
  name: string
  size?: number
}

export function Avatar({ name, size = 36 }: AvatarProps) {
  const safeSize = Math.max(1, size)
  const safeName = name || '?'
  const color = AVATAR_PALETTE[hashStringToIndex(safeName, AVATAR_PALETTE.length)]
  const initials = getInitials(safeName)

  return (
    <div
      className={styles.avatar}
      role="img"
      style={{
        width: safeSize,
        height: safeSize,
        backgroundColor: color,
        fontSize: safeSize * 0.4,
      }}
      aria-label={`Avatar for ${safeName}`}
    >
      {initials}
    </div>
  )
}
