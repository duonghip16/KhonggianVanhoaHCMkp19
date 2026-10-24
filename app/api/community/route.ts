import { NextResponse } from 'next/server'
import { publishedRecords } from '@/lib/public-content'
export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get('type')
  if (type !== 'deeds' && type !== 'messages') return NextResponse.json({ error: 'Danh mục không hợp lệ.' }, { status: 400 })
  try {
    const items = await publishedRecords(type)
    return NextResponse.json(items.slice(0, 24).map(item => ({ id: item.id, title: item.title, date: item.date, text: item.text, name: item.name })))
  } catch { return NextResponse.json({ error: 'Chưa tải được nội dung cộng đồng.' }, { status: 503 }) }
}
