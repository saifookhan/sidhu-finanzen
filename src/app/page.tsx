import { redirect } from 'next/navigation'

/**
 * Redirects root to the embeddable list page.
 */
const HomePage = () => {
  redirect('/immobilien/kaufen')
}

export default HomePage
