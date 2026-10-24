import Image from 'next/image'
import type { HistoricalImage } from '@/data/historical-media'

export default function HistoricalPhoto({ image, className = '', sizes = '(max-width: 800px) 88vw, 40vw' }: {
  image: HistoricalImage
  className?: string
  sizes?: string
}) {
  return <figure className={`historical-photo ${className}`}>
    <Image src={image.src} width={image.width} height={image.height} alt={image.alt} sizes={sizes} />
    <figcaption>
      <p>{image.caption}</p>
      <p><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.shortCredit || image.credit}</a></p>
    </figcaption>
  </figure>
}
