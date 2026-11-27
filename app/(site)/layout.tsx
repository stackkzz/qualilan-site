import { QuoteProvider } from "@/components/quote-cart";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <QuoteProvider>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </QuoteProvider>
  );
}
