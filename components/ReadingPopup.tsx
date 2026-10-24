'use client'
import { useState, type ReactNode } from 'react'
import { LIBRARY } from '@/data/content'
import ReadingDialog from './ReadingDialog'

export default function ReadingPopup({ sourceUrl, itemId, children, className = '' }: { sourceUrl: string; itemId?: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const item = LIBRARY.find(entry => itemId ? entry.id === itemId : entry.url === sourceUrl)
  if (!item) return <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  return <><button type="button" className={`reading-popup-trigger ${className}`} aria-haspopup="dialog" onClick={() => setOpen(true)}>{children}</button><ReadingDialog preview={open ? item : null} onDismiss={() => setOpen(false)} /></>
}
