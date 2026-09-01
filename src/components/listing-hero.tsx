import type { ListingSegment } from '@/lib/listing'
import {
  LISTING_SEGMENT_HEADINGS,
  LISTING_SEGMENT_SUBHEADINGS,
} from '@/lib/listing'
import { cn } from '@/lib/utils'

const LISTING_HERO_IMAGES: Record<ListingSegment, string> = {
  kaufen: '/francesca-tosolini-tHkJAMcO3QE-unsplash%20(1).jpg',
  mieten: '/brian-babb-XbwHrt87mQ0-unsplash%20(1).jpg',
}

type ListingHeroProps = {
  listingSegment: ListingSegment
}

/**
 * Full-width hero heading with a background image for listing pages.
 *
 * @param listingSegment Active listing segment for the page.
 */
export const ListingHero = ({ listingSegment }: ListingHeroProps) => {
  const backgroundImage = LISTING_HERO_IMAGES[listingSegment]

  return (
    <section
      className={cn(
        'relative flex min-h-[350px] w-full items-center overflow-hidden bg-sidhu-dark text-white',
        'bg-cover bg-center'
      )}
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div
        className='absolute inset-0 bg-gradient-to-b from-sidhu-dark/35 to-sidhu-dark/70'
        aria-hidden='true'
      />

      <div className='relative mx-auto w-full max-w-6xl px-4'>
        <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl'>
          {LISTING_SEGMENT_HEADINGS[listingSegment]}
        </h1>
        <p className='mt-2 max-w-xl text-base text-white/80'>
          {LISTING_SEGMENT_SUBHEADINGS[listingSegment]}
        </p>
      </div>
    </section>
  )
}
