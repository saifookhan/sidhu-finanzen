import { IframeEmbedBridge } from '@/components/iframe-embed-bridge'

type ImmobilienLayoutProps = {
  children: React.ReactNode
}

/**
 * Shared layout for iframe-embeddable immobilien routes.
 *
 * @param children Nested immobilien page content.
 */
const ImmobilienLayout = ({ children }: ImmobilienLayoutProps) => {
  return (
    <>
      <IframeEmbedBridge />
      {children}
    </>
  )
}

export default ImmobilienLayout
