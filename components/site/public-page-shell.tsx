import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

export function PublicPageShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>
}
