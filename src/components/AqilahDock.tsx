import { useEffect, useState } from 'react'
import { Tabs } from '@/components/liquikit/tabs'

// Floating liquid-glass tab bar for /aqilah, built on LiquiKit's Tabs.Bar
// (https://liquikit.dev, MIT © Himanshu Aggarwal; installed via `shadcn add @liquikit/tabs`).
// It talks to the page's vanilla sheet script through window events:
//   dock:open  {detail: sheetId}  open a bottom sheet
//   dock:close                    close any sheet
//   sheet:closed                  (from the page) a sheet was dismissed

const icon = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
)

const TABS = [
  { value: 'home', label: 'Invite', icon: icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>) },
  { value: 'contact', label: 'Contact', icon: icon(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />) },
  { value: 'location', label: 'Location', icon: icon(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>) },
  { value: 'calendar', label: 'Calendar', icon: icon(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>) },
  { value: 'share', label: 'Share', icon: icon(<><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></>) },
]

const SHEETS: Record<string, string> = { contact: 'sheet-contact', location: 'sheet-location', share: 'sheet-share' }

export default function AqilahDock({ calendarUrl }: { calendarUrl: string }) {
  const [value, setValue] = useState('home')

  useEffect(() => {
    const reset = () => setValue('home')
    window.addEventListener('sheet:closed', reset)
    return () => window.removeEventListener('sheet:closed', reset)
  }, [])

  function onValueChange(next: string) {
    if (next === 'calendar') {
      // an action, not a place: let the lens visit, open the link, then glide back
      setValue(next)
      window.open(calendarUrl, '_blank', 'noopener')
      window.dispatchEvent(new Event('dock:close'))
      setTimeout(() => setValue('home'), 500)
      return
    }
    setValue(next)
    window.dispatchEvent(SHEETS[next] ? new CustomEvent('dock:open', { detail: SHEETS[next] }) : new Event('dock:close'))
  }

  return (
    <Tabs.Root value={value} onValueChange={onValueChange}>
      <Tabs.Bar tabs={TABS} aria-label="Quick actions" />
    </Tabs.Root>
  )
}
