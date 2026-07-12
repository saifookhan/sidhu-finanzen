import { redirect } from 'next/navigation'

/**
 * Redirects the immobilien root to the kaufen listing page.
 */
const ImmobilienRootPage = () => {
  redirect('/immobilien/kaufen')
}

export default ImmobilienRootPage
