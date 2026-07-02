import { IframeEmbedBridge } from '@/components/iframe-embed-bridge'

type EmbedLayoutProps = {
  children: React.ReactNode
}

/**
 * Shared layout for iframe-embeddable routes with auto-resize support.
 *
 * @param children Nested embed page content.
 */
const EmbedLayout = ({ children }: EmbedLayoutProps) => {
  return (
    <>
      <IframeEmbedBridge />
      {children}
    </>
  )
}

export default EmbedLayout
