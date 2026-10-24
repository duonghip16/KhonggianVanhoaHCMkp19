import { verifyUploadAdmin } from '@/lib/firebase-admin'
import { handleMediaUpload } from '@/lib/media-upload'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  return handleMediaUpload(request, verifyUploadAdmin, {
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  })
}
