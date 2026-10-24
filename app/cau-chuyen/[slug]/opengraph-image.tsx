import { socialImage } from '@/lib/social-image'
import { loadStories } from '@/lib/stories'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-dynamic'
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = (await loadStories()).stories.find(item => item.id === slug)
  return socialImage(story?.title ?? 'Những câu chuyện đẹp', story?.category ?? 'Khu phố 19')
}
