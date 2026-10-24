import { notFound } from 'next/navigation'
import AdminCMS from '@/components/AdminCMS'
import type { ManagedCollection } from '@/lib/editorial'
const sections: Record<string, ManagedCollection> = { 'cau-chuyen': 'stories', 'hoat-dong': 'activities', 'viec-tot': 'deeds', 'thu-vien': 'library', 'loi-nhan': 'messages', quiz: 'quiz_questions', 'thong-ke': 'site_stats', 'hinh-anh': 'media', 'thu-thach': 'daily_challenges' }
export const metadata = { title: 'Quản trị nội dung', robots: { index: false, follow: false } }
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!sections[section]) notFound()
  return <AdminCMS initialCollection={sections[section]} />
}
