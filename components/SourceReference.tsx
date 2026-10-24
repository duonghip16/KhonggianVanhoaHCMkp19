import { safeUrl } from '@/lib/editorial'

export default function SourceReference({ text }: { text: string }) {
  return <>{text.split(/(https:\/\/[^\s<>]+)/).map((part, index) => {
    const link = part.replace(/[.,;)]+$/, '')
    return link.startsWith('https://') && safeUrl(link) ? <span key={index}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a>{part.slice(link.length)}</span> : <span key={index}>{part}</span>
  })}</>
}
