import Image from 'next/image'
import type { CommunityStory } from '@/data/community-stories'
import type { EditorialRecord } from '@/lib/editorial'
import DocumentaryMedia from './DocumentaryMedia'

export default function StoryPhoto({ story, media, priority = false }: { story: CommunityStory; media: EditorialRecord[]; priority?: boolean }) {
  const photo = media.find(item => item.category === `story:${story.id}`)
  if (photo || !story.localImage) return <DocumentaryMedia item={photo} priority={priority} />
  const image = story.localImage
  return <figure className="story-local-photo"><Image src={image.src} width={image.width} height={image.height} alt={image.alt} sizes="(max-width: 800px) 90vw, 60vw" priority={priority} style={{ aspectRatio: `${image.width} / ${image.height}` }} /></figure>
}
