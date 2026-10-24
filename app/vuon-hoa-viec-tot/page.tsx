import ExhibitionPage, { NextChapter } from '@/components/ExhibitionPage'
import Garden from '@/components/Garden'
import { chapterMetadata } from '@/lib/metadata'
export const metadata = chapterMetadata('Vườn hoa việc tốt', 'Mỗi việc tốt, một bông hoa đẹp. Gửi câu chuyện để lan tỏa những giá trị tích cực.', '/vuon-hoa-viec-tot')
export default function Page() {
  return <ExhibitionPage eyebrow="Chương 05 · Cộng đồng" title="Mỗi việc tốt. Một bông hoa đẹp." description="Một lời hỏi thăm, một lần giúp đỡ, một việc chung được hoàn thành. Hãy kể lại điều bạn đã làm để những giá trị tốt đẹp tiếp tục lan tỏa." tone="emerald"><Garden /><NextChapter label="Tiếp tục tham gia" href="/tuong-tac" title="Một việc nhỏ cho hôm nay" /></ExhibitionPage>
}
