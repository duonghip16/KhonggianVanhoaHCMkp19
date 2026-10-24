import ExhibitionPage, { NextChapter } from '@/components/ExhibitionPage'
import DailyAction from '@/components/DailyAction'
import Quiz from '@/components/Quiz'
import MessageWall from '@/components/MessageWall'
import { loadPublishedCollections } from '@/lib/public-content'
import ContentServiceNote from '@/components/ContentServiceNote'
import { QUIZ } from '@/data/content'
import { chapterMetadata } from '@/lib/metadata'
export const dynamic = 'force-dynamic'
export const metadata = chapterMetadata('Tương tác', 'Chọn một thử thách, tham gia quiz và gửi lời nhắn tích cực đến Khu phố 19.', '/tuong-tac')
export default async function Page() {
  const { records: [questions, challenges], unavailable } = await loadPublishedCollections(['quiz_questions', 'daily_challenges'])
  const quiz = questions.length ? questions.slice(0, 10).map(item => ({ q: item.title, o: item.options!.split('\n').map(option => option.trim()).filter(Boolean), a: item.correct!, why: item.text })) : QUIZ
  return <ExhibitionPage eyebrow="Chương 07 · Bạn là một phần câu chuyện" title="Giá trị đẹp bắt đầu từ bạn." description="Chọn một việc nhỏ để làm, thử sức với những tình huống gần gũi và gửi một lời nhắn cho cộng đồng." tone="emerald">{unavailable && <ContentServiceNote />}<DailyAction challenges={challenges} /><Quiz questions={quiz} /><MessageWall /><NextChapter label="Kể điều bạn đã làm" href="/vuon-hoa-viec-tot" title="Góp một bông hoa cho khu vườn" /></ExhibitionPage>
}
