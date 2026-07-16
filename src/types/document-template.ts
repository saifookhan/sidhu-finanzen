/** Shared document template shape for web preview and PDF generation. */
export type DocumentTemplate = {
  slug: string
  title: string
  recipient: string[]
  heading: string
  items: string[]
  filename: string
}

/** Sidhu Finanzen company details used in PDF letterhead. */
export type CompanyDetails = {
  name: string
  addressLine: string
  email: string
  address: string[]
  officeHours: string[]
}
