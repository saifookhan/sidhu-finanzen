'use client'

import { useEffect, useState } from 'react'

import { resolveCoordinatesFromQueries } from '@/lib/nominatim'
import type { PropertyCoordinates } from '@/types/property'

type PropertyMapProps = {
  coordinates: PropertyCoordinates | null
  geocodeQueries: string[]
  title: string
}

/**
 * Builds an OpenStreetMap embed URL for one coordinate pair.
 *
 * @param coordinates Latitude and longitude for the property.
 */
const buildOpenStreetMapEmbedUrl = (coordinates: PropertyCoordinates): string => {
  const { latitude, longitude } = coordinates
  const delta = 0.01
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join('%2C')

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`
}

/**
 * Renders a free OpenStreetMap embed, geocoding client-side when needed.
 *
 * @param coordinates Optional coordinates from OnOffice.
 * @param geocodeQueries Fallback address queries for geocoding.
 * @param title Property title used for iframe accessibility text.
 */
export const PropertyMap = ({
  coordinates,
  geocodeQueries,
  title,
}: PropertyMapProps) => {
  const [resolvedCoordinates, setResolvedCoordinates] =
    useState<PropertyCoordinates | null>(coordinates)
  const [isLoading, setIsLoading] = useState(!coordinates)

  useEffect(() => {
    if (coordinates) {
      setResolvedCoordinates(coordinates)
      setIsLoading(false)
      return
    }

    let isCancelled = false

    /**
     * Loads coordinates on the client when the server could not resolve them.
     */
    const loadCoordinates = async () => {
      setIsLoading(true)
      const nextCoordinates = await resolveCoordinatesFromQueries(geocodeQueries)

      if (!isCancelled) {
        setResolvedCoordinates(nextCoordinates)
        setIsLoading(false)
      }
    }

    void loadCoordinates()

    return () => {
      isCancelled = true
    }
  }, [coordinates, geocodeQueries])

  if (isLoading) {
    return (
      <section className='space-y-3'>
        <h2 className='text-xl font-bold text-[#18181b]'>Karte</h2>
        <div className='flex h-80 items-center justify-center rounded-xl border border-black/10 bg-[#f4f4f5] text-sm text-zinc-600'>
          Karte wird geladen...
        </div>
      </section>
    )
  }

  if (!resolvedCoordinates) {
    return (
      <section className='space-y-3'>
        <h2 className='text-xl font-bold text-[#18181b]'>Karte</h2>
        <div className='flex h-80 items-center justify-center rounded-xl border border-black/10 bg-[#f4f4f5] text-sm text-zinc-600'>
          Standort konnte nicht auf der Karte angezeigt werden.
        </div>
      </section>
    )
  }

  const mapUrl = buildOpenStreetMapEmbedUrl(resolvedCoordinates)

  return (
    <section className='space-y-3'>
      <h2 className='text-xl font-bold text-[#18181b]'>Karte</h2>
      <div className='overflow-hidden rounded-xl border border-black/10'>
        <iframe
          title={`Karte für ${title}`}
          src={mapUrl}
          className='h-80 w-full'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>
    </section>
  )
}
