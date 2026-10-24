import { LIBRARY, QUIZ, SOURCES } from '@/data/content'
import { PRACTICE_ACTIONS, PRACTICE_VALUES } from '@/data/practice'
import type { EditorialRecord, ManagedCollection } from './editorial'

export type SeedEntry = { collection: ManagedCollection; id: string; record: EditorialRecord }
const base = (): EditorialRecord => ({ status: 'draft', title: '', text: '', name: '', category: '', source: '', verifiedBy: '', verifiedOn: '', date: '', url: '', photographer: '', permission: '', period: '', value: 0, type: '' })

// Import only editorial resources already present on the site. Verification remains human.
export function starterContent(): SeedEntry[] {
  return [
    ...LIBRARY.map(item => ({ collection: 'library' as const, id: `curated-${item.id}`, record: {
      ...base(), title: item.title, text: item.description ?? '', type: item.type,
      source: item.source, url: item.url, curatedId: item.id,
    } })),
    ...QUIZ.map((item, index) => ({ collection: 'quiz_questions' as const, id: `practice-${index + 1}`, record: {
      ...base(), title: item.q, text: item.why, options: item.o.join('\n'), correct: item.a,
      source: `Tình huống thực hành do website biên soạn; tham khảo: ${SOURCES.ethics}`,
    } })),
    ...PRACTICE_VALUES.map(value => {
      const action = PRACTICE_ACTIONS.find(item => item.value === value.id)!
      return { collection: 'daily_challenges' as const, id: `practice-${value.id}`, record: {
        ...base(), title: action.title, category: value.title,
        text: [action.context, ...action.steps.map((step, index) => `${index + 1}. ${step}`), action.reflection].join('\n\n'),
        source: `Gợi ý thực hành do website biên soạn; tham khảo: ${value.source}`,
      } }
    }),
  ]
}
