import 'server-only'

import crypto from 'node:crypto'

import { getEnv } from '@/lib/env'
import type { Property, PropertyFilters, PropertyImage } from '@/types/property'

type OnOfficeFilterCondition = {
  op: string
  val: string | number
}

type OnOfficeActionPayload = {
  actionid: string
  resourceid: string
  resourcetype: string
  identifier: string
  timestamp: number
  hmac: string
  hmac_version: 2
  parameters: Record<string, unknown>
}

type OnOfficeApiPayload = {
  token: string
  request: {
    actions: OnOfficeActionPayload[]
  }
}

type OnOfficeElementValue = {
  value?: unknown
}

type OnOfficeEstateRecord = {
  id?: unknown
  elements?: Record<string, OnOfficeElementValue | unknown>
}

type OnOfficeEstatePictureRecord = {
  id?: unknown
  elements?: unknown
}

type OnOfficeActionResult = {
  data?: {
    records?: OnOfficeEstateRecord[]
  }
  status?: {
    errorcode?: number
    message?: string
  }
}

type OnOfficeResponse = {
  status?: {
    code?: number
    errorcode?: number
    message?: string
  }
  response?: {
    results?: OnOfficeActionResult[]
  }
}

type OnOfficePropertyRecord = Record<string, unknown>

const READ_ACTION_ID = 'urn:onoffice-de-ns:smart:2.5:smartml:action:read'
const GET_ACTION_ID = 'urn:onoffice-de-ns:smart:2.5:smartml:action:get'
const ONOFFICE_FIELDS = [
  'Id',
  'objekttitel',
  'ort',
  'plz',
  'strasse',
  'kaufpreis',
  'wohnflaeche',
  'anzahl_zimmer',
  'anzahl_schlafzimmer',
  'objektbeschreibung',
  'status',
  'lage',
  'land',
]
const ONOFFICE_FALLBACK_FIELDS = ['Id', 'objekttitel', 'ort', 'plz', 'strasse', 'kaufpreis', 'status']

/**
 * Checks whether a payload can be used as a key/value record.
 *
 * @param value Unknown data to verify.
 */
const isPropertyRecord = (value: unknown): value is OnOfficePropertyRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Reads scalar values from OnOffice element wrappers.
 *
 * @param value Element payload from API response.
 */
const unwrapElementValue = (value: unknown): unknown => {
  if (isPropertyRecord(value) && 'value' in value) {
    return value.value
  }

  return value
}

/**
 * Returns first available key value from a record.
 *
 * @param record Flat data record.
 * @param keys Candidate field names in priority order.
 */
const pickValue = (record: OnOfficePropertyRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in record) {
      return record[key]
    }
  }

  return undefined
}

/**
 * Coerces an unknown value to a finite number fallback.
 *
 * @param value Incoming API value.
 * @param fallback Number used when conversion fails.
 */
const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

/**
 * Coerces an unknown value to a string fallback.
 *
 * @param value Incoming API value.
 * @param fallback String used when conversion fails.
 */
const toString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback
}

/**
 * Maps an OnOffice API record to the app's property shape.
 *
 * @param record Raw API record for a single property.
 */
const mapOnOfficeProperty = (record: OnOfficePropertyRecord): Property => {
  const statusNumeric = toNumber(pickValue(record, ['status']), -1)
  const status: Property['status'] =
    statusNumeric === 1 ? 'active' : statusNumeric === 2 ? 'inactive' : 'unknown'

  const idValue = pickValue(record, ['Id', 'id'])
  const titleValue = pickValue(record, ['objekttitel', 'title', 'lage'])
  const cityValue = pickValue(record, ['ort', 'city'])
  const zipValue = pickValue(record, ['plz', 'zipCode'])
  const addressValue = pickValue(record, ['strasse', 'address'])
  const priceValue = pickValue(record, ['kaufpreis', 'price'])
  const areaValue = pickValue(record, ['wohnflaeche', 'areaSqm'])
  const roomsValue = pickValue(record, ['anzahl_zimmer', 'rooms'])
  const bedroomsValue = pickValue(record, ['anzahl_schlafzimmer', 'bedrooms'])
  const descriptionValue = pickValue(record, ['objektbeschreibung', 'description'])
  const imageValue = pickValue(record, ['titelbild', 'imageUrl'])

  return {
    id: toString(idValue, ''),
    title: toString(titleValue, 'Untitled property'),
    city: toString(cityValue, ''),
    zipCode: toString(zipValue, ''),
    address: toString(addressValue, ''),
    price: toNumber(priceValue, 0),
    currency: 'EUR',
    areaSqm: toNumber(areaValue, 0),
    rooms: toNumber(roomsValue, 0),
    bedrooms: toNumber(bedroomsValue, 0),
    imageUrl: typeof imageValue === 'string' ? imageValue : null,
    images: [],
    description: toString(descriptionValue, ''),
    status,
  }
}

/**
 * Converts one estate record from API response to a flat object.
 *
 * @param record Estate data from the records array.
 */
const flattenEstateRecord = (record: OnOfficeEstateRecord): OnOfficePropertyRecord => {
  const elements = isPropertyRecord(record.elements)
    ? Object.fromEntries(
        Object.entries(record.elements).map(([key, value]) => {
          return [key, unwrapElementValue(value)]
        })
      )
    : {}

  return {
    id: toString(record.id, ''),
    ...elements,
  }
}

/**
 * Normalizes estate picture elements into a flat array of records.
 *
 * @param elements Raw elements payload from estatepictures records.
 */
const normalizePictureElements = (elements: unknown): OnOfficePropertyRecord[] => {
  if (Array.isArray(elements)) {
    return elements.filter((entry): entry is OnOfficePropertyRecord => isPropertyRecord(entry))
  }

  if (isPropertyRecord(elements)) {
    return [elements]
  }

  return []
}

/**
 * Maps one raw picture element to the app image shape.
 *
 * @param entry Raw picture element from OnOffice.
 */
const mapPictureElement = (entry: OnOfficePropertyRecord): PropertyImage | null => {
  const url = typeof entry.url === 'string' ? entry.url : null
  if (!url) {
    return null
  }

  return {
    url,
    title: toString(entry.title ?? entry.titel, ''),
    type: toString(entry.type, 'Foto'),
  }
}

/**
 * Sorts images with title images first, then photos.
 *
 * @param images Unsorted property images.
 */
const sortPropertyImages = (images: PropertyImage[]): PropertyImage[] => {
  return [...images].sort((left, right) => {
    const leftPriority = left.type === 'Titelbild' ? 0 : 1
    const rightPriority = right.type === 'Titelbild' ? 0 : 1
    return leftPriority - rightPriority
  })
}

/**
 * Parses estate picture records into a map of estate id to images.
 *
 * @param records Picture records from the OnOffice API.
 */
const parseEstatePictureRecords = (
  records: OnOfficeEstatePictureRecord[]
): Map<string, PropertyImage[]> => {
  const imageMap = new Map<string, PropertyImage[]>()

  for (const record of records) {
    for (const element of normalizePictureElements(record.elements)) {
      const estateId = toString(element.estateid, '')
      const image = mapPictureElement(element)

      if (!estateId || !image) {
        continue
      }

      const existing = imageMap.get(estateId) ?? []
      const isDuplicate = existing.some((entry) => entry.url === image.url)

      if (!isDuplicate) {
        existing.push(image)
        imageMap.set(estateId, existing)
      }
    }
  }

  for (const [estateId, images] of imageMap) {
    imageMap.set(estateId, sortPropertyImages(images))
  }

  return imageMap
}

/**
 * Creates an HMAC v2 signature for one action.
 *
 * @param timestamp UNIX timestamp for the request.
 * @param resourcetype Resource type used in the action.
 * @param actionid Action id used in the request.
 */
const createHmacV2 = (
  timestamp: number,
  resourcetype: string,
  actionid: string
): string => {
  const env = getEnv()
  const payload = `${timestamp}${env.ONOFFICE_API_TOKEN}${resourcetype}${actionid}`
  return crypto.createHmac('sha256', env.ONOFFICE_API_SECRET).update(payload).digest('base64')
}

/**
 * Builds estate filters from UI query options.
 *
 * @param filters Filter values from list page URL.
 */
const buildEstateFilters = (
  filters: PropertyFilters
): Record<string, OnOfficeFilterCondition[]> => {
  const apiFilters: Record<string, OnOfficeFilterCondition[]> = {
    status: [{ op: '=', val: 1 }],
  }

  if (filters.city) {
    apiFilters.ort = [{ op: 'LIKE', val: `%${filters.city}%` }]
  }

  if (typeof filters.minPrice === 'number') {
    apiFilters.kaufpreis = [...(apiFilters.kaufpreis ?? []), { op: '>=', val: filters.minPrice }]
  }

  if (typeof filters.maxPrice === 'number') {
    apiFilters.kaufpreis = [...(apiFilters.kaufpreis ?? []), { op: '<=', val: filters.maxPrice }]
  }

  if (typeof filters.minRooms === 'number') {
    apiFilters.anzahl_zimmer = [
      ...(apiFilters.anzahl_zimmer ?? []),
      { op: '>=', val: filters.minRooms },
    ]
  }

  if (typeof filters.maxRooms === 'number') {
    apiFilters.anzahl_zimmer = [
      ...(apiFilters.anzahl_zimmer ?? []),
      { op: '<=', val: filters.maxRooms },
    ]
  }

  return apiFilters
}

/**
 * Builds one read action for estates.
 *
 * @param resourceId Optional estate id for single-item reads.
 * @param filters Optional list filter values.
 */
const buildReadEstateAction = (
  resourceId: string,
  filters?: PropertyFilters,
  dataFields: string[] = ONOFFICE_FIELDS
): OnOfficeActionPayload => {
  const timestamp = Math.floor(Date.now() / 1000)
  const hmac = createHmacV2(timestamp, 'estate', READ_ACTION_ID)

  const parameters: Record<string, unknown> = {
    data: dataFields,
  }

  if (!resourceId) {
    parameters.filter = buildEstateFilters(filters ?? {})
    parameters.listlimit = 50
    parameters.listoffset = 0
  }

  return {
    actionid: READ_ACTION_ID,
    resourceid: resourceId,
    resourcetype: 'estate',
    identifier: resourceId ? `estate-${resourceId}` : 'estate-list',
    timestamp,
    hmac,
    hmac_version: 2,
    parameters,
  }
}

/**
 * Builds one action to read public estate images.
 *
 * @param estateIds Estate ids to load images for.
 */
const buildEstatePicturesAction = (estateIds: string[]): OnOfficeActionPayload => {
  const timestamp = Math.floor(Date.now() / 1000)
  const hmac = createHmacV2(timestamp, 'estatepictures', GET_ACTION_ID)

  return {
    actionid: GET_ACTION_ID,
    resourceid: '',
    resourcetype: 'estatepictures',
    identifier: 'estate-pictures',
    timestamp,
    hmac,
    hmac_version: 2,
    parameters: {
      estateids: estateIds.map((id) => Number(id)),
      categories: ['Titelbild', 'Foto'],
      size: 'original',
    },
  }
}

/**
 * Executes one request against the OnOffice API.
 *
 * @param action Single action payload to send.
 */
const fetchOnOffice = async (action: OnOfficeActionPayload): Promise<OnOfficeActionResult> => {
  const env = getEnv()
  const normalizedBaseUrl = env.ONOFFICE_API_BASE_URL.replace(/\/+$/, '')
  const normalizedListPath = env.ONOFFICE_API_LIST_PATH.replace(/^\/+/, '')
  const url = `${normalizedBaseUrl}/${normalizedListPath}`

  const body: OnOfficeApiPayload = {
    token: env.ONOFFICE_API_TOKEN,
    request: {
      actions: [action],
    },
  }

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`OnOffice request failed with status ${response.status}`)
  }

  const parsed = (await response.json()) as OnOfficeResponse
  const firstResult = parsed.response?.results?.[0]

  if (!firstResult) {
    throw new Error('OnOffice request failed with empty result payload')
  }

  const actionErrorCode = firstResult.status?.errorcode ?? 0
  if (actionErrorCode !== 0) {
    const actionMessage = firstResult.status?.message ?? 'Unknown action error'
    throw new Error(`OnOffice action failed (${actionErrorCode}): ${actionMessage}`)
  }

  return firstResult
}

/**
 * Loads image URLs for the provided estates.
 *
 * @param estateIds Estate ids from read action.
 */
const getEstateImagesMap = async (
  estateIds: string[]
): Promise<Map<string, PropertyImage[]>> => {
  if (estateIds.length === 0) {
    return new Map<string, PropertyImage[]>()
  }

  try {
    const picturesAction = buildEstatePicturesAction(estateIds)
    const picturesResult = await fetchOnOffice(picturesAction)
    const records = picturesResult.data?.records as OnOfficeEstatePictureRecord[] | undefined

    if (!Array.isArray(records)) {
      return new Map<string, PropertyImage[]>()
    }

    return parseEstatePictureRecords(records)
  } catch (error) {
    console.warn('Failed to load estate images', error)
    return new Map<string, PropertyImage[]>()
  }
}

/**
 * Applies loaded images to one property record.
 *
 * @param property Property without image list populated.
 * @param imagesMap Estate id to images map from OnOffice.
 */
const attachPropertyImages = (
  property: Property,
  imagesMap: Map<string, PropertyImage[]>
): Property => {
  const images = imagesMap.get(property.id) ?? []
  return {
    ...property,
    images,
    imageUrl: images[0]?.url ?? property.imageUrl,
  }
}

/**
 * Fetches active properties from OnOffice with optional filters.
 *
 * @param filters Parsed query filters from the client.
 */
export const getActiveProperties = async (
  filters: PropertyFilters
): Promise<Property[]> => {
  let result: OnOfficeActionResult

  try {
    const action = buildReadEstateAction('', filters, ONOFFICE_FIELDS)
    result = await fetchOnOffice(action)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unknown field')) {
      const fallbackAction = buildReadEstateAction('', filters, ONOFFICE_FALLBACK_FIELDS)
      result = await fetchOnOffice(fallbackAction)
    } else {
      throw error
    }
  }

  const records = result.data?.records

  if (!Array.isArray(records)) {
    return []
  }

  const properties = records
    .map((entry) => flattenEstateRecord(entry))
    .map((entry) => mapOnOfficeProperty(entry))
    .filter((entry) => entry.status === 'active')

  const imagesMap = await getEstateImagesMap(properties.map((property) => property.id))
  return properties.map((property) => attachPropertyImages(property, imagesMap))
}

/**
 * Fetches one property by id from OnOffice.
 *
 * @param propertyId External property id.
 */
export const getPropertyById = async (
  propertyId: string
): Promise<Property | null> => {
  let result: OnOfficeActionResult

  try {
    const action = buildReadEstateAction(propertyId, undefined, ONOFFICE_FIELDS)
    result = await fetchOnOffice(action)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unknown field')) {
      const fallbackAction = buildReadEstateAction(
        propertyId,
        undefined,
        ONOFFICE_FALLBACK_FIELDS
      )
      result = await fetchOnOffice(fallbackAction)
    } else {
      throw error
    }
  }

  const record = result.data?.records?.[0]

  if (!record) {
    return null
  }

  const property = mapOnOfficeProperty(flattenEstateRecord(record))
  if (property.status !== 'active') {
    return null
  }

  const imagesMap = await getEstateImagesMap([property.id])
  return attachPropertyImages(property, imagesMap)
}
