import { NextResponse } from 'next/server'

import { getPropertyById } from '@/lib/onoffice'

type Params = {
  params: Promise<{ propertyId: string }>
}

/**
 * Returns one active property by id.
 *
 * @param _request Incoming request object.
 * @param params Dynamic route params.
 */
export const GET = async (_request: Request, { params }: Params) => {
  try {
    const { propertyId } = await params
    const property = await getPropertyById(propertyId)

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ data: property })
  } catch (error) {
    console.error('Failed to load property details', error)
    return NextResponse.json(
      { error: 'Failed to load property details' },
      { status: 502 }
    )
  }
}
