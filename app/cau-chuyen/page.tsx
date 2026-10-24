import type { Metadata } from 'next'
import ExhibitionPage, { NextChapter } from '@/components/ExhibitionPage'
import { loadStories } from '@/lib/stories'
import ContentServiceNote from '@/components/ContentServiceNote'
import StoryGrid from '@/components/StoryGrid'
import { chapterMetadata } from '@/lib/metadata'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = chapterMetadata('Những câu chuyện đẹp', 'Những câu chuyện có thật của cộng đồng Khu phố 19, được xác minh trước khi công bố.', '/cau-chuyen')
export default async function Page() {
  const { stories, media, unavailable } = await loadStories()
  return <ExhibitionPage eyebrow="Chương 04 · Những câu chuyện đẹp" title="Một việc nhỏ. Một câu chuyện đáng nhớ." description="Những con người và việc làm bình dị của Khu phố 19. Kể bằng tư liệu thật, chia sẻ với sự trân trọng." tone="emerald"><section className="on-light">{unavailable && <ContentServiceNote />}<div className="stories-heading"><div><p className="eyebrow">Ghi chép từ cộng đồng</p><h2>Những điều đẹp ở ngay quanh ta.</h2></div><p>Từ hành trình về nguồn đến góc phố xanh, mỗi câu chuyện là một cách cùng nhau chăm lo nơi mình sống.</p></div><StoryGrid stories={stories} media={media} /></section><NextChapter label="Góp thêm một câu chuyện" href="/vuon-hoa-viec-tot" title="Mỗi việc tốt, một bông hoa đẹp" /></ExhibitionPage>
}
