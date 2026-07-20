import Link from 'next/link'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { PropertyCarousel } from '@/components/property-carousel'
import { PropertyMap } from '@/components/property-map'
import { PropertyMasonryGallery } from '@/components/property-masonry-gallery'
import { PropertySlideshow } from '@/components/property-slideshow'
import { geocodeAddress } from '@/lib/geocoding'
import {
  buildListingListPath,
  LISTING_PRICE_LABELS,
  type ListingSegment,
} from '@/lib/listing'
import {
  buildPropertyAmenities,
  buildPropertyDetailFields,
  buildPropertyGeocodeQueries,
  buildPropertyLocationLine,
} from '@/lib/property-details'
import { cn } from '@/lib/utils'
import type { Property, PropertyCoordinates } from '@/types/property'

type ImmobilienDetailViewProps = {
  listingSegment: ListingSegment
  property: Property
  relatedProperties: Property[]
}

type DetailSectionProps = {
  title: string
  children: ReactNode
}

/**
 * Renders one titled content block on the detail page.
 *
 * @param title Section heading.
 * @param children Section body content.
 */
const DetailSection = ({ title, children }: DetailSectionProps) => {
  return (
    <section className='space-y-3 border-t border-black/10 pt-6'>
      <h2 className='text-xl font-bold text-[#18181b]'>{title}</h2>
      {children}
    </section>
  )
}

/**
 * Resolves map coordinates from property data or geocoding fallback.
 *
 * @param property Loaded property details.
 */
const resolvePropertyCoordinates = async (
  property: Property
): Promise<PropertyCoordinates | null> => {
  if (property.coordinates) {
    return property.coordinates
  }

  return geocodeAddress(buildPropertyGeocodeQueries(property))
}

/**
 * Shared detail layout for kaufen and mieten property pages.
 *
 * @param listingSegment Active listing segment for the page.
 * @param property Loaded property details.
 * @param relatedProperties Related listings in the same segment.
 */
export const ImmobilienDetailView = async ({
  listingSegment,
  property,
  relatedProperties,
}: ImmobilienDetailViewProps) => {
  const amenities = buildPropertyAmenities(property)
  const detailFields = buildPropertyDetailFields(property, listingSegment)
  const geocodeQueries = buildPropertyGeocodeQueries(property)
  const coordinates = await resolvePropertyCoordinates(property)
  const locationLine = buildPropertyLocationLine(property)

  return (
    <main className="bg-background text-foreground">
      <div className="px-4 pt-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={buildListingListPath(listingSegment)}
            className="inline-flex rounded-md border border-[#52525b] px-3 py-1.5 text-sm font-medium text-[#52525b] transition hover:bg-[#52525b] hover:text-white"
          >
            Alle anzeigen
          </Link>
        </div>
      </div>

      <div className="mt-6 w-full">
        <PropertySlideshow
          images={property.images}
          propertyTitle={property.title}
        />
      </div>

      <div className='px-4 py-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start'>
          <div className='min-w-0 flex-1 space-y-6'>
            <article className='overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_36px_rgba(0,0,0,0.1)]'>
              <div className='space-y-6 p-6 md:p-8'>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold leading-tight text-[#18181b] md:text-4xl">
                    {property.title}
                  </h1>
                  <p className="text-sm text-zinc-700">
                    <span className="font-medium text-zinc-500">Standort</span>
                    <br />
                    {locationLine}
                  </p>
                </div>

                <div className="grid gap-4 border-y border-black/10 py-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      {LISTING_PRICE_LABELS[listingSegment]}
                    </p>
                    <p className='text-2xl font-bold text-[#18181b]'>
                      {property.price.toLocaleString('de-DE')} {property.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Zimmer
                    </p>
                    <p className="text-2xl font-bold text-[#18181b]">
                      {property.rooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Wohnfläche
                    </p>
                    <p className="text-2xl font-bold text-[#18181b]">
                      ca. {property.areaSqm.toLocaleString('de-DE')} m²
                    </p>
                  </div>
                </div>
              </div>

              <DetailSection title="Objektbeschreibung">
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                  {property.description || "Keine Beschreibung vorhanden."}
                </p>
              </DetailSection>

              {amenities.length > 0 ? (
                <DetailSection title="Ausstattung">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {amenities.map((amenity) => {
                      return (
                        <div
                          key={amenity.label}
                          className="flex items-center justify-between rounded-lg bg-[#f4f4f5] px-4 py-3 text-sm"
                        >
                          <dt className="font-medium text-zinc-700">
                            {amenity.label}
                          </dt>
                          <dd className="font-semibold text-[#18181b]">
                            {amenity.value}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </DetailSection>
              ) : null}

              <PropertyMasonryGallery
                images={property.images}
                propertyTitle={property.title}
              />

              {property.locationDescription ? (
                <DetailSection title="Lage">
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                    {property.locationDescription}
                  </p>
                </DetailSection>
              ) : null}

              <div className="border-t border-black/10 pt-6">
                <PropertyMap
                  coordinates={coordinates}
                  geocodeQueries={geocodeQueries}
                  title={property.title}
                />
              </div>

              <DetailSection title="Objektdaten">
                <dl className="divide-y divide-black/10 rounded-xl border border-black/10">
                  {detailFields.map((field) => {
                    return (
                      <div
                        key={field.label}
                        className={cn(
                          'grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,220px)_1fr]',
                          'odd:bg-white even:bg-[#f4f4f5]'
                        )}
                      >
                        <dt className="font-medium text-zinc-600">
                          {field.label}
                        </dt>
                        <dd className="font-medium text-[#18181b]">
                          {field.value}
                        </dd>
                        </div>
                      )
                    })}
                </dl>
              </DetailSection>

              {property.equipmentDescription ? (
                <DetailSection title="Ausstattungsbeschreibung">
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                    {property.equipmentDescription}
                  </p>
                </DetailSection>
              ) : null}

              {property.additionalDescription ? (
                <DetailSection title="Weitere Beschreibung">
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                    {property.additionalDescription}
                  </p>
                </DetailSection>
              ) : null}

              {property.energyCertificateType ||
              property.energyCertificateValidUntil ||
              property.energyConsumption ||
              property.yearBuilt ? (
                <DetailSection title="Energieausweis">
                  <dl className="divide-y divide-black/10 rounded-xl border border-black/10">
                    {property.yearBuilt ? (
                      <div className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,220px)_1fr]">
                        <dt className="font-medium text-zinc-600">Baujahr</dt>
                        <dd className="font-medium text-[#18181b]">
                          {property.yearBuilt}
                        </dd>
                      </div>
                    ) : null}
                    {property.energyCertificateType ? (
                      <div className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,220px)_1fr] odd:bg-[#f4f4f5]">
                        <dt className="font-medium text-zinc-600">
                          Energieausweistyp
                        </dt>
                        <dd className="font-medium text-[#18181b]">
                          {property.energyCertificateType}
                        </dd>
                      </div>
                    ) : null}
                    {property.energyConsumption ? (
                      <div className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,220px)_1fr]">
                        <dt className="font-medium text-zinc-600">
                          Energieverbrauchskennwert
                        </dt>
                        <dd className="font-medium text-[#18181b]">
                          {property.energyConsumption}
                        </dd>
                      </div>
                    ) : null}
                    {property.energyCertificateValidUntil ? (
                      <div className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,220px)_1fr] odd:bg-[#f4f4f5]">
                        <dt className="font-medium text-zinc-600">
                          Gültig bis
                        </dt>
                        <dd className="font-medium text-[#18181b]">
                          {property.energyCertificateValidUntil}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </DetailSection>
              ) : null}

              <PropertyCarousel
                listingSegment={listingSegment}
                properties={relatedProperties}
              />
            </div>
          </article>
          </div>

          <aside className='w-full shrink-0 lg:w-80 xl:w-96 lg:self-stretch'>
            <div className='lg:sticky lg:top-8'>
              <div className='flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-lg md:p-8'>
                <h2 className='text-2xl font-semibold text-[#18181b]'>
                  Ihr Ansprechpartner
                </h2>

                <div className='relative mx-auto h-56 w-56 overflow-hidden rounded-xl shadow-md lg:mx-0'>
                  <Image
                    src='/gagandeep-singh-sidhu-finanzberatung.jpg'
                    alt='Herr Sidhu - Finanzberatung'
                    fill
                    sizes='(max-width: 1024px) 224px, 320px'
                    className='object-cover'
                  />
                </div>

                <h3 className='text-xl font-medium text-zinc-800'>
                  Herr Sidhu - Finanzberatung
                </h3>

                <div className='space-y-4'>
                  <div>
                    <p className='text-sm font-semibold uppercase tracking-wide text-zinc-500'>
                      E-Mail
                    </p>
                    <a
                      href='mailto:kontakt@sidhu-finanzen.de'
                      className='text-zinc-700 transition hover:text-[#18181b]'
                    >
                      kontakt@sidhu-finanzen.de
                    </a>
                  </div>

                  <div>
                    <p className='text-sm font-semibold uppercase tracking-wide text-zinc-500'>
                      Mobil
                    </p>
                    <a
                      href='tel:+494032899063'
                      className='text-zinc-700 transition hover:text-[#18181b]'
                    >
                      +49 40 32 899 063
                    </a>
                  </div>

                  <a
                    href={`mailto:kontakt@sidhu-finanzen.de?subject=${encodeURIComponent(`Exposé-Anfrage: ${property.title}`)}`}
                    className={cn(
                      'block rounded-md bg-green-500 px-4 py-2 text-center text-white transition',
                      'hover:bg-green-600'
                    )}
                  >
                    Exposé anfordern
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
