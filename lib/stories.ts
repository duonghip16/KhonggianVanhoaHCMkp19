import 'server-only'
import { loadPublishedCollections } from './public-content'
import { mergeCommunityStories } from '@/data/community-stories'

export async function loadStories() {
  const { records: [stories, media], unavailable } = await loadPublishedCollections(['stories', 'media'])
  return { stories: mergeCommunityStories(stories), media, unavailable }
}
