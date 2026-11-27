import { AnimationGate } from "@/components/animation-gate";
import { QuoteProvider } from "@/components/quote-cart";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <QuoteProvider>
      {/* Remover quando o site for publicado pela própria Qualilan */}
      <p className="bg-marinho px-5 py-2 text-center text-xs text-white/75">
        Demonstração de proposta de novo site para a Qualilan. Este não é o site oficial da empresa.
      </p>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <AnimationGate />
    </QuoteProvider>
  );
}
