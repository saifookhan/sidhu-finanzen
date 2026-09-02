'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  AREA_TYPE_OPTIONS,
  LISTING_PRICE_MAX,
  LISTING_PRICE_STEP,
  OBJECT_TYPE_OPTIONS,
} from '@/lib/filter-options'
import type { PropertyAreaType } from '@/lib/filter-options'
import { LISTING_PRICE_LABELS } from '@/lib/listing'
import { cn } from '@/lib/utils'
import type { PropertyFilters } from '@/types/property'

type PropertyFilterFormProps = {
  filters: PropertyFilters
  resultCount: number
}

type PopoverKey = 'zip' | 'objectType' | 'price' | 'area' | null

type FilterFormValues = {
  zipCode: string
  zipCityLabel: string
  objectType: string
  minPrice: number
  maxPrice: number
  minArea: string
  maxArea: string
  areaType: PropertyAreaType
  minRooms: number
}

type FilterChip = {
  id: 'zip' | 'objectType' | 'price' | 'area' | 'rooms'
  field: string
  label: string
}

type ZipEntry = { zip: string; city: string }

const ROOM_OPTIONS = [1, 2, 3, 4, 5]
const SEARCH_DEBOUNCE_MS = 500

let zipCodesCache: ZipEntry[] | null = null
let zipCodesPromise: Promise<ZipEntry[]> | null = null

const loadZipCodes = (): Promise<ZipEntry[]> => {
  if (zipCodesCache) return Promise.resolve(zipCodesCache)

  if (!zipCodesPromise) {
    zipCodesPromise = fetch('/data/de-zip-codes.json')
      .then((res) => res.json())
      .then((data: ZipEntry[]) => {
        zipCodesCache = data
        return data
      })
  }

  return zipCodesPromise
}

const formatEuro = (value: number): string =>
  `${new Intl.NumberFormat('de-DE').format(value)} €`

const buildValues = (
  filters: PropertyFilters,
  maxBound: number,
  existingCityLabel = ''
): FilterFormValues => ({
  zipCode: filters.zipCode ?? '',
  zipCityLabel: existingCityLabel,
  objectType: filters.objectType ?? '',
  minPrice: filters.minPrice ?? 0,
  maxPrice: filters.maxPrice ?? maxBound,
  minArea: filters.minArea !== undefined ? String(filters.minArea) : '',
  maxArea: filters.maxArea !== undefined ? String(filters.maxArea) : '',
  areaType: filters.areaType ?? 'wohnflaeche',
  minRooms: filters.minRooms ?? 0,
})

const buildSearchParams = (values: FilterFormValues, maxBound: number): URLSearchParams => {
  const params = new URLSearchParams()
  if (values.objectType) params.set('objectType', values.objectType)
  if (values.zipCode) params.set('zipCode', values.zipCode)
  if (values.minPrice > 0) params.set('minPrice', String(values.minPrice))
  if (values.maxPrice < maxBound) params.set('maxPrice', String(values.maxPrice))
  if (values.minArea) params.set('minArea', values.minArea)
  if (values.maxArea) params.set('maxArea', values.maxArea)
  if (values.minArea || values.maxArea) params.set('areaType', values.areaType)
  if (values.minRooms > 0) params.set('minRooms', String(values.minRooms))
  return params
}

const triggerLabelClassName =
  'text-[11px] font-semibold uppercase tracking-[0.1em] text-sidhu-meta leading-tight'
const triggerValueClassName = 'truncate text-sm font-semibold text-sidhu-title leading-tight'
const popoverPanelClassName =
  'absolute top-[calc(100%+8px)] z-50 rounded-xl border border-sidhu-border bg-white p-3 shadow-[0_16px_40px_rgba(6,22,25,0.16)]'
const popoverInputClassName = cn(
  'h-10 w-full min-w-0 box-border rounded-lg border border-sidhu-border bg-white px-3 text-sm text-zinc-900',
  'placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none'
)
const rangeInputClassName = cn(
  'pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent',
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4',
  '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer',
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
  '[&::-webkit-slider-thumb]:bg-[#24313d]',
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4',
  '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer',
  '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2',
  '[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#24313d]'
)

const MapPinIcon = () => (
  <svg aria-hidden='true' viewBox='0 0 24 24' className='h-[18px] w-[18px] shrink-0 text-sidhu-sage-dark' fill='none' stroke='currentColor' strokeWidth='1.75'>
    <path d='M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z' />
    <circle cx='12' cy='11' r='2.5' />
  </svg>
)

const SearchIcon = () => (
  <svg aria-hidden='true' viewBox='0 0 24 24' className='h-[18px] w-[18px] shrink-0' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='11' cy='11' r='7' />
    <path d='m20 20-3.5-3.5' />
  </svg>
)

const SpinnerIcon = () => (
  <svg className='h-4 w-4 animate-spin text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
  </svg>
)

export const PropertyFilterForm = ({ filters, resultCount }: PropertyFilterFormProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)

  const [isPending, startTransition] = useTransition()
  const maxBound = LISTING_PRICE_MAX[filters.listingSegment]
  const priceStep = LISTING_PRICE_STEP[filters.listingSegment]

  const [values, setValues] = useState<FilterFormValues>(() => buildValues(filters, maxBound))
  const [openPopover, setOpenPopover] = useState<PopoverKey>(null)
  const [zipMatches, setZipMatches] = useState<ZipEntry[]>([])

  // Keep state synced with URL changes while retaining city label
  useEffect(() => {
    setValues((prev) => buildValues(filters, maxBound, prev.zipCityLabel))
  }, [filters, maxBound])

  // Click outside to close popovers
  useEffect(() => {
    if (!openPopover) return
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenPopover(null)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [openPopover])

  // Resolve City name automatically if 5-digit zip code exists
  useEffect(() => {
    if (!values.zipCode) {
      setZipMatches([])
      return
    }

    let cancelled = false
    loadZipCodes().then((zipCodes) => {
      if (cancelled) return
      setZipMatches(zipCodes.filter((e) => e.zip.startsWith(values.zipCode)).slice(0, 8))

      if (values.zipCode.length === 5 && !values.zipCityLabel) {
        const exact = zipCodes.find((e) => e.zip === values.zipCode)
        if (exact) setValues((prev) => ({ ...prev, zipCityLabel: exact.city }))
      }
    })

    return () => { cancelled = true }
  }, [values.zipCode, values.zipCityLabel])

  const navigate = (next: FilterFormValues) => {
    const query = buildSearchParams(next, maxBound).toString()
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  // Debounced navigation with transition
  useEffect(() => {
    const nextQuery = buildSearchParams(values, maxBound).toString()
    const currentParams = new URLSearchParams(window.location.search).toString()

    if (nextQuery === currentParams) return

    const timer = setTimeout(() => {
      startTransition(() => {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
      })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [values, maxBound, pathname, router])

  const zipSuggestions = openPopover === 'zip' && values.zipCode ? zipMatches : []

  const objectTypeLabel = useMemo(() => {
    const match = OBJECT_TYPE_OPTIONS.find((o) => o.value === values.objectType)
    return match ? match.label.replace('— ', '') : OBJECT_TYPE_OPTIONS[0].label
  }, [values.objectType])

  const priceLabel = useMemo(() => {
    if (values.minPrice > 0 && values.maxPrice < maxBound) return `${formatEuro(values.minPrice)} – ${formatEuro(values.maxPrice)}`
    if (values.minPrice > 0) return `ab ${formatEuro(values.minPrice)}`
    if (values.maxPrice < maxBound) return `bis ${formatEuro(values.maxPrice)}`
    return 'Beliebig'
  }, [values.minPrice, values.maxPrice, maxBound])

  const areaRoomsLabel = useMemo(() => {
    const parts: string[] = []
    if (values.minArea || values.maxArea) parts.push(`${values.minArea || '0'}–${values.maxArea || '∞'} m²`)
    if (values.minRooms > 0) parts.push(`ab ${values.minRooms} Zi.`)
    return parts.length > 0 ? parts.join(' · ') : 'Beliebig'
  }, [values.minArea, values.maxArea, values.minRooms])

  const zipLabel = values.zipCode
    ? values.zipCityLabel ? `${values.zipCode} ${values.zipCityLabel}` : values.zipCode
    : 'Alle Orte'

  const chips = useMemo<FilterChip[]>(() => {
    const items: FilterChip[] = []
    if (values.zipCode) items.push({ id: 'zip', field: 'Ort', label: zipLabel })
    if (values.objectType) items.push({ id: 'objectType', field: 'Typ', label: objectTypeLabel })
    if (values.minPrice > 0 || values.maxPrice < maxBound) items.push({ id: 'price', field: 'Preis', label: priceLabel })
    if (values.minArea || values.maxArea) items.push({ id: 'area', field: 'Fläche', label: `${values.minArea || '0'}–${values.maxArea || '∞'} m²` })
    if (values.minRooms > 0) items.push({ id: 'rooms', field: 'Zimmer', label: `ab ${values.minRooms}` })
    return items
  }, [values, zipLabel, objectTypeLabel, priceLabel, maxBound])

  const removeChip = (id: FilterChip['id']) => {
    setValues((prev) => {
      switch (id) {
        case 'zip': return { ...prev, zipCode: '', zipCityLabel: '' }
        case 'objectType': return { ...prev, objectType: '' }
        case 'price': return { ...prev, minPrice: 0, maxPrice: maxBound }
        case 'area': return { ...prev, minArea: '', maxArea: '' }
        case 'rooms': return { ...prev, minRooms: 0 }
        default: return prev
      }
    })
  }

  const handleReset = () => {
    const next = buildValues({ listingSegment: filters.listingSegment }, maxBound)
    setValues(next)
    navigate(next)
    setOpenPopover(null)
  }

  return (
    <div ref={rootRef} className='relative rounded-2xl border border-sidhu-border bg-white shadow-[0_12px_40px_rgba(6,22,25,0.12)]'>
      <div className='flex flex-col gap-2 p-3 sm:flex-row sm:items-center'>
        
        {/* Ort / PLZ */}
        <div className='relative flex-1 sm:min-w-[150px]'>
          <button
            type='button'
            onClick={() => setOpenPopover(openPopover === 'zip' ? null : 'zip')}
            className='flex h-[52px] w-full items-center gap-2.5 rounded-xl border border-sidhu-border bg-white px-3.5 text-left transition hover:border-sidhu-sage-dark'
          >
            <MapPinIcon />
            <span className='flex min-w-0 flex-col'>
              <span className={triggerLabelClassName}>Ort oder PLZ</span>
              <span className={triggerValueClassName}>{zipLabel}</span>
            </span>
          </button>

          {openPopover === 'zip' && (
            <div className={cn(popoverPanelClassName, 'left-0 w-80')}>
              <input
                type='text'
                inputMode='numeric'
                value={values.zipCode}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 5)
                  setValues((prev) => ({ ...prev, zipCode: digits, zipCityLabel: '' }))
                }}
                placeholder='z. B. 37671'
                className={popoverInputClassName}
              />
              {zipSuggestions.length > 0 && (
                <div className='mt-2 flex flex-col gap-0.5'>
                  {zipSuggestions.map((entry) => (
                    <button
                      key={`${entry.zip}-${entry.city}`}
                      type='button'
                      onClick={() => {
                        setValues((prev) => ({ ...prev, zipCode: entry.zip, zipCityLabel: entry.city }))
                        setOpenPopover(null)
                      }}
                      className='flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-[#f4f6f1]'
                    >
                      <span className='font-semibold text-sidhu-title'>{entry.zip}</span>
                      <span className='text-sidhu-meta'>{entry.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className='hidden h-8 w-px shrink-0 bg-sidhu-border sm:block' />

        {/* Objekttyp */}
        <div className='relative flex-1 sm:min-w-[150px]'>
          <button
            type='button'
            onClick={() => setOpenPopover(openPopover === 'objectType' ? null : 'objectType')}
            className='flex h-[52px] w-full items-center justify-between gap-2.5 rounded-xl border border-transparent bg-white px-3.5 text-left transition hover:border-sidhu-border'
          >
            <span className='flex min-w-0 flex-col'>
              <span className={triggerLabelClassName}>Objekttyp</span>
              <span className={triggerValueClassName}>{objectTypeLabel}</span>
            </span>
            <span className='text-[10px] text-sidhu-meta'>▼</span>
          </button>

          {openPopover === 'objectType' && (
            <div className={cn(popoverPanelClassName, 'left-0 max-h-80 w-72 overflow-auto')}>
              {OBJECT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value || 'all'}
                  type='button'
                  onClick={() => {
                    setValues((prev) => ({ ...prev, objectType: option.value }))
                    setOpenPopover(null)
                  }}
                  className='flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-sidhu-title transition hover:bg-[#f4f6f1]'
                >
                  <span>{option.label}</span>
                  {option.value === values.objectType && <span className='font-bold text-sidhu-accent'>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='hidden h-8 w-px shrink-0 bg-sidhu-border sm:block' />

        {/* Preis */}
        <div className='relative flex-1 sm:min-w-[150px]'>
          <button
            type='button'
            onClick={() => setOpenPopover(openPopover === 'price' ? null : 'price')}
            className='flex h-[52px] w-full items-center justify-between gap-2.5 rounded-xl border border-transparent bg-white px-3.5 text-left transition hover:border-sidhu-border'
          >
            <span className='flex min-w-0 flex-col'>
              <span className={triggerLabelClassName}>{LISTING_PRICE_LABELS[filters.listingSegment]}</span>
              <span className={triggerValueClassName}>{priceLabel}</span>
            </span>
            <span className='text-[10px] text-sidhu-meta'>▼</span>
          </button>

          {openPopover === 'price' && (
            <div className={cn(popoverPanelClassName, 'left-0 w-[22rem]')}>
              <div className='relative mx-1 my-2.5 h-2 rounded-full bg-[#d9d4cb]'>
                <div
                  className='absolute h-2 rounded-full bg-[#24313d]'
                  style={{
                    left: `${(values.minPrice / maxBound) * 100}%`,
                    right: `${100 - (values.maxPrice / maxBound) * 100}%`,
                  }}
                />
                <input
                  type='range'
                  min={0}
                  max={maxBound}
                  step={priceStep}
                  value={values.minPrice}
                  className={cn(rangeInputClassName, 'z-20')}
                  onChange={(e) => setValues((prev) => ({ ...prev, minPrice: Math.min(Number(e.target.value), values.maxPrice) }))}
                />
                <input
                  type='range'
                  min={0}
                  max={maxBound}
                  step={priceStep}
                  value={values.maxPrice}
                  className={cn(rangeInputClassName, 'z-30')}
                  onChange={(e) => setValues((prev) => ({ ...prev, maxPrice: Math.max(Number(e.target.value), values.minPrice) }))}
                />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  placeholder='Von €'
                  value={values.minPrice > 0 ? values.minPrice : ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                  className={cn(popoverInputClassName, 'flex-1')}
                />
                <span className='text-sm text-sidhu-meta'>–</span>
                <input
                  type='number'
                  placeholder='Bis €'
                  value={values.maxPrice < maxBound ? values.maxPrice : ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, maxPrice: Number(e.target.value) || maxBound }))}
                  className={cn(popoverInputClassName, 'flex-1')}
                />
              </div>
            </div>
          )}
        </div>

        <div className='hidden h-8 w-px shrink-0 bg-sidhu-border sm:block' />

        {/* Fläche & Zimmer */}
        <div className='relative flex-1 sm:min-w-[150px]'>
          <button
            type='button'
            onClick={() => setOpenPopover(openPopover === 'area' ? null : 'area')}
            className='flex h-[52px] w-full items-center justify-between gap-2.5 rounded-xl border border-transparent bg-white px-3.5 text-left transition hover:border-sidhu-border'
          >
            <span className='flex min-w-0 flex-col'>
              <span className={triggerLabelClassName}>Fläche &amp; Zimmer</span>
              <span className={triggerValueClassName}>{areaRoomsLabel}</span>
            </span>
            <span className='text-[10px] text-sidhu-meta'>▼</span>
          </button>

          {openPopover === 'area' && (
            <div className={cn(popoverPanelClassName, 'right-0 flex w-96 flex-col gap-4')}>
              <div className='flex flex-col gap-2'>
                <span className={triggerLabelClassName}>Fläche</span>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    placeholder='Von m²'
                    value={values.minArea}
                    onChange={(e) => setValues((prev) => ({ ...prev, minArea: e.target.value }))}
                    className={cn(popoverInputClassName, 'flex-1')}
                  />
                  <span className='text-sm text-sidhu-meta'>–</span>
                  <input
                    type='number'
                    placeholder='Bis m²'
                    value={values.maxArea}
                    onChange={(e) => setValues((prev) => ({ ...prev, maxArea: e.target.value }))}
                    className={cn(popoverInputClassName, 'flex-1')}
                  />
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {AREA_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => setValues((prev) => ({ ...prev, areaType: option.value }))}
                      className={cn(
                        'h-8 rounded-full border border-sidhu-border px-3 text-sm font-medium transition',
                        option.value === values.areaType ? 'bg-sidhu-dark text-white' : 'bg-white text-sidhu-title hover:bg-[#f4f6f1]'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className='h-px bg-sidhu-border' />

              <div className='flex flex-col gap-2'>
                <span className={triggerLabelClassName}>Zimmer ab</span>
                <div className='flex gap-1.5'>
                  {ROOM_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type='button'
                      onClick={() => setValues((prev) => ({ ...prev, minRooms: prev.minRooms === n ? 0 : n }))}
                      className={cn(
                        'h-10 flex-1 rounded-lg border border-sidhu-border text-sm font-semibold transition',
                        n === values.minRooms ? 'bg-sidhu-dark text-white' : 'bg-white text-sidhu-title hover:bg-[#f4f6f1]'
                      )}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit / Loading Button */}
        <button
          type='button'
          onClick={() => {
            navigate(values)
            setOpenPopover(null)
          }}
          disabled={isPending}
          className='flex h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sidhu-dark px-6 text-sm font-semibold text-white transition hover:bg-sidhu-title disabled:opacity-75 sm:w-auto'
        >
          {isPending ? <SpinnerIcon /> : <SearchIcon />}
          <span>{isPending ? 'Lädt...' : 'Suchen'}</span>
        </button>
      </div>

      {/* Applied Filters / Chips Bar */}
      <div className='flex flex-wrap items-center gap-2 rounded-b-2xl border-t border-sidhu-border bg-[#fbfcf9] px-3.5 py-3'>
        <span className='mr-1 text-sm font-bold text-sidhu-title'>
          {resultCount} {resultCount === 1 ? 'Objekt' : 'Objekte'}
        </span>
        {chips.map((chip) => (
          <span
            key={chip.id}
            className='inline-flex h-[30px] items-center gap-2 rounded-full border border-sidhu-border bg-white py-0 pl-3 pr-1.5 text-sm font-medium text-sidhu-title'
          >
            <span className='text-sidhu-meta'>{chip.field}</span>
            {chip.label}
            <button
              type='button'
              onClick={() => removeChip(chip.id)}
              className='flex h-5 w-5 items-center justify-center rounded-full bg-[#f1f4ee] text-zinc-600 transition hover:bg-sidhu-dark hover:text-white'
            >
              ×
            </button>
          </span>
        ))}
        {chips.length > 0 ? (
          <button
            type='button'
            onClick={handleReset}
            className='ml-1 text-sm font-semibold text-sidhu-meta underline transition hover:text-sidhu-title'
          >
            Alle zurücksetzen
          </button>
        ) : (
          <span className='text-sm text-sidhu-meta'>
            Keine Filter aktiv — alle Objekte werden angezeigt.
          </span>
        )}
      </div>
    </div>
  )
}