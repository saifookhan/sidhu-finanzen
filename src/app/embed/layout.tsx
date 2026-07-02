import { IframeResizeReporter } from '@/components/iframe-resize-reporter'

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
      <IframeResizeReporter />
      {children}
    </>
  )
}

export default EmbedLayout
