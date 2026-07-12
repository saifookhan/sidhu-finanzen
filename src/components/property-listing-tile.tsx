import Link from 'next/link'
import type { ReactNode } from 'react'

import { PropertyListingTileImages } from '@/components/property-listing-tile-images'
import {
  buildListingDetailPath,
  LISTING_PRICE_LABELS,
  LISTING_TYPE_BADGE_LABELS,
} from '@/lib/listing'
import {
  formatListingArea,
  formatListingPrice,
  resolveAvailabilityBadgeLabel,
  resolvePropertyLocationLabel,
} from '@/lib/property-listing'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

type PropertyListingTileProps = {
  property: Property
  className?: string
}

type ListingMetaItem = {
  key: string
  tooltip: string
  value: string
  icon: ReactNode
}

type IconProps = {
  className?: string
}

/**
 * Location pin icon for listing tiles.
 *
 * @param className Optional utility classes.
 */
const LocationIcon = ({ className }: IconProps) => {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={cn('h-4 w-4 shrink-0', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
    >
      <path d='M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z' />
      <circle cx='12' cy='11' r='2.5' />
    </svg>
  )
}

/**
 * Area icon for listing tiles.
 *
 * @param className Optional utility classes.
 */
const AreaIcon = ({ className }: IconProps) => {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={cn('h-4 w-4 shrink-0', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
    >
      <path d='M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4' />
      <rect x='7' y='7' width='10' height='10' rx='1' />
    </svg>
  )
}

/**
 * Room icon for listing tiles.
 *
 * @param className Optional utility classes.
 */
const RoomIcon = ({ className }: IconProps) => {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={cn('h-4 w-4 shrink-0', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
    >
      <path d='M4 10V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2' />
      <path d='M3 10h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z' />
      <path d='M8 14h8' />
    </svg>
  )
}

/**
 * Bathroom icon for listing tiles.
 *
 * @param className Optional utility classes.
 */
const BathroomIcon = ({ className }: IconProps) => {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={cn('h-4 w-4 shrink-0', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
    >
      <path d='M5 12h14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5Z' />
      <path d='M7 12V7a2 2 0 0 1 2-2h1' />
      <path d='M5 17H3M21 17h-2' />
    </svg>
  )
}

/**
 * Plot area icon for listing tiles.
 *
 * @param className Optional utility classes.
 */
const PlotAreaIcon = ({ className }: IconProps) => {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={cn('h-4 w-4 shrink-0', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
    >
      <path d='M4 20 20 4' />
      <path d='M9 4H4v5M20 15v5h-5' />
    </svg>
  )
}

/**
 * Builds visible meta rows for one listing tile.
 *
 * @param property Property shown in the tile.
 */
const buildListingMetaItems = (property: Property): ListingMetaItem[] => {
  const items: ListingMetaItem[] = []
  const area = formatListingArea(property.areaSqm)

  if (area) {
    items.push({
      key: 'area',
      tooltip: 'Wohnfläche ca.',
      value: area,
      icon: <AreaIcon />,
    })
  }

  if (property.rooms > 0) {
    items.push({
      key: 'rooms',
      tooltip: 'Zimmer',
      value: String(property.rooms),
      icon: <RoomIcon />,
    })
  }

  if (property.bathrooms > 0) {
    items.push({
      key: 'bathrooms',
      tooltip: 'Badezimmer',
      value: String(property.bathrooms),
      icon: <BathroomIcon />,
    })
  }

  const plotArea = formatListingArea(property.plotAreaSqm)
  if (plotArea) {
    items.push({
      key: 'plot-area',
      tooltip: 'Grundstücksfläche ca.',
      value: plotArea,
      icon: <PlotAreaIcon />,
    })
  }

  return items
}

/**
 * Frymo-style listing tile used in list and carousel views.
 *
 * @param property Single active property.
 * @param className Optional wrapper classes.
 */
export const PropertyListingTile = ({ property, className }: PropertyListingTileProps) => {
  const detailPath = buildListingDetailPath(property.listingSegment, property.id)
  const locationLabel = resolvePropertyLocationLabel(property.city)
  const metaItems = buildListingMetaItems(property)
  const availabilityLabel = resolveAvailabilityBadgeLabel(property)
  const typeLabel = LISTING_TYPE_BADGE_LABELS[property.listingSegment]
  const priceLabel = LISTING_PRICE_LABELS[property.listingSegment]

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-sidhu-border bg-white',
        'shadow-[0_8px_24px_rgba(6,22,25,0.08)] transition hover:shadow-[0_12px_32px_rgba(6,22,25,0.12)]',
        className
      )}
    >
      <Link
        href={detailPath}
        aria-label={property.title}
        className='relative block overflow-hidden'
      >
        <div className='absolute left-3 top-3 z-10 flex flex-wrap gap-2'>
          <span
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
              'bg-sidhu-accent text-sidhu-dark'
            )}
          >
            {availabilityLabel}
          </span>
          <span
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
              property.listingSegment === 'kaufen'
                ? 'bg-sidhu-dark text-white'
                : 'bg-sidhu-sage text-sidhu-dark'
            )}
          >
            {typeLabel}
          </span>
        </div>

        <PropertyListingTileImages
          images={property.images}
          fallbackImageUrl={property.imageUrl}
          propertyTitle={property.title}
        />
      </Link>

      <div className='flex flex-1 flex-col bg-white p-4'>
        <div className='space-y-3'>
          <h3 className='line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-sidhu-title'>
            <Link
              href={detailPath}
              aria-label={property.title}
              className='transition hover:text-sidhu-accent'
            >
              {property.title}
            </Link>
          </h3>

          {locationLabel ? (
            <div className='flex items-center gap-2 text-sm text-sidhu-meta'>
              <LocationIcon className='text-sidhu-sage-dark' />
              <span>{locationLabel}</span>
            </div>
          ) : null}

          {metaItems.length > 0 ? (
            <div className='flex flex-wrap gap-x-4 gap-y-2'>
              {metaItems.map((item) => {
                return (
                  <span
                    key={item.key}
                    title={item.tooltip}
                    className='inline-flex items-center gap-1.5 text-sm text-sidhu-meta'
                  >
                    <span className='text-sidhu-sage-dark'>{item.icon}</span>
                    <span className='font-medium text-sidhu-title'>{item.value}</span>
                  </span>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className='mt-auto border-t border-sidhu-border pt-3 text-sm text-sidhu-meta'>
          <span>{priceLabel}</span>{' '}
          <span className='text-base font-bold text-sidhu-title'>
            {formatListingPrice(property)}
          </span>
        </div>
      </div>
    </article>
  )
}
