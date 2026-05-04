import { useEffect, useState } from 'react'

export default function OfflineIndicator() {
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      setShowUpdate(true)
    }

    window.addEventListener('sw-update', handleUpdate)
    return () => window.removeEventListener('sw-update', handleUpdate)
  }, [])

  const handleReload = () => {
    window.location.reload()
  }

  if (!showUpdate) return null

  return (
    <div className="update-banner">
      <span>🔄 Update available</span>
      <button onClick={handleReload} className="update-btn">
        Reload
      </button>
    </div>
  )
}
