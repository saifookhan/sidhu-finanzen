'use client'

import { useId, useState } from 'react'

import {
  LISTING_PRICE_MAX,
  LISTING_PRICE_STEP,
} from '@/lib/filter-options'
import { LISTING_PRICE_LABELS, type ListingSegment } from '@/lib/listing'
import { cn } from '@/lib/utils'

type PriceRangeFilterProps = {
  listingSegment: ListingSegment
  minPrice?: number
  maxPrice?: number
}

/**
 * Price filter with synced slider and min/max inputs.
 *
 * @param listingSegment Active listing segment for price bounds.
 * @param minPrice Initial minimum price from URL params.
 * @param maxPrice Initial maximum price from URL params.
 */
export const PriceRangeFilter = ({
  listingSegment,
  minPrice,
  maxPrice,
}: PriceRangeFilterProps) => {
  const maxBound = LISTING_PRICE_MAX[listingSegment]
  const step = LISTING_PRICE_STEP[listingSegment]
  const sliderId = useId()
  const [minValue, setMinValue] = useState(minPrice ?? 0)
  const [maxValue, setMaxValue] = useState(maxPrice ?? maxBound)

  const inputClassName = cn(
    'h-10 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-zinc-900',
    'placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none'
  )

  const clampMin = (value: number): number => {
    return Math.min(Math.max(0, value), maxValue)
  }

  const clampMax = (value: number): number => {
    return Math.max(Math.min(maxBound, value), minValue)
  }

  const minPercent = (minValue / maxBound) * 100
  const maxPercent = (maxValue / maxBound) * 100

  return (
    <fieldset className='space-y-3'>
      <legend className='text-xs font-medium uppercase tracking-[0.12em] text-[#43586c]'>
        {LISTING_PRICE_LABELS[listingSegment]}
      </legend>

      <div className='relative h-2 rounded-full bg-[#d9d4cb]'>
        <div
          className='absolute h-2 rounded-full bg-[#24313d]'
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          id={`${sliderId}-min`}
          type='range'
          min={0}
          max={maxBound}
          step={step}
          value={minValue}
          aria-label='Preis von'
          className={cn(
            'pointer-events-none absolute inset-0 z-20 h-2 w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
            '[&::-webkit-slider-thumb]:bg-[#24313d]',
            '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#24313d]'
          )}
          onChange={(event) => {
            setMinValue(clampMin(Number(event.target.value)))
          }}
        />
        <input
          id={`${sliderId}-max`}
          type='range'
          min={0}
          max={maxBound}
          step={step}
          value={maxValue}
          aria-label='Preis bis'
          className={cn(
            'pointer-events-none absolute inset-0 z-30 h-2 w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
            '[&::-webkit-slider-thumb]:bg-[#24313d]',
            '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#24313d]'
          )}
          onChange={(event) => {
            setMaxValue(clampMax(Number(event.target.value)))
          }}
        />
      </div>

      <div className='flex items-center gap-2'>
        <label className='flex-1'>
          <span className='sr-only'>Von</span>
          <input
            className={inputClassName}
            type='number'
            name='minPrice'
            placeholder='Von'
            min={0}
            max={maxBound}
            step={step}
            value={minValue > 0 ? minValue : ''}
            onChange={(event) => {
              const nextValue = event.target.value === '' ? 0 : Number(event.target.value)
              setMinValue(clampMin(nextValue))
            }}
          />
        </label>
        <span className='text-sm text-zinc-600'>–</span>
        <label className='flex-1'>
          <span className='sr-only'>An</span>
          <input
            className={inputClassName}
            type='number'
            name='maxPrice'
            placeholder='An'
            min={0}
            max={maxBound}
            step={step}
            value={maxValue < maxBound ? maxValue : ''}
            onChange={(event) => {
              const nextValue =
                event.target.value === '' ? maxBound : Number(event.target.value)
              setMaxValue(clampMax(nextValue))
            }}
          />
        </label>
      </div>
    </fieldset>
  )
}
