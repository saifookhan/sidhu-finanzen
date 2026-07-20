import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import {
  DOCUMENT_CLOSING,
  SIDHU_COMPANY,
} from '@/lib/document-templates'
import type { DocumentTemplate } from '@/types/document-template'

const colors = {
  address: '#000000',
  accent: '#61ce70',
  body: '#333333',
  muted: '#666666',
  title: '#18181b',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.body,
    lineHeight: 1.45,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  addressLine: {
    fontSize: 8,
    color: colors.address,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.address,
    maxWidth: 260,
  },
  logoColumn: {
    width: 160,
    alignItems: 'flex-end',
  },
  logo: {
    height: 40,
    width: 118,
    objectFit: 'contain',
    marginLeft: 145,
  },
  introRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recipientColumn: {
    flex: 1,
    paddingRight: 24,
  },
  sideColumn: {
    width: 160,
    fontSize: 9,
    lineHeight: 1.5,
  },
  contactHeading: {
    color: colors.accent,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 8,
  },
  contactLabel: {
    fontFamily: 'Helvetica-Bold',
    color: colors.title,
  },
  recipient: {
    color: colors.muted,
  },
  recipientLine: {
    marginBottom: 2,
  },
  contentBlock: {
    width: '100%',
  },
  heading: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.title,
    marginBottom: 14,
  },
  paragraph: {
    marginBottom: 10,
  },
  list: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingRight: 8,
  },
  bullet: {
    width: 12,
  },
  listText: {
    flex: 1,
  },
  signature: {
    fontFamily: 'Helvetica-Bold',
    color: colors.title,
  },
})

type DocumentLetterTemplateProps = {
  template: DocumentTemplate
  logoSrc: string
}

/**
 * Contact block shown in the PDF letterhead sidebar.
 */
const ContactBlock = () => (
  <View style={styles.sideColumn}>
    <Text style={styles.contactHeading}>Wir freuen uns auf Sie</Text>
    <Text style={{ marginBottom: 8 }}>
      <Text style={styles.contactLabel}>E-Mail: </Text>
      {SIDHU_COMPANY.email}
    </Text>
    <Text style={{ marginBottom: 8 }}>
      <Text style={styles.contactLabel}>Addresse: </Text>
      {'\n'}
      {SIDHU_COMPANY.address.join('\n')}
    </Text>
    <Text>
      <Text style={styles.contactLabel}>Sprechzeiten: </Text>
      {'\n'}
      {SIDHU_COMPANY.officeHours.join('\n')}
    </Text>
  </View>
)

/**
 * PDF letter template matching the Sidhu Finanzen document layout.
 *
 * @param template Document content to render inside the letterhead.
 * @param logoSrc Base64 data URI for the Sidhu Finanzen logo.
 */
export const DocumentLetterTemplate = ({
  template,
  logoSrc,
}: DocumentLetterTemplateProps) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.headerRow}>
        <Text style={styles.addressLine}>{SIDHU_COMPANY.addressLine}</Text>
        <View style={styles.logoColumn}>
          <Image src={logoSrc} style={styles.logo} />
        </View>
      </View>

      <View style={styles.introRow}>
        <View style={styles.recipientColumn}>
          <View style={styles.recipient}>
            {template.recipient.map((line) => (
              <Text key={line} style={styles.recipientLine}>
                {line}
              </Text>
            ))}
          </View>
        </View>
        <ContactBlock />
      </View>

      <View style={styles.contentBlock}>
        <Text style={styles.heading}>{template.heading}</Text>
        <Text style={styles.paragraph}>Sehr geehrte Damen und Herren,</Text>
        <Text style={styles.paragraph}>
          folgende Unterlagen werden dringend für den Finanzierungsantrag
          benötigt:
        </Text>

        <View style={styles.list}>
          {template.items.map((item) => (
            <View key={item} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.paragraph}>{DOCUMENT_CLOSING.instruction}</Text>
        <Text style={styles.paragraph}>{DOCUMENT_CLOSING.greeting}</Text>
        <Text style={styles.signature}>{DOCUMENT_CLOSING.signature}</Text>
      </View>
    </Page>
  </Document>
)
