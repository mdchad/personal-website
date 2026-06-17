import { useEffect, useState } from 'react'
import 'slot-text/style.css'
import { SlotText } from 'slot-text/react'

// wedding day
const TARGET = new Date('2026-08-08T00:00:00').getTime()

function remaining() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const [t, setT] = useState(remaining())

  useEffect(() => {
    const id = setInterval(() => setT(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!t) {
    return <span className="text-sm text-hotpink">the big day! 🎉</span>
  }

  const parts: [string, string][] = [
    [String(t.days), 'd'],
    [String(t.hours).padStart(2, '0'), 'h'],
    [String(t.minutes).padStart(2, '0'), 'm'],
    [String(t.seconds).padStart(2, '0'), 's'],
  ]

  return (
    <span className="flex flex-col gap-0.5">
      <span className="flex items-baseline gap-1.5 text-sm tabular-nums text-fg-secondary/70 dark:text-fg-dark-secondary">
        {parts.map(([value, unit]) => (
          <span key={unit} className="inline-flex items-baseline">
            <span className="text-hotpink">
              <SlotText text={value} options={{ direction: 'up' }} />
            </span>
            {unit}
          </span>
        ))}
      </span>
      <span className="text-xs text-fg-secondary/50 dark:text-fg-dark-secondary">
        8 August 2026
      </span>
    </span>
  )
}
