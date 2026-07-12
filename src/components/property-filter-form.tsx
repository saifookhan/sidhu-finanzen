import { cn } from '@/lib/utils'
import {
  buildListingListPath,
  LISTING_MAX_PRICE_PLACEHOLDERS,
  LISTING_MIN_PRICE_PLACEHOLDERS,
} from '@/lib/listing'
import type { PropertyFilters } from '@/types/property'

type PropertyFilterFormProps = {
  filters: PropertyFilters
}

/**
 * Filter form that persists values in query params.
 *
 * @param filters Active filter values from URL.
 */
export const PropertyFilterForm = ({ filters }: PropertyFilterFormProps) => {
  const inputClassName = cn(
    'h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-zinc-900',
    'placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none'
  )

  return (
    <form
      method='GET'
      action={buildListingListPath(filters.listingSegment)}
      className='grid grid-cols-1 gap-3 rounded-xl border border-black/10 bg-[#f8f6f2] p-4 md:grid-cols-5'
    >
      <input
        className={inputClassName}
        type='text'
        name='city'
        placeholder='Stadt'
        defaultValue={filters.city ?? ''}
      />
      <input
        className={inputClassName}
        type='number'
        name='minPrice'
        placeholder={LISTING_MIN_PRICE_PLACEHOLDERS[filters.listingSegment]}
        min={0}
        defaultValue={filters.minPrice}
      />
      <input
        className={inputClassName}
        type='number'
        name='maxPrice'
        placeholder={LISTING_MAX_PRICE_PLACEHOLDERS[filters.listingSegment]}
        min={0}
        defaultValue={filters.maxPrice}
      />
      <input
        className={inputClassName}
        type='number'
        name='minRooms'
        placeholder='Min. Zimmer'
        min={0}
        defaultValue={filters.minRooms}
      />
      <div className='flex gap-2'>
        <input
          className={cn(inputClassName, 'flex-1')}
          type='number'
          name='maxRooms'
          placeholder='Max. Zimmer'
          min={0}
          defaultValue={filters.maxRooms}
        />
        <button
          type='submit'
          className='rounded-md bg-[#24313d] px-4 text-sm font-medium text-white transition hover:bg-[#1b252f]'
        >
          Anwenden
        </button>
      </div>
    </form>
  )
}
