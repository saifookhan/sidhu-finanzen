# OnOffice Mini Frontend (Iframe-Ready)

Secure Next.js micro-frontend for:

- Active property list with filters
- Property details page
- Server-side OnOffice API integration (credentials never exposed client-side)
- Embed support through CSP `frame-ancestors`

## Routes

- `/embed/properties` list with filters
- `/embed/properties/:propertyId` details
- `/api/properties` and `/api/properties/:propertyId` server API endpoints

## Required Setup

1. Copy env file:

```bash
cp .env.example .env.local
```

2. Fill `.env.local` values:

- `ONOFFICE_API_BASE_URL`
- `ONOFFICE_API_LIST_PATH`
- `ONOFFICE_API_DETAILS_PATH`
- `ONOFFICE_API_USERNAME`
- `ONOFFICE_API_SECRET`
- `ONOFFICE_API_TOKEN`
- `ALLOWED_IFRAME_ANCESTORS` (example: `'self' https://sidhu-finanzen.de`)

## Run

```bash
npm run dev
```

Open [http://localhost:3000/embed/properties](http://localhost:3000/embed/properties).

## Security Notes

- OnOffice credentials are only read in server files under `src/lib/onoffice.ts`
- No `NEXT_PUBLIC_*` secret usage
- CSP and hardening headers are configured in `next.config.ts`
- `cache: 'no-store'` is used for API fetches to avoid stale sensitive data

## OnOffice Adapter

The client currently uses header-based auth:

- `x-onoffice-username`
- `x-onoffice-secret`
- `x-onoffice-token`

If your OnOffice account requires HMAC-signed payloads or a different endpoint
shape, adapt:

- `buildAuthHeaders()` in `src/lib/onoffice.ts`
- `mapOnOfficeProperty()` field mapping in `src/lib/onoffice.ts`
