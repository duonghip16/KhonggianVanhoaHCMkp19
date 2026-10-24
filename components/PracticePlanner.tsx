'use client'
import { useId, useState } from 'react'
import ReadingPopup from './ReadingPopup'
import { planDownload } from '@/lib/plan-download'
import { PRACTICE_ACTIONS, PRACTICE_VALUES, type PracticeValue } from '@/data/practice'

export default function PracticePlanner() {
  const [value, setValue] = useState<PracticeValue>('ethics')
  const [actionId, setActionId] = useState(PRACTICE_ACTIONS[0].id)
  const [completed, setCompleted] = useState<Record<string, number[]>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [status, setStatus] = useState('')
  const [copyFallback, setCopyFallback] = useState('')
  const instanceId = useId()
  const actions = PRACTICE_ACTIONS.filter(action => action.value === value)
  const action = PRACTICE_ACTIONS.find(item => item.id === actionId)!
  const category = PRACTICE_VALUES.find(item => item.id === value)!
  const checked = completed[actionId] ?? []

  function selectValue(next: PracticeValue) {
    setValue(next); setActionId(PRACTICE_ACTIONS.find(item => item.value === next)!.id); setStatus(''); setCopyFallback('')
  }
  function selectAction(next: string) { setActionId(next); setStatus(''); setCopyFallback('') }
  function toggleStep(index: number) {
    setCompleted(previous => { const steps = previous[actionId] ?? []; return { ...previous, [actionId]: steps.includes(index) ? steps.filter(step => step !== index) : [...steps, index] } })
    setStatus(''); setCopyFallback('')
  }
  function planText() {
    return ['MỘT VIỆC NHỎ · MỘT NGÀY Ý NGHĨA', 'Kế hoạch của mình | Khu phố 19', '', `${category.title} · ${checked.length}/3 bước`, action.title, action.context, '', 'BA BƯỚC BẮT ĐẦU', ...action.steps.map((step, index) => `${checked.includes(index) ? '☑' : '☐'} Bước ${index + 1}: ${step}`), '', 'MÌNH ĐÃ HỌC ĐƯỢC GÌ?', action.reflection, notes[actionId] || '(Dành một dòng cho điều mình nhận ra)', '', 'Bắt đầu vừa sức. Tiếp tục bằng sự bền bỉ.', '', 'Gợi ý thực hành do Khu phố 19 biên soạn; không phải lời trích dẫn của Chủ tịch Hồ Chí Minh.', `Nguồn tìm hiểu: ${category.source}`].join('\n')
  }
  function download() {
    const html = planDownload({ action, category: category.title, checked, note: notes[actionId] || '', source: category.source })
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `ke-hoach-${action.id}.html`
    document.body.append(anchor); anchor.click(); anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('Đã tạo mẫu kế hoạch. Mở tệp HTML để đánh dấu, ghi chú và chọn In / Lưu PDF.'); setCopyFallback('')
  }
  async function copy() {
    try { await navigator.clipboard.writeText(planText()); setStatus('Đã sao chép kế hoạch.'); setCopyFallback('') }
    catch { setCopyFallback(planText()); setStatus('Bạn có thể chọn và sao chép nội dung kế hoạch bên dưới.') }
  }

  return <section className="practice-planner on-light" id="hanh-dong" aria-labelledby="practice-planner-title">
    <div className="learn-section-heading"><div><p className="eyebrow">Một việc vừa sức</p><h2 id="practice-planner-title">Chọn điều muốn làm.<br />Bắt đầu từ hôm nay.</h2></div><p>Chọn một giá trị, một việc cụ thể và ba bước thực hiện. Bạn có thể tự đánh dấu, ghi điều đã học và lưu kế hoạch cho mình.</p></div>
    <p className="practice-origin-note">Gợi ý thực hành do Khu phố 19 biên soạn. Bạn có thể điều chỉnh theo thời gian và khả năng của mình.</p>
    <div className="practice-value-tabs" role="group" aria-label="Chọn nhóm giá trị">{PRACTICE_VALUES.map(item => <button key={item.id} type="button" aria-pressed={value === item.id} onClick={() => selectValue(item.id)}>{item.title}</button>)}</div>
    <div className="practice-action-options" role="group" aria-label={`Việc thực hành ${category.title}`}>{actions.map((item, index) => <button key={item.id} type="button" aria-pressed={actionId === item.id} onClick={() => selectAction(item.id)}><span>0{index + 1}</span><strong>{item.title}</strong><span className="practice-option-description">{item.context}</span><span className="practice-option-state">{actionId === item.id ? 'Đang chọn' : 'Chọn việc này'} <i aria-hidden="true">→</i></span></button>)}</div>
    <a className="practice-open-plan" href="#ke-hoach-thuc-hanh">Xem kế hoạch đang chọn ↓</a>
    <div className="practice-plan" id="ke-hoach-thuc-hanh"><div className="practice-plan-summary"><p className="eyebrow">Kế hoạch của bạn</p><h3>{action.title}</h3><p>{action.context}</p><p className="practice-plan-count" role="status" aria-live="polite">{checked.length} / 3 bước đã đánh dấu</p><ReadingPopup sourceUrl={category.source}>Đọc tư liệu về {category.title.toLocaleLowerCase('vi')} →</ReadingPopup></div><div className="practice-plan-work">
      <fieldset className="practice-checklist"><legend>Ba bước thực hiện</legend>{action.steps.map((step, index) => <label key={`${actionId}-${index}`}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggleStep(index)} /><span><small>Bước {index + 1}</small>{step}</span></label>)}</fieldset>
      {checked.length === 3 && <p className="practice-plan-complete">Bạn đã đánh dấu đủ ba bước. Dành một chút thời gian nhìn lại điều đã làm và điều muốn làm tốt hơn.</p>}
      <label className="practice-reflection" htmlFor={`${instanceId}-note`}>Điều tôi nhìn lại <span>Không bắt buộc</span></label><p className="practice-reflection-question" id={`${instanceId}-prompt`}>{action.reflection}</p><textarea id={`${instanceId}-note`} aria-describedby={`${instanceId}-prompt`} value={notes[actionId] ?? ''} onChange={event => { setNotes(previous => ({ ...previous, [actionId]: event.target.value })); setStatus(''); setCopyFallback('') }} maxLength={1200} rows={4} placeholder="Ghi ngắn một điều bạn nhận ra hoặc muốn tiếp tục…" />
      <div className="practice-plan-actions"><button className="btn dark" type="button" onClick={download}>Tải kế hoạch ↓</button><button type="button" onClick={copy}>Sao chép kế hoạch</button></div><p className="practice-save-note">Tải mẫu HTML có thể đánh dấu, ghi chú và in / lưu PDF; hoặc sao chép bản chữ để gửi qua tin nhắn. Ghi chú trên trang chỉ ở lại trong phiên này và không được gửi lên website.</p><p className="practice-plan-status" role="status" aria-live="polite">{status}</p>{copyFallback && <label className="practice-copy-fallback">Nội dung để sao chép<textarea readOnly rows={8} value={copyFallback} onFocus={event => event.target.select()} /></label>}
    </div></div>
  </section>
}
