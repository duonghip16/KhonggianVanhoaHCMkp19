import { SITE_NAME } from '@/data/site'
import { socialImage } from '@/lib/social-image'
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() { return socialImage('Ánh sáng từ tư tưởng, nở hoa từ hành động.') }
