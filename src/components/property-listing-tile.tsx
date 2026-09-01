import Link from 'next/link'
import type { ReactNode } from 'react'

import { PropertyListingTileImages } from '@/components/property-listing-tile-images'
import { buildListingDetailPath, LISTING_PRICE_LABELS } from '@/lib/listing'
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
      value: `${property.rooms} Zimmer`,
      icon: <RoomIcon />,
    })
  }

  if (property.bathrooms > 0) {
    items.push({
      key: 'bathrooms',
      tooltip: 'Badezimmer',
      value: `${property.bathrooms} ${property.bathrooms === 1 ? 'Bad' : 'Bäder'}`,
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
  const priceLabel = LISTING_PRICE_LABELS[property.listingSegment]
  const accessibleLabel = property.title.trim() || 'Immobilie ansehen'

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[14px] border border-sidhu-border bg-white',
        'shadow-[0_1px_2px_rgba(6,22,25,0.06)] transition-shadow duration-200 ease-out',
        'hover:shadow-[0_14px_34px_rgba(6,22,25,0.14)]',
        className
      )}
    >
      <div className='relative overflow-hidden'>
        <span
          className={cn(
            'absolute left-3.5 top-3.5 z-20 inline-flex h-[26px] items-center gap-1.5 rounded-full',
            'bg-white/95 px-2.5 text-[11px] font-bold uppercase tracking-[0.04em] text-sidhu-dark'
          )}
        >
          <span className='h-[7px] w-[7px] rounded-full bg-sidhu-accent' />
          {availabilityLabel}
        </span>

        <PropertyListingTileImages
          images={property.images}
          fallbackImageUrl={property.imageUrl}
          propertyTitle={accessibleLabel}
          detailPath={detailPath}
        />
      </div>

      <div className='relative flex flex-1 flex-col gap-3.5 bg-white p-5'>
        <Link
          href={detailPath}
          aria-label={accessibleLabel}
          className='absolute inset-0 z-0'
        />

        <div>
          <div className='text-[11px] font-semibold uppercase tracking-[0.12em] text-sidhu-meta'>
            {priceLabel}
          </div>
          <div className='text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-sidhu-title'>
            {formatListingPrice(property)}
          </div>
        </div>

        <h3 className='line-clamp-2 text-base font-bold leading-snug text-sidhu-title transition group-hover:text-sidhu-accent'>
          {property.title}
        </h3>

        {locationLabel ? (
          <div className='flex items-center gap-2 text-sm text-sidhu-meta'>
            <LocationIcon className='text-sidhu-sage-dark' />
            <span>{locationLabel}</span>
          </div>
        ) : null}

        {metaItems.length > 0 ? (
          <div className='mt-auto grid grid-cols-3 gap-2 border-t border-sidhu-border pt-3.5'>
            {metaItems.map((item) => {
              return (
                <div key={item.key} title={item.tooltip} className='flex flex-col gap-1'>
                  <span className='text-sidhu-sage-dark'>{item.icon}</span>
                  <span className='text-sm font-bold text-sidhu-title'>{item.value}</span>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </article>
  )
}
