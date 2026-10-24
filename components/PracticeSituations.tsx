'use client'
import { useState } from 'react'
import Link from 'next/link'
import { QUIZ } from '@/data/content'

const situations = [QUIZ[1], QUIZ[4], QUIZ[3]]
export default function PracticeSituations() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  return <section className="practice-situations on-light" id="tinh-huong" aria-labelledby="practice-situations-title"><div className="learn-section-heading"><div><p className="eyebrow">Thử một cách ứng xử</p><h2 id="practice-situations-title">Giá trị trong<br />những tình huống gần gũi.</h2></div><p>Chọn cách bạn muốn ứng xử, rồi đọc lời gợi ý. Các tình huống do trang biên soạn để cùng suy ngẫm.</p></div><div className="practice-situation-list">{situations.map((situation, index) => <fieldset key={situation.q}><legend><span>0{index + 1}</span>{situation.q}</legend><div className="practice-situation-options">{situation.o.map((option, optionIndex) => <button key={option} type="button" aria-pressed={answers[index] === optionIndex} onClick={() => setAnswers(previous => ({ ...previous, [index]: optionIndex }))}><span aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{answers[index] !== undefined && <div className="practice-situation-feedback" role="status"><strong>{answers[index] === situation.a ? 'Một lựa chọn phù hợp.' : 'Bạn có thể cân nhắc thêm.'}</strong><p>{answers[index] !== situation.a && <>Gợi ý: {situation.o[situation.a]}. </>}{situation.why}</p></div>}</fieldset>)}</div><Link className="learn-text-link" href="/tuong-tac">Khám phá thêm tình huống tại trang Tương tác →</Link></section>
}
