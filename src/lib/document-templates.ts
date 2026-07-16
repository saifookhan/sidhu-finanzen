import type { CompanyDetails, DocumentTemplate } from '@/types/document-template'

/** Company contact details shown in the PDF letterhead. */
export const SIDHU_COMPANY: CompanyDetails = {
  name: 'Sidhu Finanzen',
  addressLine: 'Sidhu Finanzen · Stettiner Str. 6 · 22850 Norderstedt',
  email: 'kontakt@sidhu-finanzen.de',
  address: ['Stettiner Str. 6', '22850 Norderstedt'],
  officeHours: ['Montag - Freitag', '09:00 - 16:00 Uhr'],
}

/** Closing lines shared by all financing document templates. */
export const DOCUMENT_CLOSING = {
  instruction:
    'Die vorbezeichneten Unterlagen bitte ich an mich per E-Mail oder auf dem Postwege zu übersenden.',
  greeting: 'Mit freundlichen Grüßen',
  signature: 'Ihr Sidhu-Finanzen-Team',
} as const

/** Financing document templates rendered on web and as PDFs. */
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    slug: 'bonitaetsunterlagen',
    title: 'Persönliche Unterlagen',
    recipient: ['An die Antragsteller'],
    heading: 'Notwendige Bonitätsunterlagen',
    items: [
      'Ihre 3 letzten Gehaltsnachweise ( falls verheiratet: von beiden Interessenten )',
      'Dezember-Abrechnung des Vorjahres ( falls verheiratet: von beiden Interessenten )',
      'Ausweiskopien beidseitig von allen Interessenten',
      'Eigenkapitalnachweis ( Kontoauszug, Kopie des Sparbuches, Jahreskontoauszüge bei Bausparverträgen oder Wertpapieren, etc. )',
      'falls Privatkredite bestehen: Kopie der entsprechenden Kreditverträge',
      'bei Unterhalt: Unterhaltsnachweise',
      'Ihre letztergangenen Renteninformationen Ihrer gesetzlichen Rentenversicherung',
      'bei Beschäftigungsdauer weniger als ein Jahr: Ihr Arbeitsvertrag',
    ],
    filename: '01_Notwendige_Bonitaetsunterlagen.pdf',
  },
  {
    slug: 'objektunterlagen',
    title: 'Kauf eines Objektes',
    recipient: ['An den Makler', 'oder Hauseigentümer'],
    heading: 'Notwendige Objektunterlagen',
    items: [
      'Wohnflächenberechnung',
      'gültiger Energieausweis',
      'Bauzeichnungen ( Schnitt, Grundrisse bemaßt und Ansichten )',
      'Baubeschreibung (falls vorhanden)',
      'Flurkarte oder Lageplan',
      'vollständiger Grundbuchauszug ( nicht älter als 3 Monate ) oder notarieller Kaufvertragsentwurf',
      'Objektfotos ( Vorder- und Rückansicht, ein Foto vom Bad, vom Wohnzimmer, von der Küche und von der Heizungsanlage )',
    ],
    filename: '02_Notwendige_Objektunterlagen.pdf',
  },
  {
    slug: 'objektunterlagen-neubau',
    title: 'Neubau',
    recipient: [
      'An den Grundstücksverkäufer,',
      'Architekt oder Bauträger',
    ],
    heading: 'Notwendige Objektunterlagen für die finanzierende Bank',
    items: [
      'Lageplan oder Flurkarte',
      'notarieller Kaufvertragsentwurf für das Baugrundstück oder einen aktuellen Grundbuchauszug ( nicht älter als 3 Monate )',
      'Wohnflächenberechnung',
      'Berechnung des umbauten Raumes',
      'Bauzeichnungen ( Schnitt, Grundrisse bemaßt und Ansichten )',
      'Baubeschreibung',
      'Kostenaufstellung für die Baukosten oder einen Bauwerkvertragsentwurf nebst Zahlungsplan',
      'falls KfW-Standard „Energieeffizient Bauen" beantragt wird: Online-Bestätigung hierzu',
    ],
    filename: '03_Notwendige_Objektunterlagen_finanzierende_Bank.pdf',
  },
  {
    slug: 'objektunterlagen-wohnung',
    title: 'Wohnungskauf',
    recipient: [
      'An den Wohnungseigentümer oder an den',
      'zuständigen Makler',
    ],
    heading: 'Notwendige Objektunterlagen für die finanzierende Bank',
    items: [
      'Teilungserklärung',
      'Grundriss der Wohnung mit Maßangaben',
      'Wohnflächenberechnung detailliert',
      'Grundbuchauszug ( nicht älter als 3 Monate ) oder notarieller Kaufvertragsentwurf',
      'Fotos: Außen, vom Bad und von den Fenstern',
      'Flurkarte',
    ],
    filename: '03_Notwendige_Objektunterlagen_finanzierende_Bank_Wohnung.pdf',
  },
  {
    slug: 'umschuldung',
    title: 'Umschuldung eines bestehenden Darlehens',
    recipient: ['An die Antragsteller'],
    heading: 'Notwendige Objektunterlagen zur Umschuldung',
    items: [
      'Kopie des Kreditvertrages der abzulösenden Bank',
      'Kopie der letzten 2 Jahreskontoauszüge des abzulösenden Darlehens',
      'Berechnung der Wohnfläche in m² gemäß Wohnflächenverordnung',
      'bemaßte Grundriss- und Schnittzeichnungen',
      'Objektfotos von Innen und Außen',
      'Teilungserklärung oder Aufteilungsplan bei Eigentumswohnungen',
      'Kopie des vollständigen, unbeglaubigten Grundbuchauszuges ( nicht älter als 3 Monate )',
      'Flurkarte',
      'ursprünglicher Kaufvertrag bzw. ursprüngliche Aufteilung der Gesamtherstellungskosten',
    ],
    filename: '05_Notwendige_Objektunterlagen_Umschuldung.pdf',
  },
  {
    slug: 'privatkredit',
    title: 'Privatkredit',
    recipient: ['An die Antragsteller'],
    heading: 'Notwendige Unterlagen zum Privatkredit',
    items: [
      'Personalausweise ( falls verheiratet von beiden )',
      'die letzten 3 Gehaltsnachweise ( falls verheiratet von beiden )',
      'Kontoauszüge der letzten 8 Wochen lückenlos, falls mehrere Girokonten bestehen, gilt dies für alle bestehenden Konten',
      'alle Privatkreditverträge in Kopie ( gilt auch für Rahmenkredite und Kreditkarten )',
      'falls das Arbeitsverhältnis erst seit weniger als 1 Jahr besteht: den Arbeitsvertrag',
      'falls Immobiliendarlehen bestehen: entsprechende Darlehensverträge',
    ],
    filename: '06_Notwendige_Unterlagen_Privatkredit.pdf',
  },
]

/**
 * Resolves a document template by slug.
 *
 * @param slug URL-safe document identifier.
 */
export const getDocumentTemplate = (slug: string): DocumentTemplate | undefined => {
  return DOCUMENT_TEMPLATES.find((template) => template.slug === slug)
}
